function calculateAgeDistribution(users) {
  const distribution = {
    below_20: 0,
    "20_to_40": 0,
    "40_to_60": 0,
    above_60: 0,
  }

  users.forEach((user) => {
    const age = user.age

    if (age < 20) {
      distribution.below_20++
    } else if (age >= 20 && age < 40) {
      distribution["20_to_40"]++
    } else if (age >= 40 && age < 60) {
      distribution["40_to_60"]++
    } else {
      distribution.above_60++
    }
  })

  const total = users.length
  const percentages = {
    below_20: ((distribution.below_20 / total) * 100).toFixed(2),
    "20_to_40": ((distribution["20_to_40"] / total) * 100).toFixed(2),
    "40_to_60": ((distribution["40_to_60"] / total) * 100).toFixed(2),
    above_60: ((distribution.above_60 / total) * 100).toFixed(2),
  }

  return {
    counts: distribution,
    percentages: percentages,
  }
}

function printAgeDistributionReport(distribution) {
  console.log("\n========== AGE DISTRIBUTION REPORT ==========")
  console.log("Age-Group\t\t% Distribution")
  console.log("< 20\t\t\t" + distribution.percentages.below_20)
  console.log("20 to 40\t\t" + distribution.percentages["20_to_40"])
  console.log("40 to 60\t\t" + distribution.percentages["40_to_60"])
  console.log("> 60\t\t\t" + distribution.percentages.above_60)
  console.log("============================================\n")
}

module.exports = {
  calculateAgeDistribution,
  printAgeDistributionReport,
}
