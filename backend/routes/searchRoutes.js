const express = require('express');
const router = express.Router();
const {
  searchCourses,
  getSuggestions,
} = require('../controllers/searchController');

// Routes
router.get('/courses', searchCourses);
router.get('/suggestions', getSuggestions);

module.exports = router;
