// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();

app.use((req, res, next) => {
    console.log(`${new Date()}:\n${req.originalUrl}, ${req.body}`);
    next();
});

//
app.use("/.well-known/pki-validation", express.static("src/pki-validation/"));

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/index.html");
});

// your first API endpoint...
app.get("/api/hello", function (req, res) {
    res.json({ greeting: "hello API" });
});

//
const jsonFromDate = date => {
    return { unix: date.getTime(), utc: date.toUTCString() };
};

// get present time
app.get("/api/timestamp", (req, res) => {
    date = new Date();
    res.json(jsonFromDate(date));
});

// get time from :date_string
app.get("/api/timestamp/:date_string", (req, res) => {
    const dateString = req.params.date_string;
    const time = Date.parse(dateString);

    if (!isNaN(time)) {
        // valid ISO string
        res.json(jsonFromDate(new Date(time)));
    } else {
        // time is NaN: check if integer
        const dateParsed = parseFloat(dateString);
        if (Number.isInteger(dateParsed)) {
            res.json(jsonFromDate(new Date(dateParsed)));
        } else {
            // not an integer
            res.json({ error: "Invalid Date" });
        }
    }
});

// listen for requests :)
const PORT = process.env.PORT || 3000;
var listener = app.listen(PORT, function () {
    console.log("Your app is listening on port " + listener.address().port);
});
