const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

const app = express();
const PORT = 8000;


app.use(cors());

cloudinary.config({ 
  cloud_name: 'dpywcragn', 
  api_key: '386789613317834', 
  api_secret: 'c_MM8aIh3lJkNt30EONnRwtvHx8' 
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/upload', upload.fields([{ name: 'image' }, { name: 'audio' }]), async (req, res) => {
  try {
    const imageResult = await cloudinary.uploader.upload(req.files['image'][0].path);
    const audioResult = await cloudinary.uploader.upload(req.files['audio'][0].path, {
      resource_type: 'video' 
    });

    const imageUrl = imageResult.secure_url;
    const audioUrl = audioResult.secure_url;
    


    res.json({ message: 'Files uploaded successfully', imageUrl, audioUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});