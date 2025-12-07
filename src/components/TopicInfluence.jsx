import { TopicInfluenceChart } from './Charts';

export default function TopicInfluence({ data }) {
    const topics = data.topic_influence || [];

    return (
        <div className="section">
            <h2 className="section-title">Topic Influence ({topics.length} Topics)</h2>
            <TopicInfluenceChart data={topics} />
            <div style={{ marginTop: '20px' }}>
                {topics.map((topic, idx) => (
                    <span className="topic-tag" key={idx}>
                        {topic.topic}
                        {topic.rank ? <span className="rank">#{topic.rank}</span> : ''}
                        {topic.percent ? ` (${topic.percent.toFixed(2)}%)` : ''}
                    </span>
                ))}
            </div>
        </div>
    );
}
