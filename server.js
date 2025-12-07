import express from 'express';
import { CopilotRuntime, OpenAIAdapter } from '@copilotkit/backend';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const port = 4000;

// Serve static files from dist in production, but for dev we just focus on the API
// For simplicity in this setup, we'll just handle the API endpoint

const openai = new OpenAI({ apiKey: process.env.VITE_OPENAI_API_KEY });
const serviceAdapter = new OpenAIAdapter({ openai });

app.use('/copilotkit', (req, res, next) => {
  const runtime = new CopilotRuntime();
  runtime.streamHttpServerResponse(req, res, serviceAdapter);
});

app.listen(port, () => {
  console.log(`Copilot Runtime server running at http://localhost:${port}/copilotkit`);
});
