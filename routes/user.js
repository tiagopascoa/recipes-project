const router = require("express").Router();
const User = require("../models/User.model");

router.get("/user-area", (req, res) => {
    res.render("users/user-area");
});

module.exports = router;