const mongoose = require("mongoose");

const StuffSchema = mongoose.Schema(
    {
        name: String,
        notes: String,
        price: {type:Number, default: 0},
        buyer: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        homeId: {type: mongoose.Schema.Types.ObjectId, ref: "Homes"},
        checked: {type: Boolean, default: false},
        deleted: {type: Boolean, default: false},
        creater: {type: mongoose.Schema.Types.ObjectId, ref: "Userss"},
        created: {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model("Stuffs", StuffSchema);