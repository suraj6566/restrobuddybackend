var express = require('express');
var router = express.Router();
var pool = require('./pool.js'); // ye db.js hai (promise pool)

// ✅ 1. fetch city id
router.post('/user_fetch_cityid', async (req, res) => {
  try {
    const { cityname } = req.body;

    if (!cityname) {
      return res.status(400).json({
        message: "cityname required",
        status: false
      });
    }

    const [result] = await pool.query(
      "SELECT * FROM cities WHERE cityname=?",
      [cityname]
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "City not found",
        status: false
      });
    }

    res.status(200).json({
      message: "Success",
      data: result[0],
      status: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      status: false
    });
  }
});


// ✅ 2. fetch restaurant by city
router.post('/user_fetch_restaurant_by_city', async (req, res) => {
  try {
    const cityid = Number(req.body.cityid);

    if (!cityid || isNaN(cityid)) {
      return res.status(400).json({
        message: "Invalid cityid",
        status: false
      });
    }

    const [result] = await pool.query(
      `SELECT R.*, S.statename, C.cityname
       FROM restaurant R
       LEFT JOIN states S ON S.stateid = R.stateid
       LEFT JOIN cities C ON C.cityid = R.cityid
       WHERE R.cityid = ?`,
      [cityid]
    );

    res.status(200).json({
      message: "Success",
      data: result,
      status: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
      status: false
    });
  }
});


// ✅ 3. ambience by city
router.post('/user_fetch_ambience_by_city', async (req, res) => {
  try {
    const { cityid } = req.body;

    const [result] = await pool.query(
      `SELECT R.*, RP.*, T.*,
      (SELECT S.statename FROM states S WHERE S.stateid=R.stateid) as statename,
      (SELECT C.cityname FROM cities C WHERE C.cityid=R.cityid) as cityname
      FROM restaurant R
      JOIN restaurantpictures RP ON R.restaurantid=RP.restaurantid
      JOIN timing T ON R.restaurantid=T.restaurantid
      WHERE RP.picturetype='Ambience' AND R.cityid=?`,
      [cityid]
    );

    res.json({ message: "Success", data: result, status: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ✅ 4. category count
router.post('/fetch_category_count', async (req, res) => {
  try {
    const { restaurantid } = req.body;

    const [result] = await pool.query(
      `SELECT category.categoryid, category.categoryname,
       COUNT(*) as count_category
       FROM category, subcategory
       WHERE category.categoryid=subcategory.categoryid
       AND category.restaurantid=?
       GROUP BY category.categoryid, category.categoryname`,
      [restaurantid]
    );

    res.json({ message: "Success", data: result, status: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ✅ 5. fetch food
router.post('/fetch_all_food_by_category', async (req, res) => {
  try {
    const { categoryid, restaurantid } = req.body;

    const [result] = await pool.query(
      `SELECT F.*, R.*
       FROM food F, restaurant R
       WHERE F.restaurantid=R.restaurantid
       AND F.categoryid=?
       AND F.restaurantid=?`,
      [categoryid, restaurantid]
    );

    res.json({ message: "Success", data: result, status: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ✅ 6. user signup
router.post('/submit_user', async (req, res) => {
  try {
    const { mobileno, email_id, username } = req.body;

    await pool.query(
      "INSERT INTO users VALUES (?,?,?)",
      [mobileno, email_id, username]
    );

    res.json({ message: "Success", data: req.body, status: true });

  } catch (error) {
    if (error.errno === 1062) {
      return res.status(400).json({
        message: "User already exists",
        status: false
      });
    }

    res.status(500).json({ message: "Server Error", status: false });
  }
});


// ✅ 7. search user
router.post('/search_user', async (req, res) => {
  try {
    const { email_id, mobileno } = req.body;

    const [result] = await pool.query(
      "SELECT * FROM users WHERE email_id=? OR mobileno=?",
      [email_id, mobileno]
    );

    res.json({
      message: "Success",
      data: result,
      status: result.length > 0
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error", status: false });
  }
});

module.exports = router;