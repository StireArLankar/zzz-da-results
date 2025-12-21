# Dataset Data Processing System

## 📂 Data Structure

In the `data` folder there are subdirectories containing `json` files with names in the format:

```
{dataset number} - {rounded score} - {top% for this score}.json
```

Each subdirectory is named with the dataset number and contains the corresponding JSON files.

## 🎯 Automatic Processing

### Running Data Processing

```bash
node process_data.js
```

The script automatically:

1. Processes all JSON files in the subdirectories within the `data` folder
2. Creates/updates the `compiled.json` file
3. Performs polynomial approximation
4. Validates data (`zone_id` check)

### Result in `compiled.json`

```json
{
  "{dataset number}": {
    "line": "{approximation formula in format ax^3 + bx^2 + cx + d}",
    "coefficients": {
      "a": high_precision_number,
      "b": high_precision_number,
      "c": high_precision_number,
      "d": high_precision_number
    },
    "60Percent": {percentage for score 60000},
    "data": [
      {
        "score": number,
        "percent": number,
        "predicted_percent": number
      }
    ]
  }
}
```

## 📊 Dynamics Analysis

### Running Analysis

```bash
node analyze.js
```

Creates detailed analysis of `60Percent` dynamics across all datasets.

### Creating Report

The `analyze.js` script outputs results to console. To create a detailed `analytics_report.md` report, it requires:

- Run analysis: `node analyze.js`
- Analyze outputs with AI assistant
- Create/update `analytics_report.md` with:
  - Summary table for all datasets
  - Statistics and trends
  - Development phases of data
  - Key events and conclusions

### Visualizing Data

The `graph.svg` file contains a visual representation of `60Percent` dynamics:

- **Interactive SVG chart** showing all datasets (2-25)
- **Color-coded phases** for easy identification of development stages
- **Key events highlighted** (peaks, drops, recoveries)
- **V-shaped recovery patterns** with annotations
- **Statistical information** (min, max, average, range)
- **Phase legend** explaining different periods

To view the graph:

- Open `graph.svg` in any modern browser
- View directly in VS Code with SVG preview extension
- Embed in markdown documents or reports

### Showing Predictions

```bash
node show_predictions.js
```

Shows detailed comparison of real and predicted values for all datasets:

- **For each dataset:** Displays formula, 60Percent value, and data points table
- **Data points format:** `Score: {score}, Real: {percent}%, Predicted: {predicted_percent}%, Diff: {error}% {status}`
- **Status indicators:** ✓ (excellent <0.1%), ~ (good <0.5%), ✗ (needs attention ≥0.5%)
- **Overall accuracy summary:** Total points, average error, maximum error, accuracy percentage
- **Quality assessment:** Helps identify datasets with poor approximation fit

**Current accuracy:** 99.5% average (115 data points, max error 1.59%)

## 🔄 Workflow Sequence

### Complete Workflow (when adding new dataset):

1. **Prepare data:** Place and rename JSON files in `data/{number}/` folders
2. **Process data:** `node process_data.js` → generates `compiled.json`
3. **Analyze trends:** `node analyze.js` → shows dynamics in console
4. **Check accuracy:** `node show_predictions.js` → validates approximation quality
5. **Update report:** Edit `analytics_report.md` with new insights
6. **Update visualization:** Create/update `graph.svg` with new data
7. **Update docs:** Refresh `instructions.md` statistics and procedures

### Quick Checks (existing data):

- **View current stats:** `node analyze.js`
- **Check prediction quality:** `node show_predictions.js`
- **View visualization:** Open `graph.svg` in browser

## ⚙️ Technical Details

### Data Extraction from JSON Files

- `{x}.data.[y].score` ← `data.total_score`
- `{x}.data.[y].percent` ← `data.rank_percent / 100` (conversion from percent×100)
- `{dataset number}` ← extracted from filename
- Validation: `data.zone_id = dataset_number + 69000`

### Polynomial Approximation

- **Polynomial degree:** Adaptive (1-3) depending on number of points
- **Minimum points:** 2 (for linear approximation)
- **Optimal:** 4+ points (for cubic approximation)
- **Method:** Custom implementation of least squares method + Gaussian elimination
- **Coefficient precision:** Full (no rounding, up to 12 decimal places)
- **60Percent precision:** 2 decimal places

### Formula Format

```
ax^3 + bx^2 + cx + d
```

where coefficients are automatically formatted with correct signs.

## 🔄 Updates with New Data

### When adding new dataset:

1. **Place new JSON files** in `data/{dataset_number}/` folder
2. **Rename files** according to format: `{dataset} - {score}k - {percent}%.json`
   - Extract `total_score` and `rank_percent/100` from each JSON file
   - Round score to nearest thousand (k)
   - Format: `21 - 128k - 1,58%.json`
3. **Run processing:** `node process_data.js`
4. **Run analysis:** `node analyze.js`
5. **Update report:** Update `analytics_report.md` with new data and trends
6. **Update visualization:** Create/update `graph.svg` with new data points
7. **Update documentation:** Update `instructions.md` statistics and procedures
8. **Validate accuracy:** Run `node show_predictions.js` to check approximation quality

### Automatic Processing:

- ✅ New datasets automatically detected
- ✅ Existing data recalculated
- ✅ Data validation performed automatically
- ✅ **High precision coefficients preserved for all datasets**
- ✅ Error report output to console

### Manual Steps Required:

- 📝 **File renaming** according to naming convention
- 📊 **Report updates** with trend analysis and conclusions
- 📈 **Visualization creation** for data presentation
- 📚 **Documentation updates** to reflect current state

## 📈 Current Statistics (last update: December 13, 2025)

- **Processed datasets:** 24 (datasets 2-25, dataset 1 excluded)
- **Average 60Percent value:** 34.34%
- **Value range:** 19.62% - 45.67%
- **Overall trend:** Cyclical with oscillation and mean reversion pattern (+13.19% growth from first 5 to last 5)
- **Approximation accuracy:** Average error 0.244%, maximum 1.59%, overall accuracy 99.5%
- **Data quality:** From 2 to 8 points per dataset, total 115 points
- **Latest pattern:** Oscillating waves with corrections (datasets 18-25: 42.60% → 30.36% → 42.17% → 38.72% → 35.11% → 40.61% → 32.89%)

## 🛠️ System Files

- `process_data.js` - Main data processing script
- `analyze.js` - Dynamics analysis script
- `validate_accuracy.js` - Approximation accuracy validation script
- `show_predictions.js` - Predictions demonstration script (shows real vs predicted values)
- `compiled.json` - Data processing result
- `analytics_report.md` - Detailed analysis report
- `graph.svg` - Visual representation of 60Percent dynamics across all datasets
