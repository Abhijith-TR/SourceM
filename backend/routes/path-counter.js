const express = require('express');
const {
        addPathCounter,
        getAllPathCounters
    } = require('../controllers/pathCounterController');

const router = express.Router();

router.post('/add-path-counter', addPathCounter);
router.get('/all-path-counters', getAllPathCounters);


module.exports = {
    routes: router
}
