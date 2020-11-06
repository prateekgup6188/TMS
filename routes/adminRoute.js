var express = require('express');
const tenant = require('../models/tenant');
const owner =require('../models/owner');
var router = express.Router();
var fun = require('../services/owner');
var { check,validationResult } = require('express-validator');


module.exports = router;
