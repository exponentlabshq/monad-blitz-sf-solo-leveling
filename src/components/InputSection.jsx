import { useState } from 'react';

export default function InputSection({ onAnalyze, isLoading }) {
    const [handle, setHandle] = useState('');

    const handleSubmit = () => {
        if (handle.trim()) {
            onAnalyze(handle);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="input-section">
            <input
                type="text"
                id="handle"
                placeholder="@username or username"
                autoFocus
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading || !handle.trim()}
            >
                {isLoading ? 'Generating Comprehensive Report...' : 'Generate Comprehensive Report'}
            </button>
            {isLoading && <div className="loading-progress" id="progress">Processing data...</div>}
        </div>
    );
}
