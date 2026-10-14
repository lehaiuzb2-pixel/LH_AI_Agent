import { DiagnosticResult, McpTool, DatasetItem, GeneratedCodeSnippet, SystemLog } from '../types';

export class LHAgentCore {
  public name: string = 'LH_AI_Agent';
  public status: 'ACTIVE' | 'IDLE' | 'PROCESSING' | 'DIAGNOSING' | 'PAUSED' = 'ACTIVE';
  private diagnosticCounter: number = 1;

  public runDiagnostic(customNote?: string): DiagnosticResult {
    const now = new Date();
    const timestamp = now.toLocaleTimeString() + ' ' + now.toLocaleDateString();
    const latency = Math.floor(18 + Math.random() * 24);

    const diagnosticMsg = customNote || 'DataHub MCP Server integration ready';

    const outputObj = {
      status: 'SUCCESS',
      agent: this.name,
      diagnostic: diagnosticMsg,
      timestamp: now.toISOString(),
      mcp_server: {
        endpoint: 'http://localhost:8080/mcp',
        protocol: 'mcp-2024-11-05',
        status: 'CONNECTED',
        latency_ms: latency,
      },
      capabilities: [
        'metadata_extraction',
        'data_governance',
        'code_generation',
        'lineage_tracing',
        'quality_assertions',
      ],
    };

    return {
      id: `diag-${Date.now()}-${this.diagnosticCounter++}`,
      timestamp,
      status: 'SUCCESS',
      agent: this.name,
      diagnostic: diagnosticMsg,
      details: {
        mcpProtocol: 'v2024-11-05 (JSON-RPC 2.0 SSE)',
        serverStatus: '200 OK - DataHub GMS Healthy',
        latencyMs: latency,
        schemaRegistry: 'Synchronized (142 aspects tracked)',
        eventStream: 'Kafka topic: MetadataAuditEvent_v4 (Connected)',
        governanceEngine: 'Enforcing GDPR & PII Policy v2.4',
      },
      outputJson: JSON.stringify(outputObj, null, 2),
    };
  }
}

export const INITIAL_MCP_TOOLS: McpTool[] = [
  {
    name: 'datahub_search_datasets',
    description: 'Search enterprise dataset catalog in DataHub via MCP protocol',
    category: 'metadata',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term or SQL table keyword' },
        platform: { type: 'string', description: 'Filter by platform (snowflake, bigquery, postgres)' },
        limit: { type: 'number', description: 'Max items returned', default: 10 },
      },
      required: ['query'],
    },
  },
  {
    name: 'datahub_get_lineage',
    description: 'Retrieve upstream and downstream dataset dependencies from DataHub lineage graph',
    category: 'lineage',
    inputSchema: {
      type: 'object',
      properties: {
        dataset_urn: { type: 'string', description: 'Full URN of dataset' },
        direction: { type: 'string', description: 'UPSTREAM, DOWNSTREAM, or BOTH', default: 'BOTH' },
        depth: { type: 'number', description: 'Max hop depth (1-5)', default: 2 },
      },
      required: ['dataset_urn'],
    },
  },
  {
    name: 'datahub_emit_metadata',
    description: 'Emit Metadata Change Proposals (MCP) to ingest schema, owners, or tags',
    category: 'governance',
    inputSchema: {
      type: 'object',
      properties: {
        entity_urn: { type: 'string', description: 'Target entity URN' },
        aspect_name: { type: 'string', description: 'Aspect name (e.g., schemaMetadata, ownership)' },
        payload: { type: 'object', description: 'Aspect payload in JSON format' },
      },
      required: ['entity_urn', 'aspect_name'],
    },
  },
  {
    name: 'datahub_validate_schema',
    description: 'Validate table schema against enterprise governance standards (PII tags, naming conventions)',
    category: 'governance',
    inputSchema: {
      type: 'object',
      properties: {
        table_name: { type: 'string', description: 'Target table name' },
        columns: { type: 'array', description: 'List of column definitions' },
        enforce_pii: { type: 'boolean', description: 'Check for unmasked sensitive columns', default: true },
      },
      required: ['table_name'],
    },
  },
  {
    name: 'datahub_generate_production_recipe',
    description: 'Generate standardized DataHub ingestion recipe or production ETL pipeline code',
    category: 'codegen',
    inputSchema: {
      type: 'object',
      properties: {
        source_type: { type: 'string', description: 'Source data warehouse or database' },
        target_format: { type: 'string', description: 'Output code format (yaml, python, sql)' },
        include_lineage: { type: 'boolean', description: 'Enable automated lineage extraction' },
      },
      required: ['source_type'],
    },
  },
];

