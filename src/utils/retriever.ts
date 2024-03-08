import { SupabaseVectorStore } from '@langchain/community/vectorstores/supabase'
import { OpenAIEmbeddings } from '@langchain/openai'
import supabaseClient from '../configs/supabase'
import {config} from 'dotenv';

config();

const openAIApiKey = process.env.OPENAI_API_KEY;

const embeddings = new OpenAIEmbeddings({ openAIApiKey })


const vectorStore = new SupabaseVectorStore(embeddings, {
    client : supabaseClient,
    tableName: 'bot_faq_data',
    queryName: 'match_faqs'
})

const retriever = vectorStore.asRetriever()

export { retriever }