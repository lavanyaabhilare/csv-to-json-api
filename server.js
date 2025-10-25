require("dotenv").config()
const app = require("./app")
const pool = require("./db")

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    const result = await pool.query("SELECT NOW()")
    console.log("Database connected:", result.rows[0])

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to connect to database:", error.message)
    process.exit(1)
  }
}

startServer()
