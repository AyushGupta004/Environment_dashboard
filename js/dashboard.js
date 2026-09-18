/**
 * EARTH FORWARD — NGO Environmental Intelligence & Action Platform
 * js/dashboard.js — Executive Command Center Controller
 * 
 * Strict Architecture Rule:
 * All data queries pass through EarthData (js/data.js):
 * - EarthData.getReports(filters)
 * - EarthData.getAnalytics()
 */

(function () {
  'use strict';

  // Chart references for live filter updates
  let categoryChartInstance = null;
  let timelineChartInstance = null;
  let severityChartInstance = null;
  let statusChartInstance = null;

  // Cached full dataset
  let allReportsCache = [];

  /**
   * Smooth Easing Number Count-up Animation (~800ms)
   */
  function animateCountUp(element, targetValue, duration = 800, isPercentage = false) {
    if (!element) return;
    const startValue = 0;
    const startTime = performance.now();
    const target = Number(targetValue) || 0;

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out: 1 - (1 - t)^3
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * easeProgress);

      element.textContent = isPercentage ? `${current}%` : current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = isPercentage ? `${target}%` : target.toLocaleString();
      }
    }

    requestAnimationFrame(updateCounter);
  }

  /**
   * Fetch data and populate KPI cards
   */
  async function loadKPIs(filteredReports = null) {
    let reports = filteredReports;
    if (!reports) {
      reports = await window.EarthData.getReports();
    }

    const total = reports.length;
    const highPriority = reports.filter(r => r.severity === 'High').length;
    const underInvestigation = reports.filter(r => 
      r.status === 'Reported' || r.status === 'AI Analyzed' || r.status === 'Under Review'
    ).length;
    const verified = reports.filter(r => r.verified === true).length;
    const resolved = reports.filter(r => r.status === 'Resolved').length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    // Animate KPI metrics
    animateCountUp(document.getElementById('kpiValTotal'), total);
    animateCountUp(document.getElementById('kpiValHigh'), highPriority);
    animateCountUp(document.getElementById('kpiValReview'), underInvestigation);
    animateCountUp(document.getElementById('kpiValVerified'), verified);
    animateCountUp(document.getElementById('kpiValResolved'), resolved);
    animateCountUp(document.getElementById('kpiValRate'), resolutionRate, 800, true);
  }

  /**
   * Initialize or Update Chart.js Visualizations (Monochrome Green Scale Only)
   */
  function renderCharts(reports) {
    // 1. Category Breakdown
    const catCounts = {};
    reports.forEach(r => {
      catCounts[r.category] = (catCounts[r.category] || 0) + 1;
    });
    const catLabels = Object.keys(catCounts);
    const catData = Object.values(catCounts);

    // 2. Timeline Breakdown (Group by Month Jun - Sep 2026)
    const monthBuckets = { 'Jun 2026': 0, 'Jul 2026': 0, 'Aug 2026': 0, 'Sep 2026': 0 };
    reports.forEach(r => {
      const d = new Date(r.reportDate);
      const m = d.getMonth();
      if (m === 5) monthBuckets['Jun 2026']++;
      else if (m === 6) monthBuckets['Jul 2026']++;
      else if (m === 7) monthBuckets['Aug 2026']++;
      else if (m === 8) monthBuckets['Sep 2026']++;
    });

    // 3. Severity Breakdown
    const sevCounts = { High: 0, Medium: 0, Low: 0 };
    reports.forEach(r => {
      if (sevCounts[r.severity] !== undefined) sevCounts[r.severity]++;
    });

    // 4. Status Breakdown
    const statusCounts = {
      'Reported': 0,
      'AI Analyzed': 0,
      'Under Review': 0,
      'Verified': 0,
      'Action Initiated': 0,
      'Resolved': 0
    };
    reports.forEach(r => {
      if (statusCounts[r.status] !== undefined) statusCounts[r.status]++;
    });

    // Common Tooltip & Legend Styling (Monochrome Green)
    const commonPlugins = {
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#17231A',
        bodyColor: '#657267',
        borderColor: '#C5E3CA',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true,
        titleFont: { family: 'Inter', weight: '700', size: 12 },
        bodyFont: { family: 'Inter', size: 12 }
      }
    };

    // --- Chart 1: Issues by Category (Bar Chart) ---
    const ctxCat = document.getElementById('chartCategory').getContext('2d');
    if (categoryChartInstance) {
      categoryChartInstance.data.labels = catLabels;
      categoryChartInstance.data.datasets[0].data = catData;
      categoryChartInstance.update();
    } else {
      categoryChartInstance = new Chart(ctxCat, {
        type: 'bar',
        data: {
          labels: catLabels,
          datasets: [{
            label: 'Incidents',
            data: catData,
            backgroundColor: '#315C3A',
            hoverBackgroundColor: '#264a2e',
            borderRadius: 4,
            maxBarThickness: 32
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            ...commonPlugins,
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#657267', font: { family: 'Inter', size: 11 } }
            },
            y: {
              grid: { color: '#DDEFE0' },
              ticks: { color: '#657267', precision: 0, font: { family: 'Inter', size: 11 } }
            }
          }
        }
      });
    }

    // --- Chart 2: Issues Over Time (Line Chart) ---
    const ctxTimeline = document.getElementById('chartTimeline').getContext('2d');
    if (timelineChartInstance) {
      timelineChartInstance.data.datasets[0].data = Object.values(monthBuckets);
      timelineChartInstance.update();
    } else {
      timelineChartInstance = new Chart(ctxTimeline, {
        type: 'line',
        data: {
          labels: Object.keys(monthBuckets),
          datasets: [{
            label: 'Citizen Submissions',
            data: Object.values(monthBuckets),
            borderColor: '#315C3A',
            backgroundColor: '#F0F7F1',
            fill: true,
            borderWidth: 2.5,
            tension: 0.35,
            pointBackgroundColor: '#315C3A',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            ...commonPlugins,
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#657267', font: { family: 'Inter', size: 11 } }
            },
            y: {
              grid: { color: '#DDEFE0' },
              ticks: { color: '#657267', precision: 0, font: { family: 'Inter', size: 11 } }
            }
          }
        }
      });
    }

    // --- Chart 3: Severity Distribution (Doughnut) ---
    const ctxSeverity = document.getElementById('chartSeverity').getContext('2d');
    if (severityChartInstance) {
      severityChartInstance.data.datasets[0].data = [sevCounts.High, sevCounts.Medium, sevCounts.Low];
      severityChartInstance.update();
    } else {
      severityChartInstance = new Chart(ctxSeverity, {
        type: 'doughnut',
        data: {
          labels: ['High Severity', 'Medium Severity', 'Low Severity'],
          datasets: [{
            data: [sevCounts.High, sevCounts.Medium, sevCounts.Low],
            backgroundColor: [
              '#315C3A', // High
              '#8FBC8F', // Medium
              '#DDEFE0'  // Low
            ],
            borderColor: '#FFFFFF',
            borderWidth: 2,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            ...commonPlugins,
            legend: {
              position: 'bottom',
              labels: {
                color: '#17231A',
                font: { family: 'Inter', size: 11 },
                boxWidth: 10,
                padding: 14
              }
            }
          },
          cutout: '68%'
        }
      });
    }

    // --- Chart 4: Status Distribution (Horizontal Bar / Doughnut) ---
    const ctxStatus = document.getElementById('chartStatus').getContext('2d');
    if (statusChartInstance) {
      statusChartInstance.data.labels = Object.keys(statusCounts);
      statusChartInstance.data.datasets[0].data = Object.values(statusCounts);
      statusChartInstance.update();
    } else {
      statusChartInstance = new Chart(ctxStatus, {
        type: 'bar',
        data: {
          labels: Object.keys(statusCounts),
          datasets: [{
            label: 'Incidents',
            data: Object.values(statusCounts),
            backgroundColor: [
              '#DDEFE0', // Reported
              '#C5E3CA', // AI Analyzed
              '#8FBC8F', // Under Review
              '#548c61', // Verified
              '#42734e', // Action Initiated
              '#315C3A'  // Resolved
            ],
            borderRadius: 4,
            maxBarThickness: 20
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            ...commonPlugins,
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { color: '#DDEFE0' },
              ticks: { color: '#657267', precision: 0, font: { family: 'Inter', size: 10 } }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#17231A', font: { family: 'Inter', size: 11 } }
            }
          }
        }
      });
    }
  }

  /**
   * Render Recent Reports Table (Latest 8-10 items)
   */
  function renderRecentReports(reports) {
    const tbody = document.getElementById('recentReportsBody');
    const emptyContainer = document.getElementById('dashboardEmptyState');
    const tableContainer = document.getElementById('recentTableWrapper');

    if (!reports || reports.length === 0) {
      tableContainer.style.display = 'none';
      emptyContainer.style.display = 'flex';
      return;
    }

    tableContainer.style.display = 'block';
    emptyContainer.style.display = 'none';

    // Limit to latest 10 reports
    const latest = reports.slice(0, 10);

    tbody.innerHTML = latest.map(r => {
      // Green intensity dot based on severity
      const dotIntensityClass = r.severity === 'High' ? 'intensity-high'
        : r.severity === 'Medium' ? 'intensity-medium' : 'intensity-low';

      // Clean date formatting
      const dateFormatted = new Date(r.reportDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Status class
      const statusKey = r.status.toLowerCase().replace(/\s+/g, '');

      return `
        <tr>
          <td>
            <a href="report-details.html?id=${r.id}" class="cell-compact" style="font-weight:700;">${r.id}</a>
          </td>
          <td>
            <div class="cell-title-compact" title="${r.title}">${r.title}</div>
            <span class="cell-compact">${r.category}</span>
          </td>
          <td>
            <div class="cell-location-compact" title="${r.location}">${r.location}</div>
            <span class="cell-compact" style="color:var(--c-text-primary); font-weight:500;">${r.city}</span>
          </td>
          <td>
            <div class="severity-indicator">
              <span class="intensity-dot ${dotIntensityClass}"></span>
              <span>${r.severity}</span>
            </div>
          </td>
          <td>
            <span class="cell-compact" style="font-weight:600;">${Math.round(r.confidence * 100)}%</span>
          </td>
          <td>
            <span class="badge badge-status-${statusKey}">
              <span class="dot"></span> ${r.status}
            </span>
          </td>
          <td>
            <span class="cell-compact">${dateFormatted}</span>
          </td>
          <td>
            <a href="report-details.html?id=${r.id}" class="btn btn-outline btn-sm">
              <span>View</span>
              <i data-lucide="arrow-right" style="width:12px; height:12px;"></i>
            </a>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  /**
   * Handle Shared Filter Changes
   */
  async function handleFilterChange() {
    const categoryVal = document.getElementById('dashFilterCategory').value;
    const dateVal = document.getElementById('dashFilterDate').value;
    const cityVal = document.getElementById('dashFilterCity').value;

    let filtered = [...allReportsCache];

    if (categoryVal !== 'all') {
      filtered = filtered.filter(r => r.category.toLowerCase() === categoryVal.toLowerCase());
    }

    if (cityVal !== 'all') {
      filtered = filtered.filter(r => r.city.toLowerCase() === cityVal.toLowerCase());
    }

    if (dateVal !== 'all') {
      // dateVal is '2026-06', '2026-07', '2026-08', '2026-09'
      filtered = filtered.filter(r => r.reportDate.startsWith(dateVal));
    }

    // Update KPIs for filtered subset
    loadKPIs(filtered);

    // Update charts & table
    renderCharts(filtered);
    renderRecentReports(filtered);

    // Update badge count
    const badge = document.getElementById('dashFilteredCountBadge');
    if (badge) {
      badge.textContent = `${filtered.length} of ${allReportsCache.length} reports`;
    }
  }

  /**
   * Reset Shared Filters
   */
  window.resetDashboardFilters = function () {
    document.getElementById('dashFilterCategory').value = 'all';
    document.getElementById('dashFilterDate').value = 'all';
    document.getElementById('dashFilterCity').value = 'all';
    handleFilterChange();
  };

  /**
   * Initialize Dashboard
   */
  async function initDashboard() {
    try {
      // 1. Fetch initial reports
      allReportsCache = await window.EarthData.getReports();

      // 2. Hide skeleton loaders and show metrics
      document.querySelectorAll('.kpi-metric-value.skeleton-shimmer').forEach(el => {
        el.classList.remove('skeleton-shimmer');
      });

      // 3. Load initial KPI numbers with count-up animation
      await loadKPIs(allReportsCache);

      // 4. Render initial charts
      renderCharts(allReportsCache);

      // 5. Render recent reports table
      renderRecentReports(allReportsCache);

      // 6. Bind filter bar change events
      const categorySelect = document.getElementById('dashFilterCategory');
      const dateSelect = document.getElementById('dashFilterDate');
      const citySelect = document.getElementById('dashFilterCity');
      const resetBtn = document.getElementById('dashResetFiltersBtn');

      if (categorySelect) categorySelect.addEventListener('change', handleFilterChange);
      if (dateSelect) dateSelect.addEventListener('change', handleFilterChange);
      if (citySelect) citySelect.addEventListener('change', handleFilterChange);
      if (resetBtn) resetBtn.addEventListener('click', window.resetDashboardFilters);

      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    } catch (err) {
      console.error('Error initializing Environmental Intelligence Dashboard:', err);
    }
  }

  // Auto-run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
  } else {
    initDashboard();
  }
})();
