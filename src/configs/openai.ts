import { config } from "dotenv";
import { OpenAIEmbeddings } from '@langchain/openai'

config();
const embeddings = new OpenAIEmbeddings({ openAIApiKey : process.env.OPENAI_API_KEY});

export {embeddings};
