var express = require('express');
var router = express.Router();
var pool=require('./pool.js')
var upload=require('./multer.js')


router.post('/submit_restaurant',upload.any(), function(req, res, next) 
{
   console.log("Body",req.body)
   console.log("Files",req.files)
  try{
  pool.query("insert into restaurant(restaurantname, ownername, phonenumber, mobilenumber, emailid, url, fssai, gstno, gsttype, filefssai, fileshopact, filelogo, address, stateid, cityid, latlong, password, status, createdat, updatedat) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[
  req.body.restaurantname, 
  req.body.ownername, 
  req.body.phonenumber,
  req.body.mobilenumber, 
  req.body.emailid, 
  req.body.url, 
  req.body.fssai, 
  req.body.gstno, 
  req.body.gsttype, 
  req.files[0].filename, 
  req.files[1].filename,
  req.files[2].filename,
  req.body.address, 
  req.body.stateid, 
  req.body.cityid, 
  req.body.latlong, 
  req.body.password, 
  req.body.status, 
  req.body.createdat, 
  req.body.updatedat

  ],function(error,result){
    console.log("Error",error)
    if(error)
    {
     res.status(500).json({message:'Database error, pls contact database administrator...',status:false})
    }
    else
    {
    res.status(200).json({message:'Restaurant Successfully Registerd...',status:true})
    }
  })
  }
  catch(e)
  {
    console.log("e",e)
    res.status(500).json({message:'Critical error, pls contact database administrator...',status:false})
  }

});

router.get('/display_all',function(req,res){
  try{
    pool.query("select R.* ,(select S.statename from states S where S.stateid=R.stateid) as statename ,(select C.cityname from cities C where C.cityid=R.cityid) as cityname from restaurant R",function(error,result){
      if(error)
        {
         res.status(500).json({message:'Database error, pls contact database administrator...',status:false})
        }
        else
        {
        res.status(200).json({message:'Success', data:result, status:true})
        }
    })
  }
  catch(e)
  {
    res.status(500).json({message:'Critical error, pls contact database administrator...',status:false})
  }

})


router.post('/edit_restaurant_data', function(req, res, next) 
{
   console.log("Body",req.body)
   
  try{
  pool.query("update restaurant set restaurantname=?, ownername=?, phonenumber=?, mobilenumber=?, emailid=?, url=?, fssai=?, gstno=?, gsttype=?, address=?, stateid=?, cityid=?, latlong=?, createdat=?, updatedat=? where restaurantid=? ",[
  req.body.restaurantname, 
  req.body.ownername, 
  req.body.phonenumber,
  req.body.mobilenumber, 
  req.body.emailid, 
  req.body.url, 
  req.body.fssai, 
  req.body.gstno, 
  req.body.gsttype, 
  req.body.address, 
  req.body.stateid, 
  req.body.cityid, 
  req.body.latlong, 
  req.body.createdat, 
  req.body.updatedat,
  req.body.restaurantid

  ],function(error,result){
    console.log("Error",error)
    if(error)
    {
     res.status(500).json({message:'Database error, pls contact database administrator...',status:false})
    }
    else
    {
    res.status(200).json({message:'Edit Restaurant Data Successfully ...',status:true})
    }
  })
  }
  catch(e)
  {
    console.log("e",e)
    res.status(500).json({message:'Critical error, pls contact database administrator...',status:false})
  }

});

router.post('/delete_restaurant_data', function(req,res,next){
  console.log('Body',req.body)
  try{
    pool.query('delete from restaurant where restaurantid=?',[req.body.restaurantid],function(error,result){
    if(error)
    {
      console.log('error',error)
      res.status(500).json({message:'Database error pls contact database adminstrator',status:false})
    }
    else
    {
      res.status(200).json({message:'Data Deleted successfully',status:true})
    }
    })
  }
  catch(e)
  {
    res.status(500).json({message:'Critical error pls contact with data adminstrator',status:false})
  }
})


router.post('/edit_restaurant_images',upload.single('picture'), function(req,res,next){
  console.log('Body',req.body)
  fieldname=req.body.whichimage
  try{
    var q=""
    if(fieldname=='Fssai')
    {q="update restaurant set filefssai=? where restaurantid=?"}
    else if(fieldname=='ShopAct')
      {q="update restaurant set fileShopAct=? where restaurantid=?"}
    else if(fieldname=='Logo')
      {q="update restaurant set fileLogo=? where restaurantid=?"}
    
    pool.query(q,[req.file.filename,req.body.restaurantid],function(error,result){
    if(error)
    {
      console.log('error',error)
      res.status(500).json({message:'Database error pls contact database adminstrator',status:false})
    }
    else
    {
      res.status(200).json({message:`Restaurant ${fieldname} image edited successfully...`,status:true})
    }
    })
  }
  catch(e)
  {
    res.status(500).json({message:'Critical error pls contact with data adminstrator',status:false})
  }
})

router.post('/chk_restaurant_login', function(req, res, next) {
   // console.log("Body:", req.body);

    try {
        pool.query(
            "SELECT * FROM restaurant WHERE (emailid=? OR mobilenumber=?) AND password=?", 
            [req.body.id, req.body.id, req.body.password], 
            function(error, result) {
        
                if (error) {
                    console.error("Database Error:", error);
                    res.status(500).json({ data: [], message: 'Database error, please contact administrator.', status: false });
                }
else
{
                if (result.length === 1) {
                    var{password,...data}=result[0]
                   
                     res.status(200).json({ data, message: 'Login successful.', status: true });
                } else {
                     res.status(401).json({ data: [], message: 'Invalid Admin ID or Password.', status: false });
                }
            }
            }
        );       
    } catch (e) {
        console.error("Critical Error:", e);
         res.status(500).json({ data: [], message: 'Critical error, please contact administrator.', status: false });
    }
});

module.exports = router;
