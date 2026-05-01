---
name: managing-serverless
description: "Deploy serverless: Lambda, Vercel, Cloudflare Workers. Triggers: serverless, lambda."

argument-hint: "[platform/resource] [options]"
---

# Managing Serverless Architecture

This skill defines the standards for designing, deploying, and optimizing serverless workloads. It covers Function-as-a-Service (FaaS) and Edge computing.

## Instructions
1.  **Platform Selection:**
    *   **AWS Lambda / Google Cloud Functions:** Best for heavy backend processing, CRON jobs, and integrations with other cloud services (e.g., S3/DynamoDB triggers).
    *   **Vercel / Netlify:** Best for frontend-heavy frameworks (Next.js, Nuxt) and Server-Side Rendering (SSR).
    *   **Cloudflare Workers / Deno Deploy:** Best for ultra-low latency edge computing, lightweight proxies, and globally distributed state.
2.  **Cold Start Optimization:**
    *   **Bundle Size:** Minimize dependencies. Tree-shake code and exclude heavy libraries like AWS SDKs if they are pre-installed in the runtime.
    *   **Initialization:** Initialize heavy clients (DB connections, SDKs) outside the handler function so they can be reused across warm invocations.
    *   **Language Choice:** Prefer Node.js, Go, or Rust over Java or .NET for latency-sensitive APIs to minimize JVM/CLR spin-up time.
3.  **Event-Driven Design:**
    *   **Decoupling:** Use queues (SQS), pub/sub (SNS/EventBridge), or streams (Kinesis) to decouple components. Functions should ideally do one thing and emit an event.
    *   **Idempotency:** Ensure functions are idempotent, meaning they can safely process the same event multiple times without side effects, as cloud providers guarantee "at-least-once" delivery.
4.  **State Management:**
    *   **Stateless Functions:** Never rely on local file systems (`/tmp` is ephemeral and shared across some warm starts, but not guaranteed).
    *   **External State:** Use DynamoDB, Redis (Upstash/ElastiCache), or serverless SQL (PlanetScale/Neon) for state.

## Examples

### Global Initialization (AWS Lambda Node.js)
```javascript
// DO: Initialize connection outside the handler
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "us-east-1" });

exports.handler = async (event) => {
    // REUSE: client is reused across warm starts
    // process event...
};
```

### Idempotency Example (DynamoDB Conditional Put)
```javascript
// Ensure we don't process the same transaction twice
await docClient.put({
    TableName: 'Transactions',
    Item: { transactionId: event.id, status: 'PROCESSED' },
    ConditionExpression: 'attribute_not_exists(transactionId)'
});
```

## Validation Checklist
- [ ] Is global state initialized outside the function handler?
- [ ] Is the function idempotent?
- [ ] Are dependencies minimized to reduce cold starts?
- [ ] Is the database connection pooling handled correctly for serverless?

## References

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
