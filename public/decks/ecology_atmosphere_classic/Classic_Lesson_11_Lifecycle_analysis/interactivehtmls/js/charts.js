/**
 * SVG Donut Chart Engine with Smooth Arc Interpolation, Interactive Slices,
 * and Bidirectional Hotspot Linking for iPhone Xs Environmental Report.
 */

class EnvironmentalCharts {
  constructor(options = {}) {
    this.container = options.container || document.getElementById("interactive-stage");
    this.onSelectComponent = options.onSelectComponent || (() => {});
    this.onHoverComponent = options.onHoverComponent || (() => {});
    this.activeComponentId = null;

    // Coordinate anchors with reduced radius to prevent overlapping phone hardware presentation
    this.emissionsChartCenter = { x: 156.0, y: 206.0, innerR: 78, outerR: 98 };
    this.materialsChartCenter = { x: 686.0, y: 426.0, innerR: 66, outerR: 84 };

    this.init();
  }

  init() {
    this.renderEmissionsChart(null);
    this.renderMaterialsChart(null);
    this.renderLegends(null);
  }

  // Trigonometric conversion helper
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  }

  // Generate SVG path for a donut slice with optional center offset
  describeDonutSlice(cx, cy, innerR, outerR, startAngle, endAngle, offset = 0) {
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = ((midAngle - 90) * Math.PI) / 180.0;
    const shiftedCx = cx + offset * Math.cos(midRad);
    const shiftedCy = cy + offset * Math.sin(midRad);

    const span = endAngle - startAngle;
    const largeArcFlag = span <= 180 ? "0" : "1";

    const p1 = this.polarToCartesian(shiftedCx, shiftedCy, outerR, startAngle);
    const p2 = this.polarToCartesian(shiftedCx, shiftedCy, outerR, endAngle);
    const p3 = this.polarToCartesian(shiftedCx, shiftedCy, innerR, endAngle);
    const p4 = this.polarToCartesian(shiftedCx, shiftedCy, innerR, startAngle);

    return [
      `M ${p1.x} ${p1.y}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${p2.x} ${p2.y}`,
      `L ${p3.x} ${p3.y}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${p4.x} ${p4.y}`,
      "Z"
    ].join(" ");
  }

  // Highlight a material slice and legend row from an external hover event (e.g. phone hotspot hover)
  highlightSlice(componentId, isHovered) {
    if (!componentId) {
      document.querySelectorAll(".slice-hover-highlight").forEach((el) => {
        el.classList.remove("slice-hover-highlight");
      });
      document.querySelectorAll(".legend-row-hovered").forEach((el) => {
        el.classList.remove("legend-row-hovered");
      });
      return;
    }

    const sliceEl = document.getElementById(`mat-slice-${componentId}`);
    if (sliceEl) {
      if (isHovered) {
        sliceEl.classList.add("slice-hover-highlight");
      } else {
        sliceEl.classList.remove("slice-hover-highlight");
      }
    }

    const legendRow = document.querySelector(`.material-legend-row[data-id="${componentId}"]`);
    if (legendRow) {
      if (isHovered) {
        legendRow.classList.add("legend-row-hovered");
      } else {
        legendRow.classList.remove("legend-row-hovered");
      }
    }
  }

  // Update both charts when component selection changes
  update(componentId) {
    this.activeComponentId = componentId;
    this.renderEmissionsChart(componentId);
    this.renderMaterialsChart(componentId);
    this.renderLegends(componentId);
  }

  // Render or update Emissions Donut Chart
  renderEmissionsChart(componentId) {
    const group = document.getElementById("emissions-chart-group");
    const centerTextGroup = document.getElementById("emissions-center-text");
    if (!group) return;

    const { x: cx, y: cy, innerR, outerR } = this.emissionsChartCenter;
    const comp = componentId ? ENVIRONMENTAL_DATA.components[componentId] : null;

    let slices = [];
    if (!comp) {
      // Full device overview
      const data = ENVIRONMENTAL_DATA.overview.emissionsBreakdown;
      let currentAngle = -100; // Alignment with Apple slide start angle (~11:45 o'clock)
      slices = data.map((item) => {
        const span = (item.percentage / 100) * 360;
        const slice = {
          id: item.id,
          label: item.label,
          percentage: item.percentage,
          color: item.color,
          startAngle: currentAngle,
          endAngle: currentAngle + span - 0.8, // Tiny crisp segment gap
          isHighlighted: true
        };
        currentAngle += span;
        return slice;
      });
    } else {
      // Focused component emissions breakdown
      const data = comp.emissionsBreakdown;
      let currentAngle = -90;
      slices = data.map((item) => {
        const span = (item.percentage / 100) * 360;
        const slice = {
          id: item.label,
          label: item.label,
          percentage: item.percentage,
          color: item.color,
          startAngle: currentAngle,
          endAngle: currentAngle + span - 0.8,
          isHighlighted: true
        };
        currentAngle += span;
        return slice;
      });
    }

    // Build SVG paths
    let html = "";
    slices.forEach((s) => {
      const pathD = this.describeDonutSlice(cx, cy, innerR, outerR, s.startAngle, s.endAngle, 0);
      html += `
        <path class="chart-slice emissions-slice"
              id="emissions-slice-${s.id}"
              d="${pathD}"
              fill="${s.color}"
              data-id="${s.id}"
              data-label="${s.label}"
              data-percent="${s.percentage}%"
              style="transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);">
          <title>${s.label}: ${s.percentage}%</title>
        </path>
      `;
    });
    group.innerHTML = html;

    // Attach hover effects for emissions slices to highlight matching legend row
    slices.forEach((s) => {
      const el = document.getElementById(`emissions-slice-${s.id}`);
      if (el) {
        el.addEventListener("mouseenter", () => {
          const row = document.querySelector(`.emissions-legend-row[data-id="${s.id}"]`);
          if (row) row.classList.add("legend-row-hovered");
        });
        el.addEventListener("mouseleave", () => {
          const row = document.querySelector(`.emissions-legend-row[data-id="${s.id}"]`);
          if (row) row.classList.remove("legend-row-hovered");
        });
      }
    });

    // Update center label
    if (centerTextGroup) {
      if (!comp) {
        centerTextGroup.innerHTML = `
          <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="chart-center-num">${ENVIRONMENTAL_DATA.overview.totalEmissions}</text>
          <text x="${cx}" y="${cy + 17}" text-anchor="middle" class="chart-center-unit">kg CO<tspan dy="2" font-size="0.75em">2</tspan><tspan dy="-2">e</tspan></text>
          <text x="${cx}" y="${cy + 38}" text-anchor="middle" class="chart-center-sub">Total greenhouse</text>
          <text x="${cx}" y="${cy + 52}" text-anchor="middle" class="chart-center-sub">gas emissions</text>
        `;
      } else {
        centerTextGroup.innerHTML = `
          <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="chart-center-num active-pulse">${comp.carbonFootprint}</text>
          <text x="${cx}" y="${cy + 17}" text-anchor="middle" class="chart-center-unit">kg CO<tspan dy="2" font-size="0.75em">2</tspan><tspan dy="-2">e</tspan></text>
          <text x="${cx}" y="${cy + 38}" text-anchor="middle" class="chart-center-sub active-badge">${comp.name}</text>
          <text x="${cx}" y="${cy + 52}" text-anchor="middle" class="chart-center-sub">${comp.carbonPercentage}% of Lifecycle</text>
        `;
      }
    }
  }

  // Render or update Material Use Donut Chart
  renderMaterialsChart(componentId) {
    const group = document.getElementById("materials-chart-group");
    const centerTextGroup = document.getElementById("materials-center-text");
    if (!group) return;

    const { x: cx, y: cy, innerR, outerR } = this.materialsChartCenter;
    const materials = ENVIRONMENTAL_DATA.overview.materialsBreakdown;
    const activeComp = componentId ? ENVIRONMENTAL_DATA.components[componentId] : null;

    let currentAngle = -90; // Top 12 o'clock start matching Apple slide
    let html = "";

    materials.forEach((mat) => {
      const span = (mat.weight / ENVIRONMENTAL_DATA.overview.totalWeight) * 360;
      const isSelected = activeComp && activeComp.id === mat.id;
      const isDimmed = activeComp && !isSelected;

      const offset = isSelected ? 5 : 0;
      const sliceInnerR = isSelected ? innerR - 1 : innerR;
      const sliceOuterR = isSelected ? outerR + 4 : outerR;

      const pathD = this.describeDonutSlice(
        cx,
        cy,
        sliceInnerR,
        sliceOuterR,
        currentAngle,
        currentAngle + span - 0.7,
        offset
      );

      const opacity = isDimmed ? 0.28 : 1.0;
      const filter = isSelected ? `filter: drop-shadow(0px 0px 8px ${mat.color});` : "";

      html += `
        <path class="chart-slice material-slice ${isSelected ? "active-slice" : ""}"
              id="mat-slice-${mat.id}"
              d="${pathD}"
              fill="${mat.color}"
              opacity="${opacity}"
              data-id="${mat.id}"
              style="cursor: pointer; transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1); ${filter}">
          <title>${mat.label}: ${mat.weight}g (${mat.percentage}%)</title>
        </path>
      `;

      currentAngle += span;
    });

    group.innerHTML = html;

    // Attach click and bidirectional hover listeners to material slices
    materials.forEach((mat) => {
      const sliceEl = document.getElementById(`mat-slice-${mat.id}`);
      if (sliceEl) {
        sliceEl.addEventListener("click", (e) => {
          e.stopPropagation();
          const targetId = activeComp && activeComp.id === mat.id ? null : mat.id;
          this.onSelectComponent(targetId);
        });

        sliceEl.addEventListener("mouseenter", () => {
          this.onHoverComponent(mat.id, true);
          const legendRow = document.querySelector(`.material-legend-row[data-id="${mat.id}"]`);
          if (legendRow) legendRow.classList.add("legend-row-hovered");
        });

        sliceEl.addEventListener("mouseleave", () => {
          this.onHoverComponent(mat.id, false);
          const legendRow = document.querySelector(`.material-legend-row[data-id="${mat.id}"]`);
          if (legendRow) legendRow.classList.remove("legend-row-hovered");
        });
      }
    });

    // Update center label
    if (centerTextGroup) {
      if (!activeComp) {
        centerTextGroup.innerHTML = `
          <text x="${cx}" y="${cy - 5}" text-anchor="middle" class="chart-center-title">Material</text>
          <text x="${cx}" y="${cy + 15}" text-anchor="middle" class="chart-center-title">Use</text>
          <text x="${cx}" y="${cy + 37}" text-anchor="middle" class="chart-center-sub">${ENVIRONMENTAL_DATA.overview.totalWeight}g Total Device</text>
        `;
      } else {
        centerTextGroup.innerHTML = `
          <text x="${cx}" y="${cy - 8}" text-anchor="middle" class="chart-center-num active-pulse" style="font-size: 26px; fill: ${activeComp.materialColor}">${activeComp.weightFormatted}</text>
          <text x="${cx}" y="${cy + 12}" text-anchor="middle" class="chart-center-sub active-badge" style="font-weight: 600;">${activeComp.name}</text>
          <text x="${cx}" y="${cy + 28}" text-anchor="middle" class="chart-center-sub">${activeComp.weightPercentage}% of Device</text>
          <text x="${cx}" y="${cy + 43}" text-anchor="middle" class="chart-center-sub" style="font-size: 10px; fill: #86868b;">Click to view all</text>
        `;
      }
    }
  }

  // Render the matching legends overlay
  renderLegends(componentId) {
    const leftLegendEl = document.getElementById("emissions-legend-container");
    const rightLegendEl = document.getElementById("materials-legend-container");
    const activeComp = componentId ? ENVIRONMENTAL_DATA.components[componentId] : null;

    // Left Legend (Emissions)
    if (leftLegendEl) {
      if (!activeComp) {
        const items = ENVIRONMENTAL_DATA.overview.emissionsBreakdown;
        leftLegendEl.innerHTML = items
          .map(
            (item) => `
          <div class="legend-row emissions-legend-row" data-id="${item.id}">
            <span class="legend-pct">${item.percentage}%</span>
            <span class="legend-dot" style="background-color: ${item.color};"></span>
            <span class="legend-name">${item.label}</span>
          </div>
        `
          )
          .join("");
      } else {
        const items = activeComp.emissionsBreakdown;
        leftLegendEl.innerHTML = `
          <div class="legend-header-badge" style="color: ${activeComp.materialColor}">
            ${activeComp.name}:
          </div>
          ${items
            .map(
              (item) => `
            <div class="legend-row emissions-legend-row active-comp-row">
              <span class="legend-pct">${item.percentage}%</span>
              <span class="legend-dot" style="background-color: ${item.color};"></span>
              <span class="legend-name" title="${item.label}">${item.label}</span>
            </div>
          `
            )
            .join("")}
        `;
      }
    }

    // Right Legend (Materials)
    if (rightLegendEl) {
      const items = ENVIRONMENTAL_DATA.overview.materialsBreakdown;
      rightLegendEl.innerHTML = items
        .map((item) => {
          const isSelected = activeComp && activeComp.id === item.id;
          const isDimmed = activeComp && !isSelected;
          return `
          <div class="legend-row material-legend-row ${isSelected ? "selected-legend-row" : ""} ${isDimmed ? "dimmed-legend-row" : ""}"
               data-id="${item.id}"
               style="cursor: pointer;"
               title="Click to highlight ${item.label}">
            <span class="legend-val">${item.weight}g</span>
            <span class="legend-dot" style="background-color: ${item.color}; ${isSelected ? "box-shadow: 0 0 8px " + item.color : ""}"></span>
            <span class="legend-name ${isSelected ? "active-legend-name" : ""}">${item.label}</span>
            ${isSelected ? `<span class="legend-tag">${item.percentage}%</span>` : ""}
          </div>
        `;
        })
        .join("");

      // Add click and hover listeners to right legend rows
      items.forEach((item) => {
        const row = rightLegendEl.querySelector(`.material-legend-row[data-id="${item.id}"]`);
        if (row) {
          row.addEventListener("click", () => {
            const targetId = activeComp && activeComp.id === item.id ? null : item.id;
            this.onSelectComponent(targetId);
          });

          row.addEventListener("mouseenter", () => {
            this.onHoverComponent(item.id, true);
            this.highlightSlice(item.id, true);
          });

          row.addEventListener("mouseleave", () => {
            this.onHoverComponent(item.id, false);
            this.highlightSlice(item.id, false);
          });
        }
      });
    }
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = EnvironmentalCharts;
}
