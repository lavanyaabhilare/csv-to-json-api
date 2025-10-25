function parseCSV(fileContent) {
  const lines = fileContent.trim().split("\n")

  if (lines.length < 2) {
    throw new Error("CSV file must contain header and at least one data row")
  }

  const headers = lines[0].split(",").map((h) => h.trim())
  const records = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())

    if (values.length !== headers.length) {
      throw new Error(`Row ${i + 1} has mismatched column count`)
    }

    const record = {}

    for (let j = 0; j < headers.length; j++) {
      const key = headers[j]
      const value = values[j]
      setNestedProperty(record, key, value)
    }

    records.push(record)
  }

  return records
}

function setNestedProperty(obj, path, value) {
  const keys = path.split(".")
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!current[key]) {
      current[key] = {}
    }
    current = current[key]
  }

  const lastKey = keys[keys.length - 1]
  current[lastKey] = value
}

function getNestedProperty(obj, path) {
  const keys = path.split(".")
  let current = obj

  for (const key of keys) {
    if (current && typeof current === "object") {
      current = current[key]
    } else {
      return undefined
    }
  }

  return current
}

module.exports = {
  parseCSV,
  setNestedProperty,
  getNestedProperty,
}
