const User = require("../models/user")
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

const {
    check,
    validationResult
} = require('express-validator')

exports.signUp = (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }


    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                err: "Not able to save user in DB"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            _id: user._id

        });
    });
};

exports.signIn = (req, res) => {
    const errors = validationResult(req)
    const { email, password } = req.body;
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User email doesn't exists"
            })
        }

        if (!user.authenticate(password)) {
            res.status(401).json({
                error: "Email and Password do not match"
            })
        }
        // create token
        const token = jwt.sign({
                _id: user
                    ._id
            }, "dvgreddy")
            // token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });


        // send response to front end
        const {
            _id,
            name,
            email,
            role
        } = user;

        return res.json({ token, user: { _id, name, email, role } })

    })


};

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "User Signout successfull" })
};

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET || "dvgreddy",
    userProperty: "auth"
});


//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }

    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        returnres.status(403).json({
            error: "You are not Admin"
        })
    }

    next();
};