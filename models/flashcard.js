const mongoose = require('mongoose');
const Joi = require('joi');
const { collectionSchema } = require('./collection');

const flashcardSchema = new mongoose.Schema({
    category: { type: String, required: true, minlength: 5, maxlength: 50 },
    question: { type: String, required: true, minlength: 5, maxlength: 255},
    answer: { type: String, required: true, minlength: 5, maxlength: 255},
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

function validateFlashcard(flashcard){
    const schema = Joi.object({
        category: Joi.string().required().min(5).max(50),
        question: Joi.string().required().min(5).max(255),
        answer: Joi.string().required().min(5).max(255),
    });
    return schema.validate(flashcard);
}

exports.Flashcard = Flashcard;
exports.validateF = validateFlashcard;
exports.flashcardSchema = flashcardSchema;