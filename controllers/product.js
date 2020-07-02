const Product = require('../models/product')
const formiddable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.getProductById = (req, res, next, id) => {

    Product.findById(id).populate('category').exec((err, product) => {
        if (err) {
            return res.status(400).json({
                error: 'Product not found'
            })
        }
        req.product = product;
        next();
    })
}

exports.createProduct = (req, res) => {
    let form = new formiddable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: 'Problem with images'
            })
        }
        //destructure the fields
        const { name, description, price, category, stock } = fields;
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: 'Please include all fileds'
            })
        }


        let product = new Product(fields)

        // handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: ' File size is big!'
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type

        }

        // save to DB

        product.save((err, product) => {
            if (err) {

                res.status(400).json({
                    error: "Failed to save in DB"
                })
            }
            res.json(product);
        })
    })
}


exports.getProduct = (req, res) => {

    return res.json(req.product)
}

exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}


exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: 'Failed to delete product'
            })
        }
        res.json({
            message: 'Successfully deleted the product'
        })

    })


}

exports.updateProduct = (req, res) => {

    let form = new formiddable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: 'Problem with images'
            })
        }



        let product = req.product;
        product = _.extend(product, fields);

        // handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: ' File size is big!'
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type

        }

        // save to DB

        product.save((err, product) => {
            if (err) {

                res.status(400).json({
                    error: "Failed to update in DB"
                })
            }
            res.json(product);
        })
    })

}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBY = req.query.sortBY ? req.query.sortBY : '_id';
    Product.find()
        .select('-photo')
        .populate('category')
        .sort([
            [sortBy, 'asc']
        ])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'No Products find'
                })
            }
            res.json(products)
        })
}

exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.product.map(prod => {
        return {
            updateOne: {

                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } }
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            returnres.status(400).json({
                error: 'Bulk Operation failed'
            })
        }
        next();
    })
}
exports.getAllUniqueCategories = (req, res) => {
    Product.distinct('category', {}, (err, categories) => {
        if (err) {
            res.status(400).json({
                error: 'Categories not found'
            })
        }
        res.json(categories)
    })
}