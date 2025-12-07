export default function MetricsGrid({ data }) {
    return (
        <div className="section">
            <h2 className="section-title">Core Metrics</h2>
            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-value">{data.creator.followers.toLocaleString()}</div>
                    <div className="metric-label">Followers</div>
                </div>
                <div className="metric-card">
                    <div className="metric-value">{data.metrics.engagement_rate.toFixed(2)}%</div>
                    <div className="metric-label">Engagement Rate</div>
                </div>
                <div className="metric-card">
                    <div className="metric-value">{data.metrics.network_quality_score.toFixed(0)}</div>
                    <div className="metric-label">Network Quality</div>
                </div>
                <div className="metric-card">
                    <div className="metric-value">{data.metrics.topic_influence_score.toFixed(1)}</div>
                    <div className="metric-label">Topic Influence</div>
                </div>
                <div className="metric-card">
                    <div className="metric-value">{data.metrics.creator_rank ? '#' + data.metrics.creator_rank.toLocaleString() : 'N/A'}</div>
                    <div className="metric-label">Creator Rank</div>
                </div>
                <div className="metric-card">
                    <div className="metric-value">{data.network.total_connections}</div>
                    <div className="metric-label">Network Size</div>
                </div>
            </div>
        </div>
    );
}
