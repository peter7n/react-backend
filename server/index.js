const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const PORT = process.env.PORT || 3001;
const cors=require("cors");
const corsOptions ={
   origin: '*', 
   credentials: true,            //access-control-allow-credentials:true
   optionSuccessStatus: 200,
};

const dataPath = './data/data.json';
const app = express();

const getData = () => {
	const jsonData = fs.readFileSync(dataPath);
	return JSON.parse(jsonData);
}

const saveData = (data) => {
	const stringifyData = JSON.stringify(data);
	fs.writeFileSync(dataPath, stringifyData);
}

// middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// routes
app.get("/api", (req, res) => {
	const data = getData();
	res.send(data);
	// res.json({ message: "Hello from server!" });
});

app.post("/post/:id", (req, res) => {
	const accountId = req.params['id'];
	let existingData = getData();
	// let newData = [...req.body, ...existingData];
	existingData[accountId] = req.body;
	saveData(existingData);
	res.send(existingData);
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});