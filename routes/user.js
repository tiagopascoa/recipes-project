const router = require("express").Router();
const User = require("../models/User.model");

router.get("/user-area", (req, res) => {
    const loggedInUser = req.session.currentUser;
    // set loggedin user as current user
    // pass the loggedinuser in your view
    // console log the user to understand his fields 
    // access them in the view
     res.render("users/user-area", loggedInUser);
    console.log(loggedInUser); 
 });
 router.get("/user-profile", async (req, res) => {
     const currentUser = await User.findOne(req.session.currentUser);
     res.render("users/user-profile", currentUser);
 });


module.exports = router;