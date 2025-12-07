export default function InvestmentRecommendations({ data }) {
    if (!data.recommendations || data.recommendations.length === 0) {
        return (
            <div className="section">
                <h2 className="section-title">Investment Recommendations</h2>
                <p>No specific recommendations available.</p>
            </div>
        );
    }

    return (
        <div className="section">
            <h2 className="section-title">Investment Recommendations</h2>
            {data.recommendations.map((rec, idx) => {
                const bg = rec.priority === 'high' ? 'rgba(110, 84, 255, 0.1)' : rec.priority === 'medium' ? 'rgba(255, 174, 69, 0.1)' : 'rgba(221, 215, 254, 0.3)';
                const borderColor = rec.priority === 'high' ? '#6E54FF' : rec.priority === 'medium' ? '#FFAE45' : '#DDD7FE';

                return (
                    <div className="insight-box" style={{ background: bg, borderColor: borderColor }} key={idx}>
                        <div className="insight-title">{rec.action} (Priority: {rec.priority})</div>
                        <div style={{ margin: '10px 0' }}>{rec.reasoning}</div>
                        <div style={{ marginTop: '10px' }}>
                            <strong>Next Steps:</strong>
                            <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
                                {rec.next_steps.map((step, sIdx) => <li key={sIdx}>{step}</li>)}
                            </ul>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
