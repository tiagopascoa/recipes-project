const { Schema, model } = require("mongoose");

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    dificulty: {
        type: String,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
    },
    description: {
        type: String,
        required: true,
    },
    Ingredients: {
        name: {
            type:String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            required: true,
        }
    },
    ImageUrl: {
        type: String,
        default: "/images/fork&knife-icon.png"
    },
    timestamps: true,

});