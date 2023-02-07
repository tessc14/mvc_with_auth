const express = require('express');
const countriesController = require('../controllers/countries')

const router = express.Router()

router.get('/:name', countriesController.show)

module.exports = router;