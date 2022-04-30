const express = require("express");
const Messages = require("../models/Messages");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        await Messages.create({
            user: req.body.user,
            email: req.body.email,
            message: req.body.message,
        });
        res.status(200).json({
            success: true,
            message:
                "your message had been recorded ! we will try to respond soon !",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message:
                "some internal server error occured! message cannot be recorded.",
        });
    }
});

module.exports = router;
