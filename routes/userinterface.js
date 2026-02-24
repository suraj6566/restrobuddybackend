const express = require('express');
const router = express.Router();
const pool = require('./pool.js');

// ================== CITY ==================
router.post('/user_fetch_cityid', async (req, res) => {
  try {
    const { cityname } = req.body;

    if (!cityname) {
      return res.status(400).json({ message: "City name required", status: false });
    }

    const [result] = await pool.query(
      "SELECT * FROM cities WHERE cityname = ?",
      [cityname]
    );

    res.json({ message: "Success", data: result[0] || {}, status: true });

  } catch (err) {
    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ================== RESTAURANT ==================
router.post('/user_fetch_restaurant_by_city', async (req, res) => {
  try {
    const cityid = Number(req.body.cityid);

    if (!cityid || isNaN(cityid)) {
      return res.status(400).json({ message: "Invalid cityid", status: false });
    }

    const [result] = await pool.query(
      `SELECT R.*, S.statename, C.cityname
       FROM restaurant R
       LEFT JOIN states S ON S.stateid = R.stateid
       LEFT JOIN cities C ON C.cityid = R.cityid
       WHERE R.cityid = ?`,
      [cityid]
    );

    res.json({ message: "Success", data: result, status: true });

  } catch (err) {
    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ================== AMBIENCE ==================
router.post('/user_fetch_ambience_by_city', async (req, res) => {
  try {
    const cityid = Number(req.body.cityid);

    const [result] = await pool.query(
      `SELECT R.*, RP.*, t.*
       FROM restaurant R
       JOIN restaurantpictures RP ON R.restaurantid = RP.restaurantid
       JOIN timing t ON R.restaurantid = t.restaurantid
       WHERE RP.picturetype='Ambience' AND R.cityid=?`,
      [cityid]
    );

    res.json({ message: "Success", data: result, status: true });

  } catch (err) {
    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ================== RESTAURANT DETAILS ==================
router.post('/user_fetch_ambience_by_restaurantid', async (req, res) => {
  try {
    const restaurantid = Number(req.body.restaurantid);

    const [result] = await pool.query(
      `SELECT R.*, RP.*, t.*
       FROM restaurant R
       JOIN restaurantpictures RP ON R.restaurantid = RP.restaurantid
       JOIN timing t ON R.restaurantid = t.restaurantid
       WHERE RP.picturetype='Ambience' AND RP.restaurantid=?`,
      [restaurantid]
    );

    res.json({ message: "Success", data: result[0] || {}, status: true });

  } catch (err) {
    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ================== CATEGORY COUNT ==================
router.post('/fetch_category_count', async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT category.categoryid, category.categoryname, COUNT(*) as count
       FROM category
       JOIN subcategory ON category.categoryid=subcategory.categoryid
       WHERE category.restaurantid=?
       GROUP BY category.categoryid`,
      [req.body.restaurantid]
    );

    res.json({ message: "Success", data: result, status: true });

  } catch (err) {
    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ================== FOOD ==================
router.post('/fetch_all_food_by_category', async (req, res) => {
  try {
    const { categoryid, restaurantid } = req.body;

    const [result] = await pool.query(
      `SELECT * FROM food 
       WHERE categoryid=? AND restaurantid=?`,
      [categoryid, restaurantid]
    );

    res.json({ message: "Success", data: result, status: true });

  } catch (err) {
    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ================== USER SIGNIN ==================
router.post('/usersignin', async (req, res) => {
  try {
    const { email, fullname } = req.body;

    const [result] = await pool.query(
      "INSERT INTO signin (email, fullname, createdate) VALUES (?,?,?)",
      [email, fullname, new Date()]
    );

    res.json({ message: "Success", data: result, status: true });

  } catch (err) {
    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ================== SUBMIT USER ==================
router.post('/submit_user', async (req, res) => {
  try {
    const { mobileno, email_id, username } = req.body;

    const [result] = await pool.query(
      "INSERT INTO users VALUES (?,?,?)",
      [mobileno, email_id, username]
    );

    res.json({ message: "Success", data: req.body, status: true });

  } catch (err) {
    if (err.errno === 1062) {
      return res.status(400).json({
        message: "Already exists",
        status: false
      });
    }

    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ================== SEARCH USER ==================
router.post('/search_user', async (req, res) => {
  try {
    const { email_id, mobileno } = req.body;

    const [result] = await pool.query(
      "SELECT * FROM users WHERE email_id=? OR mobileno=?",
      [email_id, mobileno]
    );

    res.json({ message: "Success", data: result, status: true });

  } catch (err) {
    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ================== SUBMIT ADDRESS (IMPORTANT 🔥) ==================
router.post('/submit_user_address', async (req, res) => {
  try {
    const {
      mobileno,
      emailid,
      fullname,
      state,
      city,
      addressone,
      addresstwo,
      landmark,
      pincode
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO useraddress 
      (mobileno, emailid, fullname, state, city, addressone, addresstwo, landmark, pincode)
      VALUES (?,?,?,?,?,?,?,?,?)`,
      [mobileno, emailid, fullname, state, city, addressone, addresstwo, landmark, pincode]
    );

    res.json({ message: "Success", data: result, status: true });

  } catch (err) {
    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ================== GET ADDRESS ==================
router.post('/user_address', async (req, res) => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM useraddress WHERE mobileno=?",
      [req.body.mobileno]
    );

    res.json({ message: "Success", data: result, status: true });

  } catch (err) {
    res.status(500).json({ message: "Server Error", status: false });
  }
});

module.exports = router;