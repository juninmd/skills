# IoT Integration Expert Forms

## 1. Device Command Request (iot_command.md)

### Goal
Send a command to an IoT device.

### Fields
- **Device ID:** [ID]
- **Protocol:** [MQTT/HTTP]
- **Topic/Endpoint:** [Topic or URL]
- **Payload:**
    ```json
    {
      "action": "turn_on",
      "params": {}
    }
    ```

## 2. Sensor Data Report (iot_report.md)

### Goal
Document sensor readings from a device.

### Fields
- **Device ID:** [ID]
- **Timestamp:** [Time]
- **Readings:**
    - **Temperature:** [Value]
    - **Humidity:** [Value]
    - **Battery:** [Value]
- **Status:** [Online/Offline]
