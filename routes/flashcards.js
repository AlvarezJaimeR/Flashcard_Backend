const { Flashcard, validateF } = require('../models/flashcard');
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