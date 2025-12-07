export default function TestPage({ data }) {
    if (!data) {
        return (
            <div className="section">
                <h2 className="section-title">Raw Data Debugger</h2>
                <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                    No data available. Please go to the Dashboard and generate a report first.
                </div>
            </div>
        );
    }

    return (
        <div className="section">
            <h2 className="section-title">Raw Data Debugger</h2>
            <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                Debugging: @{data.handle}
            </div>
            <pre id="json" style={{ maxHeight: '80vh' }}>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}
