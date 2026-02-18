---
name: iot-integration-expert
description: Interact with IoT devices, manage MQTT brokers, and process sensor data using protocols like MQTT, CoAP, and HTTP
metadata:
    works_on: [copilot, antigravity, gemini_cli]
---

# IoT Integration Expert Skill

## Description
This skill enables the agent to interact with Internet of Things (IoT) devices, manage MQTT brokers, and process sensor data. It covers protocols like MQTT, CoAP, and HTTP for device communication.

## Workflow

### 1. Device Discovery & Connection
- Scan network for devices (e.g., using mDNS).
- Connect to MQTT brokers or IoT platforms (AWS IoT, Google Cloud IoT).
- Authenticate devices using certificates or tokens.

### 2. Data Ingestion
- Subscribe to MQTT topics to receive sensor data.
- Poll HTTP endpoints for device status.
- Parse payloads (JSON, Protobuf).

### 3. Device Control
- Publish messages to command topics (e.g., turn on light, adjust thermostat).
- Update device shadows or digital twins.
- Manage firmware updates (OTA).

### 4. Processing & Automation
- Implement logic based on sensor readings (e.g., IF temp > 30 THEN turn on fan).
- Aggregate data for analytics.
- Trigger alerts for anomalies.

## Best Practices
- **Security:** Use TLS for all communications. Authenticate every device.
- **QoS:** Choose appropriate Quality of Service levels for MQTT messages (0, 1, or 2).
- **Bandwidth:** Optimize payload sizes for constrained networks.
