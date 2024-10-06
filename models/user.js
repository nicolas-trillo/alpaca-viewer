const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});

const User = mongoose.model("User", userSchema, "users");
module.exports = User;