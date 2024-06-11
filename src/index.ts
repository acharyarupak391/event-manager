import express from 'express'
import { config } from 'dotenv'
import { corsOptions } from './utils/cors'
import cors from 'cors'
import { addEvent, deleteEvent, getEvents, getHolidays, updateEvent } from './controller'
import { openDb } from './database'
import { Database } from 'sqlite'

config()

const app = express()

app.use(express.json())

app.use(cors(corsOptions))

app.get('/', (_, res) => {
  res.send('Hello World')
});

(async function () {
  let db: Database
  try {
    db = await openDb()
  } catch (error) {
    console.error(error)
    throw new Error('Error opening database')
  }

  app.post('/add-event', async (req, res) => {
    addEvent(req, res, db)
  })

  app.get('/get-events/:email', async (req, res) => {
    getEvents(req, res, db)
  })

  app.put('/update-event', async (req, res) => {
    updateEvent(req, res, db)
  })

  app.delete('/delete-event/:email', async (req, res) => {
    deleteEvent(req, res, db)
  })

})()

app.get('/holidays', async (req, res) => {
  getHolidays(req, res)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})