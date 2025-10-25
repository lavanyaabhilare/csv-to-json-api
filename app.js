const express = require("express")
const multer = require("multer")
const path = require("path")
const uploadRoutes = require("./routes/upload")

const app = express()

const uploadDir = process.env.CSV_UPLOAD_PATH || "./uploads"
if (!require("fs").existsSync(uploadDir)) {
  require("fs").mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === ".csv") {
      cb(null, true)
    } else {
      cb(new Error("Only CSV files are allowed"))
    }
  },
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/api/upload", upload.single("file"), uploadRoutes)

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message || "Internal server error" })
})

module.exports = app
