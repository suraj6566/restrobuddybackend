var express = require('express');
var router = express.Router();
var pool=require('./pool.js')
var upload=require('./multer.js')

router.post('/user_fetch_cityid',function(req,res){
    try{
     pool.query("select  * from cities where cityname=?",[req.body.cityname],function(error,result){
      if(error)
        { console.log("error",error)
         res.status(500).json({message:'Database error, Pls contact database administrator...',status:false})
        }
        else
        {
          
         res.status(200).json({message:'Success',data:result[0],status:true})
          }
  
     })
  
    }catch(e)
    {
  
      res.status(500).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
    }
  
  })

router.post('/user_fetch_restaurant_by_city', async (req, res) => {
  try {
    console.log("📥 BODY:", req.body);

    // ✅ Step 1: get & validate cityid
    const cityid = Number(req.body.cityid);

    if (!cityid || isNaN(cityid)) {
      return res.status(400).json({
        message: "Invalid cityid",
        status: false
      });
    }

    // ✅ Step 2: query (promise version - better)
    const [result] = await pool.promise().query(
      `SELECT R.*, 
              S.statename, 
              C.cityname
       FROM restaurant R
       LEFT JOIN states S ON S.stateid = R.stateid
       LEFT JOIN cities C ON C.cityid = R.cityid
       WHERE R.cityid = ?`,
      [cityid]
    );

    // ✅ Step 3: response
    return res.status(200).json({
      message: "Success",
      data: result,
      status: true
    });

  } catch (error) {
    console.error("❌ ERROR:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
      status: false
    });
  }
});

