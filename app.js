var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var express = require("express");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
express.static("public");

mongoose.connect(
	"mongodb+srv://wimpywarlord:warlord123@cluster0.0m95r.mongodb.net/<dbname>?retryWrites=true&w=majority",
	{ dbName: "viit" },
	function (err, res) {
		if (err) {
			console.log("mongo lab server not connected");
			console.log(err);
		} else {
			console.log("CONNECTED TO DB");
		}
	}
);

app.get("/", function (req, res) {
	res.render("index.ejs");
});

app.post("/party", function (req, res) {
	// res.redirect("https://meet.jit.si/xyz");
	console.log(req.body);
	// res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
	console.log("SERVER 3000 HAS STARTED");
});