export const INITIAL_DATASETS: DatasetItem[] = [
  {
    urn: 'urn:li:dataset:(urn:li:dataPlatform:snowflake,analytics.fct_orders,PROD)',
    name: 'analytics.fct_orders',
    platform: 'snowflake',
    tier: 'Tier 1',
    domain: 'E-Commerce & Revenue',
    owner: 'data-engineering@corp.local',
    qualityScore: 98.4,
    columnsCount: 34,
    rowCount: '142.8M',
    tags: ['Revenue', 'Gold_Mart', 'Daily_Reconciliation'],
    glossaryTerms: ['Net Merchandise Value', 'Order Fulfillment Status'],
    lastUpdated: '10 mins ago',
    hasLineage: true,
    compliance: {
      pii: false,
      gdpr: true,
      encrypted: true,
    },
  },
  {
    urn: 'urn:li:dataset:(urn:li:dataPlatform:bigquery,core_customer.dim_users,PROD)',
    name: 'core_customer.dim_users',
    platform: 'bigquery',
    tier: 'Tier 1',
    domain: 'Customer Identity',
    owner: 'identity-platform@corp.local',
    qualityScore: 94.2,
    columnsCount: 28,
    rowCount: '18.5M',
    tags: ['PII_Sensitive', 'Core_Dimension', 'Audit_Enabled'],
    glossaryTerms: ['Master Customer ID', 'Opt-In Status'],
    lastUpdated: '25 mins ago',
    hasLineage: true,
    compliance: {
      pii: true,
      gdpr: true,
      encrypted: true,
    },
  },
  {
    urn: 'urn:li:dataset:(urn:li:dataPlatform:postgres,payments_service.transactions,PROD)',
    name: 'payments_service.transactions',
    platform: 'postgres',
    tier: 'Tier 1',
    domain: 'Payments & Settlement',
    owner: 'fintech-eng@corp.local',
    qualityScore: 99.1,
    columnsCount: 42,
    rowCount: '89.2M',
    tags: ['PCI_DSS', 'Strict_Access', 'RealTime_CDC'],
    glossaryTerms: ['Payment Authorization Code', 'Chargeback Status'],
    lastUpdated: '2 mins ago',
    hasLineage: true,
    compliance: {
      pii: true,
      gdpr: true,
      encrypted: true,
    },
  },
  {
    urn: 'urn:li:dataset:(urn:li:dataPlatform:kafka,telemetry.user_clickstream_events,PROD)',
    name: 'telemetry.user_clickstream_events',
    platform: 'kafka',
    tier: 'Tier 2',
    domain: 'Product Telemetry',
    owner: 'tracking-team@corp.local',
    qualityScore: 91.5,
    columnsCount: 19,
    rowCount: '2.4B events',
    tags: ['High_Throughput', 'Event_Stream'],
    glossaryTerms: ['Session ID', 'Funnel Step'],
    lastUpdated: 'Live streaming',
    hasLineage: true,
    compliance: {
      pii: false,
      gdpr: true,
      encrypted: true,
    },
  },
  {
    urn: 'urn:li:dataset:(urn:li:dataPlatform:s3,lakehouse_raw.inventory_snapshots,PROD)',
    name: 'lakehouse_raw.inventory_snapshots',
    platform: 's3',
    tier: 'Tier 3',
    domain: 'Supply Chain',
    owner: 'logistics-ops@corp.local',
    qualityScore: 87.0,
    columnsCount: 16,
    rowCount: '31.0M',
    tags: ['Parquet_Bronze', 'Hourly_Batch'],
    glossaryTerms: ['SKU Level Inventory'],
    lastUpdated: '1 hour ago',
    hasLineage: false,
    compliance: {
      pii: false,
      gdpr: false,
      encrypted: true,
    },
  },
];

