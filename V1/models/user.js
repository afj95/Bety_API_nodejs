const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: String,
        phoneNumebr: Number,
        homes: [
            {type: mongoose.Schema.Types.ObjectId, ref: "Homes"}
        ],
        stuffs: [
            {type: mongoose.Schema.Types.ObjectId, ref: "Stuffs"}
        ],
        joined: {type: Date, default: Date.now}
    }
)

module.exports = mongoose.model("Users", userSchema);