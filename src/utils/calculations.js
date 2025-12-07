
export function calculateAdvancedMetrics(creator, reportData) {
  const followers = creator.creator_followers || 0;
  const interactions = creator.interactions_24h || 0;
  const posts = creator.posts_active || 0;
  
  // Engagement Rate
  const engagementRate = followers > 0 ? (interactions / followers) * 100 : 0;
  
  // Average Engagement per Post
  const avgEngagementPerPost = posts > 0 ? interactions / posts : 0;
  
  // Network Quality Score (based on top community size and diversity)
  const networkSize = (creator.top_community || []).length;
  const networkQuality = Math.min(100, (networkSize / 20) * 100);
  
  // Topic Influence Score (sum of percentages)
  const topicInfluenceScore = (creator.topic_influence || []).reduce((sum, t) => sum + (t.percent || 0), 0);
  
  // Category Diversity Score
  const categoryCount = (creator.category_influence || []).length;
  const categoryDiversity = Math.min(100, categoryCount * 12.5);

  // Content Consistency
  const contentConsistency = calculateContentConsistency(reportData);

  // Network Density
  const networkDensity = calculateNetworkDensity(reportData);
  
  // Growth Metrics (if time series available)
  let growthVelocity = 0;
  let momentum = 'neutral';
  
  if (reportData.time_series && reportData.time_series.length >= 2) {
    // Calculate growth trend from time series (slope of interactions)
    const ts = reportData.time_series;
    // Simple linear regression slope for interactions
    const n = ts.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    
    for (let i = 0; i < n; i++) {
        const x = i;
        const y = ts[i].interactions || 0;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const avgInteractions = sumY / n;
    
    // Normalize velocity: % growth per period relative to average
    if (avgInteractions > 0) {
        growthVelocity = (slope / avgInteractions) * 100;
    }

    if (growthVelocity > 5) momentum = 'bullish';
    else if (growthVelocity < -5) momentum = 'bearish';
  } else {
    // Fallback if no time series: compare 24h stats to assumed baseline or just use 0
    // Lacking historical data, we treat velocity as neutral
    growthVelocity = 0;
  }
  
  // Scale velocity to 0-100 score for the metric object (clamped)
  // Logic: 0 growth = 50 score. 5% growth = 100 score. -5% growth = 0 score.
  // formula: 50 + (velocity * 10)
  const growthScore = Math.min(100, Math.max(0, 50 + (growthVelocity * 10)));
  
  return {
    engagement_rate: engagementRate,
    avg_engagement_per_post: avgEngagementPerPost,
    network_quality_score: networkQuality,
    topic_influence_score: topicInfluenceScore,
    category_diversity_score: categoryDiversity,
    growth_velocity: growthVelocity,
    growth_score: growthScore, // Normalized 0-100
    content_consistency: contentConsistency, // 0-100
    network_density: networkDensity,
    momentum: momentum,
    creator_rank: creator.creator_rank || null,
    network_size: networkSize,
    posts_count_24h: posts,
    interactions_count_24h: interactions
  };
}

export function calculateInvestmentScore(metrics, reportData) {
  // Multi-factor weighted scoring for Long-Term Investibility
  let score = 0;
  
  // 1. Topic Authority (20%) - Proven expertise is durable
  const topicScore = Math.min(100, metrics.topic_influence_score * 10);
  score += topicScore * 0.20;
  
  // 2. Engagement Consistency (20%) - Reliability over virality
  // Assuming variance-based consistency is 0-100
  score += (metrics.content_consistency || 0) * 0.20;

  // 3. Growth Velocity (20%) - Trajectory matters
  // Using the normalized growth score calculated in metrics
  score += (metrics.growth_score || 50) * 0.20;
  
  // 4. Network Density/Quality (15%) - Depth of connections
  // rewarding strong network quality (size/quality) 
  // We can combine network quality (size) with network density (interactions/connection)
  // Let's use the Network Quality Score as the base (capped at 100)
  score += metrics.network_quality_score * 0.15;

  // 5. Engagement Rate (15%) - Base demand (Weighted down from 30%)
  const engagementScore = Math.min(100, metrics.engagement_rate * 10);
  score += engagementScore * 0.15;
  
  // 6. Creator Rank (10%) - Market position baseline
  let rankScore = 0;
  if (metrics.creator_rank) {
    // Normalize rank (lower is better, so invert)
    rankScore = Math.max(0, 100 - (metrics.creator_rank / 100000));
  }
  score += rankScore * 0.10;
  
  return Math.round(Math.min(100, score));
}

export function generateInsights(reportData, metrics, score) {
  const insights = [];
  
  // Engagement Insight
  if (metrics.engagement_rate > 5) {
    insights.push({
      type: 'positive',
      title: 'High Engagement Rate',
      message: `Engagement rate of ${metrics.engagement_rate.toFixed(2)}% indicates strong community connection.`
    });
  } else if (metrics.engagement_rate < 1) {
    insights.push({
      type: 'warning',
      title: 'Low Engagement Rate',
      message: `Engagement rate of ${metrics.engagement_rate.toFixed(2)}% suggests limited community interaction.`
    });
  }
  
  // Network Insight
  if (reportData.network.total_connections > 15) {
    insights.push({
      type: 'positive',
      title: 'Strong Network',
      message: `Connected with ${reportData.network.total_connections} top accounts, indicating strong ecosystem presence.`
    });
  }
  
  // Topic Influence Insight
  if (metrics.topic_influence_score > 10) {
    insights.push({
      type: 'positive',
      title: 'Topic Authority',
      message: `Significant influence across ${(reportData.topic_influence || []).length} topics.`
    });
  }
  
  // Creator Rank Insight
  if (metrics.creator_rank && metrics.creator_rank < 1000000) {
    insights.push({
      type: 'positive',
      title: 'Strong Creator Rank',
      message: `Ranked #${metrics.creator_rank.toLocaleString()} globally, indicating high influence.`
    });
  }
  
  return insights;
}

export function calculateEngagementVelocity(reportData) {
  // Calculate rate of engagement growth
  const interactions = reportData.creator.interactions_24h || 0;
  const followers = reportData.creator.followers || 1;
  return (interactions / followers) * 100;
}

export function calculateNetworkDensity(reportData) {
  const network = reportData.network.top_community || [];
  if (network.length === 0) return 0;
  const totalInteractions = network.reduce((sum, n) => sum + (n.count || 0), 0);
  return totalInteractions / network.length;
}

export function calculateContentConsistency(reportData) {
  const posts = reportData.top_posts || [];
  if (posts.length === 0) return 0;
  // Calculate consistency based on engagement variance
  const interactions = posts.map(p => p.interactions_total || p.interactions_24h || 0);
  if (interactions.length === 0 || interactions.reduce((a, b) => a + b, 0) === 0) return 0;
  const avg = interactions.reduce((a, b) => a + b, 0) / interactions.length;
  const variance = interactions.reduce((sum, e) => sum + Math.pow(e - avg, 2), 0) / interactions.length;
  return Math.max(0, 100 - (variance / (avg || 1)) * 10); // Lower variance = higher consistency
}

export function calculateInfluenceScore(reportData) {
  let score = 0;
  // Creator rank (lower is better)
  if (reportData.metrics.creator_rank) {
    score += Math.max(0, 50 - (reportData.metrics.creator_rank / 100000));
  }
  // Topic influence
  score += Math.min(30, reportData.metrics.topic_influence_score * 3);
  // Network quality
  score += reportData.metrics.network_quality_score * 0.2;
  return Math.min(100, score);
}

export function calculateExponentialIndicators(reportData, metrics, investmentScore) {
  const indicators = [];
  
  // High engagement rate
  if (metrics.engagement_rate > 5) {
    indicators.push({
      type: 'positive',
      indicator: 'high_engagement',
      message: 'Engagement rate above 5% indicates strong community connection',
      strength: 'strong'
    });
  }
  
  // Large network
  if (reportData.network.total_connections > 15) {
    indicators.push({
      type: 'positive',
      indicator: 'large_network',
      message: `Connected with ${reportData.network.total_connections} top accounts`,
      strength: 'strong'
    });
  }
  
  // Topic authority
  if (reportData.topic_analysis && reportData.topic_analysis.ranked_topics > 0) {
    indicators.push({
      type: 'positive',
      indicator: 'topic_authority',
      message: `Ranked in ${reportData.topic_analysis.ranked_topics} topics`,
      strength: 'moderate'
    });
  }
  
  // Growth potential
  if (investmentScore >= 60) {
    indicators.push({
      type: 'positive',
      indicator: 'growth_potential',
      message: 'Investment score indicates strong exponential potential',
      strength: 'strong'
    });
  }
  
  return indicators;
}

export function generateRecommendations(reportData, score) {
  const recommendations = [];
  
  if (score >= 70) {
    recommendations.push({
      priority: 'high',
      action: 'Strong Investment Opportunity',
      reasoning: 'High investment readiness score indicates exceptional potential',
      next_steps: ['Deep dive into network connections', 'Analyze content performance trends', 'Monitor growth trajectory']
    });
  } else if (score >= 50) {
    recommendations.push({
      priority: 'medium',
      action: 'Monitor and Evaluate',
      reasoning: 'Moderate score suggests potential with room for growth',
      next_steps: ['Track engagement trends', 'Assess network expansion', 'Evaluate content strategy']
    });
  } else {
    recommendations.push({
      priority: 'low',
      action: 'Further Analysis Required',
      reasoning: 'Lower score indicates need for deeper investigation',
      next_steps: ['Review engagement patterns', 'Assess network quality', 'Evaluate growth trajectory']
    });
  }
  
  // Network-specific recommendations
  if (reportData.network && reportData.network.total_connections < 10) {
    recommendations.push({
      priority: 'medium',
      action: 'Network Expansion Opportunity',
      reasoning: 'Limited network connections may indicate early stage or niche focus',
      next_steps: ['Identify key network gaps', 'Assess connection quality over quantity']
    });
  }
  
  return recommendations;
}

export function countDataPoints(reportData) {
  let count = 0;
  count += Object.keys(reportData.creator || {}).length;
  count += (reportData.network?.top_community || []).length;
  count += (reportData.topic_influence || []).length;
  count += (reportData.category_influence || []).length;
  count += (reportData.top_posts || []).length;
  count += Object.keys(reportData.metrics || {}).length;
  count += (reportData.insights || []).length;
  count += (reportData.recommendations || []).length;
  return count;
}

export function generateNarrative(reportData, score) {
  const handle = reportData.handle;
  const followers = reportData.creator?.followers || 0;
  const networkSize = reportData.network?.total_connections || 0;
  const topics = (reportData.topic_influence || []).length;
  
  let narrative = `@${handle} presents an `;
  
  if (score >= 70) {
    narrative += `exceptional investment opportunity with a score of ${score}/100. `;
  } else if (score >= 50) {
    narrative += `promising investment profile with a score of ${score}/100. `;
  } else {
    narrative += `emerging profile with a score of ${score}/100. `;
  }
  
  narrative += `With ${followers.toLocaleString()} followers and connections to ${networkSize} top accounts, `;
  narrative += `this individual demonstrates influence across ${topics} key topics. `;
  
  if ((reportData.topic_influence || []).length > 0) {
    const topTopic = reportData.topic_influence[0];
    narrative += `Primary focus: ${topTopic?.topic || 'N/A'} (rank #${topTopic?.rank || 'N/A'}). `;
  }
  
  narrative += `The network quality and engagement patterns suggest ${score >= 60 ? 'strong exponential potential' : 'growth potential'}.`;
  
  return narrative;
}
