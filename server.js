// server.js
// where your node app starts

// init project
const express = require('express')
const app = express()
const axios = require('axios');
const token = process.env.SECRET
const b13 = process.env.B13
const b14 = process.env.B14
const b15 = process.env.B15
const b16 = process.env.B16
const b17 = process.env.B17
const b18 = process.env.B18
const outs = process.env.OUTS


// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

var dict = {};
dict['2013'] = b13;
dict['2014'] = b14;
dict['2015'] = b15;
dict['2016'] = b16;
dict['2017'] = b17;
dict['2018'] = b18;
dict['outsider'] = outs;


app.get("/add", (request, response) => {
  let pref = request.query.email.substring(0, 4);
  let checkInsti = request.query.email.split('@')[1];
  if(checkInsti === "iiitv.ac.in" || checkInsti === "iiitvadodara.ac.in") {
    console.log("IIITian");
  }
  else {
    pref = 'outsider';
  }
  console.log(pref)
  let url = "https://api.github.com/teams/" + dict[pref] + "/memberships/" + request.query.username + "?access_token=" + token;
  console.log(url);
  axios.put(url)
  .then(response => {
    console.log(response.data.url);
  })
  .catch(error => {
    console.log(error);
  });
})

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
