---
name: graph-updater
description: Update graph.svg visualization with new dataset points. Use this skill when asked to update, add, or modify data points in graph.svg for the 60Percent dynamics chart.
---

# Graph SVG Updater Skill

This skill provides instructions for updating `graph.svg` with new dataset data points.

## Prerequisites

Before updating `graph.svg`, ensure:

- ✅ `compiled.json` is generated with `node process_data.js`
- ✅ You know the **60Percent value** for the new dataset (from `compiled.json` or `node analyze.js`)
- ✅ You know the **dataset number** (e.g., 27, 28, etc.)

## Using graph.metadata.yaml (Required)

**Always read `graph.metadata.yaml` first** before editing `graph.svg`. It provides:

### What metadata gives you:

| Information               | Location in metadata                              | Use for                         |
| ------------------------- | ------------------------------------------------- | ------------------------------- |
| Current SVG dimensions    | `canvas.width`, `canvas.height`                   | Check if width extension needed |
| Last dataset X coordinate | `chart_area.x_range.max`                          | Know where to add new point     |
| Coordinate formulas       | `coordinate_system.x_formula`, `y_formula`        | Calculate new coordinates       |
| All existing points       | `data_points.{N}.x`, `.y`, `.percent`             | Compare neighbors for min/max   |
| Point color styles        | `point_styles.normal`, `.local_min`, `.local_max` | Apply correct styling           |
| SVG line numbers          | `data_points.{N}.svg.circle_line`, etc.           | Navigate SVG quickly            |
| Local extrema list        | `quick_reference.local_maxima`, `.local_minima`   | Determine point type            |

### Step 0: Read metadata and determine context

```yaml
# From graph.metadata.yaml, extract:
1. canvas.width → current SVG width
2. chart_area.x_range.max → last point X coordinate
3. data_points → get last dataset's values for comparison
4. quick_reference → check current extrema patterns
```

### Using metadata for point type determination

```yaml
# Read from metadata:
last_dataset = max(data_points keys)
last_percent = data_points.{last_dataset}.percent
second_last_percent = data_points.{last_dataset - 1}.percent

# Compare with new value:
if new_percent > last_percent AND new_percent > second_last_percent:
  type = local_max, color = #22c55e, radius = 6
elif new_percent < last_percent AND new_percent < second_last_percent:
  type = local_min, color = #ef4444, radius = 5
else:
  type = normal, color = #2563eb, radius = 5
```

## Coordinate System

The graph uses this coordinate system:

| Axis  | Formula                | Example                   |
| ----- | ---------------------- | ------------------------- |
| **X** | `(dataset - 2) * 60`   | DS 27 → (27-2)\*60 = 1500 |
| **Y** | `500 - (percent * 10)` | 32.10% → 500 - 321 = 179  |

- **Chart origin:** DS 2 starts at x=0
- **Vertical scale:** 0% = y=500, 50% = y=0
- **Each dataset:** 60px width

## Step-by-Step Update Process

### Step 1: Calculate Coordinates

```javascript
x = (datasetNumber - 2) * 60
y = 500 - percentValue * 10
```

### Step 2: Extend SVG Width (if needed)

If `x > current_max_x`, update **both**:

1. **SVG element:** `<svg width="..."` — increase by 60px per new dataset
2. **Background rect:** `<rect width="..." height="700" fill="#ffffff"/>` — same new width

```xml
<!-- Both must match -->
<svg width="{new_width}" ...>
<rect width="{new_width}" height="700" fill="#ffffff"/>
```

### Step 3: Update Polyline Points

Find the `<polyline points="...">` element and append new coordinate pair at the end:

```xml
points="... {last_x},{last_y} {new_x},{new_y}"
```

Format: space-separated pairs, comma between x and y.

### Step 4: Add Circle Element

Add after existing circles:

```xml
<circle cx="{x}" cy="{y}" r="5" fill="{color}" stroke="#fff" stroke-width="2"/>
```

**Color codes:**

- `#2563eb` (blue) - Normal points
- `#ef4444` (red) - Local minima / significant drops
- `#22c55e` (green) - Local maxima

### Step 5: Add Value Label

**Label ABOVE point** (when y > 250, i.e., percent < 25%):

```xml
<rect x="{x - 25}" y="{y - 35}" width="50" height="18" fill="white" opacity="0.8"/>
<text x="{x}" y="{y - 21}" class="point-label" fill="#666">{percent}%</text>
```

**Label BELOW point** (when y ≤ 250, i.e., percent ≥ 25%):

```xml
<rect x="{x - 25}" y="{y + 5}" width="50" height="18" fill="white" opacity="0.8"/>
<text x="{x}" y="{y + 19}" class="point-label" fill="#666">{percent}%</text>
```

### Step 6: Add Vertical Grid Line (even datasets only)

If dataset number is EVEN:

```xml
<line x1="{x}" y1="0" x2="{x}" y2="500" stroke="#000" stroke-width="1" opacity="0.1"/>
```

### Step 7: Add X-Axis Label (if new dataset)

```xml
<text x="{x}" y="525" text-anchor="middle" font-size="12" fill="#666">{dataset_number}</text>
```

### Step 8: Update Title (if range changed)

Update the title text to reflect new dataset range:

```xml
<text ...>60Percent Dynamics Across Datasets (2-{last_dataset_number})</text>
```

### Step 9: Update graph.metadata.yaml

Add new dataset entry to `data_points` section:

```yaml
{ dataset_number }:
  x: { x }
  y: { y }
  percent: { value }
  type: { normal|local_min|local_max }
  svg:
    circle_line: { line_number }
    label_rect_line: { line_number }
    label_text_line: { line_number }
  label:
    x: { x }
    y: { label_y }
    text: '{value}%'
```

Update `quick_reference` if point is local min/max.
Update `x_axis.labels.datasets` array.
Update `main_line.points` array.

## Quick Reference Template

```
0. READ graph.metadata.yaml first (get current state, last point, extrema)
1. Calculate: x = (N-2)*60, y = 500-(P*10)
2. Extend SVG width if x > current_max (from metadata canvas.width)
3. Append to polyline points: "{x},{y}"
4. Add circle element (color based on metadata neighbor comparison)
5. Add label (above if y>250, below if y≤250)
6. Add vertical line if dataset is even
7. Add x-axis label
8. Update title if range changed
9. Update graph.metadata.yaml (REQUIRED - keep in sync)
10. Verify in browser
```

## Point Type Determination

Compare new value with neighbors to determine type:

- **local_max**: Higher than both adjacent points → green (#22c55e), r=6
- **local_min**: Lower than both adjacent points → red (#ef4444), r=5
- **normal**: Otherwise → blue (#2563eb), r=5

## Common Mistakes to Avoid

| Mistake                | Correct Approach                                       |
| ---------------------- | ------------------------------------------------------ |
| Wrong X calculation    | DS 2 starts at x=0, not x=60                           |
| Y sign error           | Use `500 - (value * 10)`, not `500 + ...`              |
| Wrong polyline format  | Use `x1,y1 x2,y2` (space between pairs, comma in pair) |
| Forgot metadata update | Always update `graph.metadata.yaml` after SVG edit     |
| Missing vertical line  | Add only for EVEN dataset numbers                      |

## Verification Checklist

- [ ] Point appears at correct position
- [ ] Line connects smoothly to new point
- [ ] Label is readable and doesn't overlap
- [ ] Color matches point type (normal/min/max)
- [ ] X-axis label is present
- [ ] Metadata file is updated
