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

- **Interactive SVG chart** showing all datasets (2-26)
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

1. **Prepare data:** Place and rename JSON files in `data/{number}/` folders
2. **Process data:** `node process_data.js` → generates `compiled.json`
3. **Analyze trends:** `node analyze.js` → shows dynamics in console
4. **Check accuracy:** `node show_predictions.js` → validates approximation quality
5. **Update report:** Edit `analytics_report.md` with new insights
6. **Update visualization:** Update `graph.svg` with new data point (see detailed instructions below)
7. **Update docs:** Refresh `instructions.md` statistics and procedures

### Quick Checks (existing data):

- **View current stats:** `node analyze.js`
- **Check prediction quality:** `node show_predictions.js`
- **View visualization:** Open `graph.svg` in browser

## 🎨 Updating graph.svg with New Dataset

### Prerequisites

Before updating `graph.svg`, ensure you have:

- ✅ Run `node process_data.js` to generate `compiled.json` with new dataset
- ✅ Note the **60Percent value** for the new dataset from `compiled.json` or `node analyze.js` output
- ✅ Know the **dataset number** (e.g., 27, 28, etc.)

### Coordinate System Understanding

The graph uses a coordinate system where:

- **X-axis:** Each dataset occupies 60px width
  - DS 2 = x=0, DS 3 = x=60, DS 4 = x=120, ..., DS N = x=(N-2)\*60
- **Y-axis:** Represents percentage values
  - Formula: `y = 500 - (60Percent_value × 10)`
  - Example: 60Percent = 35% → y = 500 - 350 = 150
- **Chart area:** 1440px wide (fits 25 datasets at 60px each)
- **Vertical scale:** 0% = y=500, 50% = y=0

### Step-by-Step Update Process

#### Step 1: Calculate Coordinates for New Dataset

For dataset number N with 60Percent value P:

```javascript
// X coordinate
x = (N - 2) * 60

// Y coordinate
y = 500 - P * 10
```

**Example for DS 27 with 60Percent = 32.10%:**

- x = (27 - 2) _ 60 = 25 _ 60 = 1500
- y = 500 - (32.10 \* 10) = 500 - 321 = 179

#### Step 2: Extend Chart Width (if needed)

If new dataset exceeds current width:

- Find `<svg width="1600"` at line 1
- Increase width: `1600 + 60 × number_of_new_datasets`
- Example for DS 27: `width="1660"` (1600 + 60)

#### Step 3: Update Polyline Points

Find the polyline element around line 195 and add new coordinate pair:

```xml
<polyline
  points="0,285.4 60,303.8 120,280 ... 1440,179.0 {new_x},{new_y}"
  fill="none"
  stroke="#2563eb"
  stroke-width="3"
  stroke-linejoin="round"
/>
```

**Add `{new_x},{new_y}` at the end of the points attribute**

#### Step 4: Add New Circle Element

Add after the last existing circle element (find circles starting around line 205):

```xml
<circle
  cx="{new_x}"
  cy="{new_y}"
  r="5"
  fill="#2563eb"
  stroke="#fff"
  stroke-width="2"
/>
```

**Color codes:**

- `#2563eb` (blue): Normal data points
- `#ef4444` (red): Significant drops or anomalies
- Choose color based on whether 60Percent value is notably different from trend

#### Step 5: Add Value Label

Add after the last label element. Position depends on whether the label goes **above** or **below** the point:

**For labels ABOVE the point (when y > 250 - lower values):**

```xml
<rect x="{new_x - 25}" y="{new_y - 35}" width="50" height="18" fill="white" opacity="0.8" />
<text x="{new_x}" y="{new_y - 21}" class="point-label" fill="#666">
  {60Percent_value formatted}%
</text>
```

Distance: ~12px above point (typical for "above" labels)

**For labels BELOW the point (when y ≤ 250 - higher values):**

```xml
<rect x="{new_x - 25}" y="{new_y + 5}" width="50" height="18" fill="white" opacity="0.8" />
<text x="{new_x}" y="{new_y + 19}" class="point-label" fill="#666">
  {60Percent_value formatted}%
</text>
```

Distance: ~19-25px below point (typical for "below" labels)

**Label positioning rules:**

- If point is at local minimum or near it: label goes **below** the point
- If point is at local maximum or near it: label goes **above** the point
- For other points: use visual judgment based on surrounding points

