var user = require("../controllers/User.Controller");
const { check, validationResult } = require('express-validator');

var VerifyToken = require('./middleware.js');
module.exports = (app) => {
    app.post("/signup", [
        check('email').trim().escape(),
        check('password').isLength({ min: 8 }).trim().escape()
    ], (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        user.signup(req, res)
    });

    app.post("/signin", user.signin);
    app.get("/signout", user.signout);

    app.get("/account/get",
    VerifyToken,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        user.get(req, res)
    });
};