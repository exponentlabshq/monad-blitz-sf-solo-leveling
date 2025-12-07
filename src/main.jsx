import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Import CopilotKit styles if needed, though they might be included in the components or require separate import
import "@copilotkit/react-ui/styles.css";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
