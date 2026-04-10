var express = require('express')
var router = express.Router()
var pool = require('./pool')
var multer = require('./multer')
const upload = require('./multer')

// fetch all categories
router.get('/fetch_all_category', function (req, res, next) {
  try {
    pool.query("select categoryid,categoryname from category", function (error, result) {
      if (error) {
        res.status(500).json({ data: [], message: 'Database error, pls contact database administration.....', status: false })
      }
      else {
        res.status(200).json({ data: result, message: 'Successful....', status: true })
      }
    })
  }
  catch (e) {
    res.status(500).json({ data: [], message: 'Critical error, pls contact database administration.....', status: false })
  }
})

// fetch subcategories by category
router.post('/fetch_all_subcategory', function (req, res, next) {
  try {
    pool.query("select subcategoryid,subcategoryname from subcategory where categoryid=?", [req.body.categoryid], function (error, result) {
      if (error) {
        res.status(500).json({ data: [], message: 'Database error, pls contact database administration.....', status: false })
      }
      else {
        res.status(200).json({ data: result, message: 'Successful....', status: true })
      }
    })
  }
  catch (e) {
    res.status(500).json({ data: [], message: 'Critical error, pls contact database administration.....', status: false })
  }
})
router.post('/submit_food_data', upload.single("icon"), function (req, res, next) {
  try {
    const icon = req.file ? req.file.filename : null;

    pool.query(
      `INSERT INTO food
      (restaurantid, categoryid, subcategoryid, foodname, price, offerprice, status, foodtype, ingredients, icon, createdat, updatedat, quantitytype)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,   // ✅ 13 placeholders
      [
        req.body.restaurantid,
        req.body.categoryid,
        req.body.subcategoryid,
        req.body.foodname,
        req.body.price,
        req.body.offerprice,
        req.body.status,
        req.body.foodtype,
        req.body.ingredients,
        icon,
        req.body.createdat,
        req.body.updatedat,
        req.body.quantitytype
      ],
      function (error, result) {
        if (error) {
          console.log("Insert Error:", error);
          return res.status(500).json({
            data: [],
            message: 'Database error, pls contact database administration.....',
            status: false
          });
        }
        res.status(200).json({
          message: 'Food Data Successfully Submitted....',
          status: true
        });
      }
    );
  } catch (e) {
    console.log("Critical Error:", e);
    res.status(500).json({
      data: [],
      message: 'Critical error, pls contact database administration.....',
      status: false
    });
  }
});


router.get('/fetch_all_food_data',function(req,res,next){
    try
    {
        pool.query("select F.*,(select R.restaurantname from restaurant R where R.restaurantid=F.restaurantid)as restaurantname,(select C.categoryname from category C where C.categoryid=F.categoryid)as categoryname,(select S.subcategoryname from subcategory S where S.subcategoryid=F.subcategoryid)as subcategoryname from food F",function(error,result){
            if(error)
                { 
                  res.status(500).json({data:[],message:'Database error, pls contact database administration.....',status:false})
                }
                else
                {
                  res.status(200).json({data:result,message:'successfull',status:true})
                }
        })
    }
    catch(e)
        { 
          res.status(500).json({data:[],message:'Critical error, pls contact database administration.....',status:false})
        }
})

router.post('/edit_food_data',function(req,res,next){
    try
    {  console.log(req.body)
        pool.query("update food set restaurantid=?,categoryid=?,subcategoryid=?,foodname=?,price=?,offerprice=?,ingredients=?,status=?,statustype=?,updatedat=? where foodid=?",[

            req.body.restaurantid,
            req.body.categoryid,
            req.body.subcategoryid,
            req.body.foodname,
            req.body.price,
            req.body.offerprice,
            req.body.ingredients,
            req.body.status,
            req.body.statustype,
            req.body.updatedat,
            req.body.foodid
        ],function(error,result){
            if(error)
                { 
                  res.status(500).json({data:[],message:'Database error, pls contact database administration.....',status:false})
                }
                else
                {
                  res.status(200).json({message:'Food Data Successfully Edit....',status:true})
                }
              })
    }
    catch(e)
            { 
              res.status(500).json({data:[],message:'Critical error, pls contact database administration.....',status:false})
            }
})

router.post('/delete_food_data',function(req,res,next){
    try
    {
        pool.query("delete from food where foodid=?",[req.body.foodid],function(error,result){
            if(error)
                { 
                  res.status(500).json({data:[],message:'Database error, pls contact database administration.....',status:false})
                }
                else
                {
                  res.status(200).json({message:'Food Data Successfully Deleted....',status:true})
                }
        })
    }
    catch(e)
    {
        res.status(500).json({data:[],message:'Critical error, pls contact database administration.....',status:false})
    }
})

router.post('/edit_food_image',upload.single('icon'),function(req,res,next){
    try
    {   //console.log(req.body)
        //console.log(req.file)
        pool.query("update food set icon=? where foodid=?",[
          req.file.filename,
          req.body.foodid
        ],function(error,result){
          if(error)
            { 
              res.status(500).json({data:[],message:'Database error, pls contact database administration.....',status:false})
            }
            else
            {
              res.status(200).json({message:'Food Picture Updated Successfully....',status:true})
            }
        })
    }
    catch(e)
    {
      res.status(500).json({data:[],message:'Critical error, pls contact database administration.....',status:false})
    }
})
module.exports=router;  