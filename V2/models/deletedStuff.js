const mongoose = require("mongoose");

const DeletedStuffSchema = mongoose.Schema(
    {
        // Input data
        name: String,
        notes: String,
        price: {type:Number, default: 0},
        // Auto generating
        buyer: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        homeId: {type: mongoose.Schema.Types.ObjectId, ref: "Homes"},
        creater: {type: mongoose.Schema.Types.ObjectId, ref: "Users"},
        checked: {type: Boolean, default: false},
        deleted: {type: Boolean, default: false},
        created: {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model("DeletedStuff", DeletedStuffSchema);