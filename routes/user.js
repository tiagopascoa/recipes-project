const router = require("express").Router();
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");
const fileUpload = require("../config/cloudinary");


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
    const createdRecipes = await Recipe.find({ user: req.session.currentUser});
    res.render("users/user-recipes-list", {createdRecipes});
});

//Delete Recipe button (user area)
router.post("/:recipeId/delete-recipe", async (req, res) => {
    await Recipe.findByIdAndDelete(req.params.recipeId);
    res.redirect("/user-recipes-list");
});

module.exports = router;