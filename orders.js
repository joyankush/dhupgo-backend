const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/create', async (req,res)=>{
  try{
    const ord = new Order(req.body);
    await ord.save();
    res.json(ord);
  }catch(e){ res.status(400).json({ error: e.message }); }
});

router.get('/all', async (req,res)=>{
  const orders = await Order.find().populate('customerId').populate('deliveryPartnerId');
  res.json(orders);
});

module.exports = router;
