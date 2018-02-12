const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(cors());

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());

app.get("/question", (req, res) => {
    var question = require("./questions/question1.json");
    res.status(200).json(question);
});

app.post("/answer", (req, res) => {
    const body = req["body"];
    var idAnswer = body["idAnswer"];
    var idQuestion = parseInt(body["idQuestion"]);
    var idNext = idQuestion + 1;
    if (fs.existsSync(__dirname + "/questions/question" + idNext + ".json")) {
        var question = require("./questions/question" + idNext + ".json");
        res.status(200).json(question);
    } else {
        res.status(200).json({ completed: true });
    }
});

app.listen(4000, () => {
    console.log("Server listening in port 4000");
});
