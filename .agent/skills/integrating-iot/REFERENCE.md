# IoT Integration Expert Reference

## Tools

### 1. `Mosquitto` (MQTT Broker/Client)
**Description:** Open source message broker that implements the MQTT protocol.
**Common Commands:**
- `mosquitto_sub -h localhost -t "sensors/#"`: Subscribe to topics.
- `mosquitto_pub -h localhost -t "cmd/light" -m "on"`: Publish message.

### 2. `Paho MQTT` (Python)
**Description:** Client class which provides a client class with support for both MQTT v3.1 and v3.1.1 on Python.
**Common Commands:**
- `client.connect("broker.hivemq.com", 1883, 60)`: Connect.
- `client.publish("topic/test", payload="Hello")`: Publish.
- `client.subscribe("topic/test")`: Subscribe.

### 3. `Node-RED`
**Description:** Programming tool for wiring together hardware devices, APIs and online services.
