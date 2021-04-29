const mongoose = require('mongoose');
const Joi = require('joi');

const collectionSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 2, maxlength: 255 },
});

const Collection = mongoose.model('Collection', collectionSchema);

function validateCollection(collection){
    const schema = Joi.object({
        title: Joi.string().min(2).max(50).required(),
    });
    return schema.validate(collection);
}

exports.Collection = Collection;
exports.validate = validateCollection;
exports.collectionSchema = collectionSchema;