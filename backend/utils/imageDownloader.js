const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const imagePages = [
  'https://www.pexels.com/photo/person-taking-picture-of-devices-4549411/',
  'https://www.pexels.com/photo/person-using-a-smartphone-5082579/',
  'https://www.pexels.com/photo/man-taking-picture-on-people-245132/', 

];

const downloadFolder = path.join(__dirname, 'downloaded_images');
const metadata = [];

if (!fs.existsSync(downloadFolder)) {
  fs.mkdirSync(downloadFolder);
}

const fetchImageUrl = async (pageUrl) => {
  try {
    const { data } = await axios.get(pageUrl);
    const $ = cheerio.load(data);
    const imageUrl = $('meta[property="og:image"]').attr('content');
    return imageUrl;
  } catch (err) {
    console.error(`❌ Error fetching image from ${pageUrl}:`, err.message);
    return null;
  }
};

const downloadImage = async (url, index) => {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    const fileName = `${index + 1}.png`;
    const filePath = path.join(downloadFolder, fileName);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    metadata.push({ name: fileName, source: url });

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`✅ Downloaded ${fileName}`);
        resolve();
      });
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`❌ Failed to download image ${index + 1}:`, err.message);
  }
};

const run = async () => {
  for (let i = 0; i < imagePages.length; i++) {
    const imageUrl = await fetchImageUrl(imagePages[i]);
    if (imageUrl) {
      await downloadImage(imageUrl, i);
    }
  }

  fs.writeFileSync('image_metadata.json', JSON.stringify(metadata, null, 2));
  console.log('📁 Metadata saved to image_metadata.json');
};

run();