# Exponential Individuals - 10X Intelligence

A React-based dashboard for analyzing Twitter creator data using the LunarCrush API, featuring an AI-powered analyst chatbot powered by CopilotKit.

## Tech Stack

- **Frontend Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Blockchain & Payments**: [Monad](https://monad.xyz/) (x402 Payments)
- **Web3 Integration**: [Thirdweb](https://thirdweb.com/)
- **AI Integration**: [CopilotKit](https://docs.copilotkit.ai/) (Chatbot & Context-aware AI)
- **Data Visualization**: [Chart.js](https://www.chartjs.org/) + `react-chartjs-2`
- **Routing**: `react-router-dom`
- **Styling**: Native CSS with CSS Variables for Dark Theme
- **Backend / Runtime**: Node.js + Express (for CopilotKit Runtime)

## Features

- **Comprehensive Dashboard**: View detailed metrics on engagement, network quality, and topic influence.
- **Investment Readiness Score**: A proprietary 0-100 score calculating the "investibility" of a creator based on long-term growth and consistency.
- **AI Analyst**: A built-in chatbot that can answer questions about the specific report data currently on screen.
- **Dark Mode**: Sleek, modern dark UI designed for data density and readability.
- **Visualizations**: Animated charts for Time Series, Topic Influence, and Network connections.

## Prerequisites

- Node.js (v14.18+ or v18+)
- NPM
- A [LunarCrush](https://lunarcrush.com/) API Key based on the V4 API.
- An [OpenAI](https://openai.com/) API Key.

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   cd monad-blitz-sf-solo-leveling
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_LUNARCRUSH_API_KEY=your_lunarcrush_api_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

## Running the Application

To run both the Frontend (Vite) and the Backend Runtime (Express) concurrently:

```bash
npm run start:dev
```

- **Frontend**: `http://localhost:5173`
- **Copilot Runtime**: `http://localhost:4000/copilotkit`

## Project Structure

- `src/components/`: Reusable UI components (Charts, Navbar, Sections).
- `src/utils/calculations.js`: Core business logic for scoring and metrics.
- `src/services/api.js`: API integration logic.
- `server.js`: Express server for handling AI request proxying.