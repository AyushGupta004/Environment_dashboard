/**
 * EARTH FORWARD — NGO Environmental Intelligence & Action Platform
 * js/app.js — Shared Application Shell & Navigation Controller
 *
 * Responsibilities:
 * - Injects shared persistent Sidebar & Topbar across application pages
 * - Active route / link detection by filename
 * - Mobile drawer & sidebar toggle behavior
 * - Global instant search across environmental reports (ID, category, location, severity)
 * - Notification dropdown & dismiss behavior
 * - Shared modal / settings handler
 */

(function () {
  'use strict';

  // Navigation Items per specifications:
  // Dashboard, Reports, Environmental Map, Analytics, Hotspots, Organizations, Proposals, Impact, Divider, Settings
  const NAV_ITEMS = [
    { label: 'Dashboard', href: 'dashboard.html', icon: 'layout-dashboard' },
    { label: 'Reports', href: 'reports.html', icon: 'file-search' },
    { label: 'Environmental Map', href: 'map.html', icon: 'map' },
    { label: 'Analytics', href: 'analytics.html', icon: 'bar-chart-3' },
    { label: 'Hotspots', href: 'hotspots.html', icon: 'map-pin' },
    { label: 'Organizations', href: 'organizations.html', icon: 'users' },
    { label: 'Proposals', href: 'proposal.html', icon: 'file-text' },
    { label: 'Impact', href: 'impact.html', icon: 'shield-check' }
  ];

  // Mock Notification Feed (Strictly using responsible AI framing)
  const NOTIFICATIONS = [
    {
      id: 'NOTIF-1',
      title: 'AI-detected suspected issue in Sector 63',
      meta: 'High-opacity plume reported • 12m ago',
      unread: true,
      link: 'report-details.html?id=REP-2026-001'
    },
    {
      id: 'NOTIF-2',
      title: 'Surajpur Wetland Debris Triage Required',
      meta: '400 sq.m encroachment flagged • 1h ago',
      unread: true,
      link: 'report-details.html?id=REP-2026-004'
    },
    {
      id: 'NOTIF-3',
      title: 'Dr. Radhika Sen logged water sample report',
      meta: 'Mangolpuri drain investigation • 3h ago',
      unread: false,
      link: 'report-details.html?id=REP-2026-008'
    }
  ];

  function getCurrentFilename() {
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return filename.split('?')[0];
  }

  function renderSidebar(currentFile) {
    const navLinksHtml = NAV_ITEMS.map(item => {
      const isActive = currentFile === item.href;

      return `
        <a href="${item.href}" class="nav-link ${isActive ? 'active' : ''}" data-nav="${item.label}">
          <i data-lucide="${item.icon}"></i>
          <span>${item.label}</span>
        </a>
      `;
    }).join('');

    return `
      <div class="sidebar-header">
        <a href="dashboard.html" class="brand-wrapper">
          <div class="brand-badge">EF</div>
          <div class="brand-meta">
            <span class="brand-title">EARTH FORWARD</span>
            <span class="brand-sub">NGO Intelligence</span>
          </div>
        </a>
        <button id="sidebarCloseBtn" class="sidebar-close-btn" aria-label="Close Navigation">
          <i data-lucide="x"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <span class="nav-label">Intelligence & Action</span>
        ${navLinksHtml}
        
        <div class="nav-divider"></div>
        
        <a href="settings.html" class="nav-link ${currentFile === 'settings.html' ? 'active' : ''}">
          <i data-lucide="settings"></i>
          <span>Settings</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div>
          <strong style="color:var(--c-text-primary);">NCR Sector Ops</strong>
          <div style="font-size:11px; margin-top:2px;">Person 3: NGO Platform</div>
        </div>
        <a href="index.html" title="Sign Out" style="color:var(--c-text-secondary); display:flex; align-items:center;">
          <i data-lucide="log-out" style="width:16px; height:16px;"></i>
        </a>
      </div>
    `;
  }

  function renderTopbar() {
    const notifItemsHtml = NOTIFICATIONS.length > 0 ? NOTIFICATIONS.map(n => `
      <a href="${n.link}" class="notification-item" style="text-decoration:none; display:block;">
        <div class="notification-title" style="display:flex; justify-content:space-between;">
          <span>${n.title}</span>
          ${n.unread ? '<span style="display:inline-block; width:6px; height:6px; background:var(--c-primary); border-radius:50%;"></span>' : ''}
        </div>
        <div class="notification-time">${n.meta}</div>
      </a>
    `).join('') : `
      <div class="empty-state" style="padding:var(--space-6) var(--space-4); border:none; margin:0;">
        <div class="empty-state-icon" style="width:36px; height:36px; margin-bottom:var(--space-2);">
          <i data-lucide="bell-off"></i>
        </div>
        <div class="empty-state-title" style="font-size:var(--text-xs);">No notifications</div>
        <div class="empty-state-desc" style="font-size:11px;">All regional environmental alerts have been reviewed.</div>
      </div>
    `;

    return `
      <div class="topbar-left">
        <button id="mobileMenuBtn" class="mobile-menu-btn" aria-label="Open Navigation">
          <i data-lucide="menu"></i>
        </button>
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="topbar-platform-title">Earth Forward</span>
            <span class="demo-data-pill" style="margin:0; padding:2px 7px; font-size:10px;">
              <span class="dot" style="width:5px; height:5px;"></span> DEMO DATA
            </span>
          </div>
          <span class="topbar-platform-sub">NGO Environmental Intelligence &amp; Action</span>
        </div>
      </div>

      <div class="topbar-right">
        <!-- Global Search Input -->
        <div class="topbar-search">
          <i data-lucide="search" class="topbar-search-icon"></i>
          <input 
            type="text" 
            id="globalSearchInput" 
            class="topbar-search-input" 
            placeholder="Search reports..."
            autocomplete="off"
          />
          <div id="searchResultsDropdown" class="search-results-dropdown"></div>
        </div>

        <!-- Notifications Bell -->
        <div class="notifications-wrapper">
          <button id="notifBellBtn" class="topbar-icon-btn" aria-label="View notifications">
            <i data-lucide="bell"></i>
            <span class="unread-dot"></span>
          </button>
          <div id="notifDropdown" class="notifications-dropdown">
            <div class="notifications-header">
              <span>Incident Alerts</span>
              <span class="badge badge-severity-medium" style="font-size:10px;">${NOTIFICATIONS.filter(n => n.unread).length} Unread</span>
            </div>
            ${notifItemsHtml}
            <div style="padding:var(--space-2) var(--space-4); text-align:center; background:var(--c-surface-subtle); border-bottom-left-radius:var(--radius-lg); border-bottom-right-radius:var(--radius-lg);">
              <a href="reports.html" style="font-size:11px; font-weight:600; color:var(--c-primary);">View All Incidents &rarr;</a>
            </div>
          </div>
        </div>

        <!-- NGO Profile Chip -->
        <a href="#profile" id="profileChipBtn" class="profile-chip">
          <div class="profile-avatar">NGO</div>
          <span class="profile-name">NGO Officer</span>
        </a>
      </div>
    `;
  }

  function renderSettingsModal() {
    return `
      <div id="settingsModalBackdrop" class="modal-backdrop">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-title">Platform Configuration</div>
            <button id="closeSettingsModal" class="btn btn-ghost btn-sm" aria-label="Close modal">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="ai-notice-banner" style="margin-bottom:var(--space-4);">
              <span class="ai-notice-tag">Demo Mode</span>
              <span>Local storage overlay active. All mutations persist in your browser session.</span>
            </div>

            <div class="form-group">
              <label class="form-label">Active NGO Jurisdiction</label>
              <input type="text" class="form-control" value="NCR Regional Coalition (Delhi, Noida, Ghaziabad)" readonly>
            </div>

            <div class="form-group">
              <label class="form-label">Responsible AI Threshold</label>
              <input type="text" class="form-control" value="0.70 Minimum Confidence for Automated Triage" readonly>
            </div>

            <div class="form-group" style="margin-top:var(--space-4);">
              <label class="form-label">Reset Local Demo Storage</label>
              <p style="font-size:var(--text-xs); color:var(--c-text-secondary); margin-bottom:var(--space-2);">Restores original 50 citizen reports and resets any field notes or status changes.</p>
              <button id="modalResetDataBtn" class="btn btn-secondary btn-sm">
                <i data-lucide="rotate-ccw"></i> Reset to Base Data
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button id="dismissSettingsModal" class="btn btn-primary btn-sm">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  // Bind interactions
  function initInteractions() {
    const currentFile = getCurrentFilename();

    // Mobile Drawer Elements
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
      mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
      });

      const closeDrawer = () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      };

      if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeDrawer);
      sidebarOverlay.addEventListener('click', closeDrawer);
    }

    // Notifications Dropdown
    const notifBellBtn = document.getElementById('notifBellBtn');
    const notifDropdown = document.getElementById('notifDropdown');

    if (notifBellBtn && notifDropdown) {
      notifBellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('active');
      });

      document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && e.target !== notifBellBtn) {
          notifDropdown.classList.remove('active');
        }
      });
    }

    // Global Search Controller
    const searchInput = document.getElementById('globalSearchInput');
    const searchDropdown = document.getElementById('searchResultsDropdown');

    if (searchInput && searchDropdown) {
      let debounceTimer = null;

      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 2) {
          searchDropdown.classList.remove('active');
          searchDropdown.innerHTML = '';
          return;
        }

        debounceTimer = setTimeout(async () => {
          if (window.EarthData && typeof window.EarthData.getReports === 'function') {
            const results = await window.EarthData.getReports({ search: query });
            renderSearchResults(results.slice(0, 6), query);
          }
        }, 150);
      });

      // Close search on outside click
      document.addEventListener('click', (e) => {
        if (!searchDropdown.contains(e.target) && e.target !== searchInput) {
          searchDropdown.classList.remove('active');
        }
      });
    }

    function renderSearchResults(results, query) {
      if (!results || results.length === 0) {
        searchDropdown.innerHTML = `
          <div class="empty-state" style="padding:var(--space-6) var(--space-4); border:none; margin:0;">
            <div class="empty-state-icon" style="width:36px; height:36px; margin-bottom:var(--space-2);">
              <i data-lucide="search-x"></i>
            </div>
            <div class="empty-state-title" style="font-size:var(--text-xs);">No search results</div>
            <div class="empty-state-desc" style="font-size:11px;">No environmental reports match "<strong>${escapeHtml(query)}</strong>"</div>
          </div>
        `;
        searchDropdown.classList.add('active');
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      searchDropdown.innerHTML = results.map(r => `
        <a href="report-details.html?id=${r.id}" class="search-result-item">
          <div class="search-result-header">
            <span class="search-result-title">${r.id} • ${r.category}</span>
            <span class="badge badge-severity-${r.severity.toLowerCase()}">${r.severity}</span>
          </div>
          <div class="search-result-meta">${r.title}</div>
          <div class="cell-compact" style="font-size:10px;">${r.location}, ${r.city}</div>
        </a>
      `).join('');

      searchDropdown.classList.add('active');
    }

    // Settings Modal
    const settingsNavLink = document.getElementById('settingsNavLink');
    const profileChipBtn = document.getElementById('profileChipBtn');
    const settingsModalBackdrop = document.getElementById('settingsModalBackdrop');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    const dismissSettingsModal = document.getElementById('dismissSettingsModal');
    const modalResetDataBtn = document.getElementById('modalResetDataBtn');

    function openSettings(e) {
      if (e) e.preventDefault();
      if (settingsModalBackdrop) settingsModalBackdrop.classList.add('active');
    }

    function closeSettings() {
      if (settingsModalBackdrop) settingsModalBackdrop.classList.remove('active');
    }

    if (settingsNavLink) settingsNavLink.addEventListener('click', openSettings);
    if (profileChipBtn) profileChipBtn.addEventListener('click', openSettings);
    if (closeSettingsModal) closeSettingsModal.addEventListener('click', closeSettings);
    if (dismissSettingsModal) dismissSettingsModal.addEventListener('click', closeSettings);

    if (modalResetDataBtn) {
      modalResetDataBtn.addEventListener('click', () => {
        const confirmed = confirm('Confirm Demo Data Reset: This will restore the base 50 citizen reports and permanently clear custom field assignments, status transitions, and NGO notes. Proceed?');
        if (confirmed && window.EarthData && typeof window.EarthData.resetDemoData === 'function') {
          window.EarthData.resetDemoData();
          alert('Demo data successfully reseeded to original base state.');
          location.reload();
        }
      });
    }

    // Re-instantiate icons
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Shell Injection Entry Point
  function initAppShell() {
    const currentFile = getCurrentFilename();

    // Do not inject shell on index.html (the login screen)
    if (currentFile === 'index.html' || document.body.classList.contains('login-page')) {
      return;
    }

    const appShell = document.getElementById('app-shell') || document.querySelector('.app-shell');
    if (!appShell) return;

    // 1. Inject or update Sidebar
    let sidebar = appShell.querySelector('.sidebar');
    let overlay = appShell.querySelector('.sidebar-overlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      appShell.insertBefore(overlay, appShell.firstChild);
    }

    if (!sidebar) {
      sidebar = document.createElement('aside');
      sidebar.className = 'sidebar';
      appShell.insertBefore(sidebar, overlay.nextSibling);
    }
    sidebar.innerHTML = renderSidebar(currentFile);

    // 2. Inject or update Topbar
    const mainContent = appShell.querySelector('.main-content');
    if (mainContent) {
      let topbar = mainContent.querySelector('.topbar');
      if (!topbar) {
        topbar = document.createElement('header');
        topbar.className = 'topbar';
        mainContent.insertBefore(topbar, mainContent.firstChild);
      }
      topbar.innerHTML = renderTopbar();
    }

    // 3. Inject Settings Modal if missing
    if (!document.getElementById('settingsModalBackdrop')) {
      const modalWrapper = document.createElement('div');
      modalWrapper.innerHTML = renderSettingsModal();
      document.body.appendChild(modalWrapper.firstElementChild);
    }

    initInteractions();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppShell);
  } else {
    initAppShell();
  }

  // Expose namespace for debugging or custom programmatic trigger
  window.EarthApp = {
    initAppShell,
    getCurrentFilename
  };
})();
