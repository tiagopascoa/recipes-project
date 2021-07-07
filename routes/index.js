const router = require("express").Router();
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");

//Recipes main page (All Recipes, all users)
router.get("/", async (req, res, next) => {
  const recipes = await Recipe.find().populate("user");
  
  res.render("index", {recipes});
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

module.exports = router;


