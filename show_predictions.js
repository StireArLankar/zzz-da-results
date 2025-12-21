const fs = require('fs')

function showPredictions() {
  try {
    const compiledData = JSON.parse(fs.readFileSync('compiled.json', 'utf8'))

    console.log('=== Predictions vs Real Values ===\n')

    for (const [dataset, data] of Object.entries(compiledData)) {
      console.log(`Dataset ${dataset}:`)
      console.log(`Formula: ${data.line}`)
      console.log(`60Percent: ${data['60Percent']}%`)
      console.log('Data points:')

      data.data.forEach((point) => {
        const diff = Math.abs(point.percent - point.predicted_percent)
        const status = diff < 0.1 ? '✓' : diff < 0.5 ? '~' : '✗'
        console.log(
          `  Score: ${point.score}, Real: ${
            point.percent
          }%, Predicted: ${point.predicted_percent.toFixed(
            2
          )}%, Diff: ${diff.toFixed(3)}% ${status}`
        )
      })
      console.log('')
    }

    // Calculate overall accuracy
    let totalPoints = 0
    let totalError = 0
    let maxError = 0

    for (const [dataset, data] of Object.entries(compiledData)) {
      data.data.forEach((point) => {
        const error = Math.abs(point.percent - point.predicted_percent)
        totalError += error
        totalPoints++
        if (error > maxError) maxError = error
      })
    }

    const avgError = totalError / totalPoints
    console.log('=== Overall Accuracy ===')
    console.log(`Total data points: ${totalPoints}`)
    console.log(`Average error: ${avgError.toFixed(3)}%`)
    console.log(`Maximum error: ${maxError.toFixed(3)}%`)
    console.log(`Accuracy: ${((1 - avgError / 50) * 100).toFixed(1)}%`)
  } catch (error) {
    console.error('Error reading compiled.json:', error.message)
    process.exit(1)
  }
}

showPredictions()