#### Step 6: Add Vertical Line (for even datasets only)

If new dataset number is EVEN, add vertical line after existing vertical lines (around line 78):

```xml
<line
  x1="{new_x}"
  y1="0"
  x2="{new_x}"
  y2="500"
  stroke="#000"
  stroke-width="1"
  opacity="0.1"
/>
```

#### Step 7: Update X-Axis Labels (if needed)

If adding dataset at the end, update x-axis labels section (around line 135):

```xml
<!-- Add new label -->
<text x="{new_x}" y="525" text-anchor="middle" font-size="12" fill="#666">
  {dataset_number}
</text>
```

#### Step 8: Update Graph Title (if dataset range changed)

Update title around line 28 to reflect new range:

```xml
<text x="700" y="40" text-anchor="middle" font-size="26" font-weight="bold" fill="#1a1a1a">
  60Percent Dynamics Across Datasets (2-{last_dataset_number})
</text>
```

#### Step 9: Verify and Test

1. **Open `graph.svg` in browser** - check if all elements display correctly
2. **Verify positioning** - new point should align with line
3. **Check label visibility** - label should be readable and not overlap other elements
4. **Validate distances** - compare label distance to neighbors (typically 12-25px)
5. **Review consistency** - new element should follow existing patterns

### Quick Reference Template

For adding dataset N with 60Percent value P:

```
1. Calculate: x = (N-2)*60, y = 500-(P*10)
2. Extend SVG width if x > 1440
3. Add to polyline: "... 1440,179.0 {x},{y}"
4. Add circle: <circle cx="{x}" cy="{y}" r="5" fill="#2563eb" stroke="#fff" stroke-width="2"/>
5. Add label (above/below depending on position)
6. Add vertical line if N is even
7. Add x-axis label if needed
8. Update title if range changed
9. Verify in browser
```

### Common Mistakes to Avoid

❌ **Incorrect X calculation** - Remember: first dataset (DS 2) starts at x=0
❌ **Y coordinate sign error** - Formula is `500 - (value × 10)`, not `500 + (value × 10)`
❌ **Label overlap** - Check surrounding labels before positioning
❌ **Missing circle update** - Don't forget to add the circle element
❌ **Wrong polyline format** - Ensure comma separates x,y pairs: `x1,y1 x2,y2 x3,y3`
❌ **Forgot vertical line** - Add line only for even datasets
❌ **Label distance inconsistency** - Above: ~12px, Below: ~19-25px

## 📋 Graph Metadata (graph.metadata.yaml)

### Overview

`graph.metadata.yaml` contains structured metadata about `graph.svg` that accelerates AI assistant's work with the visualization file. It provides quick access to:

- Canvas dimensions and coordinate system
- Point positions, types, and labels
- SVG element line numbers for fast navigation
- Styling information and color codes
- Quick reference for local minima/maxima

### Metadata Structure

```yaml
canvas:
  width: 1600
  height: 700
  viewBox: '0 0 1600 700'

chart_area:
  transform: { x: 100, y: 100 }
  x_range: { min: 0, max: 1440 }
  y_range: { min: 0, max: 500 }

coordinate_system:
  x_formula: '(dataset - 2) * 60'
  y_formula: '500 - (percent * 10)'

point_styles:
  normal:
    color: '#2563eb'
    radius: 5
  local_min:
    color: '#ef4444'
    radius: 5
  local_max:
    color: '#22c55e'
    radius: 6

data_points:
  { dataset_number }:
    x: { x_coordinate }
    y: { y_coordinate }
    percent: { value }
    type: { normal|local_min|local_max }
    svg:
      circle_line: { line_number }
      label_rect_line: { line_number }
      label_text_line: { line_number }
    label:
      x: { label_x }
      y: { label_y }
      text: '{value}%'
      bg: { ... }

quick_reference:
  local_maxima: [9, 14, 18, 21, 24]
  local_minima: [3, 11, 16, 19, 23]
```

### Using Metadata for Quick Navigation

#### Finding a Specific Point

To quickly navigate to a dataset's elements in `graph.svg`:

```bash
# 1. Open graph.metadata.yaml
# 2. Find dataset number, e.g., "14"
# 3. Get line numbers:
#    - circle_line: 315  (the point circle)
#    - label_rect_line: 452  (background rectangle)
#    - label_text_line: 455  (label text)
# 4. In VS Code: Ctrl+G and enter line number to jump directly
```

