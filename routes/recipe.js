const router = require("express").Router();
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");
const fileUpload = require("../config/cloudinary");

//New Recipe
router.get("/new-recipe", (req, res) => {
    res.render("recipes/new-recipe");
});

router.post("/new-recipe", fileUpload.single("image"), async (req, res) => {
    
    let fileUrlOnCloudinary = "";
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
     $push: { favorites: recipeDetail}
    });


    res.redirect(`/recipe-page/${recipeDetail._id}`);
});


//Search by category
router.get("/category-desert", async (req, res) => {
    const categoryDesert = await Recipe.find({ category: "desert"});
    res.render("recipes/category-desert", {categoryDesert});
});

router.get("/category-meat", async (req, res) => {
    const categoryMeat = await Recipe.find({ category: "meat"});
    res.render("recipes/category-meat", {categoryMeat});
});

router.get("/category-fish", async (req, res) => {
    const categoryFish = await Recipe.find({ category: "fish"});
    res.render("recipes/category-fish", {categoryFish});
});

router.get("/category-vegetarian", async (req, res) => {
    const categoryVegetarian = await Recipe.find({ category: "vegetarian"});
    res.render("recipes/category-vegetarian", {categoryVegetarian});
});

//Search-bar
router.get("/search", async (req, res) => {

    const search = req.query.search;
    console.log(search);

    const recipeSearch = await Recipe.find({
        title: {
          $regex: '.*' + search + '.*',
          $options: 'i'
        }
      });

    console.log(recipeSearch);

    res.render("recipes/search", {recipeSearch});
});

module.exports = router;