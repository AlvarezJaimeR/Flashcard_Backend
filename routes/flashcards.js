const { Flashcard } = require('../models/flashcard');
const { Collection, validate } = require('../models/collection');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const flashcard = await Flashcard.find();
        return res.send (flashcard);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;