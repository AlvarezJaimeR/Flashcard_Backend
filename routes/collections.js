const { Collection, validate } = require ('../models/collection');
const { Flashcard } = require('../models/flashcard');
const express = require ('express');
const router = express.Router();

//get all collections
router.get ('/', async (req, res) => {
    try{
        const collections = await Collection.find();
        return res.send(collections);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//get a collection by id
router.get ('/:id', async (req, res) => {
    try{
        const collection = await Collection.findById(req.params.id);

        if (!collection)
            return res.status(400).send(`The collection with id "${req.params.id}" does not exist.`);
        
        return res.send(collection);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//get flashcards from a collection id
router.get ('/:id/cards', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);

        if (!collection)
            return res.status(400).send(`The collection with id "${req.params.id}" does not exist.`);

        return res.send (collection.cards);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.post ('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send(error);

        const collection = new Collection({
            title: req.body.title,
        });

        await collection.save();

        return res.send(collection);

    }   catch (ex){
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;