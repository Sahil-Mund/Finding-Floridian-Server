import "dotenv/config";

// import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings, OpenAI } from "@langchain/openai";
import { loadQAStuffChain } from "langchain/chains";
import { Document } from "@langchain/core/documents";

import { ArrayTypeNode } from "typescript";
import Post from "../database/models/post.model";
import QNA from "../database/models/qna.model";
import { QNANew } from "../database/models";

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_ANON_KEY
// );

// Function to generate embedding for a asked query
export const generateEmbedding = async (prompt: string) => {
  const openAIEmbeddings = new OpenAIEmbeddings();
  const embeddings = await openAIEmbeddings.embedQuery(prompt);
  console.log(embeddings);
  
  return embeddings;
};

// Function to find similar documents in Supabase using cosine similarity
export const findSimilarDocuments = async (embedding: any) => {
  // const { data, error } = await supabase.from("posts").select("*");

  try {
    const data = await QNANew.findAll();

    const SIMILARITY_THRESHOLD = 0.5;
    if (!data) {
      console.error("No Data found");
      return [];
    }

    // Filter and return documents with high cosine similarity

    return data?.filter((doc: any) => {
      const docEmbedding = Array.isArray(doc.embedding)
        ? doc.embedding
        : JSON.parse(doc.embedding);
      const similarity = cosineSimilarity(embedding, docEmbedding);
      return similarity > SIMILARITY_THRESHOLD;
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// Function to calculate the cosine similarity between two vectors
function cosineSimilarity(
  vecA: any | ArrayTypeNode,
  vecB: any | ArrayTypeNode
) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB)) {
    console.error("One of the vectors is not an array");
    return 0;
  }
  /*
Cosine Similarity:- 
  1 means the vectors are identical, 0 means they are orthogonal (no similarity), and -1 means they are diametrically opposed.
*/
  const dotProduct = vecA.reduce(
    (acc, current, idx) => acc + current * vecB[idx],
    0
  );
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));

  return dotProduct / (magnitudeA * magnitudeB);
}

export const generateOpenAIResponse = async (
  similarDocuments: any,
  query: string
) => {
  if (similarDocuments.length <= 0) {
    return {
      status_message: "No similar documents found",
    };
  }
  try {
    const concatenatedPageContent = similarDocuments
      .map((data: any) => data.body)
      .join(" ");

    const llm = new OpenAI({});
    const chain = loadQAStuffChain(llm);

    try {
      const inputDocument = [
        new Document({ pageContent: concatenatedPageContent }),
      ];

      // console.log(inputDocument);

      const result = await chain.call({
        input_documents: inputDocument,
        question: query,
      });
      console.log(`Answer: ${result.text}`);
      return {
        status_message: "Bot Response",
        content: result.text,
      };
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
