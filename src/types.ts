export type AgentStatus = 'ACTIVE' | 'IDLE' | 'PROCESSING' | 'DIAGNOSING' | 'PAUSED';

export interface DiagnosticResult {
  id: string;
  timestamp: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILURE';
  agent: string;
  diagnostic: string;
  details: {
    mcpProtocol: string;
    serverStatus: string;
    latencyMs: number;
    schemaRegistry: string;
    eventStream: string;
    governanceEngine: string;
  };
  outputJson: string;
}

export interface McpServerConfig {
  endpoint: string;
  transport: 'sse' | 'stdio' | 'websocket';
  protocolVersion: string;
  authToken: string;
  connected: boolean;
  serverInfo: {
    name: string;
    version: string;
    capabilities: string[];
  };
}

export interface McpTool {
  name: string;
  description: string;
  category: 'governance' | 'lineage' | 'metadata' | 'quality' | 'codegen';
  inputSchema: {
    type: string;
    properties: Record<string, { type: string; description: string; default?: any }>;
    required?: string[];
  };
}

export interface DatasetItem {
  urn: string;
  name: string;
  platform: 'snowflake' | 'bigquery' | 'postgres' | 'kafka' | 's3';
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  domain: string;
  owner: string;
  qualityScore: number;
  columnsCount: number;
  rowCount: string;
  tags: string[];
  glossaryTerms: string[];
  lastUpdated: string;
  hasLineage: boolean;
  compliance: {
    pii: boolean;
    gdpr: boolean;
    encrypted: boolean;
  };
}

export interface LineageNode {
  id: string;
  name: string;
  platform: string;
  type: 'source' | 'transform' | 'warehouse' | 'bi' | 'ml';
  status: 'healthy' | 'warning' | 'error';
}

export interface LineageEdge {
  from: string;
  to: string;
  recordsTransferred: string;
}

export interface GeneratedCodeSnippet {
  id: string;
  title: string;
  language: 'python' | 'sql' | 'yaml' | 'typescript';
  category: 'DataHub Recipe' | 'dbt Model' | 'ETL Pipeline' | 'FastAPI Connector' | 'Data Quality Assertion';
  description: string;
  code: string;
  createdAt: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  source: 'LH_AI_Agent' | 'DataHub_MCP' | 'Governance_Engine' | 'CodeGen';
  message: string;
  payload?: any;
}

export interface MetricPoint {
  time: string;
  requestsPerSec: number;
  latencyMs: number;
  cpuUsage: number;
  memoryUsageMb: number;
}
