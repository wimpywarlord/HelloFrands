var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var express = require("express");
const { v4: uuidv4 } = require("uuid");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
express.static("public");

var user_base_schema = new mongoose.Schema({
	unique_id: String,
	alone: Boolean,
	room: String,
});

var user_base = mongoose.model("user_bases", user_base_schema);

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
	var sort = { _id: 1 };
	var list_of_all_user;
	var finding_free_person = new Promise(async (resolve, reject) => {
		await user_base
			.find({}, function (err, all_users) {
				if (err) {
					console.log(
						"ALL CURRENT USER NOT FETCHED ACCORDING TO TIME STAMP"
					);
				} else {
					console.log("ALL USERS FETCHED");
					console.log(all_users);
					list_of_all_user = all_users;
				}
			})
			.sort(sort);

		// console.log("SHOULD PRINT AFTER USER FETCH ");

		// <--CODE FOR FINDING THE BEST ROOM-->
		var best_free_room;
		if (list_of_all_user != undefined)
			list_of_all_user.forEach((element) => {
				if (element.alone == true) {
					best_free_room = element;
					return false;
				}
			});
		// <--CODE FOR FINDING THE BEST ROOM-->

		if (best_free_room) {
			// SETTING THE ALONE OF BEST USER TO FALSE
			var filter = { unique_id: best_free_room.unique_id };
			var update = { alone: false };
			user_base.findOneAndUpdate(filter, update, function (err, res) {
				if (err) {
					console.log("THE PERSON WHO IS NOT ALONE ANYMORE FAILED");
				} else {
					console.log("THE PERSON WHO IS NOT ALONE ANYMORE success");
				}
			});
			// IF WE FIND SOME FREE ROOM
			console.log("THIS IS THE BEST USER");
			console.log(best_free_room);
			console.log(best_free_room.room);
			user_base.update(
				{
					unique_id: req.body.unique_id,
					alone: false,
					room: best_free_room.room,
				},
				{
					upsert: true,
				},
				function (err, user) {
					if (err) {
						console.log("New user NOT created");
						console.log(err);
					} else {
						console.log("New user created");
						console.log(user);
					}
				}
			);
			res.redirect(`https://meet.jit.si/${best_free_room.room}`);
		} else {
			// IF NO FREE ROOM IS AVAILABLE
			const room_for_current_user = uuidv4();
			res.redirect(`https://meet.jit.si/${room_for_current_user}`);
			user_base.update(
				{
					unique_id: req.body.unique_id,
				},
				{
					unique_id: req.body.unique_id,
					alone: true,
					room: room_for_current_user,
				},
				{
					upsert: true,
				},
				function (err, user) {
					if (err) {
						console.log("New user NOT created");
						console.log(err);
					} else {
						console.log("New user created");
						console.log(user);
					}
				}
			);
		}
	});

	// res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
	console.log("SERVER 3000 HAS STARTED");
});
