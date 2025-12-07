
import { 
  calculateAdvancedMetrics, 
  calculateInvestmentScore, 
  generateInsights, 
  generateNarrative, 
  calculateEngagementVelocity, 
  calculateNetworkDensity, 
  calculateContentConsistency, 
  calculateInfluenceScore, 
  calculateExponentialIndicators, 
  generateRecommendations, 
  countDataPoints 
} from '../utils/calculations';

const API_BASE = 'https://lunarcrush.com/api4';

export async function fetchReport(handle, onProgress) {
  const API_KEY = import.meta.env.VITE_LUNARCRUSH_API_KEY;
  
  if (!API_KEY) {
    throw new Error('LunarCrush API Key is missing. Please check .env file.');
  }

  const cleanHandle = handle.replace('@', '').toLowerCase().trim();
  
  const reportData = {
    handle: cleanHandle,
    generated_at: new Date().toISOString(),
    version: '10X-Intelligence-v1.0'
  };
  
  if (onProgress) onProgress('Fetching creator data...');
  
  // 1. Creator Data
  let creatorUrl = `${API_BASE}/public/creator/twitter/${cleanHandle}/v1?key=${API_KEY}`;
  let creatorResponse = await fetch(creatorUrl);
  let creatorData = await creatorResponse.json();
  
  if (creatorData.error || !creatorData.data) {
    throw new Error(creatorData.error?.message || 'Creator not found');
  }
  
  const creator = creatorData.data;
  
  reportData.creator = {
    id: creator.creator_id,
    name: creator.creator_name,
    display_name: creator.creator_display_name,
    avatar: creator.creator_avatar,
    followers: creator.creator_followers || 0,
    creator_rank: creator.creator_rank || null,
    interactions_24h: creator.interactions_24h || 0,
    posts_active_24h: creator.posts_active || 0,
    posts_created_24h: creator.posts_created || 0,
    verified: creator.verified || false,
    ...(creator.engagement_rate && { engagement_rate: creator.engagement_rate }),
    ...(creator.avg_engagement_rate && { avg_engagement_rate: creator.avg_engagement_rate }),
    ...(creator.sentiment && { sentiment: creator.sentiment }),
    ...(creator.social_dominance && { social_dominance: creator.social_dominance })
  };
  
  // 2. Time Series Data
  if (onProgress) onProgress('Fetching time series data...');
  try {
    const timeSeriesUrl = `${API_BASE}/public/creator/twitter/${cleanHandle}/time-series/v1?key=${API_KEY}`;
    const timeSeriesResponse = await fetch(timeSeriesUrl);
    const timeSeriesData = await timeSeriesResponse.json();
    if (timeSeriesData.data) {
      reportData.time_series = timeSeriesData.data;
    }
  } catch (e) {
    console.log('Time series not available');
  }
  
  // 3. Top Posts
  if (onProgress) onProgress('Fetching top posts...');
  try {
    const postsUrl = `${API_BASE}/public/creator/twitter/${cleanHandle}/posts/v1?key=${API_KEY}`;
    const postsResponse = await fetch(postsUrl);
    const postsData = await postsResponse.json();
    if (postsData.data && Array.isArray(postsData.data)) {
      reportData.top_posts = postsData.data;
      const sortedPosts = [...postsData.data].sort((a, b) => 
        (b.interactions_total || 0) - (a.interactions_total || 0)
      );
      
      reportData.posts_analysis = {
        total_posts: postsData.data.length,
        total_interactions: postsData.data.reduce((sum, p) => sum + (p.interactions_total || p.interactions_24h || 0), 0),
        avg_interactions: postsData.data.length > 0 ? 
          postsData.data.reduce((sum, p) => sum + (p.interactions_total || p.interactions_24h || 0), 0) / postsData.data.length : 0,
        top_post: sortedPosts[0] || null,
        top_5_posts: sortedPosts.slice(0, 5),
        posts_with_high_engagement: postsData.data.filter(p => (p.interactions_total || p.interactions_24h || 0) > 100).length,
        viral_posts: postsData.data.filter(p => (p.interactions_total || 0) > 500).length
      };
      
      reportData.top_posts = sortedPosts;
    }
  } catch (e) {
    console.log('Posts not available', e);
    reportData.top_posts = [];
  }
  
  // 4. Topic Influence
  if (onProgress) onProgress('Analyzing topic influence...');
  reportData.topic_influence = creator.topic_influence || [];
  reportData.topic_analysis = {
    total_topics: (creator.topic_influence || []).length,
    top_topic: (creator.topic_influence && creator.topic_influence[0]) || null,
    total_influence_percent: (creator.topic_influence || []).reduce((sum, t) => sum + (t.percent || 0), 0),
    ranked_topics: (creator.topic_influence || []).filter(t => t.rank).length
  };
  
  // 5. Social Category Influence
  const categoryInfluence = creator.category_influence || creator.social_category_influence || creator.categories || [];
  reportData.category_influence = categoryInfluence;
  reportData.category_analysis = {
    total_categories: categoryInfluence.length,
    top_category: categoryInfluence[0] || null,
    total_influence_percent: categoryInfluence.reduce((sum, c) => sum + (c.percent || c.influence || 0), 0),
    categories: categoryInfluence.map(c => ({
      name: c.category || c.name || c,
      percent: c.percent || c.influence || 0
    }))
  };
  
  // 6. Top Community
  if (onProgress) onProgress('Mapping network...');
  const topCommunity = creator.top_community || [];
  reportData.network = {
    top_community: topCommunity,
    total_connections: topCommunity.length,
    network_analysis: {
      total_interactions: topCommunity.reduce((sum, c) => sum + (c.count || 0), 0),
      avg_interactions_per_connection: topCommunity.length > 0 ? 
        topCommunity.reduce((sum, c) => sum + (c.count || 0), 0) / topCommunity.length : 0,
      top_connection: topCommunity[0] || null,
      connections_with_avatars: topCommunity.filter(c => c.creator_avatar).length
    }
  };
  
  // 7. Assets mentioned
  const assetsMentioned = creator.assets_mentioned || creator.mentioned_assets || creator.assets || [];
  reportData.assets_mentioned = assetsMentioned;
  
  // 8. Advanced Metrics
  if (onProgress) onProgress('Calculating metrics...');
  const metrics = calculateAdvancedMetrics(creator, reportData);
  reportData.metrics = metrics;
  
  // 9. Investment Score
  const investmentScore = calculateInvestmentScore(metrics, reportData);
  reportData.investment_readiness_score = investmentScore;
  
  // 10. Insights
  reportData.insights = generateInsights(reportData, metrics, investmentScore);
  
  // 11. Narrative
  reportData.narrative = generateNarrative(reportData, investmentScore);
  
  // 12. Derived Metrics
  reportData.derived_metrics = {
    engagement_velocity: calculateEngagementVelocity(reportData),
    network_density: calculateNetworkDensity(reportData),
    content_consistency: calculateContentConsistency(reportData),
    influence_score: calculateInfluenceScore(reportData),
    exponential_indicators: calculateExponentialIndicators(reportData, metrics, investmentScore)
  };
  
  // 13. Recommendations
  reportData.recommendations = generateRecommendations(reportData, investmentScore);
  
  // 14. Metadata
  reportData.metadata = {
    data_quality: 'high',
    data_freshness: new Date().toISOString(),
    data_sources: ['lunarcrush_api_v4'],
    total_data_points: countDataPoints(reportData),
    report_version: '10X-Intelligence-v1.0'
  };
  
  return reportData;
}
