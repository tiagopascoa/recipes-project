// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

//Added helpers because I want to use the #eq helper
const helpers = require("handlebars-helpers");
hbs.registerHelper(helpers());
hbs.registerHelper(helpers(
    
));

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

//User session control 
const session = require("express-session");

//User session from database 
const mongoStore = require("connect-mongo");

app.use(
    session({
        resave:true,
        saveUninitialized:true,
        secret: process.env.SESSION_SECRET,
        cookie: {
            sameSite: true,
            httpOnly: true,
            maxAge: 6000000,
        },
        rolling: true,
        store: new mongoStore({
            mongoUrl: process.env.MONGODB_URI,
            ttl: 60 * 60 * 24 // 1 day
        })
        
    })
);

function getCurrentLoggedUser(req, res, next) {
    if(req.session && req.session.currentUser){
        app.locals.loggedInUser = req.session.currentUser.username;
/*         if(req.session.currentUser.role === "admin"){
            app.locals.loggedRoleAdmin = req.session.currentUser.role;
        } */
    } 
    else {
        app.locals.loggedInUser = "";
    }
    next();
}

app.use(getCurrentLoggedUser);


// default value for title local
const projectName = "recipes-project";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth");
app.use("/", auth);

const user = require("./routes/user");
app.use("/", user);

const recipe = require("./routes/recipe");
app.use("/", recipe);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
