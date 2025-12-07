export default function ScoreContainer({ score, narrative }) {
    return (
        <div className="score-container">
            <div className="score-label">Investment Readiness Score</div>
            <div className="score-value">{score}</div>
            <div style={{ marginTop: '10px', fontSize: '16px' }}>{narrative}</div>
        </div>
    );
}
