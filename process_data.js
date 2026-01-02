const fs = require('fs')
const path = require('path')

// Function to solve linear equation system using Gaussian elimination
function solveLinearSystem(matrix, vector) {
  const n = matrix.length

  // Forward elimination of Gaussian method
  for (let i = 0; i < n; i++) {
    // Search for pivot element
    let maxRow = i
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(matrix[k][i]) > Math.abs(matrix[maxRow][i])) {
        maxRow = k
      }
    }

    // Row swapping
    ;[matrix[i], matrix[maxRow]] = [matrix[maxRow], matrix[i]]
    ;[vector[i], vector[maxRow]] = [vector[maxRow], vector[i]]

    // Variable elimination
    for (let k = i + 1; k < n; k++) {
      const factor = matrix[k][i] / matrix[i][i]
      for (let j = i; j < n; j++) {
        matrix[k][j] -= factor * matrix[i][j]
      }
      vector[k] -= factor * vector[i]
    }
  }

  // Back substitution
  const solution = new Array(n)
  for (let i = n - 1; i >= 0; i--) {
    solution[i] = vector[i]
    for (let j = i + 1; j < n; j++) {
      solution[i] -= matrix[i][j] * solution[j]
    }
    solution[i] /= matrix[i][i]
  }

  return solution
}

// Function for polynomial regression of different degrees
function polynomialRegression(points, degree) {
  const n = points.length

  if (degree >= n) {
    degree = n - 1
  }

  // Calculate sums of x powers
  const maxPower = degree * 2
  const sumX = new Array(maxPower + 1).fill(0)
  const sumXY = new Array(degree + 1).fill(0)

  for (const point of points) {
    const x = point.score
    const y = point.percent

    let xPower = 1
    for (let i = 0; i <= maxPower; i++) {
      sumX[i] += xPower
      if (i <= degree) {
        sumXY[i] += xPower * y
      }
      xPower *= x
    }
  }

  // Create coefficient matrix
  const matrix = []
  for (let i = 0; i <= degree; i++) {
    const row = []
    for (let j = 0; j <= degree; j++) {
      row.push(sumX[i + j])
    }
    matrix.push(row)
  }

  // Solve equation system
  const coefficients = solveLinearSystem(matrix, sumXY)

  // Return coefficients as array [a0, a1, a2, ..., an]
  return coefficients
}

// Function to calculate adaptive polynomial degree based on number of points
function calculateAdaptiveDegree(numPoints) {
  const formulaDegree = Math.floor(numPoints / 2)
  const minDegree = 3
  const maxDegree = 7

  // Maximum degree is limited by points-1 (need at least n+1 points for degree n)
  const feasibleMaxDegree = Math.min(maxDegree, numPoints - 1)

  // Only use minDegree if we have enough points
  const effectiveMinDegree = Math.min(minDegree, feasibleMaxDegree)

  const finalDegree = Math.max(
    effectiveMinDegree,
    Math.min(formulaDegree, feasibleMaxDegree)
  )
  return finalDegree
}

// Function to format coefficients into formula string with high precision
function formatPolynomial(coeffs, degree) {
  // Format with high precision (12 decimal places)
  const formatCoeff = (coeff) => {
    if (coeff === undefined || coeff === null || Math.abs(coeff) < 1e-12)
      return '0.000000000000'
    return coeff.toFixed(12)
  }

  let formula = ''

  // Format from highest degree to constant term
  for (let i = degree; i >= 0; i--) {
    const coeff = coeffs[i]
    const formatted = formatCoeff(coeff)

    if (i === degree) {
      // First term
      if (i === 0) {
        formula = formatted
      } else if (i === 1) {
        formula = `${formatted}x`
      } else {
        formula = `${formatted}x^${i}`
      }
    } else {
      // Subsequent terms
      if (i === 0) {
        if (coeff >= 0) {
          formula += ` + ${formatted}`
        } else {
          formula += ` - ${formatCoeff(Math.abs(coeff))}`
        }
      } else if (i === 1) {
        if (coeff >= 0) {
          formula += ` + ${formatted}x`
        } else {
          formula += ` - ${formatCoeff(Math.abs(coeff))}x`
        }
      } else {
        if (coeff >= 0) {
          formula += ` + ${formatted}x^${i}`
        } else {
          formula += ` - ${formatCoeff(Math.abs(coeff))}x^${i}`
        }
      }
    }
  }

  return formula
}

