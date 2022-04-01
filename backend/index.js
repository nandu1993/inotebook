const connectToMongo = require("./db");
const express = require('express')
var cors = require('cors')

connectToMongo();
var app = express()
const port = 5000

//used for receive data in body
app.use(cors())
app.use(express.json())

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

//routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/notes",require("./routes/notes"))

app.listen(port, () => {
    console.log(`iNotebook app listening on port ${port}`)
})