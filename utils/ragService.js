// // // utils/ragService.js
const { OpenAI } = require("openai");
const { Pinecone } = require("@pinecone-database/pinecone");

class RAGService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    this.indexName = 'mycash-chat';
    this.embeddingModel = 'text-embedding-ada-002';
    this.llmModel = 'gpt-4o-mini';
    this.index = null;
    this.isInitialized = false;
  }

  async initializeIndex() {
    try {
      if (!process.env.PINECONE_API_KEY) {
        throw new Error('PINECONE_API_KEY is not set');
      }
  
      // console.log(' Checking Pinecone indexes...');
      const indexList = await this.pinecone.listIndexes();
      
      // Add this debug log
      // console.log("Raw Pinecone index list:", JSON.stringify(indexList, null, 2));
  
      let indexNames = [];
      if (Array.isArray(indexList)) {
        indexNames = indexList.map(i => i.name);
      } else if (indexList && Array.isArray(indexList.indexes)) {
        indexNames = indexList.indexes.map(i => i.name);
      } else {
        indexNames = Object.values(indexList || {}).flat().map(i => i.name);
      }
  
      if (!indexNames.includes(this.indexName)) {
        // console.log(`Creating new index: ${this.indexName}`);
        await this.pinecone.createIndex({
          name: this.indexName,
          dimension: 1536,
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1'
            }
          }
        });
  
        // console.log(' Waiting for index to be ready...');
        let attempts = 0;
        while (attempts < 30) {
          try {
            const indexStats = await this.pinecone.Index(this.indexName).describeIndexStats();
            if (indexStats) {
              // console.log(' Index is ready');
              break;
            }
          } catch (error) {
            console.warn("Index not ready yet:", error.message);
          }
          await new Promise(resolve => setTimeout(resolve, 10000));
          attempts++;
        }
  
        if (attempts >= 30) {
          throw new Error('Index creation timeout - please check Pinecone dashboard');
        }
      }
  
      this.index = this.pinecone.Index(this.indexName);
      this.isInitialized = true;
      // console.log('RAG Service initialized successfully');
  
    } catch (error) {
      console.error('Failed to initialize RAG Service:', error.message);
      this.isInitialized = false;
      throw error;
    }
  }
  async generateEmbedding(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new Error('Invalid text input for embedding generation');
    }
    const maxLength = 8000;
    const processedText = text.length > maxLength ? text.substring(0, maxLength) : text;
    const response = await this.openai.embeddings.create({
      model: this.embeddingModel,
      input: processedText
    });
    return response.data[0].embedding;
  }

  async storeMessageInVectorDB(messageObj) {
    if (!this.isInitialized || !this.index) return;
    if (!messageObj || !messageObj.message || !messageObj.id) return;

    const embedding = await this.generateEmbedding(messageObj.message);
    const vectorData = {
      id: messageObj.id,
      values: embedding,
      metadata: {
        text: messageObj.message,
        sender: messageObj.sender,
        user_id: messageObj.user_id,
        timestamp: messageObj.timestamp.toISOString(),
        message_type: messageObj.sender === 'system' ? 'expense_data' : 'conversation',
        created_at: new Date().toISOString()
      }
    };

    await this.index.upsert([vectorData]);
  }

  async getRelevantContext(question, user_id) {
    if (!this.isInitialized || !this.index) return '';
    if (!question || typeof question !== 'string') return '';

    const questionEmbedding = await this.generateEmbedding(question);
    const queryResponse = await this.index.query({
      vector: questionEmbedding,
      topK: 5,
      includeMetadata: true,
      filter: { user_id }
    });

    if (!queryResponse.matches || queryResponse.matches.length === 0) return '';

    const relevantMessages = queryResponse.matches
      .filter(match => match.score > 0.7)
      .map(match => {
        const metadata = match.metadata;
        const relevanceScore = Math.round(match.score * 100);
        return `[${metadata.sender}] (${relevanceScore}% relevant): ${metadata.text}`;
      })
      .slice(0, 3);

    return relevantMessages.join('\n');
  }

  isReady() {
    return this.isInitialized && this.index !== null;
  }
}

module.exports = { RAGService };