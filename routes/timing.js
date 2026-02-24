var express =require('express');
var router=express.Router();
var pool=require('./pool');
var multer=require('./multer.js');
const upload=require('./multer.js');

router.post('/submit_timing',function(req,res,next){
    try{ 
        pool.query("insert into timing(restaurantid,status,timingopen,timingclose) values(?,?,?,?)",[
            req.body.restaurantid,
            req.body.status,
            req.body.timingopen,
            req.body.timingclose
        ],function(error, result){
            if (error) {
                console.log(req.body)
                res.status(500).json({ data: [], message: 'Database error, pls contact database administration.....', status: false })
              }
              else {
                res.status(200).json({ message: 'Category Data Successfully Submit....', status: true })
              }
        })
    }
    catch(e){
    res.status(500).json({ data: [], message: 'Critical error, pls contact database administration.....', status: false })
    }
});

module.exports= router;