# Dataset Data Processing System

## 📂 Data Structure

In the `data` folder there are `json` files with names in the format:

```
{dataset number} - {rounded score} - {top% for this score}.json
```

## 🎯 Automatic Processing

### Running Data Processing

```bash
node process_data.js
```

The script automatically:

1. Processes all JSON files in the `data` folder
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

### Showing Predictions

```bash
node show_predictions.js
```

Shows detailed comparison of real and predicted values for all datasets.

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

1. Place new JSON files in `data` folder
2. Run: `node process_data.js`
3. To update analysis: `node analyze.js`

### Automatic Processing:

- ✅ New datasets automatically detected
- ✅ Existing data recalculated
- ✅ Data validation performed automatically
- ✅ **High precision coefficients preserved for all datasets**
- ✅ Error report output to console

## 📈 Current Statistics (last update)

- **Processed datasets:** 18 (datasets 2-19, dataset 1 excluded)
- **Average 60Percent value:** 33.42%
- **Value range:** 19.62% - 45.67%
- **Overall trend:** Cyclical with corrections (+13.11% growth from first to last)
- **Approximation accuracy:** Average error 0.08%, maximum 1.11%
- **Data quality:** From 2 to 8 points per dataset, total 68 points

## 🛠️ System Files

- `process_data.js` - Main data processing script
- `analyze.js` - Dynamics analysis script
- `validate_accuracy.js` - Approximation accuracy validation script
- `show_predictions.js` - Predictions demonstration script
- `compiled.json` - Data processing result
- `analytics_report.md` - Detailed analysis report
