const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/User')
const Post = require('./models/Post')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const uploadMiddleware =multer({dest: 'uploads/'})

const fs = require('fs');
const app = express();
const salt = bcrypt.genSaltSync(10);


const secret = 'hghjghhjhjg33455SASDDS557667fdf';
app.use(cors({credentials: true, origin:'http://localhost:5173'}));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(__dirname + '/uploads'));
mongoose.connect('mongodb+srv://akshit:akshit@mernblog.kqtzx.mongodb.net')

app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) return res.status(401).json({ error: 'Not authenticated' });
      
      const {title, summary, content} = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }
      
      // Extract just the filename for storage in the database
      const coverPath = 'uploads/' + newPath.split('\\').pop().split('/').pop();
      
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: coverPath,
        author: info.id,
      });
      
      res.json(postDoc);
    });
  } catch (error) {
    console.error('Error in /post route:', error);
    res.status(500).json({ error: 'Server error processing upload' });
  }
});

app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
  try {
    let newPath = null;
    if (req.file) {
      const {originalname,path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length - 1];
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
      // Convert to relative path for storage in DB
      newPath = 'uploads/' + newPath.split('\\').pop().split('/').pop();
    }

    const {token} = req.cookies;
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) return res.status(401).json({ error: 'Not authenticated' });
      
      const {id,title,summary,content} = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Post ID is required' });
      }
      
      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }
      
      const postDoc = await Post.findById(id);
      if (!postDoc) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(403).json({ error: 'You are not the author' });
      }
      
      await postDoc.updateOne({
        title,
        summary,
        content,
        cover: newPath ? newPath : postDoc.cover,
      });

      res.json(postDoc);
    });
  } catch (error) {
    console.error('Error in PUT /post route:', error);
    res.status(500).json({ error: 'Server error processing request' });
  }
});

app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

app.listen(4000);
// mongodb+srv://akshit:akshit@mernblog.kqtzx.mongodb.net/
