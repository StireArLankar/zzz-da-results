const fs = require('fs')
const path = require('path')

const dataset = 27
const dataDir = path.join(__dirname, 'data', String(dataset))
// List all JSON files in the directory
const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json'))

const roundScore = (s) => Math.round(s / 1000) + 'k'

files.forEach((f) => {
  const filePath = path.join(dataDir, f)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const totalScore = data.data.total_score
  const rankPercent = data.data.rank_percent
  const percent = (rankPercent / 100).toFixed(2).replace('.', ',')
  const newName = `${dataset} - ${roundScore(totalScore)} - ${percent}%.json`
  const newPath = path.join(dataDir, newName)
  console.log(`${f} -> ${newName}`)
  fs.renameSync(filePath, newPath)
})

console.log('\nГотово!')
