const mongoose = require('mongoose');

const mongoDBUrl = 'mongodb://localhost:27017/graduation';
mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', async () => {
  console.log('Connected to the database');

  try {
    const collection = db.collection('studentsInfo');
    const students = await collection.find({}).toArray();
    const rollNumbers = new Set();
    const duplicates = [];

    for (const student of students) {
      if (rollNumbers.has(student['Roll No'])) {
        duplicates.push(student['_id']); // Collect duplicate IDs
      } else {
        rollNumbers.add(student['Roll No']);
      }
    }

    if (duplicates.length > 0) {
      await collection.deleteMany({ _id: { $in: duplicates } });
      console.log(`${duplicates.length} duplicate records removed.`);
    } else {
      console.log('No duplicates found.');
    }
  } catch (error) {
    console.error('Error removing duplicates:', error);
  } finally {
    db.close();
  }
});
