const { Schema, model } = require("mongoose");

const recipeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true,
    },
    dificulty: {
        type: String,
        required: true,
    },
    totaltime: {
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
    ingredients: {
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
});

const Recipe = model("Recipe", recipeSchema);
module.exports = Recipe;
