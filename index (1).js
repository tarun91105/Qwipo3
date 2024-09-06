const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const jsonMiddleware = express.json()
app.use(jsonMiddleware)
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
let db = null
const dbPath = path.join(__dirname, 'Tasks.db')

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(8080, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.post('/', async (request, response) => {
  const details = request.body
  console.log(details.first)
  const {first, last, phone, email, address} = details
  const query = `
   INSERT INTO 
        profiles (firstname, lastname,phone,address,email) 
      VALUES 
        (
          '${first}', 
          '${last}',
          '${phone}', 
          '${address}',
          '${email}'
        )`

  const dbresponse = await db.run(query)
  console.log('called')
})

app.get('/profiles', async (request, response) => {
  const query1 = `SELECT * FROM profiles`
  const res = await db.all(query1)
  console.log(res)
  response.send(res)
})
