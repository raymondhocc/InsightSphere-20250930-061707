# InsightSphere: AI CRM Analytics Agent

[cloudflarebutton]

InsightSphere is a sophisticated, AI-driven CRM analytics platform designed to provide real-time, data-driven insights through a minimalist and intuitive chat interface. Users can ask complex questions in natural language about customer behavior, sales funnels, and key performance indicators (KPIs). The AI agent interprets these queries, utilizes specialized data analysis tools to fetch and process information from a mock CRM database, and presents the findings as clear text summaries, interactive charts, and elegant KPI cards. The application is a single-page interface featuring a collapsible sidebar for managing conversation history and a main view dedicated to the interactive chat and dynamic data visualizations. The entire experience is designed to be visually stunning, highly responsive, and exceptionally user-friendly, transforming raw CRM data into actionable intelligence.

## Key Features

-   **Conversational AI Agent**: Interact with your CRM data using natural language.
-   **Dynamic Data Visualization**: Automatically generates KPI cards and charts based on your queries.
-   **Real-time Insights**: Get immediate, data-driven answers about customer behavior, market trends, and KPIs.
-   **Session Management**: A collapsible sidebar to manage, create, and switch between conversation histories.
-   **Modern, Responsive UI**: A visually stunning and intuitive interface that works flawlessly on all devices.
-   **Scalable Architecture**: Built on Cloudflare Workers and Durable Objects for high performance and reliability.

## Technology Stack

-   **Frontend**: React, Vite, TypeScript, Tailwind CSS
-   **UI Components**: shadcn/ui, Framer Motion, Lucide React
-   **Data Visualization**: Recharts
-   **State Management**: Zustand
-   **Backend**: Hono on Cloudflare Workers
-   **Persistence**: Cloudflare Agents SDK & Durable Objects
-   **AI Integration**: OpenAI SDK, Cloudflare AI Gateway

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v20.x or later recommended)
-   [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/insightsphere-crm-agent.git
    cd insightsphere-crm-agent
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**

    Create a `.dev.vars` file in the root of the project. This file is used by Wrangler for local development.

    ```ini
    # .dev.vars

    # Required: Your Cloudflare AI Gateway URL
    # Format: https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_NAME/openai
    CF_AI_BASE_URL="your-cloudflare-ai-gateway-url"

    # Required: Your Cloudflare AI Gateway API Key
    CF_AI_API_KEY="your-cloudflare-api-key"
    ```

    > **Note:** For the AI features to work, you must have a Cloudflare account and set up an AI Gateway.

## Development

To run the application in development mode, which includes hot-reloading for the frontend and the local worker environment, use the following command:

```bash
bun dev
```

This will start the Vite development server for the React frontend and `wrangler dev` for the Cloudflare Worker backend. The application will be available at `http://localhost:3000` (or the port specified in your environment).

## Usage

Once the application is running, you can interact with the AI CRM agent:

1.  Open your browser and navigate to the local development URL.
2.  You will be greeted with a new, untitled chat session.
3.  Type a query into the chat input at the bottom of the screen, for example:
    -   `What was our user acquisition last month?`
    -   `Show me the sales funnel for Q2.`
    -   `Break down new customers by marketing source.`
4.  Press Enter or click the send button.
5.  The AI agent will process your request and respond with a text summary. The analytics dashboard below the chat will populate with relevant KPI cards and charts.
6.  Use the sidebar to start a new chat or switch between previous conversations.

## Deployment

This project is designed for seamless deployment to Cloudflare's global network.

1.  **Login to Wrangler:**
    If you haven't already, authenticate Wrangler with your Cloudflare account:
    ```bash
    bunx wrangler login
    ```

2.  **Deploy the application:**
    Run the deploy script, which will build the application and deploy it using Wrangler.
    ```bash
    bun run deploy
    ```

    This command handles building the Vite frontend, bundling the worker code, and publishing them to your Cloudflare account.

Alternatively, you can deploy directly from your GitHub repository with a single click.

[cloudflarebutton]

## Important Note on AI Capabilities

For security reasons, this public repository and its live demo environment do not handle API keys directly. While the full AI capabilities are implemented in the code, they will not function in a cloned repository or the demo without proper configuration.

To enable the AI features, you must:
1.  Fork or clone this repository to your own GitHub account.
2.  Create a `.dev.vars` file locally (as described in the installation section) with your own Cloudflare AI Gateway credentials.
3.  When deploying to Cloudflare, set the `CF_AI_BASE_URL` and `CF_AI_API_KEY` as secrets in your Worker's settings dashboard.

This ensures that your API keys remain secure and are never exposed publicly.