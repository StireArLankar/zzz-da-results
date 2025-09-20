const fs = require('fs')

const data = JSON.parse(fs.readFileSync('compiled.json', 'utf8'))
const sorted = Object.entries(data).sort(
  (a, b) => parseInt(a[0]) - parseInt(b[0])
)

console.log('=== 60Percent Dynamics Across Datasets ===')
console.log('Dataset | 60Percent | Data Points')
console.log('--------|-----------|------------')

let values = []
sorted.forEach(([dataset, info]) => {
  const percent = info['60Percent']
  values.push(percent)
  console.log(
    `   ${dataset.padStart(2)}   |   ${percent
      .toString()
      .padStart(5)}   |      ${info.data.length}`
  )
})

console.log('\n=== Statistics ===')
console.log(`Minimum: ${Math.min(...values)}%`)
console.log(`Maximum: ${Math.max(...values)}%`)
console.log(
  `Average: ${(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)}%`
)

console.log('\n=== Trend Analysis ===')
const first5 = values.slice(0, 5)
const last5 = values.slice(-5)
const avgFirst = first5.reduce((a, b) => a + b, 0) / first5.length
const avgLast = last5.reduce((a, b) => a + b, 0) / last5.length

console.log(`Average of first 5 datasets (2-6): ${avgFirst.toFixed(2)}%`)
console.log(`Average of last 5 datasets (13-17): ${avgLast.toFixed(2)}%`)
console.log(
  `Change: ${avgLast > avgFirst ? '+' : ''}${(avgLast - avgFirst).toFixed(2)}%`
)

console.log('\n=== Detailed Dynamics ===')
for (let i = 1; i < values.length; i++) {
  const change = values[i] - values[i - 1]
  const datasetNum = sorted[i][0]
  console.log(
    `Dataset ${sorted[i - 1][0]} → ${datasetNum}: ${
      change > 0 ? '+' : ''
    }${change.toFixed(2)}%`
  )
}
