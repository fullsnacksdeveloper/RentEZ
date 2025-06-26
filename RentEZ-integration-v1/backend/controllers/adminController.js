const pool = require('../db');

const getAdminStats = async (req, res, next) => {
  try {
    const [propertyCount, pendingCount] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM listings`),
      pool.query(`SELECT COUNT(*) FROM listings WHERE verification_status = 'Pending'`)
    ]);

    res.json({
      totalProperties: parseInt(propertyCount.rows[0].count),
      pendingListings: parseInt(pendingCount.rows[0].count)
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ message: 'Failed to load dashboard stats' });
  }
};

module.exports = { getAdminStats };
