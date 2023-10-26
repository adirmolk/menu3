const express = require("express");
const { auth } = require("../middlewares/auth");
const { validatetoys, toysModel } = require("../models/toysModel");
const router = express.Router();

// get toy router
router.get("/", async(req,res) => {
  try{
    const limit = req.query.limit || 5;
    const page = req.query.page - 1 || 0;
    const sort = req.query.sort || "_id";
    const reverse = req.query.reverse == "yes" ? 1 : -1;

    let filterFind = {};
    if(req.query.s){  
      const searchExp = new RegExp(req.query.s,"i");
      filterFind = {$or:[{name:searchExp},{category:searchExp},{info:searchExp}]}
    }
    const data = await toysModel
    .find(filterFind)
    .limit(limit)
    .skip(page * limit)
    .sort({[sort]:reverse})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
});

//get specific toy
router.get("/single/:id", async(req,res) => {
  try{
    const id = req.params.id;
    const data = await toysModel.findOne({_id:id}, req.body);
    res.status(200).json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
});
 
// filtering toys with price route
router.get("/prices", async(req,res) =>{
  const limit = req.query.limit || 5;
  const page = req.query.page - 1 || 0;
  const min  = req.query.min || 0;
  const max = req.query.max || Infinity;

  const data = await toysModel
  .find({price:{$gte:min, $lte:max}})
  .limit(limit)
  .skip(page * limit)
  res.json(data);
});

// get the count of the pages and items
router.get("/count", async(req,res) => {
  try{
    const limit = req.query.limit || 5;
    const count = await toysModel.countDocuments({})
    res.json({count,pages:Math.ceil(count/limit)})
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

//upload toy router
router.post("/",auth, async(req,res) => {
  const validBody = validatetoys(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const toys = new toysModel(req.body);
    toys.user_id = req.tokenData._id;
    await toys.save();

    res.status(201).json(toys);

  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
});

//update toy router
router.put("/:id", auth, async (req, res) => {
  const validBody = validatetoys(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const id = req.params.id;
    const data = await toysModel.updateOne({_id:id,user_id:req.tokenData._id}, req.body);
    res.status(200).json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
});

//delete toy router
router.delete("/:id", auth, async (req, res) => {
  const validBody = validatetoys(req.body)
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    const id = req.params.id;
    const data = await toysModel.deleteOne({_id:id,user_id:req.tokenData._id}, req.body);
    res.status(201).json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;