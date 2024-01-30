// 1. Import necessary modules and libraries
// import { OpenAI } from 'langchain/llms';
import { OpenAI } from "@langchain/openai";

import { RetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import * as dotenv from "dotenv";
import path from 'path';

// 2. Load environment variables
dotenv.config();

// 3. Set up input data and paths
const txtFilename = "qna";
const txtFile = 'qna.txt';
const vectorFile = 'qna.index';

// const question = "what is the name and address of sahil?";
// const txtPath = `${path.basename}/assets/documents/${txtFilename}.txt`;
// const VECTOR_STORE_PATH = `../assets/index/${txtFilename}.index`;
const parentDirectory = path.join(__dirname, '..');
const folderPath = path.join(parentDirectory, 'assets', 'documents');

const VECTOR_STORE_PATH =  path.join(folderPath, vectorFile);
// Create the full path to the file
const filePath = path.join(folderPath, txtFile);


const getOpenAIModel = () => {
  // Initialize the OpenAI model
  const model = new OpenAI({
    modelName: "gpt-3.5-turbo-instruct", // Defaults to "gpt-3.5-turbo-instruct" if no model provided.
    temperature: 0.9,
    openAIApiKey: process.env.OPENAI_API_KEY, // In Node.js defaults to process.env.OPENAI_API_KEY
  });

  return model;
};

const createHNSWVectorStore = async () => {
  let vectorStore;
  if (fs.existsSync(VECTOR_STORE_PATH)) {
    // 6.1. If the vector store file exists, load it into memory
    console.log("Vector Exists..");
    vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings());
  } else {
    // 6.2. If the vector store file doesn't exist, create it
    // 6.2.1. Read the input text file
    const text = fs.readFileSync(filePath, "utf8");
    // 6.2.2. Create a RecursiveCharacterTextSplitter with a specified chunk size
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    // 6.2.3. Split the input text into documents
    const docs = await textSplitter.createDocuments([text]);
    // 6.2.4. Create a new vector store from the documents using OpenAIEmbeddings
    vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    // 6.2.5. Save the vector store to a file
    await vectorStore.save(VECTOR_STORE_PATH);
  }
  return vectorStore;
};
// 4. Define the main function runWithEmbeddings
export const getResponseByBot = async (question: string) => {

  const model = getOpenAIModel();
  const vectorStore = await createHNSWVectorStore();
  // 7. Create a RetrievalQAChain by passing the initialized OpenAI model and the vector store retriever
  const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());

  // 8. Call the RetrievalQAChain with the input question, and store the result in the 'res' variable
  const res = await chain.call({
    query: question,
  });

  // 9. Log the result to the console
  return res;
};
