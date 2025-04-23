import os
import boto3
import uuid  # To generate unique IDs
from langchain.document_loaders import TextLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from transformers import pipeline
from dotenv import load_dotenv

load_dotenv()

# Initialize the sentiment analysis pipeline
classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base")

# Initialize DynamoDB connection
dynamodb = boto3.resource("dynamodb", region_name=os.getenv("AWS_REGION"))
table = dynamodb.Table(os.getenv("DYNAMODB_TABLE_NAME"))

# Function to load and process data
def load_and_process_data(data_path):
    loader = DirectoryLoader(data_path, loader_cls=TextLoader)
    data = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200, length_function=len, add_start_index=True)
    return text_splitter.split_documents(data)

# Function to setup embeddings and vector store
def setup_vectorstore(data):
    embeddings = OpenAIEmbeddings()
    return FAISS.from_documents(data, embedding=embeddings)

# Function to initialize the QA chain
def setup_qa_chain(vectorstore):
    llm = ChatOpenAI(temperature=0.7, model_name="gpt-4o-mini")
    return RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(search_kwargs={"k": 5})
    )

# Function to analyze sentiment
def analyze_sentiment(query):
    sentiment_result = list(classifier(query)[0].values())[0]
    return sentiment_result in ["sadness", "fear", "surprise"], sentiment_result

# Function to store data in DynamoDB
def store_query_data(query, sentiment, response):
    try:
        table.put_item(Item={
            "id": str(uuid.uuid4()),  # Generate unique ID
            "query": query,
            "sentiment": sentiment,
            "response": response
        })
        print("Data stored successfully in DynamoDB")
    except Exception as e:
        print(f"Error storing data: {e}")

# Main function to process query
def process_query(query, data_path="src/dataset"):
    # Load and process data
    data = load_and_process_data(data_path)

    # Setup vectorstore and QA chain
    vectorstore = setup_vectorstore(data)
    qa_chain = setup_qa_chain(vectorstore)

    # Run the query through the QA chain
    result = qa_chain.run(query)

    # Analyze sentiment
    is_negative_sentiment, sentiment = analyze_sentiment(query)
    
    # Append motivational message if sentiment is negative
    if is_negative_sentiment:
        result += " Cancer can be a tough journey, but one's courage and determination will always shine brighter than any challenge faced. The road may be hard, but no one walks it alone. There are people who care, and there is always hope for brighter days ahead."
    
    # Store in DynamoDB
    store_query_data(query, sentiment, result)

    return result

# Example usage
if __name__ == "__main__":
    query = "I just got diagnosed with cancer, and I feel overwhelmed. What are the first steps I should take?"
    print(process_query(query))
