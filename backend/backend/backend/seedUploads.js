const fs = require('fs');
const path = require('path');
const { initializeDatabase } = require('./config/database');

const UPLOADS_DIR = path.join(__dirname, 'uploads');

const seedImages = async () => {
  try {
    const db = await initializeDatabase(); // your SQLite instance

    const files = fs.readdirSync(UPLOADS_DIR).filter(f =>
      /\.(jpg|jpeg|png|gif)$/i.test(f)
    );

    console.log(`Found ${files.length} files in uploads folder.`);

    let addedCount = 0;

    for (const file of files) {
      const name = file.replace(/\.[^/.]+$/, ''); // remove extension
      const imagePath = `uploads/${file}`;

      // Check if this image already exists
      const row = await new Promise((resolve, reject) => {
        db.get(
          'SELECT * FROM listings WHERE image = ?',
          [imagePath],
          (err, row) => (err ? reject(err) : resolve(row))
        );
      });

      if (!row) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO listings (name, image) VALUES (?, ?)',
            [name, imagePath],
            err => (err ? reject(err) : resolve())
          );
        });
        console.log(`Added: ${name} → ${imagePath}`);
        addedCount++;
      }
    }

    console.log(`Seeding complete. ${addedCount} new listings added.`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding uploads:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  seedImages();
}

module.exports = seedImages;
