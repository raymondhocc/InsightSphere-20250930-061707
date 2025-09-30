import type { WeatherResult, ErrorResult } from './types';
import { mcpManager } from './mcp-client';
import { mockKpiData, mockUserAcquisitionData, mockSalesFunnelData, mockCustomerSegmentationData } from './mock-crm-data';
export type ToolResult = WeatherResult | { content: string } | ErrorResult | Record<string, any>;
interface SerpApiResponse {
  knowledge_graph?: { title?: string; description?: string; source?: { link?: string } };
  answer_box?: { answer?: string; snippet?: string; title?: string; link?: string };
  organic_results?: Array<{ title?: string; link?: string; snippet?: string }>;
  local_results?: Array<{ title?: string; address?: string; phone?: string; rating?: number }>;
  error?: string;
}
const customTools = [
  {
    type: 'function' as const,
    function: {
      name: 'get_kpi_data',
      description: 'Retrieves key performance indicators (KPIs) for the CRM dashboard.',
      parameters: {
        type: 'object',
        properties: {
          kpis: {
            type: 'array',
            items: { type: 'string' },
            description: 'An array of KPI names to retrieve. Available KPIs: totalUsers, monthlyRevenue, conversionRate, churnRate.',
          },
        },
        required: ['kpis'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_user_acquisition_data',
      description: 'Retrieves user acquisition data for a specified time period, usually for a chart.',
      parameters: {
        type: 'object',
        properties: {
          period: {
            type: 'string',
            description: "The time period for the data, e.g., 'last_month'.",
          },
        },
        required: ['period'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_sales_funnel_data',
      description: 'Retrieves sales funnel data to visualize the customer journey from prospect to closed deal.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_customer_segmentation_data',
      description: 'Retrieves customer segmentation data, typically by plan or tier.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_weather',
      description: 'Get current weather information for a location',
      parameters: {
        type: 'object',
        properties: { location: { type: 'string', description: 'The city or location name' } },
        required: ['location']
      }
    }
  },
  {
    type: 'function' as const,
    function: {
      name: 'web_search',
      description: 'Search the web using Google or fetch content from a specific URL',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query for Google search' },
          url: { type: 'string', description: 'Specific URL to fetch content from (alternative to search)' },
          num_results: { type: 'number', description: 'Number of search results to return (default: 5, max: 10)', default: 5 }
        },
        required: []
      }
    }
  }
];
export async function getToolDefinitions() {
  const mcpTools = await mcpManager.getToolDefinitions();
  return [...customTools, ...mcpTools];
}
const createSearchUrl = (query: string, apiKey: string, numResults: number) => {
  const url = new URL('https://serpapi.com/search');
  url.searchParams.set('engine', 'google');
  url.searchParams.set('q', query);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('num', Math.min(numResults, 10).toString());
  return url.toString();
};
const formatSearchResults = (data: SerpApiResponse, query: string, numResults: number): string => {
  const results: string[] = [];
  if (data.knowledge_graph?.title && data.knowledge_graph.description) {
    results.push(`**${data.knowledge_graph.title}**\n${data.knowledge_graph.description}`);
    if (data.knowledge_graph.source?.link) results.push(`Source: ${data.knowledge_graph.source.link}`);
  }
  if (data.answer_box) {
    const { answer, snippet, title, link } = data.answer_box;
    if (answer) results.push(`**Answer**: ${answer}`);
    else if (snippet) results.push(`**${title || 'Answer'}**: ${snippet}`);
    if (link) results.push(`Source: ${link}`);
  }
  if (data.organic_results?.length) {
    results.push('\n**Search Results:**');
    data.organic_results.slice(0, numResults).forEach((result, index) => {
      if (result.title && result.link) {
        const text = [`${index + 1}. **${result.title}**`];
        if (result.snippet) text.push(`   ${result.snippet}`);
        text.push(`   Link: ${result.link}`);
        results.push(text.join('\n'));
      }
    });
  }
  return results.length ? `🔍 Search results for "${query}":\n\n${results.join('\n\n')}`
    : `No results found for "${query}". Try: https://www.google.com/search?q=${encodeURIComponent(query)}`;
};
async function performWebSearch(query: string, numResults = 5): Promise<string> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return `🔍 Web search requires SerpAPI key. Get one at https://serpapi.com/\nFallback: https://www.google.com/search?q=${encodeURIComponent(query)}`;
  }
  try {
    const response = await fetch(createSearchUrl(query, apiKey, numResults), {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WebBot/1.0)', 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) throw new Error(`SerpAPI returned ${response.status}`);
    const data: SerpApiResponse = await response.json();
    if (data.error) throw new Error(`SerpAPI error: ${data.error}`);
    return formatSearchResults(data, query, numResults);
  } catch (error) {
    const isTimeout = error instanceof Error && error.message.includes('timeout');
    const fallback = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    return `Search failed: ${isTimeout ? 'timeout' : 'API error'}. Try: ${fallback}`;
  }
}
const extractTextFromHtml = (html: string): string => html
  .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
async function fetchWebContent(url: string): Promise<string> {
  try {
    new URL(url); // Validate
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WebBot/1.0)' },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/')) throw new Error('Unsupported content type');
    const html = await response.text();
    const text = extractTextFromHtml(html);
    return text.length ? `Content from ${url}:\n\n${text.slice(0, 4000)}${text.length > 4000 ? '...' : ''}`
      : `No readable content found at ${url}`;
  } catch (error) {
    throw new Error(`Failed to fetch: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
export async function executeTool(name: string, args: Record<string, unknown>): Promise<ToolResult> {
  try {
    switch (name) {
      case 'get_kpi_data': {
        const requestedKpis = args.kpis as string[];
        const kpiResults = requestedKpis.map(kpi => {
          switch (kpi) {
            case 'totalUsers':
              return { title: 'Total Users', icon: 'users', ...mockKpiData.totalUsers };
            case 'monthlyRevenue':
              return { title: 'Monthly Revenue', icon: 'revenue', ...mockKpiData.monthlyRevenue };
            case 'conversionRate':
              return { title: 'Conversion Rate', icon: 'conversion', ...mockKpiData.conversionRate };
            case 'churnRate':
              return { title: 'Churn Rate', icon: 'churn', ...mockKpiData.churnRate };
            default:
              return null;
          }
        }).filter(Boolean);
        return { kpis: kpiResults };
      }
      case 'get_user_acquisition_data': {
        return {
          chartData: [{
            type: 'user_acquisition',
            data: mockUserAcquisitionData,
          }],
        };
      }
      case 'get_sales_funnel_data': {
        return { funnelData: mockSalesFunnelData.stages };
      }
      case 'get_customer_segmentation_data': {
        return { segmentationData: mockCustomerSegmentationData };
      }
      case 'get_weather':
        return {
          location: args.location as string,
          temperature: Math.floor(Math.random() * 40) - 10,
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 100)
        };
      case 'web_search': {
        const { query, url, num_results = 5 } = args;
        if (typeof url === 'string') {
          const content = await fetchWebContent(url);
          return { content };
        }
        if (typeof query === 'string') {
          const content = await performWebSearch(query, num_results as number);
          return { content };
        }
        return { error: 'Either query or url parameter is required' };
      }
      default: {
        const content = await mcpManager.executeTool(name, args);
        return { content };
      }
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
}