const express = require('express');
const router = express.Router();

const upload = require('../upload');

const {createListing, editListing, getListingById,getListingsByLandlord, 
    getPublicListing,deleteListing,searchListings,createReview,
    getReviewsForListing, uploadImagesForListing,getImagesForListing,
    deleteImage} = require('../controllers/listingController');







router.get('/search', searchListings);
router.post('/', createListing);
router.put('/:property_id', editListing);
router.get('/:property_id', getListingById);
router.get('/landlord/:landlord_id', getListingsByLandlord);
router.get('/public/:property_id', getPublicListing);
router.delete('/:property_id', deleteListing);
 
router.post('/:property_id/review', createReview);
router.get('/:property_id/reviews', getReviewsForListing);


router.post('/:property_id/images', upload.array('images', 5), uploadImagesForListing);
router.get('/:property_id/images', getImagesForListing);
router.delete('/:property_id/images/:image_id', deleteImage);

module.exports = router; 