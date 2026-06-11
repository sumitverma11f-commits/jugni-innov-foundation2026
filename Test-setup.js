const { MongoClient } = require('mongodb');
  async function run() {
      const uri = 'mongodb://localhost:27017';
      console.log('Step 1: Initializing client with URI:', uri);
      const client = new MongoClient(uri, {
          serverSelectionTimeoutMS: 5000 
      });

      try {
          console.log('Step 2: Attempting to connect to MongoDB... (Please ensure MongoDB server is running)');
          await client.connect();
          console.log('✅ SUCCESS: MongoDB Connected Successfully!');
      } catch (e) {
          console.log('❌ ERROR: Connection Failed!');
          console.log('Detail:', e.message);
          console.log('\nTIP: Check if MongoDB server is actually running on yourmachine.');
      } finally {
          await client.close();
          console.log('Step 3: Client closed.');
      }
  }

  run().catch(console.error);