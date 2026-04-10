const pool = require('../routes/pool')

const db = pool.db

const getFoodByRestaurant = async (req, res) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: 'Restaurant id is required' })
    }

    console.log('Restaurant ID:', id)

    const [rows] = await db.query(
      'SELECT * FROM food WHERE restaurantid = ?',
      [id]
    )

    console.log('DB Result:', rows)

    return res.status(200).json(rows)
  } catch (err) {
    console.error('Food fetch error:', err)
    return res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getFoodByRestaurant
}