#### Example: Edit Dataset 14's Label

```yaml
# From metadata:
14:
  svg:
    circle_line: 315
    label_rect_line: 452
    label_text_line: 455
  label:
    text: '45.67%'
# Actions:
# - Press Ctrl+G, type 455, press Enter → jump to label text
# - Press Ctrl+G, type 452, press Enter → jump to label background
# - Press Ctrl+G, type 315, press Enter → jump to point circle
```

### Using Metadata for Adding New Datasets

#### Step 1: Calculate Coordinates

```yaml
# From coordinate_system section:
x_formula: "(dataset - 2) * 60"
y_formula: "500 - (percent * 10)"

# Example for DS 27, 60Percent = 32.10%:
x = (27 - 2) * 60 = 1500
y = 500 - (32.10 * 10) = 179
```

#### Step 2: Determine Point Type

Compare new value with neighbors:

```yaml
# From quick_reference section:
local_maxima: [9, 14, 18, 21, 24]
local_minima: [3, 11, 16, 19, 23]
# Determine if new dataset is:
# - local_max: higher than both neighbors
# - local_min: lower than both neighbors
# - normal: otherwise
```

#### Step 3: Apply Correct Style

```yaml
# From point_styles section:
normal:
  color: '#2563eb' # Blue
  radius: 5

local_max:
  color: '#22c55e' # Green
  radius: 6

local_min:
  color: '#ef4444' # Red
  radius: 5
```

#### Step 4: Add to Main Line Points

```yaml
# From main_line.points:
main_line:
  points:
    - [0, 285.4]
    - [60, 303.8]
    ...
    - [1440, 175]

# Add new point at end:
    - [1440, 175]
    - [1500, 179]  # New point for DS 27
```

#### Step 5: Update Metadata

After adding new dataset to `graph.svg`, update `graph.metadata.yaml`:

```yaml
data_points:
  27:
    x: 1500
    y: 179
    percent: 32.10
    type: normal # or local_max/local_min
    svg:
      circle_line: { new_line_number }
      label_rect_line: { new_line_number }
      label_text_line: { new_line_number }
    label:
      x: 1500
      y: { above_or_below }
      text: '32.10%'
      bg: { ... }

# Update quick_reference (if needed):
quick_reference:
  local_maxima: [9, 14, 18, 21, 24, 27] # Add 27 if it's a maximum
  local_minima: [3, 11, 16, 19, 23] # Add 27 if it's a minimum

# Update x_axis.labels.datasets:
x_axis:
  labels:
    datasets: [2, 3, 4, ..., 26, 27] # Add 27
```

### Updating Metadata After SVG Edits

**⚠️ Important:** Line numbers in `svg` section may become outdated after editing `graph.svg`.

**To update line numbers:**

1. **Method 1: Manual update**

   - Add new dataset to `data_points` section
   - Approximate line numbers based on pattern:
     - Each circle: 6 lines
     - Each label pair (rect + text): 3 lines
   - Verify with Ctrl+G in VS Code

2. **Method 2: Regenerate completely**

   - Ask AI assistant to regenerate `graph.metadata.yaml` from `graph.svg`
   - Specify: "Regenerate metadata with updated line numbers"
   - This ensures 100% accuracy

3. **Method 3: Use search pattern**
   - Use VS Code search: `cx="{x}"` where `{x}` is new point's x coordinate
   - Find exact line number and update metadata manually

### Common Use Cases

#### Use Case 1: Change Label Text

```bash
# Goal: Change "32.50%" to "32.5%"

# Using metadata:
1. Find dataset 26
2. label_text_line: 535
3. Ctrl+G → 535 → Edit text

# Without metadata:
1. Open graph.svg
2. Search: "32.50%"
3. Find correct occurrence (might be multiple)
4. Edit
```

#### Use Case 2: Change Point Color

```bash
# Goal: Make DS 14 red instead of green

# Using metadata:
1. Find dataset 14
2. circle_line: 315
3. Ctrl+G → 315 → Change fill="#22c55e" to fill="#ef4444"
4. Update metadata type from local_max to local_min
5. Update quick_reference.local_maxima: remove 14

# Without metadata:
1. Search: 'cx="720"' (x coordinate for DS 14)
2. Find circle element
3. Change color
4. Remember to update label color too
```

