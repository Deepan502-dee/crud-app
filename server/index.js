const express = require("express");
const cors = require("cors");
const users = require("./sample.json");
const fs = require("fs");

const app = express();
const port = 8800;

// Enable CORS
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'PATCH']
}));

// Display All Users
app.get("/users", (req, res) => {
    res.json(users);
});

// Delete User
app.delete("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let filteredUser = users.filter((users) => users.id !== id);
    fs.writeFile('./sample.json', JSON.stringify(filteredUser), (err, data) => {
        return res.json(filteredUser);
    })
});

app.use(express.json());

app.patch("/users/:id", (req, res) => {
    let id = Number(req.params.id);
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({ message: "All fields required" }); // Add return here
    }
    let index = users.findIndex((user) => user.id == id);
    users.splice(index, 1, { ...req.body });
    fs.writeFile('./sample.json', JSON.stringify(users), (err, data) => {
        return res.json({ message: "User details Updated successfully" });
    })
});

app.post("/users", (req, res) => {
    let { name, age, city } = req.body;
    if (!name || !age || !city) {
        return res.status(400).send({ message: "All fields required" }); // Add return here
    }
    let id = Date.now();
    users.push({ id, name, age, city })
    fs.writeFile('./sample.json', JSON.stringify(users), (err, data) => {
        return res.json({ message: "User details added successfully" });
    })
});

app.listen(port, (err) => {
    if (err) {
        console.error("Error starting the server:", err);
    } else {
        console.log(`App is running on port ${port}`);
    }
});
