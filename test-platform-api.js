// Simple test script to verify platform-specific API implementation
const testPlatformAPI = async () => {
  try {
    console.log('🧪 Testing Platform-Specific API Implementation...\n');
    
    // Test different platform endpoints
    const platforms = ['all', 'facebook', 'instagram', 'twitter', 'linkedin'];
    
    for (const platform of platforms) {
      console.log(`📊 Testing ${platform} platform...`);
      
      const url = `http://localhost:3000/api/campaign-performance-new/platform-metrics?platform=${platform}&role=brand`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (response.ok && data.success) {
          console.log(`✅ ${platform}: API working`);
          console.log(`   - Overview items: ${data.data.overview?.length || 0}`);
          console.log(`   - Top posts: ${data.data.topPosts?.length || 0}`);
          console.log(`   - Engagement data: ${Object.keys(data.data.engagement || {}).length} platforms`);
        } else {
          console.log(`❌ ${platform}: ${data.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.log(`❌ ${platform}: Connection error - ${err.message}`);
      }
      
      console.log('');
    }
    
    console.log('🎯 Test completed!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testPlatformAPI();