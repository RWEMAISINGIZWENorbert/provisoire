import app from './app'
import { connectDb } from './config/db'

const PORT = Number(process.env.PORT ?? 5000)

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })