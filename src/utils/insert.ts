import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { config } from "dotenv";
import supabaseClient from "../configs/supabase";
import { OpenAIEmbeddings } from '@langchain/openai'

import fs from "fs";
config();

export const insertDocs = async () => {
  try {
    const data = await fs.promises.readFile("../server/src/assets/qna.txt", "utf8");
    
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
      separators: ["\n\n", "\n", " ", ""], // default setting , priority order
    });

    const output = await splitter.createDocuments([data]);

    // insert the data into supabase db
    await SupabaseVectorStore.fromDocuments(
      output,
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      {
        client: supabaseClient,
        tableName: "bot_faq_data",
      }
    );

    console.log("data embedded successfully !!");
  
  } catch (err) {
    console.log(err);
  }
};

// insertDocs();
