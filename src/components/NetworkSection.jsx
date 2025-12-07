import { NetworkConnectionsChart } from './Charts';

export default function NetworkSection({ data }) {
    const connections = data.network?.top_community || [];

    return (
        <div className="section">
            <h2 className="section-title">Network Analysis ({data.network?.total_connections || 0} Connections)</h2>

            {connections.slice(0, 20).map(interactor => (
                <div className="interactor-card" key={interactor.creator_id || interactor.creator_name}>
                    <img
                        src={interactor.creator_avatar || 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Ccircle cx=%2750%27 cy=%2750%27 r=%2740%27 fill=%27%23ddd%27/%3E%3C/svg%3E'}
                        alt={interactor.creator_name}
                        className="interactor-avatar"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 100 100%27%3E%3Ccircle cx=%2750%27 cy=%2750%27 r=%2740%27 fill=%27%23ddd%27/%3E%3C/svg%3E';
                        }}
                    />
                    <div className="interactor-info">
                        <div className="interactor-name">{interactor.creator_display_name || interactor.creator_name}</div>
                        <div className="interactor-handle">@{interactor.creator_name}</div>
                    </div>
                    <div className="interactor-count">{interactor.count || 0}</div>
                </div>
            ))}

            <div className="section">
                <h2 className="section-title">Network Connections Visualization</h2>
                <NetworkConnectionsChart data={connections} />
            </div>
        </div>
    );
}
