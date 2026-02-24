var express = require('express');
var router = express.Router();
var pool = require('./pool.js')
var multer = require('./multer.js');
const upload = require('./multer.js');

router.post('/submit_category', upload.single("icon"), function (req, res, next) {
  // console.log("try:", req.body)
  // console.log("hhh:", req.file)
  try {
    pool.query("insert into category(restaurantid,categoryname,icon,createdat,updatedat) values(?,?,?,?,?)", [
      req.body.restaurantid,
      req.body.categoryname,
      req.file.filename,
      req.body.createdat,
      req.body.updatedat
    ], function (error, result) {
      if (error) {
        res.status(500).json({ data: [], message: 'Database error, pls contact database administration.....', status: false })
      }
      else {
        res.status(200).json({ message: 'Category Data Successfully Submit....', status: true })
      }
    })
  }
  catch (e) {
    res.status(500).json({ data: [], message: 'Critical error, pls contact database administration.....', status: false })
  }
})
router.get('/display_all_category',function(req,res,next){
  try
  {
    pool.query("select C.*,(select R.restaurantname from restaurant R where R.restaurantid=C.restaurantid)as restaurantname from category C",function(error,result){
      if(error)
        {
            res.status(500).json({data:[],message:'Database error, pls contact database administration.....',status:false})
        }
        else
        {
            res.status(200).json({data:result,message:'Successful....',status:true})
        }
    })
  }
  catch(e)
  {
    res.status(500).json({data:[],message:'Critical error, pls contact database administration.....',status:false})
  }
})
router.post('/edit_category_data',function(req,res,next){
  //console.log(req.body)
  try
  {
    pool.query("update category set restaurantid=?, categoryname=?, updatedat=? where categoryid=?",[
      req.body.restaurantid,
      req.body.categoryname,
      req.body.updatedat,
      req.body.categoryid
    ],function(error,result){
      if(error)
        { //console.log("error",req.body)
          res.status(500).json({data:[],message:'Database error, pls contact database administration.....',status:false})
        }
        else
        { 
          res.status(200).json({message:'Category Data Edited Successfully....',status:true})
        }
    })
  }
  catch(e)
  {
    res.status(500).json({data:[],message:'Critical error, pls contact database administration.....',status:false})
  }
})
router.post('/delete_data',function(req,res,next){
  // console.log(req.body)
  try
  {
    pool.query("delete from category where categoryid=?",[req.body.categoryid],function(error,result){
      if(error)
        { 
          res.status(500).json({data:[],message:'Database error, pls contact database administration.....',status:false})
        }
        else
        {
          res.status(200).json({message:'Category Data Deleted Successfully....',status:true})
        }
    })
  }
  catch(e)
  {
    res.status(500).json({data:[],message:'Critical error, pls contact database administration.....',status:false})
  }
})

router.post('/edit_category_image',upload.single('icon'),function(req,res,next){
    try
    {   //console.log(req.body)
        //console.log(req.file)
        pool.query("update category set icon=? where categoryid=?",[
          req.file.filename,
          req.body.categoryid
        ],function(error,result){
          if(error)
            { 
              res.status(500).json({data:[],message:'Database error, pls contact database administration.....',status:false})
            }
            else
            {
              res.status(200).json({message:'Category Data Edited Successfully....',status:true})
            }
        })
    }
    catch(e)
    {
      res.status(500).json({data:[],message:'Critical error, pls contact database administration.....',status:false})
    }
})
module.exports = router;