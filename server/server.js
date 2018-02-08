const express = require("express");
const app = express();
const question = require("../questions.json");
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());

app.get("/question", (req, res) => {
    res.status(200).json(question);
});

app.post("/answer", (req, res) => {
    const body = req["body"];
    var idAnswer = body["idAnswer"];
    var result;
    if (idAnswer == 3) {
        result = "OK";
    } else {
        result = "KO";
    }
    res.status(200).json(question);
});

app.listen(4000, () => {
    console.log("Server listening in port 4000");
});
