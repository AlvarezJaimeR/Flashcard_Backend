const { Collection, validateC } = require ('../models/collection');
const { Flashcard, validateF } = require('../models/flashcard');
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
        return res.status(500).send(`Internal Server Error: "${ex}"`);
    }
});

//get specific ID cards from a specific collection
router.get ('/:collectionId/cards/:cardsId', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.collectionId);
        if (!collection)
            return res.status(400).send(`The collection with id "${req.params.collectionId}" does not exist.`);
        
        const flash = await Flashcard.findById(req.params.cardsId);
        // const card = collection.cards.id(req.params.cardsId)
        if (!flash)
            return res.status(400).send(`The flashcard with id "${req.params.cardsId}" does not exist.`);

        return res.send(flash);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: "${ex}`);
    }
});

//post new collections
router.post ('/', async (req, res) => {
    try {
        const { error } = validateC(req.body);
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

//post a new flashcard after taking a collection id
router.post('/:collectionId/cards', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.collectionId);
        if (!collection)
            return res.status(400).send(`The collection id "${req.params.collectionId}" does not exist.`);

        const cards = new Flashcard({
            category: req.body.category,
            question: req.body.question,
            answer: req.body.answer,
        });

        await cards.save();

        return res.send(cards);
    }   catch (ex){
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//post a new flashcard after taking a collection and flashcard id
router.post('/:collectionId/cards/:flashcardId', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.collectionId);
        if (!collection)
            return res.status(400).send(`The collection id "${req.params.collectionId}" does not exist.`);

        const flashcard = await Flashcard.findById(req.params.flashcardId);
        if (!flashcard)
            return res.status(400).send(`The flashcard id "${req.params.flashcardId}" does not exist.`);

        collection.cards.push(flashcard);

        await collection.save();
        return res.send(collection.cards);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//put -- update a collection 
router.put('/:id', async (req, res) => {
    try {
        const { error } = validateC(req.body);
        if (error) return res.status(400).send(error);

        const collection = await Collection.findById(req.params.id);
        if(!collection)
        return res.status(400).send(`The collection id "${req.params.id}" does not exist.`);

        collection.title = req.body.title;

        await collection.save();
        return res.send(collection);
    }   catch (ex){
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//put -- update the flashcard after taking a collection and flashcard id
router.put('/:collectionId/cards/:flashcardId', async (req, res) => {
    try {
        const { error } = validateF(req.body);
        if (error) return res.status(400).send(error);

        const collection = await Collection.findById(req.params.collectionId);
        if(!collection)
        return res.status(400).send(`The collection id "${req.params.collectionId}" does not exist.`);

        const flashcard = collection.cards.id(req.params.flashcardId);
        if (!flashcard)
        return res.status(400).send(`The flashcard with id "${req.params.flashcardId}" does not exist in the collection id.`);

        flashcard.category = req.body.category;
        flashcard.question = req.body.question;
        flashcard.answer = req.body.answer; 

        await collection.save();
        return res.send(flashcard);
    }   catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

//delete a flashcard after taking in a collection and flashcard id
router.delete('/:collectionId/cards/:flashcardId', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.collectionId);
        if (!collection)
        return res.status(400).send(`The collection id "${req.params.collectionId}" does not exist.`);

        let flashcard = collection.cards.id(req.params.flashcardId);
        if (!flashcard) 
        return res.status(400).send(`The flashcard with id "${req.params.flashcardId}" does not exist.`);

        flashcard = await flashcard.remove();

        await collection.save();
        return res.send(flashcard);
    }   catch (ex){
        return res.status(500).send (`Internal Server Error: "${ex}"`);
    }
});

module.exports = router;