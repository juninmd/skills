# Computer Vision Engineer Forms

## 1. Vision Task Request (vision_request.md)

### Goal
Request a computer vision task on an image or video.

### Fields
- **Task:** [Object Detection/OCR/Classification]
- **Input Source:** [Path/URL]
- **Model:** [YOLOv8/Tesseract/ResNet]
- **Confidence Threshold:** [0.0 - 1.0]

## 2. Vision Analysis Report (vision_report.md)

### Goal
Document the results of a computer vision analysis.

### Fields
- **Task:** [Task Name]
- **Input:** [Input Source]
- **Detections:**
    - **Object 1:** [Label] (Confidence: [Score]) - [Bounding Box]
    - **Object 2:** [Label] (Confidence: [Score]) - [Bounding Box]
- **Extracted Text:** [If OCR task]
- **Processed Image:** [Path to output image]
