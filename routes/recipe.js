const router = require("express").Router();
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");
const fileUpload = require("../config/cloudinary");

//New Recipe
router.get("/new-recipe", (req, res) => {
    res.render("recipes/new-recipe");
});

router.post("/new-recipe", fileUpload.single("image"), async (req, res) => {
    
    let fileUrlOnCloudinary = "/images/no-product-image.png";
    if (req.file) {
        fileUrlOnCloudinary = req.file.path;
    }

    const {title, image, dificulty, category, time, user} = req.body;

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

//Ingredients (update, add, delete)
router.get("/ingredients/:recipeId/update", async (req, res) => {

    const recipeToEdit = await Recipe.findById(req.params.recipeId);

    res.render("recipes/update-ingredients", recipeToEdit);
});

router.post("/ingredients/:recipeId/add", async (req, res) => {
    
    const {name, quantity, unit} = req.body;

    const newIngredient = await Recipe.findByIdAndUpdate(req.params.recipeId, {
        $push: {ingredients: {name, quantity, unit}}
    });

    res.redirect(`/ingredients/${newIngredient._id}/update`);
});

router.post("/ingredients/:ingredientId/recipe/:recipeId/delete", async (req, res) => {
    const deletedIng = await Recipe.findByIdAndUpdate(req.params.recipeId, {
        $pull: {ingredients: { _id: req.params.ingredientId}}
    });

    res.redirect(`/ingredients/${deletedIng._id}/update`);
});

//Preparation Steps (update, add, delete)
router.get("/preparation/:recipeId/update", async (req, res) => {

    const recipeToEdit = await Recipe.findById(req.params.recipeId);

    res.render("recipes/preparation-steps", recipeToEdit);
});

router.post("/preparation/:recipeId/update", async (req, res) => {

    const  {step} = req.body;

    const newStep = await Recipe.findByIdAndUpdate(req.params.recipeId, {
        $push: {preparation: {step}}
    });

    res.redirect(`/preparation/${newStep._id}/update`);
});

router.post("/preparation/:preparationId/recipe/:recipeId/delete", async (req, res) => {

    const deleteStep = await Recipe.findByIdAndUpdate(req.params.recipeId, {
        $pull: {preparation: { _id: req.params.preparationId}}
    });

    res.redirect(`/preparation/${deleteStep._id}/update`);
});

//Recipe-page
router.get("/recipe-page/:recipeId", async (req, res) => {

    const recipeDetail = await Recipe.findById(req.params.recipeId).populate("user");

    const avRating = (recipeDetail.rating.reduce((a, b) => a + b, 0)) / (recipeDetail.rating.length);

    const avRatingRound = Math.round((avRating + Number.EPSILON) * 10) / 10;

    res.render("recipes/recipe-page", {recipeDetail, avRatingRound});
});

//Rating
router.post("/recipe-page/:recipeId/rating", async (req, res) => {

    const {rating} = req.body;

    const recipeDetail = await Recipe.findByIdAndUpdate(req.params.recipeId, {
        $push: {rating}
    }, {new: true});

    res.redirect(`/recipe-page/${recipeDetail._id}`);    
});

//Favorites
router.post("/recipe-page/:recipeId/favorites", async (req, res) => {

    const recipeDetail = await Recipe.findById(req.params.recipeId);


    await User.findByIdAndUpdate(req.session.currentUser._id, {
     $addToSet: { favorites: recipeDetail}
    });

    res.redirect(`/recipe-page/${recipeDetail._id}`);
});

router.post("/user-favorite-list/:recipeId/remove", async (req, res) => {

    const recipeDetail = await Recipe.findById(req.params.recipeId);

    await User.findByIdAndUpdate(req.session.currentUser._id, {
     $pull: { favorites: recipeDetail._id }
    });

    res.redirect("/");
});





module.exports = router;