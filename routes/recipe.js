const router = require("express").Router();
const Recipe = require("../models/Recipe.model");

router.get("/new-recipe", (req, res) => {
    res.render("recipes/new-recipe");
});


module.exports = router;