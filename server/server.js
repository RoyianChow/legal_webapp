const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const s3 = new AWS.S3({
  accessKeyId: 'AKIAXODODGUVMTJXAISI',
  secretAccessKey: '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',
  region: 'us-east-2',
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email:String
});

const User = mongoose.model('User', userSchema);

mongoose.connect('mongodb+srv://rchowd:admin@cluster0.p2b9bjg.mongodb.net/legalDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

const upload = multer({
  storage: multer.memoryStorage()
});

const videoSchema = new mongoose.Schema({
  uuid: String,
  title: String,
  description: String,
  s3key: String,
  partyNames: [String]
});

const Video = mongoose.model('Video', videoSchema);

app.post('/upload', upload.single('video'), async (req, res) => {
  const file = req.file;
  const uuid = uuidv4();

  const s3Params = {
    Bucket: 'legalproceedingbucket',
    Key: `${uuid}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  s3.upload(s3Params, async function(err, data) {
    if (err) {
      res.status(500).send(err);
    } else {
      const video = new Video({
        uuid: uuid,
        title: req.body.title, 
        description: req.body.description,
        s3key: s3Params.Key,
        partyNames: JSON.parse(req.body.partyNames) 
      });

      try {
        await video.save();
        res.json({ message: 'success!', data });
      } catch(err) {
        res.status(500).send(err);
      }
    }
  });
});

app.get('/library', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    console.error('Error fetching videos:', err);
    res.status(500).send(err);
  }
});

app.post('/login', async (req, res) => {
  const {username, password} = req.body;

  const user = await User.findOne({username});

  if (!user) {
    return res.status(400).json({error: 'User not found'});
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return res.status(400).json({error: 'Invalid password'});
  }

  const secretKey = 'q3t6w9z$C&F)J@NcRfUjWnZr4u7x!A%D';

  const token = jwt.sign({_id: user._id}, secretKey);

  res.header('auth-token', token).json({message: 'Logged in'});
});

app.delete('/video/:s3key', async (req, res) => {
  try {
    const video = await Video.findOne({ s3key: req.params.s3key });
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const deleteParams = {
      Bucket: 'legalproceedingbucket',
      Key: video.s3key
    };

    s3.deleteObject(deleteParams, async (err, data) => {
      if (err) {
        console.log(err, err.stack);
        return res.status(500).json({ error: 'Failed to delete video from S3' });
      } else {
        console.log(data);
        await Video.deleteOne({ s3key: req.params.s3key });
        res.json({ message: 'Video successfully deleted!' });
      }
    });
  } catch (err) {
    console.error('Error deleting video:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/video/:s3key', async (req, res) => {
  try {
    const video = await Video.findOne({ s3key: req.params.s3key });
    if (!video) {
      res.status(404).json({ message: "Video not found" });
    } else {
      res.json(video);
    }
  } catch (err) {
    console.error('Error fetching video:', err);
    res.status(500).json({ message: "Server error" });
  }
});

app.put('/video/:s3key', upload.single('video'), async (req, res) => {
  try {
    const video = await Video.findOne({ s3key: req.params.s3key });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const deleteParams = {
      Bucket: 'legalproceedingbucket',
      Key: video.s3key
    };

    s3.deleteObject(deleteParams, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        return res.status(500).json({ error: 'Failed to delete old video from S3' });
      }
    });

    const file = req.file;
    const s3Params = {
      Bucket: 'legalproceedingbucket',
      Key: `${video.uuid}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    s3.upload(s3Params, async function(err, data) {
      if (err) {
        res.status(500).send(err);
      } else {
        video.title = req.body.title;
        video.description = req.body.description;
        video.s3key = s3Params.Key;
        video.partyNames = JSON.parse(req.body.partyNames);

        await video.save();
        res.json({ message: 'Video successfully updated!' });
      }
    });

  } catch (err) {
    console.error('Error updating video:', err);
    res.status(500).json({ message: "Server error" });
  }
});
