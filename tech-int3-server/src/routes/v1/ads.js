const express = require('express');
const router = express.Router();
const { 
  getAds, 
  getAdById, 
  approveAd, 
  rejectAd, 
  requestChanges,
  getNewAdsCount
} = require('../../controllers/v1/adsController');

router.get('/new-count', getNewAdsCount);

router.get('/', getAds);

router.get('/:id', getAdById);

router.post('/:id/approve', approveAd);

router.post('/:id/reject', rejectAd);

router.post('/:id/request-changes', requestChanges);

module.exports = router;
