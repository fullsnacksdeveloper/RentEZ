const pool = require('../db');
const Joi = require("joi");

const listingSchema = Joi.object({
  property_id: Joi.number().required(),
  landlord_id: Joi.number().required(),
  address_line: Joi.string().required(),
  city: Joi.string().required(),
  parish: Joi.string().required(),
  rental_type: Joi.string().required(),
  furnished: Joi.boolean().required(),
  monthly_rent: Joi.number().required(),
  is_available: Joi.boolean().required(),
  description: Joi.string().required(),
  verification_status: Joi.string().required(),
  created_at: Joi.date().required()
});

/*
    create listing with info
1. request is sent to the server to create a listing
2. server receives and validates form data
3. server inserts listing into database
*/

const createListing = async (req, res) => {
  try {

    const { error, value } = listingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const values = [
      value.property_id,
      value.landlord_id,
      value.address_line,
      value.city,
      value.parish,
      value.rental_type,
      value.furnished,
      value.monthly_rent,
      value.is_available,
      value.description,
      value.verification_status,
      value.created_at
    ];

    const result = await pool.query(
      `INSERT INTO properties (
        property_id, landlord_id, address_line, city, parish, rental_type,
        furnished, monthly_rent, is_available, description, verification_status, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      values
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Could not create listing", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* 
Accepting a PUT request to /api/listing/:property_id

Validating the new data with Joi

Updating the record in the database

Returning the updated listing in the response

*/


// Define update schema — all fields optional
const partialUpdateSchema = Joi.object({
  landlord_id: Joi.number().optional(),
  address_line: Joi.string().optional(),
  city: Joi.string().optional(),
  parish: Joi.string().optional(),
  rental_type: Joi.string().optional(),
  furnished: Joi.boolean().optional(),
  monthly_rent: Joi.number().optional(),
  is_available: Joi.boolean().optional(),
  description: Joi.string().optional(),
  verification_status: Joi.string().optional()
}).min(1); // Require at least one field to update

const editListing = async (req, res) => {
  try {
    const property_id = parseInt(req.params.property_id);

    // Validate input
    const { error, value } = partialUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Dynamically build SET clause
    const keys = Object.keys(value); // e.g., ['monthly_rent', 'description']
    const values = Object.values(value); // e.g., [80000, 'Updated desc']

    // Map each key to "key = $index"
    const setClauses = keys.map((key, index) => `${key} = $${index + 1}`);

    const query = `
      UPDATE properties
      SET ${setClauses.join(', ')}
      WHERE property_id = $${keys.length + 1}
      RETURNING *;
    `;

    values.push(property_id); // Add property_id for WHERE clause

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error('Could not update listing:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

///////////////////////////////GET ROUTES /////////////////////////////////////////////////////////////////////////

const getListingById = async (req, res) => {
  try {
    const property_id = parseInt(req.params.property_id);

    const listingResult = await pool.query(
      `SELECT * FROM properties WHERE property_id = $1`,
      [property_id]
    );

    if (listingResult.rowCount === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const imagesResult = await pool.query(
      `SELECT file_path FROM gallery WHERE property_id = $1`,
      [property_id]
    );

    const listing = listingResult.rows[0];
    listing.images = imagesResult.rows;

    res.status(200).json(listing);

  } catch (error) {
    console.error("Error fetching listing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getListingsByLandlord = async (req, res) => {
  try {
    const landlord_id = parseInt(req.params.landlord_id);

    const result = await pool.query(
      `SELECT * FROM properties WHERE landlord_id = $1`,
      [landlord_id]
    );

    res.status(200).json(result.rows); // could be [] if no listings

  } catch (error) {
    console.error("Error fetching landlord listings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getPublicListing = async (req, res) => {
  try {
    const property_id = parseInt(req.params.property_id);

    const result = await pool.query(
      `SELECT * FROM properties
       WHERE property_id = $1 AND verification_status = 'verified'`,
      [property_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Listing not found or not verified yet" });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Error fetching public listing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

////////////////////////////////////////DELETE////////////////////////////////////////////////////////////////

const deleteListing = async (req, res) => {
  try {
    const property_id = parseInt(req.params.property_id);

    const result = await pool.query(
      `DELETE FROM properties WHERE property_id = $1 RETURNING *`,
      [property_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.status(200).json({ message: "Listing deleted successfully", listing: result.rows[0] });

  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


////////////////////////////////////////////SEARCH    GET SAME WAY /////////////////////////////////////////////////////////////////
const searchListings = async (req, res) => {
  try {
    const {
      city,
      parish,
      rental_type,
      furnished,
      is_available,
      minRent,
      maxRent
    } = req.query;

    // Build dynamic WHERE clauses
    const conditions = [`verification_status = 'verified'`]; // Only public listings
    const values = [];

    if (city) {
      values.push(city);
      conditions.push(`city ILIKE $${values.length}`);
    }

    if (parish) {
      values.push(parish);
      conditions.push(`parish ILIKE $${values.length}`);
    }

    if (rental_type) {
      values.push(rental_type);
      conditions.push(`rental_type ILIKE $${values.length}`);
    }

    if (furnished !== undefined) {
      values.push(furnished === 'true');
      conditions.push(`furnished = $${values.length}`);
    }

    if (is_available !== undefined) {
      values.push(is_available === 'true');
      conditions.push(`is_available = $${values.length}`);
    }

    if (minRent) {
      values.push(Number(minRent));
      conditions.push(`monthly_rent >= $${values.length}`);
    }

    if (maxRent) {
      values.push(Number(maxRent));
      conditions.push(`monthly_rent <= $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `SELECT * FROM properties ${whereClause}`;

    const result = await pool.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error searching listings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

////////////////////////////////////////////////REVIEW FOR LISTING //////////////////////////////////////////////


const reviewSchema = Joi.object({
  tenant_id: Joi.number().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow('').optional()
});

const createReview = async (req, res) => {
  try {
    const property_id = parseInt(req.params.property_id);
    const { error, value } = reviewSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { tenant_id, rating, comment } = value;

    const result = await pool.query(
      `INSERT INTO reviews (property_id, tenant_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [property_id, tenant_id, rating, comment]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


const getReviewsForListing = async (req, res) => {
  try {
    const property_id = parseInt(req.params.property_id);

    const reviewsResult = await pool.query(
      `SELECT * FROM reviews WHERE property_id = $1 ORDER BY created_at DESC`,
      [property_id]
    );

    const averageResult = await pool.query(
      `SELECT AVG(rating)::numeric(2,1) AS average_rating
       FROM reviews
       WHERE property_id = $1`,
      [property_id]
    );

    res.status(200).json({
      reviews: reviewsResult.rows,
      average_rating: averageResult.rows[0].average_rating || "0.0"
    });

  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


///////////////////////////////////////////IMAGE UPLOAD SUPPORT ///////////////////////////////////////////////

const uploadImagesForListing = async (req, res) => {
  try {
    const property_id = parseInt(req.params.property_id);
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No valid image files uploaded.' });
    }

    const values = files.map(file => [property_id, `/uploads/${file.filename}`]);

    const insertQuery = `
      INSERT INTO gallery (property_id, file_path)
      VALUES ${values.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')}
      RETURNING *`;

    const flatValues = values.flat();

    const result = await pool.query(insertQuery, flatValues);

    res.status(201).json({ uploaded: result.rows });

  } catch (err) {
    if (err instanceof multer.MulterError || err.message.includes('Only')) {
      return res.status(400).json({ error: err.message });
    }

    console.error("Error uploading images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



const getImagesForListing = async (req, res) => {
  try {
    const property_id = parseInt(req.params.property_id);

    const result = await pool.query(
      `SELECT file_path FROM gallery WHERE property_id = $1`,
      [property_id]
    );

    res.status(200).json(result.rows);

  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteImage = async (req, res) => {
  try {
    const property_id = parseInt(req.params.property_id);
    const image_id = parseInt(req.params.image_id);

    // Check if image exists
    const check = await pool.query(
      `SELECT file_path FROM gallery WHERE image_id = $1 AND property_id = $2`,
      [image_id, property_id]
    );

    if (check.rowCount === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const imagePath = check.rows[0].file_path;
    const fs = require('fs');

    // Delete file from disk
    fs.unlinkSync(`.${imagePath}`);

    // Remove from DB
    await pool.query(`DELETE FROM gallery WHERE image_id = $1`, [image_id]);

    res.status(200).json({ message: "Image deleted successfully" });

  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
    createListing, 
    editListing, 
    getListingById,
    getListingsByLandlord,
    getPublicListing,
    deleteListing,
    searchListings,
    createReview,
    getReviewsForListing,
    uploadImagesForListing,
    getImagesForListing, 
    deleteImage};
