// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

app.use((req, res, next) => {
  console.log(`${new Date()}:\n${req.originalUrl}, ${req.body}`);
  next();
})

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

//
const jsonFromDate = date => {
  return { unix: date.getTime(), utc: date.toUTCString() }
}

// get present time
app.get('/api/timestamp', (req, res) => {
  date = new Date();
  res.json(jsonFromDate(date))
})

// 
app.get('/api/timestamp/:date_string', (req, res) => {
  const dateString = req.params.date_string;

  // milliseconds
  const dateParsed = parseFloat(dateString);
  console.log(dateParsed)
  if (Number.isInteger(dateParsed)) {
    res.json(jsonFromDate(new Date(dateParsed)));
    return
  }

  // valid ISO date format
  const time = Date.parse(dateString);
  if (isNaN(time)) {
    res.json({ error: "Invalid Date" });
  } else {
    res.json(jsonFromDate(new Date(time)))
  }

})


// listen for requests :)
const PORT = process.env.PORT || 3000;
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});