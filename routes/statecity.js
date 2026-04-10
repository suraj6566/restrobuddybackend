var express = require('express')
var router = express.Router();
var pool=require("./pool")

router.get('/fetch_all_state',function(req, res, next){
    try
    {
        pool.query("select * from states",function(error,result){
            if(error)
            {
                res.status(500).json({data:[],message:'Database error, pls contact with adminstartor..',status:false})
            }
            else
            {
                res.status(200).json({data:result,message:'succesfull...',status:true})
            }        
        })       
    }
    catch(e)
            {
                res.status(500).json({data:[],message:'Critical error, pls contact with adminstartor..',status:false})   
            }
})


router.post('/fetch_all_city',function(req, res, next){
    try
    {
        pool.query("select * from cities where stateid=?",[req.body.stateid], function(error,result){
            if(error)
            {
                res.status(500).json({data:[],message:'Database error, pls contact with adminstartor..',status:false})
            }
            else
            {
                res.status(200).json({data:result,message:'succesfull...',status:true})
            }        
        })       
    }
    catch(e)
            {
                res.status(500).json({data:[],message:'Critical error, pls contact with adminstartor..',status:false})   
            }
})

module.exports= router;