const fs = require('fs')

// Function to calculate polynomial value
function evaluatePolynomial(coeffs, x) {
  return (
    coeffs.a * Math.pow(x, 3) +
    coeffs.b * Math.pow(x, 2) +
    coeffs.c * x +
    coeffs.d
  )
}

const data = JSON.parse(fs.readFileSync('compiled.json', 'utf8'))

console.log('=== Validation of All Datasets Accuracy ===')
console.log('Dataset | Average Error | Max. Error | Data Points')
console.log('--------|---------------|------------|------------')

let totalDatasets = 0
let totalAvgError = 0
let totalMaxError = 0

for (const [datasetNum, dataset] of Object.entries(data)) {
  const coeffs = dataset.coefficients
  const points = dataset.data

  let totalError = 0
  let maxError = 0

  points.forEach((point) => {
    const predicted = evaluatePolynomial(coeffs, point.score)
    const error = Math.abs(predicted - point.percent)
    totalError += error
    maxError = Math.max(maxError, error)
  })

  const avgError = totalError / points.length

  console.log(
    `${datasetNum.padStart(7)} | ${avgError.toFixed(6)}% | ${maxError.toFixed(
      6
    )}% | ${points.length}`
  )

  totalDatasets++
  totalAvgError += avgError
  totalMaxError = Math.max(totalMaxError, maxError)
}

console.log('\n=== Overall Statistics ===')
console.log(`Total datasets: ${totalDatasets}`)
console.log(
  `Average error across all datasets: ${(totalAvgError / totalDatasets).toFixed(
    6
  )}%`
)
console.log(`Maximum error among all datasets: ${totalMaxError.toFixed(6)}%`)

if (totalMaxError < 1.0) {
  console.log('\n✅ All datasets calculated with high accuracy!')
} else {
  console.log('\n⚠️  Some datasets have increased error')
}
