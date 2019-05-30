const express = require("express"),
	  request = require("request"),
      router = express.Router();

//Route user to cardpointe for payment

router.post("/pay-fines", (req, res) => {
    var userId = req.body.user_id,
        getFees = process.env.ALMA_API + "users/" + userId + "/fees?" + "apikey=" + process.env.API_KEY + "&format=json";
    request(getFees, function(error, response, body){
    	if(!error && response.statusCode === 200){
			var result = JSON.parse(body),
            fees = (result["total_sum"]);
            res.redirect(process.env.CP_URL + "/pay?total=" + fees + "&cf_Library_ID=" + userId);
        } else {
        	req.flash("error", "An error has occurred. Please contact the University Library Main Circulation Desk at 847-491-7633 to make a payment.");
        	res.redirect("error"); 
        }
    });
});

//Process payment confirmation

router.post("/confirm", (req, res) => {
	var data = req.body.json,
		parsedData =  JSON.parse(data),
		merchantId = parsedData.merchantId,
		responseText = parsedData.responseText,
		amountPaid = parsedData.total,
		userId = parsedData.cf_Library_ID,
		payFees = process.env.ALMA_API + "users/" + userId + "/fees/all?op=pay&amount=" + amountPaid + "&method=ONLINE&apikey=" + process.env.API_KEY;
	request.post({
		headers: {
			'Content-Type': 'application/xml'
		},
		url: payFees
	});
});

module.exports = router;
