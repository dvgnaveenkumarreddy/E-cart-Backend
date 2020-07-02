const user = require('../models/user');
const order = require('../models/order');

exports.getUserById = (req, res, next, id) => {
    user.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User was not found"
            })
        }
        req.profile = user;
        next();
    });
};

exports.getUser = (req, res) => {

    // TODO get back here for password
    req.profile.salt = undefined;
    req.profile.encryPassword = undefined;

    return res.json(req.profile);
};

exports.getAllUsers = (req, res) => {
    user.find().exec((err, users) => {
        if (err || !users) {
            return res.status(400).json({
                error: "No users found"
            })
        }

        res.send(users);
    });
};

exports.updateUser = (req, res) => {
    user.findByIdAndUpdate({
        _id: req.profile._id
    }, {
        $set: req.body
    }, { new: true, useFindAndModify: false }, (err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'update was unsuccessfull'
            })
        }

        res.json(user)
    })
};

exports.userPurchaseList = (req, res) => {
    order.find({
        user: req.profile._id
    }).populate('user', '_id name'), exec((err, order) => {
        if (err) {
            res.status(400).json({
                error: "No order found"
            })
        }
        return res.json(order)
    })
};
exports.pushOrderInpurchaseList = (req, res, next) => {

    let purchases = []
    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transcationId: req.body.transcationId
        })
    });

    // store this in db

    user.findOneAndUpdate({
            _id: req.profile._id
        }, {
            $push: { purchases: purchases }
        }, { new: true },
        (err, purchases) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to save "
                });
            }
            next();
        }

    )
}