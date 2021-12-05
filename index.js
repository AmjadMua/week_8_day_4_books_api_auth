const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const books = require("./routes/books")
const users = require("./routes/users")

const app = express()
app.use(bodyParser.json())
app.use(cors())

mongoose
  .connect(`mongodb://localhost:27017/testDB`)
  .then(() => console.log("connected to database"))
  .catch(error => console.log("ERROR", error))

app.use("/api/books", books)
app.use("/api/users", users)

app.listen(5000, () => {
  console.log("port is listening now!", 5000)
})

//                    for react
//              http://localhost:5000/api/books
//              http://localhost:5000/api/users
