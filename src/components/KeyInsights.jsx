export default function KeyInsights({ insights }) {
    return (
        <div className="section">
            <h2 className="section-title">Key Insights</h2>
            {insights.map((insight, idx) => (
                <div className="insight-box" key={idx}>
                    <div className="insight-title">{insight.title}</div>
                    <div>{insight.message}</div>
                </div>
            ))}
        </div>
    );
}
