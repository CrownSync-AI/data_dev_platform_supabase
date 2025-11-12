  # Ayrshare API Setup Guide

## 🔑 Getting Your Ayrshare API Key

To complete the social media analytics integration, you'll need to obtain an Ayrshare API key and configure it in your environment.

### Step 1: Sign Up for Ayrshare

1. Visit [Ayrshare.com](https://www.ayrshare.com)
2. Sign up for an account or log in if you already have one
3. Choose a plan that includes API access (usually Business or Enterprise plans)

### Step 2: Get Your API Key

1. Log into your Ayrshare dashboard
2. Navigate to **Settings** → **API Keys**
3. Generate a new API key or copy your existing one
4. Make note of your API key (it will look something like: `ayr_abc123def456...`)

### Step 3: Configure Environment Variables

Update your `.env.local` file with your actual Ayrshare API key:

```bash
# Replace 'your_ayrshare_api_key_here' with your actual API key
AYRSHARE_API_KEY=ayr_your_actual_api_key_here
AYRSHARE_BASE_URL=https://app.ayrshare.com/api
```

### Step 4: Connect Social Media Accounts

In your Ayrshare dashboard:

1. **Connect Platforms**: Link your LinkedIn, Instagram, Facebook, and Google Business Profile accounts
2. **Set Up Profiles**: Configure profile keys for each connected account
3. **Test Connection**: Verify that all accounts are properly connected

### Step 5: Configure Profile Keys

Each connected social media account will have a unique profile key in Ayrshare. You'll need to map these to your retailers in the CrownSync database.

Example profile keys:
- LinkedIn: `linkedin_profile_123`
- Instagram: `instagram_profile_456` 
- Facebook: `facebook_profile_789`
- Google Business: `google_business_profile_012`

### Step 6: Test the Integration

Once configured, you can test the integration:

```bash
# Run the Supabase connection test
node scripts/test-supabase-connection.js

# Start the development server
npm run dev

# Navigate to /dashboard/brand-performance/social-analytics
```

## 🔄 Data Synchronization

### Automatic Sync

The system is configured to automatically sync data from Ayrshare:

- **Real-time Updates**: Every 30 seconds for live metrics
- **Daily Sync**: Complete data refresh once per day
- **Manual Sync**: Available via the refresh button in the UI

### Manual Sync

You can trigger a manual sync using the API:

```bash
curl -X POST http://localhost:3000/api/social-analytics/sync
```

## 📊 Available Metrics

Once connected, you'll have access to:

### Platform Metrics
- **LinkedIn**: Company followers, page views, engagement, lead forms
- **Instagram**: Followers, story views, reel performance, shopping taps
- **Facebook**: Page likes, post reach, video views, audience demographics
- **Google Business**: Profile views, direction requests, phone calls, reviews

### Analytics Features
- **Real-time Dashboard**: Live metrics and performance tracking
- **Retailer Rankings**: Performance comparison across all retailers
- **Content Analysis**: Top-performing posts and engagement trends
- **Export Functionality**: CSV, JSON, and PDF reports

## 🛠️ Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the API key is correct and active
   - Check that your Ayrshare plan includes API access
   - Ensure the key has proper permissions

2. **No Data Appearing**
   - Confirm social media accounts are connected in Ayrshare
   - Check that profile keys are properly configured
   - Verify the sync process is running

3. **Rate Limiting**
   - Ayrshare has API rate limits
   - The system automatically handles retries
   - Consider upgrading your Ayrshare plan for higher limits

### Support

- **Ayrshare Documentation**: [docs.ayrshare.com](https://docs.ayrshare.com)
- **CrownSync Issues**: Check the application logs for detailed error messages
- **API Testing**: Use the built-in test endpoints to verify connectivity

## 🔐 Security Notes

- **Never commit API keys** to version control
- **Use environment variables** for all sensitive configuration
- **Rotate API keys** regularly for security
- **Monitor API usage** to detect any unusual activity

Once your Ayrshare API key is configured, the social media analytics feature will be fully functional with live data from all connected platforms!