// Function to calculate polynomial value at point x
function evaluatePolynomial(coeffs, x) {
  let result = 0
  for (let i = 0; i < coeffs.length; i++) {
    result += coeffs[i] * Math.pow(x, i)
  }
  return result
}

// Function to extract dataset number from filename
function extractDatasetNumber(filename) {
  const match = filename.match(/^(\d+)\s*-/)
  return match ? parseInt(match[1]) : null
}

// Main processing function
async function processData() {
  const dataDir = path.join(__dirname, 'data')
  const subdirs = fs.readdirSync(dataDir).filter((item) => {
    const itemPath = path.join(dataDir, item)
    return fs.statSync(itemPath).isDirectory() && /^\d+$/.test(item)
  })

  const datasets = {}

  // Process each subdirectory
  for (const subdir of subdirs) {
    const subdirPath = path.join(dataDir, subdir)
    const files = fs
      .readdirSync(subdirPath)
      .filter((file) => file.endsWith('.json'))

    for (const file of files) {
      const filePath = path.join(subdirPath, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const jsonData = JSON.parse(fileContent)

      const datasetNumber = extractDatasetNumber(file)
      if (!datasetNumber) {
        console.warn(`Failed to extract dataset number from file: ${file}`)
        continue
      }

      // Check zone_id correspondence
      const expectedZoneId = datasetNumber + 69000
      if (jsonData.data.zone_id !== expectedZoneId) {
        console.warn(
          `Zone_id mismatch in file ${file}: expected ${expectedZoneId}, got ${jsonData.data.zone_id}`
        )
        continue
      }

      // Extract data
      const score = jsonData.data.total_score
      const percent = jsonData.data.rank_percent / 100 // Convert from percent * 100 to regular percent

      // Group by dataset number
      if (!datasets[datasetNumber]) {
        datasets[datasetNumber] = []
      }

      datasets[datasetNumber].push({ score, percent })
    }
  }

  // Process each dataset
  const result = {}

  for (const [datasetNumber, points] of Object.entries(datasets)) {
    if (points.length < 2) {
      console.warn(
        `Insufficient data points for dataset ${datasetNumber}: ${points.length}`
      )
      continue
    }

    // Calculate adaptive polynomial degree
    const degree = calculateAdaptiveDegree(points.length)

    // Perform polynomial regression with adaptive degree
    const coefficients = polynomialRegression(points, degree)

    // Format formula
    const line = formatPolynomial(coefficients, degree)

    // Calculate percentage for 60k points
    const percent60k = evaluatePolynomial(coefficients, 60000)

    result[datasetNumber] = {
      line: line,
      coefficients: coefficients, // Array of coefficients [d, c, b, a, ...]
      '60Percent': Math.round(percent60k * 100) / 100, // Round to 2 decimal places
      data: points.map((p) => ({
        score: p.score,
        percent: p.percent,
        predicted_percent:
          Math.round(evaluatePolynomial(coefficients, p.score) * 100) / 100,
      })),
    }

    console.log(
      `Processed dataset ${datasetNumber}: ${points.length} points (polynomial degree: ${degree})`
    )
  }

  // Save result
  const outputPath = path.join(__dirname, 'compiled.json')
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8')

  console.log(`Result saved to ${outputPath}`)
  console.log(`Processed datasets: ${Object.keys(result).length}`)
}

// Run processing
processData().catch(console.error)
