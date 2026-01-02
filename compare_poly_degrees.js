// Сравнение точности полиномов разных степеней для DS 26

// Данные из compiled.json для DS 26
const data = [
  { score: 101673, percent: 4.69 },
  { score: 101638, percent: 4.7 },
  { score: 110362, percent: 3.17 },
  { score: 125172, percent: 1.62 },
  { score: 48079, percent: 49.11 },
  { score: 50077, percent: 45.73 },
  { score: 56833, percent: 35.99 },
  { score: 61283, percent: 31.07 },
  { score: 64327, percent: 27.79 },
  { score: 66950, percent: 24.9 },
  { score: 75489, percent: 16.57 },
  { score: 74811, percent: 17.15 },
  { score: 79077, percent: 13.84 },
  { score: 82189, percent: 11.84 },
  { score: 82516, percent: 11.66 },
  { score: 85525, percent: 10.03 },
  { score: 90812, percent: 7.76 },
]

function gaussianElimination(A, b) {
  const n = A.length
  for (let i = 0; i < n; i++) {
    // Find pivot
    let maxRow = i
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k
      }
    }
    ;[A[i], A[maxRow]] = [A[maxRow], A[i]]
    ;[b[i], b[maxRow]] = [b[maxRow], b[i]]

    // Make all rows below this one 0 in current column
    for (let k = i + 1; k < n; k++) {
      const factor = A[k][i] / A[i][i]
      b[k] -= factor * b[i]
      for (let j = i; j < n; j++) {
        A[k][j] -= factor * A[i][j]
      }
    }
  }

  // Back substitution
  const x = new Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    x[i] = b[i]
    for (let j = i + 1; j < n; j++) {
      x[i] -= A[i][j] * x[j]
    }
    x[i] /= A[i][i]
  }
  return x
}

function polynomialRegression(points, degree) {
  const n = degree + 1
  const A = []
  const b = []

  for (let i = 0; i < n; i++) {
    A[i] = []
    for (let j = 0; j < n; j++) {
      let sum = 0
      for (const point of points) {
        sum += Math.pow(point.score, i + j)
      }
      A[i][j] = sum
    }
    let sum = 0
    for (const point of points) {
      sum += point.percent * Math.pow(point.score, i)
    }
    b[i] = sum
  }

  return gaussianElimination(A, b)
}

function predict(coeffs, x) {
  let result = 0
  for (let i = 0; i < coeffs.length; i++) {
    result += coeffs[i] * Math.pow(x, i)
  }
  return result
}

function calculateError(coeffs, points) {
  let totalError = 0
  let maxError = 0
  for (const point of points) {
    const predicted = predict(coeffs, point.score)
    const error = Math.abs(predicted - point.percent)
    totalError += error
    maxError = Math.max(maxError, error)
  }
  return {
    avg: totalError / points.length,
    max: maxError,
  }
}

console.log(`\nСравнение точности полиномов для DS 26 (${data.length} точек)\n`)
console.log('='.repeat(80))

for (let degree = 3; degree <= 7; degree++) {
  const coeffs = polynomialRegression(data, degree)
  const error = calculateError(coeffs, data)
  const accuracy =
    100 -
    (error.avg / data.reduce((sum, p) => sum + p.percent, 0) / data.length) *
      100

  console.log(`\nСтепень ${degree}:`)
  console.log('─'.repeat(80))
  console.log('Коэффициенты:')
  for (let i = 0; i < coeffs.length; i++) {
    const power = i === 0 ? 'x^0 (const)' : `x^${i}`
    console.log(`  a${i}: ${coeffs[i].toExponential(4)} (${power})`)
  }
  console.log(`\nОшибки:`)
  console.log(`  Средняя ошибка: ${error.avg.toFixed(4)}%`)
  console.log(`  Макс. ошибка: ${error.max.toFixed(4)}%`)
  console.log(`  Точность: ${accuracy.toFixed(2)}%`)

  // Prediction for score 60000
  const prediction60 = predict(coeffs, 60000)
  console.log(`  60Percent (score=60000): ${prediction60.toFixed(2)}%`)

  // Show points with largest errors
  const errors = data
    .map((p) => ({
      score: p.score,
      real: p.percent,
      predicted: predict(coeffs, p.score),
      error: Math.abs(predict(coeffs, p.score) - p.percent),
    }))
    .sort((a, b) => b.error - a.error)

  console.log(`\n  Точки с наибольшей ошибкой:`)
  errors.slice(0, 3).forEach((e) => {
    console.log(
      `    ${e.score}: ${e.real.toFixed(2)}% vs ${e.predicted.toFixed(
        2
      )}% (ошибка: ${e.error.toFixed(4)}%)`
    )
  })
}

console.log('\n' + '='.repeat(80))
