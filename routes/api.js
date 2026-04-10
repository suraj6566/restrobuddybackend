var express = require('express')
var router = express.Router()

const { getFoodByRestaurant } = require('../controllers/foodController')

router.get('/food/:id', getFoodByRestaurant)

module.exports = router