router.post('/user_fetch_ambience_by_city',function(req,res){
    try{
        pool.query("select R.*,RP.*,t.*,(select S.statename from states S where  S.stateid=R.stateid) as statename ,(select C.cityname from cities C where C.cityid=R.cityid) as cityname from restaurant R, restaurantpictures rp,timing t where R.restaurantid=rp.restaurantid and r.restaurantid=t.restaurantid and rp.picturetype='Ambience' and R.cityid=?",[req.body.cityid], function(error,result){
      if(error)
        { console.log("error",error)
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


router.post('/user_fetch_ambience_by_restaurantid',function(req,res){
    try{
        pool.query("select R.*,RP.*,t.*,(select group_concat(c.categoryname) from category c where c.restaurantid=22) as listcategory,(select S.statename from states S where  S.stateid=R.stateid) as statename ,(select C.cityname from cities C where C.cityid=R.cityid) as cityname from restaurant R, restaurantpictures rp,timing t where R.restaurantid=rp.restaurantid and r.restaurantid=t.restaurantid and rp.picturetype='Ambience' and rp.restaurantid=?",[req.body.restaurantid], function(error,result){
      if(error)
        { console.log("error",error)
         res.status(500).json({message:'Database error, pls contact database administrator...',status:false})
        }
        else
        {
        res.status(200).json({message:'Success', data:result[0], status:true})
        }
    })
  }
  catch(e)
  {
    res.status(500).json({message:'Critical error, pls contact database administrator...',status:false})
  }

})

router.post('/fetch_category_count', function(req, res, next){
  console.log("body",req.body)
  try
  {
    pool.query("select category.categoryid,category.categoryname,count(*) as count_category from category,subcategory where category.categoryid=subcategory.categoryid and category.restaurantid=? group by category.categoryid,category.categoryname ",[req.body.restaurantid], function(error, result) {
      if (error) { console.log(error)
        res.status(500).json({message:'Database error, pls contact database administrator...', data:[], status:false});
      } else {
        res.status(200).json({message:'success', data:result, status:true});
      }
    });
  }
  catch(e)
  {
     res.status(500).json({message:'Critical error, pls contact database administrator...',status:false})
  }
})


router.post('/fetch_all_food_by_category', function(req, res, next) {
  console.log("Body:",req.body)
  try
  {
    pool.query("select F.*,R.* from food F ,restaurant R where F.restaurantid=R.restaurantid and F.categoryid=? and F.restaurantid=?",[req.body.categoryid,req.body.restaurantid],function(error,result){
     if(error)
     {  console.log(error)
        res.status(500).json({data:[],message:'Database error, Pls contact database administrator...',status:false})
     }
     else
     {
          res.status(200).json({data:result,message:'Success',status:true})
     }


    })

  }
  catch(e)
  {

    res.status(500).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
  }

});

router.post('/usersignin', function(req, res, next){
  console.log("body",req.body)
  try
  {
    pool.query("insert into signin (email,fullname,createdate) value(?,?,?) ",[req.body.email,req.body.fullname], function(error, result) {
      if (error) { console.log(error)
        res.status(500).json({message:'Database error, pls contact database administrator...', data:[], status:false});
      } else {
        res.status(200).json({message:'success', data:result, status:true});
      }
    });
  }
  catch(e)
  {
     res.status(500).json({message:'Critical error, pls contact database administrator...',status:false})
  }
})

router.post('/submit_user', function(req, res, next) {
 
  try
  {
    pool.query("insert into users values(?,?,?)",[req.body.mobileno,req.body.email_id,req.body.username],function(error,result){
     if(error)
     { 
        if (error.errno === 1062) 

        res.status(401).json({data:[],message:'Mobile No or EmailId Already Exist...',status:false})
        else
           res.status(500).json({data:[],message:'Database error, Pls contact database administrator...',status:false})
     
      
    }
     else
     {
          res.status(200).json({data:req.body,message:'Success',status:true})
     }


    })

  }
  catch(e)
  {

    res.status(200).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
  }

});

router.post('/search_user', function(req, res, next) {
 
  try
  {
    pool.query("select * from users where email_id=? or mobileno=?",[req.body.email_id,req.body.mobileno],function(error,result){
     if(error)
     {  
        res.status(200).json({data:[],message:'Database error, Pls contact database administrator...',status:false})
      
     }
     else
     {   if(result.length==1)
          res.status(200).json({data:result,message:'Success',status:true})
          else
          res.status(200).json({data:result,message:'Success',status:false})
     }


    })

  }
  catch(e)
  {
    console.log(e)
    res.status(200).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
  }

});


router.post('/search_user_mobileno', function(req, res, next) {
 
  try
  {
    pool.query("select * from users where  mobileno=?",[req.body.mobileno],function(error,result){
     if(error)
     {  
        res.status(200).json({data:[],message:'Database error, Pls contact database administrator...',status:false})
      
     }
     else
     {   if(result.length==1)
          res.status(200).json({data:result,message:'Success',status:true})
          else
          res.status(200).json({data:result,message:'Success',status:false})
     }


    })

  }
  catch(e)
  {
    console.log(e)
    res.status(200).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
  }

});


router.post('/submit_user_address', function(req, res, next) {
 
  try
  {
    pool.query("insert into useraddress (mobileno, emailid, fullname, state, city, addressone, addresstwo, landmark, pincode) values(?,?,?,?,?,?,?,?,?)",[req.body.mobileno, req.body.emailid, req.body.fullname, req.body.state, req.body.city, req.body.addressone, req.body.addresstwo, req.body.landmark, req.body.pincode],function(error,result){
     if(error)
     {  
        res.status(200).json({data:[],message:'Database error, Pls contact database administrator...',status:false})
      
     }
     else
     {   
          res.status(200).json({data:result,message:'Success',status:true})
         
     }


    })

  }
  catch(e)
  {
    console.log(e)
    res.status(200).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
  }

});


router.post('/user_address', function(req, res, next) {
  console.log(req.body)
  try
  {
    pool.query("select * from useraddress where  mobileno=?",[req.body.mobileno],function(error,result){
     if(error)
     {  
        res.status(200).json({data:[],message:'Database error, Pls contact database administrator...',status:false})
      
     }
     else
     {   
          res.status(200).json({data:result,message:'Success',status:true})
            }


    })

  }
  catch(e)
  {
    console.log(e)
    res.status(200).json({data:[],message:'Critical error, Pls contact database administrator...',status:false})
  }

});


module.exports = router;