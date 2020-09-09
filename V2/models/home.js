const
    mongoose = require("mongoose");


const homeSchema = mongoose.Schema(
    {
        name: String,
        // adminEmail: [
        //     {type: mongoose.Schema.Types.ObjectId, ref: "Users"}
        // ],
        stuffs: [
            {type: mongoose.Schema.Types.ObjectId, ref: "Stuffs"}
        ],
        members: [
            {type: mongoose.Schema.Types.ObjectId, ref: "Users"}
        ],
        created: {type: Date, default: Date.now}
    }
);

module.exports = mongoose.model("Homes", homeSchema);