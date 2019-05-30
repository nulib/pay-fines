const express = require("express"),
	  router = express.Router();

//Render form to get user id

router.get("/", (req, res) => {
    res.render("pay-form");
});

module.exports = router;