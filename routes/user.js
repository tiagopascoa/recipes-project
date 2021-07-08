const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const fileUpload = require("../config/cloudinary");

function requireAdmin(req, res, next){
    if (req.session.currentUser && req.session.currentUser.role === "admin") {
        next();
    } else {
        res.redirect("/login");
    }
}

//User Area
router.get("/user-area/", async (req, res) => {

    const logged = await User.findById(req.session.currentUser._id);

    const createdRecipes = await Recipe.find({ user: req.session.currentUser});
    
    res.render("users/user-area", {logged, createdRecipes});
 });


 //User Profile
 router.get("/user-profile/:userId", async (req, res) => {
     
    const loggedUser = await User.findById(req.params.userId);
    console.log(loggedUser);
     res.render("users/user-profile", {loggedUser});
 });

 router.post("/user-profile/:userId/update", fileUpload.single("image"), async (req, res) => {

    let fileUrlOnCloudinary = "";
    if (req.file) {
      fileUrlOnCloudinary = req.file.path;
    }
    const {username, email} = req.body;

        await User.findByIdAndUpdate(req.params.userId, {
            imageUrl: fileUrlOnCloudinary,
            username,
            email
        });

    res.redirect("/user-area");
 });



//User Favorite List
router.get("/user-favorite-list", async (req, res) => {
    
    const theUser = await User.findById(req.session.currentUser._id).populate("favorites");

    res.render("users/user-favorite-list", theUser);
});

//User Recipes List
router.get("/user-recipes-list", async (req, res)=>{
    const createdRecipes = await Recipe.find({ user: req.session.currentUser}).populate("user");
    res.render("users/user-recipes-list", {createdRecipes});
});

//Delete Recipe button (user area)
router.post("/:recipeId/delete-recipe", async (req, res) => {
    await Recipe.findByIdAndDelete(req.params.recipeId);
    res.redirect("/user-recipes-list");
});

//Backoffice

router.get("/backoffice", requireAdmin, async (req, res) => {
    const allRecipes = await Recipe.find();
    
    const allUsers = await User.find();

    res.render("users/backoffice", {allRecipes, allUsers});
});

router.post("/backoffice/:userId/deleteUser", async (req, res) => {

    await User.findByIdAndDelete(req.params.userId);
    res.redirect("/backoffice");
});

router.post("/backoffice/:recipeId/deleteRecipe", async (req, res) => {

    await Recipe.findByIdAndDelete(req.params.recipeId);
    res.redirect("/backoffice");
});

module.exports = router;