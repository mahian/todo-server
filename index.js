const express = require("express");
const PORT = 5000;
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://mahian:${process.env.MONGO_PASS}@cluster0.aiix3w5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const tasksCollection = client.db("todo-app").collection("tasks");

async function run() {
    try {
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await tasksCollection.insertOne(task);
            res.send(result);
        })

        app.get('/tasks', async (req, res) => {
            const query = {}
            const tasks = await tasksCollection.find(query).toArray();
            res.send(tasks);
        })

        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const task = await tasksCollection.findOne(query);
            res.send(task);
        })

        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const task = req.body;
            const option = {upsert: true};
            const updatedTask = {
                $set: {
                    task: task.task,
                    desc: task.desc,
                }
            }
            const result = await tasksCollection.updateOne(filter, updatedTask, option);
            res.send(result);
        })

        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const task = await tasksCollection.deleteOne(query);
            res.send(task);
        })
    }
    finally { }
}
run().catch(err => console.log(err))

app.get("/", (req, res) => {
    res.send("This is home page.");
});


app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});