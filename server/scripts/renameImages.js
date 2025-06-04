const fs = require('fs');
const path = require('path');

// Product data with image mappings
const products = [
  { "title": "Puppy Face Soy wax", "image": "media/EB6D4D62-ED28-4220-B237-8ABE75EBE76F.jpg" },
  { "title": "Tulip Soy Wax Candles", "image": "media/9B2D529D-F10D-4611-AEC0-F0A2AFE7B24A.jpg" },
  { "title": "Peony Candles", "image": "media/A228DF92-390F-48AE-9037-B02256BC9D35.jpg" },
  { "title": "Valentine Day Special Love Heart Candle", "image": "media/EEE6BEAA-F514-4CB2-B0ED-41CB30682BF1.jpg" },
  { "title": "Astronaut Candle", "image": "media/EF56442C-43DF-4E00-86F2-7AE153B7984C.jpg" },
  { "title": "Cloud Design Candle", "image": "media/0BE5A8B6-0BD8-41E8-9F34-38AD4A0B01BA.jpg" },
  { "title": "Strawberry Scented Candles", "image": "media/2CE1E525-7C62-492A-9ED5-117FBFB5F38C.jpg" },
  { "title": "Bubble Bliss", "image": "media/CC7F0916-7F76-443A-A7B5-300EDE9027A1.jpg" },
  { "title": "Teddy candle Blue White", "image": "media/5909888D-1324-4271-A318-552A78D0061B.jpg" },
  { "title": "Peony Candle", "image": "media/C2C552FB-C852-47FA-86C8-C481C40A4A7B.jpg" },
  { "title": "heart stacked candel", "image": "media/64D6BDAA-1768-42BD-B3E9-994764A73E50.jpg" },
  { "title": "Romantic Heart Shaped Scented Candle", "image": "media/29423600-37F7-46B8-AF71-C131D0A9DBFC.jpg" },
  { "title": "Bubble candle", "image": "media/6C331B6F-40D2-4EEB-9789-75136A1B0944.jpg" },
  { "title": "David Bust & Blindfold Lady Soy Wax Candles", "image": "media/EE49E4B5-0A68-42AC-9A48-109690ADA816.jpg" },
  { "title": "couple candel", "image": "media/314DECE8-D027-468D-9CC5-8071CB690A5A.jpg" },
  { "title": "Heart Rose Bouquet Candle", "image": "media/9D2B8BB2-0D31-455A-94D6-ADB61755D411.jpg" },
  { "title": "Heart candel", "image": "media/3DECB134-338C-411A-BF44-9E78AEFB4BF8.jpg" },
  { "title": "Heart Candle", "image": "media/F1040790-ED4B-4B36-84C6-C08C43A11BE3.jpg" },
  { "title": "Rose Couple candel", "image": "media/4451B392-903B-4EB5-ABED-434C4BF52098.jpg" },
  { "title": "Heart candel", "image": "media/D6C1967A-FA6D-4094-AB4A-918E14C1C8DD.jpg" },
  { "title": "Heart Petals candles", "image": "media/0A377411-A804-4A9D-813A-69C7B6DA870B.jpg" },
  { "title": "Red Heart Teddy Candle", "image": "media/6D9717E9-46EF-4ED9-A863-522BEF201491.jpg" },
  { "title": "Teddy Bear Rose Candles", "image": "media/6DFB330B-00B9-41AE-9A42-1040FAD3206C.jpg" },
  { "title": "Flower covered candel", "image": "media/79AC273F-0AA3-4E69-BC81-CBD927BBB00C.jpg" },
  { "title": "Heart Bubble Candle", "image": "media/89EC74C4-D67B-4578-8980-BDD81442BE39.jpg" },
  { "title": "pillar Candles", "image": "media/4DE10BAA-9A04-4FFE-8367-185C0B617A13.jpg" },
  { "title": "Bubble Candle", "image": "media/494AF045-E894-4038-8FD3-91D9ED1C5900.jpg" },
  { "title": "Teddy Bear Rose Candles", "image": "media/B2BEBB7E-E35C-4B6A-A8B8-456F85625364.jpg" },
  { "title": "lady candels", "image": "media/12AFD05F-3B3F-4358-AB71-A045CAA9A864.jpg" },
  { "title": "red flower bouquet", "image": "media/A7FE3521-2563-426A-A8CF-B19315768E27.jpg" },
  { "title": "Seashell candels", "image": "media/997FA62A-3075-45F3-B248-7DF8FAAD1F85.jpg" },
  { "title": "Heart candels", "image": "media/150E355E-ED51-42F0-9AC7-B769149A0869.jpg" }
];

// Function to convert title to filename
const titleToFilename = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace spaces and special chars with hyphens
    .replace(/^-+|-+$/g, '')      // Remove leading/trailing hyphens
    .substring(0, 50);            // Limit length to 50 chars
};

// Function to rename files
const renameFiles = () => {
  const mediaDir = path.join(__dirname, 'media');
  
  // Create a backup directory
  const backupDir = path.join(__dirname, 'media_backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  // First, backup all files
  console.log('Creating backup of all files...');
  fs.readdirSync(mediaDir).forEach(file => {
    const sourcePath = path.join(mediaDir, file);
    const backupPath = path.join(backupDir, file);
    fs.copyFileSync(sourcePath, backupPath);
  });
  console.log('Backup completed successfully!');

  // Now rename the files
  console.log('\nStarting file renaming...');
  products.forEach((product, index) => {
    try {
      const oldImagePath = path.join(mediaDir, path.basename(product.image));
      const newFilename = `${titleToFilename(product.title)}.jpg`;
      const newImagePath = path.join(mediaDir, newFilename);

      // Check if source file exists
      if (!fs.existsSync(oldImagePath)) {
        console.error(`Source file not found: ${oldImagePath}`);
        return;
      }

      // Check if destination file already exists
      if (fs.existsSync(newImagePath)) {
        console.error(`Destination file already exists: ${newImagePath}`);
        return;
      }

      // Rename the file
      fs.renameSync(oldImagePath, newImagePath);
      console.log(`${index + 1}. Renamed: ${path.basename(oldImagePath)} -> ${newFilename}`);
    } catch (error) {
      console.error(`Error renaming file for ${product.title}:`, error.message);
    }
  });
  console.log('\nFile renaming completed!');
};

// Run the script
renameFiles(); 