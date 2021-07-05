const router = require("express").Router();
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");

//Recipes main page (All Recipes, all users)

router.get("/", async (req, res, next) => {
  const recipes = await Recipe.find().populate("user");
  res.render("index", {recipes});
});

module.exports = router;


