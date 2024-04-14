const mongoose =require("mongoose");

const countSchema = new mongoose.Schema({
    count:Number
})

module.exports = mongoose.model("count",countSchema);