#### Use Case 3: Find All Minima/Maxima

```yaml
# From quick_reference section:
local_maxima: [9, 14, 18, 21, 24]
local_minima: [3, 11, 16, 19, 23]

# To edit all minima:
# Use metadata to get line numbers:
3:  circle_line: 247
11: circle_line: 297
16: circle_line: 329
19: circle_line: 349
23: circle_line: 375

# Batch edit: Visit each line and make changes
```

### Maintenance Best Practices

**✅ Do:**

- Keep metadata in sync with `graph.svg`
- Update line numbers after significant edits
- Use metadata for quick navigation during development
- Regenerate metadata when structure changes substantially

**❌ Don't:**

- Rely on outdated line numbers
- Edit `graph.svg` without updating metadata afterward
- Assume metadata is automatically updated (it's not)

### Metadata vs Direct Editing

| Task                       | Using Metadata   | Direct Editing   |
| -------------------------- | ---------------- | ---------------- |
| Find specific dataset      | ⚡ Fast (Ctrl+G) | 🐢 Slow (search) |
| Change single point        | ✅ Ideal         | Works but manual |
| Batch edit multiple points | ✅ Excellent     | Error-prone      |
| Add new dataset            | ✅ Structured    | Works but manual |
| Navigate SVG               | ✅ Precise       | Guesswork        |
| Update metadata            | ⚠️ Manual step   | N/A              |

### Integration with Workflow

When adding new dataset:

```
1. Run: node process_data.js
2. Get 60Percent value from compiled.json
3. Calculate coordinates using metadata formulas
4. Determine point type using quick_reference
5. Add elements to graph.svg (use metadata line numbers for placement)
6. Update graph.metadata.yaml with new dataset info
7. Verify: Open graph.svg in browser
8. (Optional) Regenerate metadata for accurate line numbers
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
2. **Rename files** according to format: `{dataset} - {score}k - {percent}%.json`
   - Extract `total_score` and `rank_percent/100` from each JSON file
   - Round score to nearest thousand (k)
   - Format: `21 - 128k - 1,58%.json`
3. **Run processing:** `node process_data.js` (generates `compiled.json`)
4. **Run analysis:** `node analyze.js` (shows dynamics in console)
5. **Check accuracy:** `node show_predictions.js` (validates approximation quality)
6. **Update report:** Update `analytics_report.md` with new data and trends
7. **Update visualization:** Update `graph.svg` with new data point (see "🎨 Updating graph.svg with New Dataset" section for detailed step-by-step instructions)
8. **Update documentation:** Update `instructions.md` statistics and procedures

### Automatic Processing:

- ✅ New datasets automatically detected
- ✅ Existing data recalculated
- ✅ Data validation performed automatically
- ✅ **High precision coefficients preserved for all datasets**
- ✅ Error report output to console

### Manual Steps Required:

- 📝 **File renaming** according to naming convention
- 📊 **Report updates** with trend analysis and conclusions
- 📈 **Visualization creation** - follow detailed instructions in "🎨 Updating graph.svg with New Dataset" section
- 📚 **Documentation updates** to reflect current state

## 📈 Current Statistics (last update: January 2, 2026)

- **Processed datasets:** 25 (datasets 2-26, dataset 1 excluded)
- **Average 60Percent value:** 34.25%
- **Value range:** 19.62% - 45.67%
- **Overall trend:** Cyclical with oscillation and mean reversion pattern (+13.19% growth from first 5 to last 5)
- **Approximation accuracy:** Average error 0.254%, maximum 1.59%, overall accuracy 99.5%
- **Data quality:** From 2 to 17 points per dataset, total 132 points
- **Latest pattern:** Oscillating waves with corrections (datasets 18-26: 42.60% → 30.36% → 42.17% → 38.72% → 35.11% → 40.61% → 32.89% → 32.10%)

## 🛠️ System Files

- `process_data.js` - Main data processing script
- `analyze.js` - Dynamics analysis script
- `validate_accuracy.js` - Approximation accuracy validation script
- `show_predictions.js` - Predictions demonstration script (shows real vs predicted values)
- `compiled.json` - Data processing result
- `analytics_report.md` - Detailed analysis report
- `graph.svg` - Visual representation of 60Percent dynamics across all datasets (see "🎨 Updating graph.svg with New Dataset" for update instructions)
