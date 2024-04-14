const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password:  { type: String, required: true},
    token:  { type: String},
    loggedInStatus:  { type: Boolean},
});

module.exports = mongoose.model("user", userSchema);