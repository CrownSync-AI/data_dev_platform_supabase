-- Create a safe SQL execution function for the chatbot
-- This function only allows SELECT queries and has built-in safety checks

CREATE OR REPLACE FUNCTION execute_safe_query(query_text TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    query_upper TEXT;
    unsafe_keywords TEXT[] := ARRAY['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE', 'GRANT', 'REVOKE', 'EXEC', 'EXECUTE', 'CALL', 'MERGE', 'REPLACE'];
    keyword TEXT;
BEGIN
    -- Convert query to uppercase for checking
    query_upper := UPPER(TRIM(query_text));
    
    -- Must start with SELECT
    IF NOT query_upper LIKE 'SELECT%' THEN
        RAISE EXCEPTION 'Only SELECT queries are allowed';
    END IF;
    
    -- Check for unsafe keywords
    FOREACH keyword IN ARRAY unsafe_keywords
    LOOP
        IF query_upper LIKE '%' || keyword || '%' THEN
            RAISE EXCEPTION 'Unsafe keyword detected: %', keyword;
        END IF;
    END LOOP;
    
    -- Limit query length to prevent abuse
    IF LENGTH(query_text) > 2000 THEN
        RAISE EXCEPTION 'Query too long. Maximum 2000 characters allowed.';
    END IF;
    
    -- Execute the query and return as JSON
    EXECUTE 'SELECT json_agg(row_to_json(t)) FROM (' || query_text || ' LIMIT 100) t' INTO result;
    
    -- Return empty array if no results
    IF result IS NULL THEN
        result := '[]'::JSON;
    END IF;
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Return error as JSON
        RETURN json_build_object(
            'error', TRUE,
            'message', SQLERRM,
            'code', SQLSTATE
        );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION execute_safe_query(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION execute_safe_query(TEXT) TO service_role;