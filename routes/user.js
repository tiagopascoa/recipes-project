const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

router.get("/user-area", async (req, res) => {
    const logged = req.session.currentUser;
    const createdRecipes = await Recipe.find({ user: req.session.currentUser});
    res.render("users/user-area", {logged, createdRecipes});
 });
 router.get("/user-profile", async (req, res) => {
     const currentUser = await User.findOne(req.session.currentUser);
     res.render("users/user-profile", currentUser);
 });

router.get("/user-favorite-list", (req, res) => {
    res.render("users/user-favorite-list");
});

router.get("/user-recipes-list", async (req, res)=>{
    const createdRecipes = await Recipe.find({ user: req.session.currentUser});
    res.render("users/user-recipes-list", {createdRecipes});
});


module.exports = router;