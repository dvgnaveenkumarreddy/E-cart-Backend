var express = require('express');
const {
    check,
    validationResult
} = require('express-validator')
var router = express.Router();
const { signout, signUp, signIn, isSignedIn } = require("../controllers/auth")



router.post('/signup', [

        check("name", "Name Should be at least 5 letters").isLength({
            min: 5
        }),
        check("email", "Email is required").isEmail(),
        check("password", "Password is required and should be of length 6").isLength({ min: 6 }),
    ],
    signUp);

router.post('/signin', [
        check("email", "Email is required").isEmail(),
        check("password", "Password is required").isLength({ min: 6 }),
    ],
    signIn);

router.get("/signout", signout);

router.get("/testrouter", isSignedIn, (req, res) => {
    res.json(req.auth);
});

module.exports = router;