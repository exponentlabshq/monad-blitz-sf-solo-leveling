
import { CopilotKit, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import TestPage from './pages/TestPage';
import InputSection from './components/InputSection';
import ScoreContainer from './components/ScoreContainer';
import MetricsGrid from './components/MetricsGrid';
import KeyInsights from './components/KeyInsights';
import NetworkSection from './components/NetworkSection';
import TopicInfluence from './components/TopicInfluence';
import PostsSection from './components/PostsSection';
import InvestmentRecommendations from './components/InvestmentRecommendations';
import { TimeSeriesChart, EngagementMetricsChart } from './components/Charts';
import { useAnalysis } from './hooks/useAnalysis';

function Dashboard({ data }) {
    // Make data readable by Copilot
    useCopilotReadable({
        description: "The analysis report of the Twitter user",
        value: data
    });

    return (
        <>
            <ScoreContainer score={data.investment_readiness_score} narrative={data.narrative} />

            <div className="data-stats">
                <strong>Report Statistics:</strong> {JSON.stringify(data).length} bytes of data |
                {Object.keys(data).length} top-level sections |
                {data.network?.total_connections || 0} network connections |
                {data.top_posts?.length || 0} posts analyzed
            </div>

            <MetricsGrid data={data} />

            <KeyInsights insights={data.insights} />

            <NetworkSection data={data} />

            <TopicInfluence data={data} />

            {data.time_series && data.time_series.length > 0 && (
                <div className="section">
                    <h2 className="section-title">Engagement Trends</h2>
                    <TimeSeriesChart data={data.time_series} />
                </div>
            )}

            <PostsSection data={data} />

            <div className="section">
                <h2 className="section-title">Engagement Metrics Overview</h2>
                <EngagementMetricsChart data={data.metrics} />
            </div>

            <InvestmentRecommendations data={data} />
        </>
    );
}

function MainContent({ data, isLoading, error, loadingMessage, analyze }) {
    return (
        <>
            <InputSection onAnalyze={analyze} isLoading={isLoading} />

            {isLoading && <div className="loading" style={{ textAlign: 'center', margin: '20px' }}>{loadingMessage}</div>}

            {error && (
                <div className="error">Error: {error}</div>
            )}

            <Routes>
                <Route path="/" element={data && <Dashboard data={data} />} />
                <Route path="/test" element={<TestPage data={data} />} />
            </Routes>
        </>
    );
}

function App() {
    const { data, isLoading, error, loadingMessage, analyze } = useAnalysis();

    return (
        <CopilotKit publicApiKey={import.meta.env.VITE_COPILOTKIT_PUBLIC_KEY}>
            <Router>
                <div className="app-container">
                    <Navbar />
                    <h1>Exponential Individuals - 10X Intelligence</h1>
                    <MainContent
                        data={data}
                        isLoading={isLoading}
                        error={error}
                        loadingMessage={loadingMessage}
                        analyze={analyze}
                    />
                </div>
            </Router>

            <CopilotSidebar
                defaultOpen={true}
                instructions="You are an AI assistant helping analyze Lunarcrush creator data. You have access to the report data currently displayed on the screen. Answer questions about the investment score, key insights, and network."
                labels={{ title: "10X Analyst" }}
            />
        </CopilotKit>
    );
}

export default App;
