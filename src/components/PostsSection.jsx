export default function PostsSection({ data }) {
    const topPosts = data.top_posts ? data.top_posts.slice(0, 10) : [];

    if (topPosts.length === 0) return null;

    return (
        <div className="section">
            <h2 className="section-title">Key Tweets (Top {topPosts.length} by Engagement)</h2>
            {topPosts.map((post, idx) => {
                const borderColor = idx === 0 ? '#85E6FF' : idx < 3 ? '#FFAE45' : '#6E54FF';
                const interactions = (post.interactions_total || post.interactions_24h || 0);
                const postDate = post.post_created ? new Date(post.post_created * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
                const sentiment = post.post_sentiment ? post.post_sentiment.toFixed(1) : 'N/A';
                const postText = post.post_title || post.text || post.content || 'N/A';

                return (
                    <div className="post-item" style={{ borderLeft: `4px solid ${borderColor}`, paddingLeft: '15px', marginBottom: '20px' }} key={post.id || idx}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>#{idx + 1} Most Engaging</div>
                                <div className="post-text" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '15px', marginBottom: '10px' }}>{postText}</div>
                                {post.post_image && (
                                    <img
                                        src={post.post_image}
                                        style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', marginTop: '10px', objectFit: 'cover' }}
                                        onError={(e) => e.target.style.display = 'none'}
                                        alt="Post media"
                                    />
                                )}
                                <div className="post-meta" style={{ marginTop: '10px' }}>
                                    <a href={post.post_link || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#6E54FF', textDecoration: 'none', fontWeight: 'bold' }}>View Tweet →</a> |
                                    {' '}{postDate} |
                                    Sentiment: {sentiment}/5.0
                                </div>
                            </div>
                            <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#6E54FF', lineHeight: 1, fontFamily: 'Roboto Mono, monospace' }}>{interactions.toLocaleString()}</div>
                                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>interactions</div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {data.posts_analysis && (
                <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <strong>Posts Analysis:</strong> {(data.posts_analysis.total_interactions || 0).toLocaleString()} total interactions |
                    {(data.posts_analysis.avg_interactions || 0).toFixed(0)} avg per post |
                    {data.posts_analysis.viral_posts || 0} viral posts (500+ interactions)
                </div>
            )}
        </div>
    );
}
