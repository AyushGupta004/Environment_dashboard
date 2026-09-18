/**
 * EARTH FORWARD — NGO Environmental Intelligence & Action Platform
 * js/map.js — Spatial Intelligence Map & Geospatial Hotspots Controller
 * 
 * Strict Architecture Rule:
 * All data access goes through EarthData (js/data.js):
 * - EarthData.getReports()
 * - EarthData.getHotspots()
 * 
 * Strictly adheres to Ethical AI Language:
 * - "AI-detected suspected issue"
 * - Never "proves" or "confirms" without ground validation.
 */

(function () {
  'use strict';

  // Map state
  let map = null;
  let allReports = [];
  let allHotspots = [];
  let filteredReports = [];

  // Layers
  let markerClusterGroup = null;
  let hotspotsLayerGroup = null;
  let showIncidentMarkers = true;
  let showHotspotBuffers = true;

  // Filter state
  let selectedCategory = 'All';
  let selectedSeverity = 'All';
  let selectedStatus = 'All';
  let selectedCity = 'All';
  let selectedDateRange = 'All';

  /**
   * Category classification mapping for chips
   */
  function matchesCategoryChip(category, chipKey) {
    if (chipKey === 'All') return true;
    const cat = (category || '').toLowerCase();

    if (chipKey === 'Waste') {
      return cat.includes('waste') || cat.includes('garbage') || cat.includes('dumping');
    }
    if (chipKey === 'Burning') {
      return cat.includes('burning') || cat.includes('crop') || cat.includes('fire');
    }
    if (chipKey === 'Air') {
      return cat.includes('air') || cat.includes('particulate') || cat.includes('vehicle');
    }
    if (chipKey === 'Water') {
      return cat.includes('water') || cat.includes('sewage') || cat.includes('drainage') || cat.includes('effluent');
    }
    if (chipKey === 'Industrial') {
      return cat.includes('industrial') || cat.includes('emission');
    }
    if (chipKey === 'Deforestation') {
      return cat.includes('deforestation') || cat.includes('tree');
    }
    if (chipKey === 'Plastic') {
      return cat.includes('plastic');
    }
    return true;
  }

  /**
   * Helper: Category micro-icon for popups
   */
  function getCategoryMiniIcon(category) {
    const cat = (category || '').toLowerCase();
    if (cat.includes('industrial')) return 'factory';
    if (cat.includes('burning')) return 'flame';
    if (cat.includes('water')) return 'droplets';
    if (cat.includes('dumping') || cat.includes('garbage')) return 'trash-2';
    if (cat.includes('air') || cat.includes('vehicle')) return 'wind';
    if (cat.includes('deforestation')) return 'tree-pine';
    return 'alert-circle';
  }

  /**
   * Initialize Leaflet Map with CartoDB Positron Minimal Basemap
   */
  function initMapCanvas() {
    const mapContainer = document.getElementById('leafletMap');
    if (!mapContainer) return;

    // National Capital Region Centroid: [28.58, 77.38], zoom 11
    map = L.map('leafletMap', {
      center: [28.58, 77.38],
      zoom: 11,
      minZoom: 9,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // CartoDB Positron Minimal Basemap (Light Gray / Monochrome)
    L.tileLayer(`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${window.EARTH_FORWARD_CONFIG.CARTO_API_KEY}`, {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    // Initialize Layer Groups
    markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 42,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: function (cluster) {
        const count = cluster.getChildCount();
        let size = count < 5 ? 32 : count < 10 ? 38 : 46;
        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: 'marker-cluster marker-cluster-' + (count < 5 ? 'small' : count < 10 ? 'medium' : 'large'),
          iconSize: L.point(size, size)
        });
      }
    });

    hotspotsLayerGroup = L.layerGroup();

    map.addLayer(markerClusterGroup);
    map.addLayer(hotspotsLayerGroup);
  }

  /**
   * Load Data & Render Markers and Hotspot Zones
   */
  async function loadMapData() {
    try {
      allReports = await window.EarthData.getReports();
      allHotspots = await window.EarthData.getHotspots();

      updateCategoryChipCounts();
      renderHotspotBuffers();
      applyFilters();
      renderTopHotspotsOverview();

      if (window.lucide) {
        window.lucide.createIcons();
      }
    } catch (err) {
      console.error('Failed to load map data:', err);
    }
  }

  /**
   * Update Badge Counts on Category Chips
   */
  function updateCategoryChipCounts() {
    const chips = ['All', 'Waste', 'Burning', 'Air', 'Water', 'Industrial', 'Deforestation', 'Plastic'];
    chips.forEach(key => {
      const el = document.getElementById(`chipCount${key}`);
      if (!el) return;
      if (key === 'All') {
        el.textContent = allReports.length;
      } else {
        const count = allReports.filter(r => matchesCategoryChip(r.category, key)).length;
        el.textContent = count;
      }
    });
  }

  /**
   * Render Regional Hotspot Concentration Buffers
   * Green dashed perimeter and soft tinted radius indicating dense multi-report zones
   */
  function renderHotspotBuffers() {
    hotspotsLayerGroup.clearLayers();

    allHotspots.forEach(hotspot => {
      const lat = hotspot.coordinates[0];
      const lng = hotspot.coordinates[1];
      const radius = hotspot.radiusMeters || 2400;

      // Soft circular density polygon
      const circle = L.circle([lat, lng], {
        radius: radius,
        color: '#315C3A',
        weight: 1.5,
        dashArray: '5, 6',
        fillColor: '#8FBC8F',
        fillOpacity: 0.12,
        interactive: true
      });

      // Hotspot popup
      const popupHtml = `
        <div class="popup-inner-card">
          <div class="popup-header">
            <span class="popup-id-badge">${hotspot.id}</span>
            <span class="badge badge-status-verified" style="font-size:10px; padding:2px 6px;">
              ${hotspot.riskLevel} Risk Cluster
            </span>
          </div>
          <h4 class="popup-title">${hotspot.name}</h4>
          <div class="popup-location-row">
            <i data-lucide="map-pin" style="width:12px; height:12px; color:var(--c-primary);"></i>
            <span>${hotspot.city} &bull; ${radius}m dispersion zone</span>
          </div>
          <p style="font-size:11px; color:var(--c-text-secondary); line-height:1.4; margin:4px 0 0 0;">
            ${hotspot.aiRiskAssessment}
          </p>
          <div class="popup-meta-grid" style="margin-top:6px;">
            <div class="popup-meta-item">
              <span class="popup-meta-label">Active Reports</span>
              <span class="popup-meta-value">${hotspot.activeReports} Incidents</span>
            </div>
            <div class="popup-meta-item">
              <span class="popup-meta-label">Intervention</span>
              <span class="popup-meta-value" style="font-size:10px;">${hotspot.interventionStatus.split(' ')[0]} Active</span>
            </div>
          </div>
          <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
            <span class="popup-ai-label">
              <i data-lucide="shield" style="width:11px; height:11px;"></i>
              Hotspot Cluster
            </span>
            <a href="hotspots.html" class="btn-popup-view" style="font-size:10px; padding:3px 8px;">
              Cluster Audit &rarr;
            </a>
          </div>
        </div>
      `;

      circle.bindPopup(popupHtml, { maxWidth: 300 });
      circle.on('popupopen', () => {
        if (window.lucide) window.lucide.createIcons();
      });

      hotspotsLayerGroup.addLayer(circle);
    });
  }

  /**
   * Apply Filter Bar Criteria Live Without Reload
   */
  function applyFilters() {
    filteredReports = allReports.filter(r => {
      // 1. Category Chip Filter
      if (!matchesCategoryChip(r.category, selectedCategory)) {
        return false;
      }

      // 2. Severity Dropdown
      if (selectedSeverity !== 'All' && r.severity !== selectedSeverity) {
        return false;
      }

      // 3. Status Dropdown
      if (selectedStatus !== 'All' && r.status !== selectedStatus) {
        return false;
      }

      // 4. City Dropdown
      if (selectedCity !== 'All' && r.city !== selectedCity) {
        return false;
      }

      // 5. Date Range Filter
      if (selectedDateRange !== 'All') {
        const days = parseInt(selectedDateRange, 10);
        const reportTime = new Date(r.reportDate).getTime();
        const cutoff = new Date('2026-09-18T16:00:00Z').getTime() - (days * 24 * 60 * 60 * 1000);
        if (reportTime < cutoff) {
          return false;
        }
      }

      return true;
    });

    // Re-plot markers
    plotReportMarkers(filteredReports);

    // Update stats strip and label
    updateStatsKPIs(filteredReports);
  }

  /**
   * Plot Reports as Circle Markers with Green Intensity
   * High: Dark Forest Green (#315C3A)
   * Medium: Medium Sage (#8FBC8F)
   * Low: Light Mint/Sage (#C5E3CA with #315C3A border)
   */
  function plotReportMarkers(reportsToPlot) {
    markerClusterGroup.clearLayers();

    reportsToPlot.forEach(r => {
      if (!r.coordinates || r.coordinates.length < 2) return;

      const isHigh = r.severity === 'High';
      const isMedium = r.severity === 'Medium';

      const color = isHigh ? '#315C3A' : isMedium ? '#8FBC8F' : '#315C3A';
      const fillColor = isHigh ? '#315C3A' : isMedium ? '#8FBC8F' : '#C5E3CA';
      const fillOpacity = isHigh ? 0.92 : isMedium ? 0.85 : 0.75;
      const radius = isHigh ? 9 : isMedium ? 7.5 : 6;

      const circleMarker = L.circleMarker([r.coordinates[0], r.coordinates[1]], {
        radius: radius,
        color: color,
        weight: 1.5,
        fillColor: fillColor,
        fillOpacity: fillOpacity
      });

      // Format date
      const dateStr = new Date(r.reportDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const confPct = Math.round((r.confidence || 0.85) * 100);
      const dotClass = isHigh ? 'dot-high' : isMedium ? 'dot-medium' : 'dot-low';
      const statusKey = r.status.toLowerCase().replace(/\s+/g, '');

      // Styled Custom Leaflet Popup
      const popupContent = `
        <div class="popup-inner-card">
          <div class="popup-header">
            <span class="popup-id-badge">${r.id}</span>
            <span class="badge badge-status-${statusKey}" style="font-size:10px; padding:2px 6px;">
              <span class="dot"></span> ${r.status}
            </span>
          </div>

          <h4 class="popup-title">${r.title}</h4>

          <div class="popup-location-row">
            <i data-lucide="map-pin" style="width:12px; height:12px; color:var(--c-primary);"></i>
            <span>${r.location}, ${r.city}</span>
          </div>

          <div class="popup-meta-grid">
            <div class="popup-meta-item">
              <span class="popup-meta-label">Category</span>
              <span class="popup-meta-value">${r.category}</span>
            </div>
            <div class="popup-meta-item">
              <span class="popup-meta-label">Severity</span>
              <span class="popup-meta-value">
                <span class="intensity-dot ${dotClass}" style="margin-right:2px;"></span>
                ${r.severity}
              </span>
            </div>
            <div class="popup-meta-item">
              <span class="popup-meta-label">AI Confidence</span>
              <span class="popup-meta-value">${confPct}%</span>
            </div>
            <div class="popup-meta-item">
              <span class="popup-meta-label">Date Reported</span>
              <span class="popup-meta-value">${dateStr}</span>
            </div>
          </div>

          <div class="popup-footer-action">
            <span class="popup-ai-label">
              <i data-lucide="info" style="width:11px; height:11px;"></i>
              AI-detected suspected issue
            </span>
            <a href="report-details.html?id=${r.id}" class="btn-popup-view">
              <span>View Report</span>
              <i data-lucide="arrow-right" style="width:12px; height:12px;"></i>
            </a>
          </div>
        </div>
      `;

      circleMarker.bindPopup(popupContent, { maxWidth: 300 });
      circleMarker.on('popupopen', () => {
        if (window.lucide) window.lucide.createIcons();
      });

      markerClusterGroup.addLayer(circleMarker);
    });
  }

  /**
   * Update Stats KPIs and Filter Count
   */
  function updateStatsKPIs(currentFiltered) {
    const totalEl = document.getElementById('statTotalPlotted');
    const highEl = document.getElementById('statHighSeverity');
    const verifiedEl = document.getElementById('statVerifiedIncidents');
    const labelEl = document.getElementById('filteredReportsCount');

    const total = currentFiltered.length;
    const highCount = currentFiltered.filter(r => r.severity === 'High').length;
    const verifiedCount = currentFiltered.filter(r => r.verified || r.status === 'Verified' || r.status === 'Resolved').length;

    if (totalEl) totalEl.textContent = total;
    if (highEl) highEl.textContent = highCount;
    if (verifiedEl) verifiedEl.textContent = verifiedCount;

    if (labelEl) {
      labelEl.textContent = `Showing ${total} of ${allReports.length} reports`;
    }
  }

  /**
   * Render Top Hotspots Overview Summary
   */
  function renderTopHotspotsOverview() {
    const container = document.getElementById('topHotspotsList');
    if (!container || !allHotspots) return;

    const top4 = allHotspots.slice(0, 4);

    container.innerHTML = top4.map(h => `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:var(--space-2) var(--space-3); background:var(--c-surface-subtle); border:1px solid var(--c-border-light); border-radius:var(--radius-md); font-size:var(--text-xs);">
        <div style="display:flex; align-items:center; gap:var(--space-2);">
          <span class="intensity-dot dot-high"></span>
          <div>
            <div style="font-weight:700; color:var(--c-text-primary);">${h.name}</div>
            <div style="font-size:11px; color:var(--c-text-secondary);">${h.primaryCategory} &bull; ${h.city}</div>
          </div>
        </div>
        <button type="button" class="btn btn-outline btn-sm quick-jump-btn" data-center="${h.coordinates[0]},${h.coordinates[1]}" data-zoom="14" style="font-size:11px; padding:0.25rem 0.55rem;">
          Focus &rarr;
        </button>
      </div>
    `).join('');
  }

  /**
   * Event Listeners Setup
   */
  function setupEventListeners() {
    // 1. Category Chips Click
    const chips = document.querySelectorAll('.chip-btn');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedCategory = chip.getAttribute('data-category') || 'All';
        applyFilters();
      });
    });

    // 2. Dropdown Filters Change
    const sevSelect = document.getElementById('mapFilterSeverity');
    if (sevSelect) {
      sevSelect.addEventListener('change', (e) => {
        selectedSeverity = e.target.value;
        applyFilters();
      });
    }

    const statusSelect = document.getElementById('mapFilterStatus');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        selectedStatus = e.target.value;
        applyFilters();
      });
    }

    const citySelect = document.getElementById('mapFilterCity');
    if (citySelect) {
      citySelect.addEventListener('change', (e) => {
        selectedCity = e.target.value;
        applyFilters();
      });
    }

    const dateSelect = document.getElementById('mapFilterDate');
    if (dateSelect) {
      dateSelect.addEventListener('change', (e) => {
        selectedDateRange = e.target.value;
        applyFilters();
      });
    }

    // 3. Reset Filters Button
    const resetBtn = document.getElementById('btnResetMapFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        selectedCategory = 'All';
        selectedSeverity = 'All';
        selectedStatus = 'All';
        selectedCity = 'All';
        selectedDateRange = 'All';

        chips.forEach(c => c.classList.remove('active'));
        const allChip = document.querySelector('.chip-btn[data-category="All"]');
        if (allChip) allChip.classList.add('active');

        if (sevSelect) sevSelect.value = 'All';
        if (statusSelect) statusSelect.value = 'All';
        if (citySelect) citySelect.value = 'All';
        if (dateSelect) dateSelect.value = 'All';

        applyFilters();

        if (map) {
          map.flyTo([28.58, 77.38], 11, { duration: 1.2 });
        }
      });
    }

    // 4. Quick Jump Hotspots Buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.quick-jump-btn');
      if (!btn || !map) return;

      const centerAttr = btn.getAttribute('data-center');
      const zoomAttr = btn.getAttribute('data-zoom') || '14';

      if (centerAttr) {
        const [lat, lng] = centerAttr.split(',').map(Number);
        map.flyTo([lat, lng], parseInt(zoomAttr, 10), {
          duration: 1.4,
          easeLinearity: 0.25
        });
      }
    });

    // 5. Layer Toggles (Incidents / Hotspot Buffers)
    const toggleMarkersBtn = document.getElementById('toggleMarkersLayer');
    if (toggleMarkersBtn) {
      toggleMarkersBtn.addEventListener('click', () => {
        showIncidentMarkers = !showIncidentMarkers;
        if (showIncidentMarkers) {
          map.addLayer(markerClusterGroup);
          toggleMarkersBtn.classList.add('active');
        } else {
          map.removeLayer(markerClusterGroup);
          toggleMarkersBtn.classList.remove('active');
        }
      });
    }

    const toggleHotspotsBtn = document.getElementById('toggleHotspotsLayer');
    if (toggleHotspotsBtn) {
      toggleHotspotsBtn.addEventListener('click', () => {
        showHotspotBuffers = !showHotspotBuffers;
        if (showHotspotBuffers) {
          map.addLayer(hotspotsLayerGroup);
          toggleHotspotsBtn.classList.add('active');
        } else {
          map.removeLayer(hotspotsLayerGroup);
          toggleHotspotsBtn.classList.remove('active');
        }
      });
    }
  }

  // Initialize on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initMapCanvas();
      loadMapData();
      setupEventListeners();
    });
  } else {
    initMapCanvas();
    loadMapData();
    setupEventListeners();
  }

})();
