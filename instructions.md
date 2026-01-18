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

- **Interactive SVG chart** showing all datasets (2-27)
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

**Current accuracy:** 99.5% average (132 data points, max error 1.59%)

## 🔄 Workflow Sequence

### Complete Workflow (when adding new dataset):

1. **Prepare data:** Place JSON files in `data/{number}/` folder and run rename script:
   - Update `dataset` variable in `rename_files.js` to new dataset number
   - Run: `node rename_files.js`
   - Script auto-renames files to format: `{dataset} - {score}k - {percent}%.json`

2. **Process data:** `node process_data.js` → generates `compiled.json`
3. **Analyze trends:** `node analyze.js` → shows dynamics in console
4. **Check accuracy:** `node show_predictions.js` → validates approximation quality
5. **Update report:** Edit `analytics_report.md` with new insights
6. **Update visualization:** Update `graph.svg` with new data point (use `graph-updater` skill at [.github/skills/graph-updater/SKILL.md](.github/skills/graph-updater/SKILL.md))
7. **Update docs:** Refresh `instructions.md` statistics and procedures

### Quick Checks (existing data):

- **View current stats:** `node analyze.js`
- **Check prediction quality:** `node show_predictions.js`

## 🎨 Updating graph.svg with New Dataset

> **📖 Skill Reference:** For detailed step-by-step instructions, read the Agent Skill at [.github/skills/graph-updater/SKILL.md](.github/skills/graph-updater/SKILL.md)

### Quick Overview

The `graph-updater` skill provides complete instructions for:

- Calculating coordinates for new data points
- Updating SVG elements (polyline, circles, labels)
- Managing point colors based on type (normal/min/max)
- Updating `graph.metadata.yaml` in sync

### Quick Reference

```
1. Calculate: x = (N-2)*60, y = 500-(P*10)
2. Extend SVG width if needed
3. Append to polyline points
4. Add circle element
5. Add label (above/below based on position)
6. Add vertical line if dataset is even
7. Add x-axis label
8. Update title if range changed
9. Update graph.metadata.yaml
10. Verify in browser
```

## ⚙️ Technical Details

### Data Extraction from JSON Files

- `{x}.data.[y].score` ← `data.total_score`
- `{x}.data.[y].percent` ← `data.rank_percent / 100` (conversion from percent×100)
- `{dataset number}` ← extracted from filename
- Validation: `data.zone_id = dataset_number + 69000`

### Polynomial Approximation

- **Polynomial degree:** Adaptive based on number of data points
  - Formula: `degree = floor(points / 2)`
  - Minimum: `max(3, points - 1)`
  - Maximum: 7
  - Example: 17 points → degree 7, 10 points → degree 5, 6 points → degree 3
- **Minimum points:** 2 (for linear approximation)
- **Method:** Custom implementation of least squares method + Gaussian elimination
- **Coefficient precision:** Full (no rounding, up to 12 decimal places)
- **60Percent precision:** 2 decimal places

### Formula Format

Polynomial with adaptive degree (1-7):

```
a_n x^n + a_{n-1} x^{n-1} + ... + a_1 x + a_0
```

where `n` is the polynomial degree calculated based on number of points.
Coefficients are automatically formatted with correct signs and high precision (12 decimal places).

## 🔄 Updates with New Data

### When adding new dataset:

1. **Place new JSON files** in `data/{dataset_number}/` folder
2. **Rename files** using script:
   - Update `dataset` variable in `rename_files.js` to new dataset number
   - Run: `node rename_files.js`
3. **Run processing:** `node process_data.js` (generates `compiled.json`)
4. **Run analysis:** `node analyze.js` (shows dynamics in console)
5. **Check accuracy:** `node show_predictions.js` (validates approximation quality)
6. **Update report:** Update `analytics_report.md` with new data and trends
7. **Update visualization:** Update `graph.svg` with new data point (use `graph-updater` skill at [.github/skills/graph-updater/SKILL.md](.github/skills/graph-updater/SKILL.md))
8. **Update documentation:** Update `instructions.md` statistics and procedures

### Automatic Processing:

- ✅ New datasets automatically detected
- ✅ Existing data recalculated
- ✅ Data validation performed automatically
- ✅ **High precision coefficients preserved for all datasets**
- ✅ Error report output to console

### Manual Steps Required:

- 📝 **File renaming** - update `dataset` in `rename_files.js`, then run script
- 📊 **Report updates** with trend analysis and conclusions
- 📈 **Visualization creation** - use `graph-updater` skill at [.github/skills/graph-updater/SKILL.md](.github/skills/graph-updater/SKILL.md)
- 📚 **Documentation updates** to reflect current state

## 📈 Current Statistics (last update: January 5, 2026)

- **Processed datasets:** 26 (datasets 2-27, dataset 1 excluded)
- **Average 60Percent value:** 34.40%
- **Value range:** 19.62% - 45.67%
- **Overall trend:** Cyclical with oscillation and mean reversion pattern (+13.19% growth from first 5 to last 5)
- **Approximation accuracy:** Average error 0.246%, maximum 0.65%, overall accuracy 99.8%
- **Data quality:** From 2 to 17 points per dataset, total 149 points
- **Latest pattern:** Oscillating waves with corrections (datasets 18-27: 42.60% → 30.36% → 42.17% → 38.72% → 35.11% → 40.61% → 32.89% → 32.10% → 34.84%)

## 🛠️ System Files

- `rename_files.js` - Auto-rename JSON files (update `dataset` variable before use)
- `process_data.js` - Main data processing script
- `analyze.js` - Dynamics analysis script
- `validate_accuracy.js` - Approximation accuracy validation script
- `show_predictions.js` - Predictions demonstration script (shows real vs predicted values)
- `compiled.json` - Data processing result
- `analytics_report.md` - Detailed analysis report
- `graph.svg` - Visual representation of 60Percent dynamics across all datasets (update using `graph-updater` skill)
