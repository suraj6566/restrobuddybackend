var express = require('express');
var router = express.Router();
var pool=require('./pool.js')
var upload=require('./multer.js')


router.post('/submit_picture',upload.any(),function(req, res, next) {
    try{
     var files=req.files.map((item)=>{
        return item.filename
     })
    
  pool.query("insert into restaurantpictures (  restaurantid,picturetype,pictures) value(?,?,?)",
    [   req.body.restaurantid,
        req.body.picturetype,
        files+"",  
        
    
      
  ],function(error,result){
      if(error)
          {console.log("error",error)
             res.status(500).json({data:[],message:'Database error,Pls contact database administrator',status:false })
          }
          else{
             res.status(200).json({data:result,message:'Category Sucessfully Registerd....',status:true}) 
          }
  })
    }
  catch(e)
  { console.log("e:",e)
      res.status(500).json({data:[],message:'Critical error,Pls contact database administrator',status:false })
  }
  });
  
  module.exports = router;