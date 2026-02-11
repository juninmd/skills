# Computer Vision Engineer Reference

## Tools

### 1. `OpenCV` (cv2)
**Description:** Open Source Computer Vision Library.
**Common Commands:**
- `cv2.imread('image.jpg')`: Load an image.
- `cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)`: Convert to grayscale.
- `cv2.rectangle(img, pt1, pt2, color)`: Draw a rectangle.

### 2. `YOLO` (Ultralytics)
**Description:** Real-time object detection model.
**Common Commands:**
- `model = YOLO("yolov8n.pt")`: Load model.
- `results = model("image.jpg")`: Run inference.

### 3. `Tesseract OCR` (pytesseract)
**Description:** Optical Character Recognition engine.
**Common Commands:**
- `pytesseract.image_to_string(image)`: Extract text from image.
