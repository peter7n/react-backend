let devMode = true;
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
// const http = require("http");
const https = require("https");
let privateKey = '';
let certificate = '';
let credentials= {};
if (!devMode) {
	privateKey = fs.readFileSync('/etc/pki/tls/private/masterptn.org.key', 'utf8');
	certificate = fs.readFileSync('/etc/pki/tls/certs/masterptn.org.crt', 'utf8');
	credentials = {key: privateKey, cert: certificate};
}

const dataPath = './data/data.json';
const dataPath2 = './data/data2.json';
const app = express();

const getData = () => {
	const jsonData = fs.readFileSync(dataPath);
	return JSON.parse(jsonData);
}

const getData2 = () => {
	const jsonData = fs.readFileSync(dataPath2);
	return JSON.parse(jsonData);
}

const saveData = (data) => {
	const stringifyData = JSON.stringify(data);
	fs.writeFileSync(dataPath, stringifyData);
}

const saveData2 = (data) => {
	const stringifyData = JSON.stringify(data);
	fs.writeFileSync(dataPath2, stringifyData);
}

// middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// routes
app.get("/get-data/:id", (req, res) => {
	const dateId = req.params['id'];
	const data = getData();
	const entry = data[dateId];
	if (entry) {
		res.send(entry);
	} else {
		res.send({ entry_found: false });
	}
});

app.get("/get-data-2/:id", (req, res) => {
	const dateId = req.params['id'];
	const data = getData2();
	const entry = data[dateId];
	if (entry) {
		res.send(entry);
	} else {
		res.send({ entry_found: false });
	}
});

app.get("/get-data", (req, res) => {
	const data = getData();
	res.send(data);
});

app.get("/get-data-2", (req, res) => {
	const data = getData2();
	res.send(data);
});

app.post("/post-data/:id", (req, res) => {
	const dateId = req.params['id'];
	let existingData = getData();
	existingData[dateId] = req.body;
	saveData(existingData);
	res.send(existingData);
});

app.post("/post-data-2/:id", (req, res) => {
	const dateId = req.params['id'];
	let existingData = getData2();
	existingData[dateId] = req.body;
	saveData2(existingData);
	res.send(existingData);
});

if (!devMode) {
	const httpsServer = https.createServer(credentials, app);
	httpsServer.listen(3000, () => {
		console.log('Server listening on 3000');
	});
} else {
	app.listen(PORT, () => {
		console.log(`Server listening on ${PORT}`);
	});
}