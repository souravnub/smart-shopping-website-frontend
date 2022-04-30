const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("messages", MessagesSchema);
