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

  // Return coefficients in descending order of degree
  const result = { a: 0, b: 0, c: 0, d: 0 }

  if (degree >= 3) result.a = coefficients[3]
  if (degree >= 2) result.b = coefficients[Math.min(2, degree)]
  if (degree >= 1) result.c = coefficients[Math.min(1, degree)]
  result.d = coefficients[0]

  return result
}

// Function for 3rd degree polynomial regression (or lower with insufficient points)
function polynomialRegression3(points) {
  const maxDegree = Math.min(3, points.length - 1)
  return polynomialRegression(points, maxDegree)
}

// Function to format coefficients into formula string with high precision
function formatPolynomial(coeffs) {
  const a = coeffs.a
  const b = coeffs.b
  const c = coeffs.c
  const d = coeffs.d

  // Format with high precision (12 decimal places)
  const formatCoeff = (coeff) => {
    if (Math.abs(coeff) < 1e-12) return '0.000000000000'
    return coeff.toFixed(12)
  }

  let formula = `${formatCoeff(a)}x^3`

  if (b >= 0) {
    formula += ` + ${formatCoeff(b)}x^2`
  } else {
    formula += ` - ${formatCoeff(Math.abs(b))}x^2`
  }

  if (c >= 0) {
    formula += ` + ${formatCoeff(c)}x`
  } else {
    formula += ` - ${formatCoeff(Math.abs(c))}x`
  }

  if (d >= 0) {
    formula += ` + ${formatCoeff(d)}`
  } else {
    formula += ` - ${formatCoeff(Math.abs(d))}`
  }

  return formula
}

// Function to calculate polynomial value at point x
function evaluatePolynomial(coeffs, x) {
  return coeffs.a * x * x * x + coeffs.b * x * x + coeffs.c * x + coeffs.d
}

// Function to extract dataset number from filename
function extractDatasetNumber(filename) {
  const match = filename.match(/^(\d+)\s*-/)
  return match ? parseInt(match[1]) : null
}

// Main processing function
async function processData() {
  const dataDir = path.join(__dirname, 'data')
  const files = fs.readdirSync(dataDir).filter((file) => file.endsWith('.json'))

  const datasets = {}

  // Process each file
  for (const file of files) {
    const filePath = path.join(dataDir, file)
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

  // Process each dataset
  const result = {}

  for (const [datasetNumber, points] of Object.entries(datasets)) {
    if (points.length < 2) {
      console.warn(
        `Insufficient data points for dataset ${datasetNumber}: ${points.length}`
      )
      continue
    }

    // Perform polynomial regression
    const coefficients = polynomialRegression3(points)

    // Format formula
    const line = formatPolynomial(coefficients)

    // Calculate percentage for 60k points
    const percent60k = evaluatePolynomial(coefficients, 60000)

    result[datasetNumber] = {
      line: line,
      coefficients: {
        a: coefficients.a,
        b: coefficients.b,
        c: coefficients.c,
        d: coefficients.d,
      },
      '60Percent': Math.round(percent60k * 100) / 100, // Round to 2 decimal places
      data: points.map((p) => ({
        score: p.score,
        percent: p.percent,
        predicted_percent:
          Math.round(evaluatePolynomial(coefficients, p.score) * 100) / 100,
      })),
    }

    console.log(
      `Processed dataset ${datasetNumber}: ${
        points.length
      } points (polynomial degree: ${Math.min(3, points.length - 1)})`
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
