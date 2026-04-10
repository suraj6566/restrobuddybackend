var express = require('express');
var router = express.Router();
var pool=require('./pool.js')
var multer=require('./multer.js');
const upload = require('./multer.js');

router.post('/submit_subcategory',upload.single("icon"),function(req,res,next){
    // console.log("try:",req.body)
    //     console.log("hhh:",req.file)
    try
    { 
        pool.query("insert into subcategory(restaurantid,categoryid,subcategoryname,icon,createdat,updatedat) values(?,?,?,?,?,?)",[
            req.body.restaurantid,
            req.body.categoryid,
            req.body.subcategoryname,
            req.file.filename,
            req.body.createdat,
            req.body.updatedat
        ],function(error,result){
            if(error)
                { 
                  res.status(500).json({data:[],message:'Database error, pls contact database administration.....',status:false})
                }
                else
                {
                  res.status(200).json({message:'Subcategory Data Successfully Submit....',status:true})
                }
              })
            }
            catch(e)
            { 
              res.status(500).json({data:[],message:'Critical error, pls contact database administration.....',status:false})
            }
})
router.get('/fetch_all_category',function(req,res,next){
  try
  {
    pool.query("SELECT * FROM category;",function(error,result){
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

router.get('/fetch_all_subcategory_data',function(req,res,next){
  try
  {
    pool.query("select S.*,(select C.categoryname from category C where C.categoryid=S.categoryid)as categoryname,(select R.restaurantname from restaurant R where R.restaurantid=S.restaurantid)as restaurantname from subcategory S",function(error,result){
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

router.post('/edit_subcategory_data',function(req,res,next){
  console.log(req.body)
  try
  {
    pool.query("update subcategory set restaurantid=?, categoryid=?,subcategoryname=?, updatedat=? where subcategoryid=?",[
      req.body.restaurantid,
      req.body.categoryid,
      req.body.subcategoryname,
      req.body.updatedat,
      req.body.subcategoryid
    ],function(error,result){
      if(error)
        { console.log("error",req.body)
          res.status(500).json({data:[],message:'Database error, pls contact database administration.....',status:false})
        }
        else
        {console.log("else",req.body)
          res.status(200).json({message:'Subcategory Data Edited Successfully....',status:true})
        }
    })
  }
  catch(e)
  {
    res.status(500).json({data:[],message:'Critical error, pls contact database administration.....',status:false})
  }
})
router.post('/delete_data',function(req,res,next){
  console.log(req.body)
  try
  {
    pool.query("delete from subcategory where subcategoryid=?",[req.body.subcategoryid],function(error,result){
      if(error)
        { 
          res.status(500).json({data:[],message:'Database error, pls contact database administration.....',status:false})
        }
        else
        {
          res.status(200).json({message:'Subcategory Data Deleted Successfully....',status:true})
        }
    })
  }
  catch(e)
  {
    res.status(500).json({data:[],message:'Critical error, pls contact database administration.....',status:false})
  }
})

router.post('/edit_subcategory_image',upload.single('icon'),function(req,res,next){
    try
    {   //console.log(req.body)
        //console.log(req.file)
        pool.query("update subcategory set icon=? where subcategoryid=?",[
          req.file.filename,
          req.body.subcategoryid
        ],function(error,result){
          if(error)
            { 
              res.status(500).json({data:[],message:'Database error, pls contact database administration.....',status:false})
            }
            else
            {
              res.status(200).json({message:'Subcategory Picture Updated Successfully....',status:true})
            }
        })
    }
    catch(e)
    {
      res.status(500).json({data:[],message:'Critical error, pls contact database administration.....',status:false})
    }
})
module.exports= router;