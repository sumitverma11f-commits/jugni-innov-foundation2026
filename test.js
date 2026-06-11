const { MongoClient } = require('mongodb');

async function run() {
    // Agar aap MongoDB Atlas use kar rahe hain, toh niche 'mongodb://localhost:27017' ko apne Atlas link se replace karein
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('✅ MongoDB Connected Successfully!');
    } catch (e) {
        console.log('❌ Connection Failed: ' + e.message);
    } finally {
        await client.close();
    }
}

run();
