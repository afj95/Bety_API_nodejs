const mongoose = require("mongoose");


const homeSchema = mongoose.Schema(
    {
        name: String,
        admins: [
            {type: mongoose.Schema.Types.ObjectId, ref: "Users"}
        ],
        stuffs: [
            {type: mongoose.Schema.Types.ObjectId, ref: "Stuffs"}
        ],
        members: [
            {type: mongoose.Schema.Types.ObjectId, ref: "Users"}
        ],
        created: {type: Date, default: new Date()}
    }
);

module.exports = mongoose.model("Homes", homeSchema);