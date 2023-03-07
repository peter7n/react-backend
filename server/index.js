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
const privateKey = fs.readFileSync('/etc/pki/tls/private/localhost.key', 'utf8');
const certificate = fs.readFileSync('/etc/pki/tls/certs/localhost.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

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
app.get("/get-data", (req, res) => {
	const data = getData();
	res.send(data);
	// res.json({ message: "Hello from server!" });
});

app.post("/post-data/:id", (req, res) => {
	const accountId = req.params['id'];
	let existingData = getData();
	// let newData = [...req.body, ...existingData];
	existingData[accountId] = req.body;
	saveData(existingData);
	res.send(existingData);
});

// const httpServer = http.createServer(app);
// httpServer.listen(PORT, () => {
// 	console.log(`Server listening on ${PORT}`);
// });

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(3000, () => {
	console.log('Server listening on 3000');
});

// app.listen(PORT, () => {
// 	console.log(`Server listening on ${PORT}`);
// });