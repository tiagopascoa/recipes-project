const router = require("express").Router();
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");
const fileUpload = require("../config/cloudinary");

router.get("/new-recipe", (req, res) => {
    res.render("recipes/new-recipe");
});

router.get("/ingredients/:recipeId/update", async (req, res) => {

    const recipeToEdit = await Recipe.findById(req.params.recipeId);

    res.render("recipes/update-ingredients", recipeToEdit);
});


router.post("/new-recipe", fileUpload.single("image"), async (req, res) => {
    
    let fileUrlOnCloudinary = "";
    if (req.file) {
        fileUrlOncloudinary = req.file.path;
    }

    const {title, image, dificulty, category, time, user} = req.body;

    /* const thisUser = await User.findById(req.session.currentUser).populate("user"); 
    Recipe find all .populate user
    */

    const newRecipe = await Recipe.create({
        title,
        imageUrl: fileUrlOnCloudinary,
        dificulty,
        category,
        time,
        user: req.session.currentUser
    });

    res.redirect(`/ingredients/${newRecipe._id}/update`);
    
});

router.post("/ingredients/:recipeId/add", async (req, res) => {
    
    const {name, quantity, unit} = req.body;

    const newIngredient = await Recipe.findByIdAndUpdate(req.params.recipeId, {
        $push: {ingredients: {name, quantity, unit}}
    });

    res.redirect(`/ingredients/${newIngredient._id}/update`);

});

router.get("/preparation/:recipeId/update", async (req, res) => {

    const recipeToEdit = await Recipe.findById(req.params.recipeId);

    res.render("recipes/preparation-steps", recipeToEdit);
});

router.post("/preparation/:recipeId/update", async (req, res) => {
    const  {preparation} = req.body;

    const prepSteps = await Recipe.findByIdAndUpdate(req.params.recipeId, {preparation});

    res.redirect("/");
});






module.exports = router;