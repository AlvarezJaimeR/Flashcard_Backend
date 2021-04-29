const { Collection, validate } = require ('../models/collection');
const express = require ('express');
const router = express.Router();

router.get ('/', async (req, res) => {
    try{
        const collections = await Collection.find();
        return res.send(collections);
    } catch (ex) {
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