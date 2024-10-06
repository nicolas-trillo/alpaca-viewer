const express = require('express')
const axios = require("axios");
const methodOverride = require("method-override");
const { req, res } = require("http");
const {exec} = require('child_process')
const keys = require('./access_info.js');
const app = express()
const port = 4000

//const curentUser = null
// sample rundown user
const curentUser = {tasks:[
  {
    task_name: "test1",
    task_id: "a6fa10bf-35e1-4974-af01-d003633ec0c0",
    params:{
      dates: [
        {
          endDate: "2024-10-06"
        }
      ]
    }
  },
  {
    task_name: "test2",
    task_id: "a3f77c2f-4a6d-4ea5-a294-e3041a1ab9b0",
    params:{
      dates: [
        {
          endDate: "2024-10-06"
        }
      ]
    }
  },
  {
    task_name: "test3",
    task_id: "b1991ba7-88b8-498b-bb4a-a031ecebc113",
    params:{
      dates: [
        {
          endDate: "2024-10-06"
        }
      ]
    }
  },
  {
    task_name: "test4",
    task_id: "532e8a82-6382-409e-a0e9-9e2784eae083",
    params:{
      dates: [
        {
          endDate: "2024-10-06"
        }
      ]
    }
  },
  {
    task_name: "test5",
    task_id: "65b3082b-34f9-427c-9c86-6123ed735bce",
    params:{
      dates: [
        {
          endDate: "2024-10-06"
        }
      ]
    }
  },
  {
    task_name: "test6",
    task_id: "19a799e7-ca96-4d79-8c3d-949f9a8f3549",
    params:{
      dates: [
        {
          endDate: "2024-10-06"
        }
      ]
    }
  }
]};

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());
app.use(methodOverride("_method"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

let currentTaskId;
// curl "https://appeears.earthdatacloud.nasa.gov/api/product/L09.002"
// http://localhost:4000/new-req?taskName=prueba00&startDate=01-01-2021&endDate=01-01-2023&coordinate=[30,-97]


app.get('/new-req', async (req,res) => {
  const {taskName, startDate, endDate,coordinate} = req.query;
  coordinateArray = JSON.parse(coordinate);
  const curlCommand = `curl --request POST --header "Authorization: Bearer ${keys.token}" "https://appeears.earthdatacloud.nasa.gov/api/task?task_type=point&task_name=${taskName}&startDate=${startDate}&endDate=${endDate}&layer=L09.002,SR_B1&layer=L09.002,SR_B2&layer=L09.002,SR_B3&layer=L09.002,SR_B4&layer=L09.002,SR_B5&layer=L09.002,SR_B6&layer=L09.002,SR_B7&layer=L09.002,QA_PIXEL&layer=L09.002,SR_QA_AEROSOL&layer=L09.002,QA_LINEAGE&layer=L09.002,QA_RADSAT&coordinate=${coordinateArray[0]},${coordinateArray[1]}&coordinate=${(parseInt(coordinateArray[0]) - 0.00925).toString()},${coordinateArray[1]}&coordinate=${(parseInt(coordinateArray[0]) + 0.00925).toString()},${coordinateArray[1]}&coordinate=${(parseInt(coordinateArray[0]) - 0.00925).toString()},${(parseInt(coordinateArray[1]) + 0.0085).toString()}&coordinate=${coordinateArray[0]},${(parseInt(coordinateArray[1]) - 0.0085).toString()}&coordinate=${(parseInt(coordinateArray[0]) + 0.00925).toString()},${(parseInt(coordinateArray[1]) - 0.0085).toString()}&coordinate=${(parseInt(coordinateArray[0]) - 0.00925).toString()},${(parseInt(coordinateArray[1]) - 0.0085).toString()}&coordinate=${coordinateArray[0]},${(parseInt(coordinateArray[1]) + 0.0085).toString()}&coordinate=${(parseInt(coordinateArray[0]) + 0.0095).toString()},${(parseInt(coordinateArray[1]) + 0.0085).toString()}"`;

  console.log(curlCommand);
  try {
    currentTaskId = await new Promise((resolve, reject) => {
      exec(curlCommand, (error, stdout, stderr) => {
        if (error) {
          reject(`exec error: ${error}`);
        }
        resolve(stdout.trim());
      });
    });
    
    res.redirect("/get-tasks");
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear la tarea');
  }
})

app.get('/get-tasks', (req, res) => {
  const curlCommand = `curl "Content-Type: application/json" --header "Authorization: Bearer ${keys.token}" "https://appeears.earthdatacloud.nasa.gov/api/task/${JSON.parse(currentTaskId).task_id}"`;
  exec(curlCommand, (error, stdout, stderr) => {
    //console.log(JSON.parse(stdout)[0]);
    res.send(`tasks list: ${JSON.stringify(JSON.parse(stdout))}`);
  });
});

app.get('/user', (req, res) => {
    console.log("Name: ", req.query.name);
    console.log("Age:", req.query.age);
    res.send("caca");
});

app.get("/explorer", (req, res) => {
  if (curentUser != null) {
    res.render("explorer", {user: curentUser});
  } else res.redirect("/")
});

app.get("/saved-locations", (req, res) => {
  if (curentUser != null) {
    res.render("locations", {user: curentUser});
  } else res.redirect("/")
});

app.get("/account", (req, res) => {
  if (curentUser != null) {
    res.render("account", {user: curentUser});
  } else res.redirect("/")
});

app.get("/", (req, res) => {
    res.render("login", {message: "Please login"});
});

// localhost:4000/user?name=gabo%20cornejo&age=19


// /positions/{id}/{observer_lat}/{observer_lng}/{observer_alt}/{seconds}
// https://api.n2yo.com/rest/v1/satellite/positions/49260/30/-97/0/5/&apiKey=(our key)

// curl --header "Content-Type: application/json" --header "Authorization: Bearer (our token)" "https://appeears.earthdatacloud.nasa.gov/api/task/19a799e7-ca96-4d79-8c3d-949f9a8f3549"