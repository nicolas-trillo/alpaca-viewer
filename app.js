const express = require('express')
const axios = require("axios");
const methodOverride = require("method-override");
const { req, res } = require("http");
const {exec} = require('child_process')
const keys = require('./access_info');
const app = express()
const port = 4000

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());
app.use(methodOverride("_method"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

app.get('/new-req', (req,res) => {
  const curlCommand = `curl --request POST --header "Authorization: Bearer ${keys.token}" "https://appeears.earthdatacloud.nasa.gov/api/task?task_type=point&task_name=trilloprueba&startDate=05-08-2022&endDate=09-08-2022&layer=L09.002,B04&layer=L09.002,B03&layer=L09.002,QA_PIXEL&coordinate=30,-97&coordinate=-16.379261389374733,-71.54026025533676"`;
  exec(curlCommand, (error, stdout, stderr) => {
    console.log(`Response: ${stdout}`);
  });
  res.redirect("/get-tasks");
})

app.get('/get-tasks', (req, res) => {
  const curlCommand = `curl --header "Authorization: Bearer ${keys.token}" "https://appeears.earthdatacloud.nasa.gov/api/task?pretty=true"`;
  exec(curlCommand, (error, stdout, stderr) => {
    console.log(JSON.parse(stdout)[0]);
    res.send(`tasks list: ${JSON.stringify(JSON.parse(stdout)[0])}`);
  });
});



app.get('/login', (req, res)=>{
  //res.render("login")
})

app.get('/', (req, res) => {
  res.render("landing")
})



// /positions/{id}/{observer_lat}/{observer_lng}/{observer_alt}/{seconds}
// https://api.n2yo.com/rest/v1/satellite/positions/49260/30/-97/0/5/&apiKey=EGFNYS-3MA2QA-KSCT9K-5CK8