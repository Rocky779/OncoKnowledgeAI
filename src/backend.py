import os
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

# Set your OpenAI API key as an environment variable

# Function to load and process data
def load_and_process_data(data_path):
    loader = DirectoryLoader(data_path, loader_cls=TextLoader)
    data = loader.load()
    
    # Split the data into chunks
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
        retriever=vectorstore.as_retriever(search_kwargs={"k": 5})  # Adjust k for the number of top results
    )

# Function to analyze sentiment
def analyze_sentiment(query):
    sentiment_result = list(classifier(query)[0].values())[0]
    return sentiment_result in ["sadness", "fear", "surprise"]

# Main function to process query
def process_query(query, data_path='src/dataset'):
    # Load and process data
    data = load_and_process_data(data_path)

    # Setup vectorstore and QA chain
    vectorstore = setup_vectorstore(data)
    qa_chain = setup_qa_chain(vectorstore)

    # Run the query through the QA chain
    result = qa_chain.run(query)
    #result = result.replace('*', '')

    # Analyze sentiment and append a motivational message if necessary
    if analyze_sentiment(query):
        result += " Cancer can be a tough journey, but one's courage and determination will always shine brighter than any challenge faced. The road may be hard, but no one walks it alone. There are people who care, and there is always hope for brighter days ahead."
        #result = result.replace('*', '')
    return result

# Example of how this function could be used by an API
if __name__ == "__main__":
    query = "I just got diagnosed with cancer, and I feel overwhelmed. What are the first steps I should take?"
    print(process_query(query))
