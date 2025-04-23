# 🩺 **OncoKnowledge AI**  
### *Your Personalized Cancer Information Assistant*  

OncoKnowledge AI is an AI-powered assistant that provides reliable, accurate, and empathetic responses to cancer-related queries. By leveraging the power of **Retrieval-Augmented Generation (RAG)**, it ensures every answer is backed by relevant and factual information.  

---

## 🚀 **Project Overview**  

- **Name**: OncoKnowledge AI  
- **Purpose**: Provide personalized, evidence-based responses to cancer-related questions using AI.  
- **Tech Stack**:  
  - Backend: **Python, Flask**  
  - AI Model: **GPT-4o-mini**   
  - Retrieval: **FAISS** for vector search  
  - Embeddings: **OpenAI Embeddings**  
  - Sentiment Analysis: **Hugging Face**  
  - Frontend: **React.js** 
- **Special Feature**: Empathetic motivational messages for emotionally sensitive queries.  

---

## 🧠 **Understanding RAG in OncoKnowledge AI**  

**Retrieval-Augmented Generation (RAG)** enhances the capabilities of large language models (LLMs) by introducing external, domain-specific information into the generation process. OncoKnowledge AI uses this technique to ensure factual accuracy while reducing AI hallucinations.  

### 🔎 **RAG Pipeline in Action**  

1. **User Query Input**  
    - The user submits a question like:  
      > *"What are the early symptoms of pancreatic cancer?"*  

2. **Data Loading and Chunking**  
    - **DirectoryLoader** scans and loads cancer-related documents.  
    - **TextLoader** reads the content of `.txt` files.  
    - **RecursiveCharacterTextSplitter** splits large documents into chunks of **1000 characters** with an overlap of **200 characters** for context retention.  

```python
loader = DirectoryLoader('src/dataset', loader_cls=TextLoader)
data = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
chunks = text_splitter.split_documents(data)
```

---

3. **Embedding Creation and Vector Storage**  
    - Each document chunk is transformed into vector embeddings using **OpenAI Embeddings**.  
    - These vectors are stored in **FAISS** for efficient similarity search.  

```python
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(chunks, embedding=embeddings)
```

---

4. **Document Retrieval**  
    - When the user submits a query, the vectorstore performs a **k-nearest neighbor (k-NN)** search to retrieve the most relevant chunks (**k=5**).  
    - **FAISS** ensures fast and scalable retrieval, even with large datasets.  

---

5. **LLM Response Generation**  
    - Using **LangChain’s RetrievalQA**, the LLM (**GPT-4o-mini**) is provided with both the query and the retrieved documents.  
    - The chain type **"stuff"** concatenates the documents to generate an informed, context-rich answer.  

```python
llm = ChatOpenAI(temperature=0.7, model_name="gpt-4o-mini")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5})
)
response = qa_chain.run(query)
```

---

6. **Sentiment Analysis and Motivational Support**  
    - **Hugging Face**’s sentiment classification model detects emotional tones in the user’s query.  
    - If the query expresses **sadness**, **fear**, or **surprise**, OncoKnowledge AI appends a motivational message.  

```python
classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")
sentiment_result = classifier(query)[0]['label']

if sentiment_result in ["sadness", "fear", "surprise"]:
    response += "\n\n🌿 Remember, you are not alone. Support is available, and strength is built through challenges."
```

---

## 🎯 **Why Use RAG for OncoKnowledge AI?**  

- **Factual Accuracy**: Reduces hallucinations by grounding responses with real-world cancer data.  
- **Personalized Responses**: Delivers tailored information based on the user’s query.  
- **Empathy in AI**: Detects emotional cues and responds with motivational support.  
- **Efficient Search**: FAISS ensures quick and scalable search results.  

---

## 🏗️ **Project Status**  

✅ Data embedding and FAISS vector store setup  
✅ LangChain RAG pipeline with GPT-4o-mini  
✅ Sentiment analysis and motivational support    
✅ Frontend development using React.js  
✅ Storing query, sentiment and responses in DynamoDB

Plan on using AWS Cognito to add user authentication

---

## 💡 **Example Query and Response**  

> **User**: "I just got diagnosed with cancer, and I feel overwhelmed. What are the first steps I should take?"  

**OncoKnowledge AI Response:**  
*"Receiving a cancer diagnosis can be overwhelming, but taking it step by step can help. The first steps usually involve consulting with an oncologist, understanding the diagnosis, and exploring treatment options. Support groups and counseling can also be valuable resources. Remember, you don't have to face this journey alone."*  

*🌿 Cancer can be a tough journey, but one's courage and determination will always shine brighter than any challenge faced. There are people who care, and there is always hope for brighter days ahead.*  

---<img width="1425" alt="Screenshot 2025-04-02 at 1 12 02 PM" src="https://github.com/user-attachments/assets/6a1c320a-3952-4541-b11d-60b1ce24f8be" />

  
<img width="1436" alt="Screenshot 2025-04-02 at 1 14 26 PM" src="https://github.com/user-attachments/assets/60fe7c43-7892-4f0f-ae16-cb940e2996bf" />