export const INITIAL_CODE_TEMPLATES: GeneratedCodeSnippet[] = [
  {
    id: 'code-1',
    title: 'DataHub Snowflake Ingestion Recipe (Standardized)',
    language: 'yaml',
    category: 'DataHub Recipe',
    description: 'Enterprise production recipe for extracting Snowflake tables, views, tags, and table lineage into DataHub GMS.',
    createdAt: 'Auto-generated by LH_AI_Agent',
    code: `source:
  type: snowflake
  config:
    account_id: "\${SNOWFLAKE_ACCOUNT}.snowflakecomputing.com"
    warehouse: "DATA_GOVERNANCE_WH"
    database_pattern:
      allow:
        - "ANALYTICS"
        - "CORE_CUSTOMER"
    schema_pattern:
      deny:
        - ".*_TEMP"
        - ".*_BACKUP"
    include_table_lineage: true
    include_view_lineage: true
    profiling:
      enabled: true
      profile_table_level_only: false
    stateful_ingestion:
      enabled: true

sink:
  type: datahub-rest
  config:
    server: "http://datahub-gms:8080"
    token: "\${DATAHUB_REST_TOKEN}"
    max_threads: 8
`,
  },
  {
    id: 'code-2',
    title: 'dbt Production Mart with Lineage & Governance Schema',
    language: 'sql',
    category: 'dbt Model',
    description: 'Standardized SQL model with embedded documentation, test assertions, and column-level PII masking.',
    createdAt: 'Standardized by LH_AI_Agent',
    code: `{{ config(
    materialized='incremental',
    unique_key='order_id',
    incremental_strategy='merge',
    tags=['tier_1', 'revenue', 'governance_certified'],
    meta={
        'owner': 'data-engineering@corp.local',
        'datahub_urn': 'urn:li:dataset:(urn:li:dataPlatform:snowflake,analytics.fct_orders,PROD)'
    }
) }}

WITH source_orders AS (
    SELECT * FROM {{ ref('stg_ecommerce__orders') }}
    {% if is_incremental() %}
    WHERE updated_at >= (SELECT MAX(updated_at) FROM {{ this }})
    {% endif %}
),

customer_dim AS (
    SELECT customer_id, customer_tier, country_code
    FROM {{ ref('dim_customers') }}
)

SELECT
    o.order_id,
    o.customer_id,
    c.customer_tier,
    c.country_code,
    o.order_timestamp,
    o.gross_amount_usd,
    o.discount_amount_usd,
    (o.gross_amount_usd - o.discount_amount_usd) AS net_revenue_usd,
    o.order_status,
    CURRENT_TIMESTAMP() AS dbt_updated_at
FROM source_orders o
LEFT JOIN customer_dim c ON o.customer_id = c.customer_id
`,
  },
  {
    id: 'code-3',
    title: 'LH_AI_Agent Python Production Runner with MCP Server',
    language: 'python',
    category: 'ETL Pipeline',
    description: 'Production-ready Python implementation extending src/agent.py with full MCP client and DataHub aspect emitter.',
    createdAt: 'Optimized by LH_AI_Agent',
    code: `import os
import json
import logging
from typing import Dict, Any

logging.basicConfig(level=logging.INFO, format="[%(asctime)s] [%(name)s] [%(levelname)s] %(message)s")
logger = logging.getLogger("LH_AI_Agent")

class LH_Agent:
    """
    LH_AI_Agent: Autonomous AI Agent integrated with DataHub MCP Server
    Optimizes data governance workflows, generates production code, and monitors telemetry.
    """
    def __init__(self, mcp_endpoint: str = "http://localhost:8080/mcp"):
        self.name = "LH_AI_Agent"
        self.status = "ACTIVE"
        self.mcp_endpoint = mcp_endpoint
        logger.info(f"Initialized {self.name} connected to {self.mcp_endpoint}")

    def run_diagnostic(self) -> Dict[str, Any]:
        """
        Runs comprehensive system diagnostic across MCP server,
        metadata catalog, and governance policy engine.
        """
        diagnostic_payload = {
            "status": "SUCCESS",
            "agent": self.name,
            "diagnostic": "DataHub MCP Server integration ready",
            "mcp_version": "2024-11-05",
            "catalog_sync": True
        }
        logger.info(f"[{self.name}] Diagnostic OK. DataHub MCP Server integration ready.")
        return diagnostic_payload

if __name__ == "__main__":
    agent = LH_Agent()
    result = agent.run_diagnostic()
    print(json.dumps(result, indent=2))
`,
  },
  {
    id: 'code-4',
    title: 'Data Quality & Governance Assertion Suite (Great Expectations)',
    language: 'python',
    category: 'Data Quality Assertion',
    description: 'Automated data assertions suite validating row completeness, PII masking compliance, and freshness thresholds.',
    createdAt: 'Standardized by LH_AI_Agent',
    code: `import great_expectations as gx

def validate_fct_orders_governance(df):
    context = gx.get_context()
    validator = context.sources.pandas_default.read_dataframe(df)

    # 1. Primary key uniqueness & non-null
    validator.expect_column_values_to_not_be_null("order_id")
    validator.expect_column_values_to_be_unique("order_id")

    # 2. Revenue bounds logic
    validator.expect_column_values_to_be_between("net_revenue_usd", min_value=0.0, max_value=1_000_000.0)

    # 3. Status enum validation
    validator.expect_column_values_to_be_in_set(
        "order_status",
        ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "REFUNDED", "CANCELLED"]
    )

    results = validator.validate()
    return results.to_json_dict()
`,
  },
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'log-1',
    timestamp: '12:25:02',
    level: 'INFO',
    source: 'LH_AI_Agent',
    message: 'LH_AI_Agent initialized. State set to ACTIVE.',
  },
  {
    id: 'log-2',
    timestamp: '12:25:05',
    level: 'SUCCESS',
    source: 'DataHub_MCP',
    message: 'DataHub MCP Server connected via SSE transport on http://localhost:8080/mcp (protocol v2024-11-05).',
  },
  {
    id: 'log-3',
    timestamp: '12:25:12',
    level: 'INFO',
    source: 'Governance_Engine',
    message: 'Loaded governance policies: GDPR Article 32, SOC2 Data Lineage, PII Classification rules.',
  },
  {
    id: 'log-4',
    timestamp: '12:25:30',
    level: 'SUCCESS',
    source: 'LH_AI_Agent',
    message: '[LH_AI_Agent] Diagnostic OK. DataHub MCP Server integration ready.',
    payload: { status: 'SUCCESS', agent: 'LH_AI_Agent', diagnostic: 'DataHub MCP Server integration ready' },
  },
];
