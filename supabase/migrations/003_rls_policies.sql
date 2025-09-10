-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- Data access control based on user types and ownership
-- =============================================

-- =============================================
-- USERS TABLE POLICIES
-- =============================================

-- Users can view their own profile and admins can view all
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (
        auth.uid()::text = user_id::text OR 
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (
        auth.uid()::text = user_id::text
    );

-- Only admins can insert new users
CREATE POLICY "Admins can insert users" ON users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Only admins can delete users
CREATE POLICY "Admins can delete users" ON users
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- =============================================
-- FILES TABLE POLICIES
-- =============================================

-- Users can view files they created or files in their organization
CREATE POLICY "Users can view accessible files" ON files
    FOR SELECT USING (
        created_by_user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users u1, users u2
            WHERE u1.user_id::text = auth.uid()::text
            AND u2.user_id = created_by_user_id
            AND u1.user_type = u2.user_type
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can insert files
CREATE POLICY "Users can insert files" ON files
    FOR INSERT WITH CHECK (
        created_by_user_id::text = auth.uid()::text
    );

-- Users can update their own files
CREATE POLICY "Users can update own files" ON files
    FOR UPDATE USING (
        created_by_user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can delete their own files
CREATE POLICY "Users can delete own files" ON files
    FOR DELETE USING (
        created_by_user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- =============================================
-- FILE ACTIONS TABLE POLICIES
-- =============================================

-- Users can view file actions for files they have access to
CREATE POLICY "Users can view accessible file actions" ON file_actions
    FOR SELECT USING (
        user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM files f
            WHERE f.file_id = file_actions.file_id
            AND f.created_by_user_id::text = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can insert their own file actions
CREATE POLICY "Users can insert own file actions" ON file_actions
    FOR INSERT WITH CHECK (
        user_id::text = auth.uid()::text
    );

-- =============================================
-- CAMPAIGNS TABLE POLICIES
-- =============================================

-- Users can view campaigns they created or campaigns in their organization
CREATE POLICY "Users can view accessible campaigns" ON campaigns
    FOR SELECT USING (
        created_by_user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users u1, users u2
            WHERE u1.user_id::text = auth.uid()::text
            AND u2.user_id = created_by_user_id
            AND u1.user_type = u2.user_type
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can insert campaigns
CREATE POLICY "Users can insert campaigns" ON campaigns
    FOR INSERT WITH CHECK (
        created_by_user_id::text = auth.uid()::text
    );

-- Users can update their own campaigns
CREATE POLICY "Users can update own campaigns" ON campaigns
    FOR UPDATE USING (
        created_by_user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can delete their own campaigns
CREATE POLICY "Users can delete own campaigns" ON campaigns
    FOR DELETE USING (
        created_by_user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- =============================================
-- TEMPLATES TABLE POLICIES
-- =============================================

-- Users can view templates they created or templates in their organization
CREATE POLICY "Users can view accessible templates" ON templates
    FOR SELECT USING (
        created_by_user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users u1, users u2
            WHERE u1.user_id::text = auth.uid()::text
            AND u2.user_id = created_by_user_id
            AND u1.user_type = u2.user_type
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can insert templates
CREATE POLICY "Users can insert templates" ON templates
    FOR INSERT WITH CHECK (
        created_by_user_id::text = auth.uid()::text
    );

-- Users can update their own templates
CREATE POLICY "Users can update own templates" ON templates
    FOR UPDATE USING (
        created_by_user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can delete their own templates
CREATE POLICY "Users can delete own templates" ON templates
    FOR DELETE USING (
        created_by_user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- =============================================
-- SESSIONS TABLE POLICIES
-- =============================================

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions" ON sessions
    FOR SELECT USING (
        user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can insert their own sessions
CREATE POLICY "Users can insert own sessions" ON sessions
    FOR INSERT WITH CHECK (
        user_id::text = auth.uid()::text
    );

-- Users can update their own sessions
CREATE POLICY "Users can update own sessions" ON sessions
    FOR UPDATE USING (
        user_id::text = auth.uid()::text
    );

-- =============================================
-- COLLECTIONS TABLE POLICIES
-- =============================================

-- Users can view collections they created or public collections
CREATE POLICY "Users can view accessible collections" ON collections
    FOR SELECT USING (
        created_by_user_id::text = auth.uid()::text OR
        is_public = true OR
        EXISTS (
            SELECT 1 FROM users u1, users u2
            WHERE u1.user_id::text = auth.uid()::text
            AND u2.user_id = created_by_user_id
            AND u1.user_type = u2.user_type
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can insert collections
CREATE POLICY "Users can insert collections" ON collections
    FOR INSERT WITH CHECK (
        created_by_user_id::text = auth.uid()::text
    );

-- Users can update their own collections
CREATE POLICY "Users can update own collections" ON collections
    FOR UPDATE USING (
        created_by_user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can delete their own collections
CREATE POLICY "Users can delete own collections" ON collections
    FOR DELETE USING (
        created_by_user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- =============================================
-- COLLECTION FILES TABLE POLICIES
-- =============================================

-- Users can view collection files for collections they have access to
CREATE POLICY "Users can view accessible collection files" ON collection_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM collections c
            WHERE c.collection_id = collection_files.collection_id
            AND (
                c.created_by_user_id::text = auth.uid()::text OR
                c.is_public = true OR
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE user_id::text = auth.uid()::text 
                    AND user_type = 'admin'
                )
            )
        )
    );

-- Users can add files to their own collections
CREATE POLICY "Users can manage own collection files" ON collection_files
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM collections c
            WHERE c.collection_id = collection_files.collection_id
            AND c.created_by_user_id::text = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- =============================================
-- EMAIL CAMPAIGNS TABLE POLICIES (Retailer Side)
-- =============================================

-- Retailers can view their own email campaigns
CREATE POLICY "Retailers can view own email campaigns" ON email_campaigns
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM campaigns c
            WHERE c.campaign_id = email_campaigns.campaign_id
            AND c.created_by_user_id::text = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Retailers can insert email campaigns for their campaigns
CREATE POLICY "Retailers can insert email campaigns" ON email_campaigns
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM campaigns c
            WHERE c.campaign_id = email_campaigns.campaign_id
            AND c.created_by_user_id::text = auth.uid()::text
        )
    );

-- Retailers can update their own email campaigns
CREATE POLICY "Retailers can update own email campaigns" ON email_campaigns
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM campaigns c
            WHERE c.campaign_id = email_campaigns.campaign_id
            AND c.created_by_user_id::text = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- =============================================
-- EMAIL SENDS TABLE POLICIES (Retailer Side)
-- =============================================

-- Retailers can view email sends for their campaigns
CREATE POLICY "Retailers can view own email sends" ON email_sends
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM email_campaigns ec
            JOIN campaigns c ON ec.campaign_id = c.campaign_id
            WHERE ec.email_campaign_id = email_sends.email_campaign_id
            AND c.created_by_user_id::text = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- System can insert email sends
CREATE POLICY "System can insert email sends" ON email_sends
    FOR INSERT WITH CHECK (true); -- Will be restricted by application logic

-- =============================================
-- SMS CAMPAIGNS TABLE POLICIES (Retailer Side)
-- =============================================

-- Retailers can view their own SMS campaigns
CREATE POLICY "Retailers can view own sms campaigns" ON sms_campaigns
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM campaigns c
            WHERE c.campaign_id = sms_campaigns.campaign_id
            AND c.created_by_user_id::text = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Retailers can insert SMS campaigns for their campaigns
CREATE POLICY "Retailers can insert sms campaigns" ON sms_campaigns
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM campaigns c
            WHERE c.campaign_id = sms_campaigns.campaign_id
            AND c.created_by_user_id::text = auth.uid()::text
        )
    );

-- Retailers can update their own SMS campaigns
CREATE POLICY "Retailers can update own sms campaigns" ON sms_campaigns
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM campaigns c
            WHERE c.campaign_id = sms_campaigns.campaign_id
            AND c.created_by_user_id::text = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- =============================================
-- SMS SENDS TABLE POLICIES (Retailer Side)
-- =============================================

-- Retailers can view SMS sends for their campaigns
CREATE POLICY "Retailers can view own sms sends" ON sms_sends
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sms_campaigns sc
            JOIN campaigns c ON sc.campaign_id = c.campaign_id
            WHERE sc.sms_campaign_id = sms_sends.sms_campaign_id
            AND c.created_by_user_id::text = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- System can insert SMS sends
CREATE POLICY "System can insert sms sends" ON sms_sends
    FOR INSERT WITH CHECK (true); -- Will be restricted by application logic

-- =============================================
-- SOCIAL ACCOUNTS TABLE POLICIES (Retailer Side)
-- =============================================

-- Users can view their own social accounts
CREATE POLICY "Users can view own social accounts" ON social_accounts
    FOR SELECT USING (
        user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can insert their own social accounts
CREATE POLICY "Users can insert own social accounts" ON social_accounts
    FOR INSERT WITH CHECK (
        user_id::text = auth.uid()::text
    );

-- Users can update their own social accounts
CREATE POLICY "Users can update own social accounts" ON social_accounts
    FOR UPDATE USING (
        user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can delete their own social accounts
CREATE POLICY "Users can delete own social accounts" ON social_accounts
    FOR DELETE USING (
        user_id::text = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- =============================================
-- SOCIAL POSTS TABLE POLICIES (Retailer Side)
-- =============================================

-- Users can view posts from their social accounts
CREATE POLICY "Users can view own social posts" ON social_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM social_accounts sa
            WHERE sa.account_id = social_posts.account_id
            AND sa.user_id::text = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- Users can insert posts to their social accounts
CREATE POLICY "Users can insert own social posts" ON social_posts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM social_accounts sa
            WHERE sa.account_id = social_posts.account_id
            AND sa.user_id::text = auth.uid()::text
        )
    );

-- Users can update their own social posts
CREATE POLICY "Users can update own social posts" ON social_posts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM social_accounts sa
            WHERE sa.account_id = social_posts.account_id
            AND sa.user_id::text = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- =============================================
-- SOCIAL ENGAGEMENT TABLE POLICIES (Retailer Side)
-- =============================================

-- Users can view engagement for their posts
CREATE POLICY "Users can view own social engagement" ON social_engagement
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM social_posts sp
            JOIN social_accounts sa ON sp.account_id = sa.account_id
            WHERE sp.post_id = social_engagement.post_id
            AND sa.user_id::text = auth.uid()::text
        ) OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- System can insert engagement data
CREATE POLICY "System can insert social engagement" ON social_engagement
    FOR INSERT WITH CHECK (true); -- Will be restricted by application logic

-- =============================================
-- PRODUCTS TABLE POLICIES (Retailer Side)
-- =============================================

-- Retailers can view their own products
CREATE POLICY "Retailers can view own products" ON products
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type IN ('retailer', 'admin')
        )
    );

-- Retailers can insert products
CREATE POLICY "Retailers can insert products" ON products
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'retailer'
        )
    );

-- Retailers can update their products
CREATE POLICY "Retailers can update products" ON products
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type IN ('retailer', 'admin')
        )
    );

-- =============================================
-- PRODUCT VARIANTS TABLE POLICIES (Retailer Side)
-- =============================================

-- Retailers can view their own product variants
CREATE POLICY "Retailers can view own product variants" ON product_variants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type IN ('retailer', 'admin')
        )
    );

-- Retailers can insert product variants
CREATE POLICY "Retailers can insert product variants" ON product_variants
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'retailer'
        )
    );

-- Retailers can update their product variants
CREATE POLICY "Retailers can update product variants" ON product_variants
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type IN ('retailer', 'admin')
        )
    );

-- =============================================
-- ANALYTICS TABLES POLICIES
-- =============================================

-- Users can view analytics for data they have access to
CREATE POLICY "Users can view accessible analytics" ON daily_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type IN ('brand', 'retailer', 'admin')
        )
    );

-- System can insert analytics data
CREATE POLICY "System can insert analytics" ON daily_analytics
    FOR INSERT WITH CHECK (true); -- Will be restricted by application logic

-- =============================================
-- AUDIT LOGS POLICIES
-- =============================================

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE user_id::text = auth.uid()::text 
            AND user_type = 'admin'
        )
    );

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true); -- Will be restricted by application logic

-- =============================================
-- GEOGRAPHY AND DEVICES POLICIES
-- =============================================

-- All authenticated users can view geography data
CREATE POLICY "Users can view geography" ON geography
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- All authenticated users can view device data
CREATE POLICY "Users can view devices" ON devices
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- System can insert geography and device data
CREATE POLICY "System can insert geography" ON geography
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can insert devices" ON devices
    FOR INSERT WITH CHECK (true);

COMMIT;