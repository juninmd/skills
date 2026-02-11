# NLP Specialist Forms

## 1. NLP Analysis Request (nlp_request.md)

### Goal
Request an NLP task on a specific text or dataset.

### Fields
- **Task:** [Sentiment/NER/Summarization/Translation]
- **Input Text/File:** [Text or Path]
- **Target Language:** [If translation]
- **Output Format:** [JSON/CSV/Text]

## 2. NLP Analysis Report (nlp_report.md)

### Goal
Document the results of an NLP analysis.

### Fields
- **Task:** [Task Name]
- **Input Summary:** [Brief description of input]
- **Results:**
    - **Sentiment:** [Positive/Negative] (Score: 0.95)
    - **Entities:**
        - [Entity 1] ([Label])
        - [Entity 2] ([Label])
    - **Summary:** [Generated Summary]
