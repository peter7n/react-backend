let devMode = false;
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
const privateKey = '';
const certificate = '';
const credentials= {};
if (!devMode) {
	privateKey = fs.readFileSync('/etc/pki/tls/private/masterptn.org.key', 'utf8');
	certificate = fs.readFileSync('/etc/pki/tls/certs/masterptn.org.crt', 'utf8');
	credentials = {key: privateKey, cert: certificate};
}


const dataPath = '../data/data.json';
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

app.get("/get-data", (req, res) => {
	const data = getData();
	res.send(data);
	// res.json({ message: "Hello from server!" });
});

app.post("/post-data/:id", (req, res) => {
	const dateId = req.params['id'];
	let existingData = getData();
	// let newData = [...req.body, ...existingData];
	existingData[dateId] = req.body;
	saveData(existingData);
	res.send(existingData);
});

// const httpServer = http.createServer(app);
// httpServer.listen(PORT, () => {
// 	console.log(`Server listening on ${PORT}`);
// });

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