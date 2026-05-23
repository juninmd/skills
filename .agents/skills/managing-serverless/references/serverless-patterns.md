# Serverless Architecture Patterns and Optimization

Detailed guidelines for building efficient and resilient serverless workloads.

## 1. Platform Selection Strategy
- **AWS Lambda / GCF:** Backend processing, CRON jobs, and deep cloud integrations.
- **Vercel / Netlify:** SSR and frontend-heavy frameworks (Next.js, Nuxt).
- **Cloudflare Workers:** Low-latency edge computing and global distribution.

## 2. Cold Start Optimization
- **Minimal Bundles:** Tree-shake dependencies and exclude built-in SDKs.
- **Warm Re-use:** Initialize DB clients and SDKs outside the handler function.
- **Runtime Choice:** Prefer Node.js, Go, or Rust for low spin-up latency.

## 3. Event-Driven and Resilient Design
- **Decoupling:** Use SQS, SNS, or EventBridge to trigger single-purpose functions.
- **Idempotency:** Ensure safe re-processing of events using unique IDs and conditional writes.
- **Statelessness:** Use external stores (DynamoDB, Redis, Upstash) for all state.

## 4. Examples

### Warm Start Re-use (Node.js)
```javascript
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "us-east-1" }); // Outside handler

exports.handler = async (event) => {
    // client is reused across warm starts
};
```

### Conditional Write (Idempotency)
```javascript
await docClient.put({
    TableName: 'Transactions',
    Item: { transactionId: event.id, status: 'PROCESSED' },
    ConditionExpression: 'attribute_not_exists(transactionId)'
});
```
