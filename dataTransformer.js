const { getNestedProperty } = require("./csvParser")

function transformRecord(record) {
  const firstName = getNestedProperty(record, "name.firstName")
  const lastName = getNestedProperty(record, "name.lastName")
  const age = getNestedProperty(record, "age")

  if (!firstName || !lastName || !age) {
    throw new Error("Missing mandatory fields: name.firstName, name.lastName, or age")
  }

  const fullName = `${firstName} ${lastName}`
  const ageNum = Number.parseInt(age, 10)

  if (isNaN(ageNum)) {
    throw new Error("Age must be a valid number")
  }

  const address = record.address || null
  const additionalInfo = extractAdditionalInfo(record)

  return {
    name: fullName,
    age: ageNum,
    address: address ? JSON.stringify(address) : null,
    additional_info: Object.keys(additionalInfo).length > 0 ? JSON.stringify(additionalInfo) : null,
  }
}

function extractAdditionalInfo(record) {
  const excluded = ["name", "age", "address"]
  const additional = {}

  function traverse(obj, prefix = "") {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const fullKey = prefix ? `${prefix}.${key}` : key

        if (excluded.includes(key) && !prefix) {
          continue
        }

        if (typeof obj[key] === "object" && obj[key] !== null) {
          traverse(obj[key], fullKey)
        } else {
          additional[fullKey] = obj[key]
        }
      }
    }
  }

  traverse(record)
  return additional
}

module.exports = {
  transformRecord,
}
