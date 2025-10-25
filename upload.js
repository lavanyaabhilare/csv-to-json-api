const express = require("express")
const fs = require("fs")
const path = require("path")
const pool = require("../db")
const { parseCSV } = require("../csvParser")
const { transformRecord } = require("../dataTransformer")
const { calculateAgeDistribution, printAgeDistributionReport } = require("../ageDistribution")

module.exports = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    if (path.extname(req.file.originalname).toLowerCase() !== ".csv") {
      return res.status(400).json({ error: "File must be a CSV" })
    }

    const fileContent = fs.readFileSync(req.file.path, "utf-8")
    const records = parseCSV(fileContent)
    console.log("[v0] Parsed records:", records.length)

    const transformedRecords = records.map((record) => transformRecord(record))
    console.log("[v0] Transformed records:", transformedRecords.length)
    console.log("[v0] First record:", transformedRecords[0])

    const insertQuery = `
      INSERT INTO public.users (name, age, address, additional_info)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `

    const insertedIds = []

    for (const record of transformedRecords) {
      console.log("[v0] Inserting record:", record)
      const result = await pool.query(insertQuery, [record.name, record.age, record.address, record.additional_info])
      console.log("[v0] Insert result:", result.rows[0])
      insertedIds.push(result.rows[0].id)
    }

    console.log("[v0] All records inserted. Total:", insertedIds.length)

    const allUsersQuery = "SELECT age FROM public.users;"
    const allUsersResult = await pool.query(allUsersQuery)
    const allUsers = allUsersResult.rows
    console.log("[v0] All users from DB:", allUsers.length)

    const distribution = calculateAgeDistribution(allUsers)
    printAgeDistributionReport(distribution)

    fs.unlinkSync(req.file.path)

    res.status(200).json({
      message: "CSV uploaded and processed successfully",
      recordsInserted: insertedIds.length,
      insertedIds: insertedIds,
      ageDistribution: distribution,
    })
  } catch (error) {
    console.error("[v0] ERROR:", error)
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    console.error("Upload error:", error.message)
    res.status(500).json({ error: error.message })
  }
}
