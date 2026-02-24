var express = require('express');
var router = express.Router();
var pool = require("./pool");

router.post('/chk_admin_login', function(req, res, next) {
   // console.log("Body:", req.body);

    try {
        pool.query(
            "SELECT * FROM restroadmin WHERE (emailid=? OR mobileno=?) AND password=?", 
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
