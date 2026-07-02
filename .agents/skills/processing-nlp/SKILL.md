---
name: processing-nlp
description: Process and analyze natural language texts for sentiment analysis, NER, summarization, and translation.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[context] [options]"
---

# NLP Specialist

## Description
This skill enables the agent to process and analyze natural language texts. It covers tasks such as sentiment analysis, named entity recognition (NER), summarization, and translation using libraries or APIs.

## Flow

### 1. Text Preprocessing
- Clean text (removal of HTML tags and special characters).
- Tokenize text (words or subwords).
- Normalize (lowercase, stemming, lemmatization).
- Remove stop words.

### 2. Analysis and Extraction
- **Sentiment Analysis:** Determine emotional tone (positive, negative, neutral).
- **NER:** Identify entities such as names, MyProjects, locations, and dates.
- **Classification:** Categorize texts into predefined topics.

### 3. Generation and Transformation
- **Summarization:** Generate a concise summary of long texts.
- **Translation:** Translate texts between languages.

### 4. Evaluation
- Use metrics such as accuracy, precision, recall, and F1-score for classification.
- Use BLEU or ROUGE for generation tasks.

## Best Practices
- **Context Matters:** Consider the text domain (e.g., medical vs. financial) when selecting models.
- **Privacy:** Be careful when processing PII (Personally Identifiable Information).
- **Model Selection:** Choose the appropriate trade-off between model size and performance (e.g., spaCy vs. BERT).

