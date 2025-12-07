import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

// Update chart defaults for Light Mode
ChartJS.defaults.color = '#52525B';
ChartJS.defaults.borderColor = '#E4E4E7';
ChartJS.defaults.scale.grid.color = '#E4E4E7';
ChartJS.defaults.font.family = 'Inter';

export function TopicInfluenceChart({ data }) {
    if (!data || data.length === 0) return null;

    const topTopics = data.slice(0, 10);
    const chartData = {
        labels: topTopics.map(t => t.topic),
        datasets: [{
            label: 'Influence %',
            data: topTopics.map(t => t.percent || 0),
            backgroundColor: 'rgba(110, 84, 255, 0.8)',
            borderColor: '#6E54FF',
            borderWidth: 1,
            borderRadius: 4
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 2000,
            easing: 'easeOutQuart'
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Topic Influence Distribution',
                font: { family: 'Inter', size: 16, weight: 'bold' },
                color: '#1B1D21'
            }
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#E4E4E7' } },
            x: { grid: { display: false } }
        }
    };

    return <div className="chart-container"><Bar data={chartData} options={options} /></div>;
}

export function NetworkConnectionsChart({ data }) {
    if (!data || data.length === 0) return null;

    const topConnections = data.slice(0, 15);
    const chartData = {
        labels: topConnections.map(c => c.creator_name || 'Unknown'),
        datasets: [{
            label: 'Interactions',
            data: topConnections.map(c => c.count || 0),
            backgroundColor: 'rgba(14, 165, 233, 0.8)', /* Cyan updated for light mode */
            borderColor: '#0EA5E9',
            borderWidth: 1,
            borderRadius: 4
        }]
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 2000,
            easing: 'easeOutQuart',
            delay: (context) => context.dataIndex * 100
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Top Network Connections',
                font: { family: 'Inter', size: 16, weight: 'bold' },
                color: '#1B1D21'
            }
        },
        scales: {
            y: {
                ticks: {
                    color: '#52525B',
                    callback: function (value, index) {
                        const label = this.getLabelForValue(value);
                        return label.length > 15 ? label.substring(0, 15) + '...' : label;
                    }
                },
                grid: { display: false }
            },
            x: { grid: { color: '#E4E4E7' } }
        }
    };

    return <div className="chart-container large"><Bar data={chartData} options={options} /></div>;
}

export function TimeSeriesChart({ data }) {
    if (!data || data.length === 0) return null;

    const labels = data.map(d => new Date(d.time * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const interactions = data.map(d => d.interactions || 0);
    const postsActive = data.map(d => d.posts_active || 0);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Interactions',
                data: interactions,
                borderColor: '#6E54FF',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(110, 84, 255, 0.5)');
                    gradient.addColorStop(1, 'rgba(110, 84, 255, 0.0)');
                    return gradient;
                },
                tension: 0.4,
                fill: true,
                yAxisID: 'y'
            },
            {
                label: 'Active Posts',
                data: postsActive,
                borderColor: '#0EA5E9',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        animation: {
            y: { duration: 2000, from: 500 },
            easing: 'easeOutQuart'
        },
        plugins: {
            legend: { position: 'top', labels: { color: '#1B1D21' } },
            title: {
                display: true,
                text: 'Engagement Trends Over Time',
                font: { family: 'Inter', size: 16, weight: 'bold' },
                color: '#1B1D21'
            }
        },
        scales: {
            y: {
                position: 'left',
                title: { display: true, text: 'Interactions', color: '#52525B' },
                grid: { color: '#E4E4E7' },
                ticks: { color: '#52525B' }
            },
            y1: {
                position: 'right',
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Active Posts', color: '#52525B' },
                ticks: { color: '#52525B' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#52525B' }
            }
        }
    };

    return <div className="chart-container large"><Line data={chartData} options={options} /></div>;
}

export function EngagementMetricsChart({ data }) {
    if (!data) return null;

    const chartData = {
        labels: ['Engagement Rate', 'Network Quality', 'Topic Influence', 'Growth Potential'],
        datasets: [{
            data: [
                data.engagement_rate || 0,
                data.network_quality_score || 0,
                data.topic_influence_score || 0,
                data.growth_velocity || 0
            ],
            backgroundColor: [
                'rgba(110, 84, 255, 0.8)',
                '#0EA5E9',
                '#F59E0B',
                '#DDD7FE'
            ],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            animateScale: true,
            animateRotate: true,
            duration: 2000
        },
        plugins: {
            legend: { position: 'right', labels: { color: '#1B1D21' } },
            title: {
                display: true,
                text: 'Engagement Metrics Breakdown',
                font: { family: 'Inter', size: 16, weight: 'bold' },
                color: '#1B1D21'
            }
        }
    };

    return <div className="chart-container"><Doughnut data={chartData} options={options} /></div>;
}
