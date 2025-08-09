const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register (admin/customer) - simple for testing
router.post('/register', async (req,res)=>{
  try{
    const { name,email,password,role } = req.body;
    const hashed = await bcrypt.hash(password,10);
    const user = new User({ name,email,password:hashed,role });
    await user.save();
    res.status(201).json({ message: 'Registered' });
  }catch(e){ res.status(400).json({ error: e.message }); }
});

// Login - returns JWT
router.post('/login', async (req,res)=>{
  const { email,password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  res.json({ token, role: user.role });
});

module.exports = router;
