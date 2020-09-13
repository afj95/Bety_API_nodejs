const mongoose              = require("mongoose");
const PassportLocalMongoose = require("passport-local-mongoose")

const userSchema = mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        username: String,
        email: String,
        phoneNumebr: Number,
        password: String,
        homes: [
            {type: mongoose.Schema.Types.ObjectId, ref: "Homes"}
        ],
        stuffs: [
            {type: mongoose.Schema.Types.ObjectId, ref: "Stuffs"}
        ],
        joined: {type: Date, default: Date.now}
    }
)

userSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model("Users", userSchema);