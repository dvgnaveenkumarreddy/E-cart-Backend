const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");


var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastName: {
        type: String,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    userInfo: {
        type: String,
        trim: true
    },
    encryPassword: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
});
userSchema.virtual("password")
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.encryPassword = this.securePassword(password);
    })

.get(function() {
    return this._password;
});

userSchema.methods = {

    authenticate: function(password) {
        return this.securePassword(password) === this.encryPassword;
    },
    securePassword: function(password) {
        if (!password) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return "";
        }
    }

}

module.exports = mongoose.model("User", userSchema)