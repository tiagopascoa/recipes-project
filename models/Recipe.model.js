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
    time: {
        type: Number,
        required: true,
    },
    rating: [
        Number
    ],
    preparation: [{
        step: {
            type: String,
        },

    }],
    ingredients: [{
        name: {
            type:String,
            /* required: true, */
        },
        quantity: {
            type: Number,
            /* required: true, */
        },
        unit: {
            type: String,
            /* required: true, */
        }
    }],
    imageUrl: {
        type: String,
        default: "/images/fork&knife-icon.png"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [{
        username: String,
        comment: String,
    }],
},

{timestamps: true}
);

const Recipe = model("Recipe", recipeSchema);
module.exports = Recipe;
