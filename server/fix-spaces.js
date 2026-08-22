const mongoose = require('mongoose');
const Emotion = require('./models/Emotion');
require('dotenv').config({ path: '.env.development' });

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    let count = 0;
    const emotions = await Emotion.find({});
    for (let doc of emotions) {
      if (doc.text_input && typeof doc.text_input === 'string') {
        const trimmed = doc.text_input.trim();
        if (trimmed !== doc.text_input) {
          doc.text_input = trimmed;
          await doc.save();
          count++;
        }
      }
    }
    console.log(`Trimmed spaces on ${count} entries.`);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
