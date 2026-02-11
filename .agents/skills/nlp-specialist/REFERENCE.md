# NLP Specialist Reference

## Tools

### 1. `spaCy` (Python)
**Description:** Industrial-strength Natural Language Processing in Python.
**Common Commands:**
- `nlp = spacy.load("en_core_web_sm")`: Load a model.
- `doc = nlp(text)`: Process text.
- `doc.ents`: Access named entities.

### 2. `NLTK` (Natural Language Toolkit)
**Description:** Leading platform for building Python programs to work with human language data.
**Common Commands:**
- `nltk.word_tokenize(text)`: Tokenize text.
- `nltk.corpus.stopwords.words('english')`: Get stop words.

### 3. `Transformers` (Hugging Face)
**Description:** State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.
**Common Commands:**
- `pipeline("sentiment-analysis")`: Create a pipeline for sentiment analysis.
- `pipeline("summarization")`: Create a pipeline for summarization.
