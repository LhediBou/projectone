document.addEventListener('DOMContentLoaded', () => {

    // UI ELEMENTS
    const elements = {
        totalKpi: document.getElementById('kpi-total'),
        loadKpi: document.getElementById('kpi-load'),
        loadTrend: document.getElementById('kpi-load-trend'),
        categoryKpi: document.getElementById('kpi-category'),
        lastRefresh: document.getElementById('last-refresh-time'),
        refreshBtn: document.getElementById('refresh-btn'),
        tableBody: document.getElementById('table-body'),
        chartBars: document.getElementById('chart-bars'),
        loading: document.getElementById('loading-overlay'),
        error: document.getElementById('error-message'),
        empty: document.getElementById('empty-state'),
        sidebar: document.getElementById('sidebar'),
        openSidebar: document.getElementById('open-sidebar'),
        closeSidebar: document.getElementById('close-sidebar'),
        moduleStatuses: document.getElementById('module-status-container'),
        terminalBody: document.getElementById('terminal-body')
    };

    // LOGGING UTILITY
    const addLog = (message, type = "info") => {
        if (!elements.terminalBody) return;
        const entry = document.createElement("div");
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        entry.className = `log-entry ${type}-msg`;
        entry.textContent = `[${timestamp}] ${message}`;
        
        elements.terminalBody.prepend(entry);
        
        // Limit logs to last 30
        while (elements.terminalBody.children.length > 30) {
            elements.terminalBody.lastChild.remove();
        }
    };

    addLog("SHERLOG.OS v1.0.5 KERNEL LOADED", "system");
    addLog("HYPERVISOR UPLINK: ESTABLISHED", "info");
    addLog("GEOSPATIAL MODULE: ACTIVE", "info");

    // MOCK DATA ADAPTER
    const MOCK_DATA = {
        modules: ["SHERLOG", "ATHENA", "SPLASH", "INTERACTION", "LOOP"],
        actions: ["File Audit", "Batch Sync", "State Update", "Event Hook", "Logic Link"],
        categories: ["Monitoring", "Sync", "Auth", "IO", "AI"],
        statuses: ["Completed", "Processing", "Warning"]
    };

    // UTILITIES
    // [PRECISION] 19870_XINU: Temporal Sealing Epoch
    const formatStatusTime = (dateInput) => {
        const d = new Date(dateInput);
        const date = d.toISOString().split('T')[0];
        const time = d.toLocaleTimeString('en-US', { hour12: false });
        return `${date} ${time}`;
    };

    // MAP INITIALIZATION
    let map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([39.1547, -77.2405], 11); // Montgomery County Center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    let markerGroup = L.layerGroup().addTo(map);

    // SHERLOG HQ MARKER (Permanent)
    const hqCoords = [39.1547, -77.2405];
    const hqMarker = L.circleMarker(hqCoords, {
        radius: 12,
        fillColor: "#fff",
        color: "#4a90e2",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
        className: 'hq-pulse-marker'
    }).addTo(map);
    
    hqMarker.bindPopup(`
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; text-align: center;">
            <strong style="color: #4a90e2;">SHERLOG HQ</strong><br>
            <span>UPLINK CENTER ALPHA</span><br>
            <span style="font-size: 0.6rem; color: #888;">COORD: 39.1547, -77.2405</span>
        </div>
    `).openPopup();

    // CORE LOGIC: DATA FETCHING (REAL-TIME: MONTGOMERY POLICE DISPATCH)
    const fetchData = async () => {
        const API_URL = "https://data.montgomerycountymd.gov/resource/98cc-bc7d.json?$limit=15&$order=start_time DESC";
        
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const rawData = await response.json();

            // Transform Police Data into Dashboard format
            return {
                kpis: {
                    total: rawData.length,
                    category: rawData[0]?.initial_type || "N/A"
                },
                trend: Array.from({ length: 12 }, () => Math.floor(Math.random() * 80) + 10),
                records: rawData.map(item => ({
                    id: item.incident_id,
                    time: formatStatusTime(item.start_time),
                    module: "POLICE DISPATCH",
                    action: item.initial_type,
                    status: item.priority === "1" ? "CRITICAL" : (item.priority === "2" ? "HIGH" : "NORMAL"),
                    lat: parseFloat(item.latitude),
                    lng: parseFloat(item.longitude),
                    address: item.address
                }))
            };
        } catch (error) {
            console.error("Fetch Error:", error);
            throw error;
        }
    };

    // UI RENDERERS
    const renderUI = (data) => {
        elements.error.classList.add('hidden');
        elements.empty.classList.add('hidden');

        // Update KPIs
        elements.totalKpi.textContent = data.kpis.total;
        elements.categoryKpi.textContent = data.kpis.category;
        elements.lastRefresh.textContent = new Date().toLocaleTimeString();

        // Update Map Markers
        markerGroup.clearLayers();
        data.records.forEach(r => {
            if (r.lat && r.lng) {
                const color = r.status === 'CRITICAL' ? '#ff2975' : (r.status === 'HIGH' ? '#d29922' : '#3fb950');
                const marker = L.circleMarker([r.lat, r.lng], {
                    radius: r.status === 'CRITICAL' ? 8 : 6,
                    fillColor: color,
                    color: "#fff",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).addTo(markerGroup);
                
                marker.bindPopup(`
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;">
                        <strong style="color: ${color}">[${r.status}]</strong><br>
                        <strong>Type:</strong> ${r.action}<br>
                        <strong>Addr:</strong> ${r.address}
                    </div>
                `);
            }
        });

        // Fit map to markers if we have any
        if (data.records.length > 0) {
            const group = new L.featureGroup(markerGroup.getLayers());
            map.fitBounds(group.getBounds().pad(0.1));
        }

        // Update Module Status
        elements.moduleStatuses.innerHTML = '';
        const uniqueDepts = [...new Set(data.records.map(r => r.module))].slice(0, 5);
        uniqueDepts.forEach(dept => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.padding = '8px 0';
            li.style.borderBottom = '1px solid var(--border)';
            li.innerHTML = `<span>${dept}</span> <span class="status-tag tag-success">Active</span>`;
            elements.moduleStatuses.appendChild(li);
        });

        // Render Table
        elements.tableBody.innerHTML = '';
        if (data.records.length === 0) {
            elements.empty.classList.remove('hidden');
        } else {
            data.records.forEach(r => {
                const tr = document.createElement('tr');
                const priority = r.status;
                const statusClass = priority === 'CRITICAL' ? 'tag-danger' : 
                                   (priority === 'HIGH' ? 'tag-warning' : 'tag-success');
                tr.innerHTML = `
                    <td>#${r.id}</td>
                    <td>${r.time}</td>
                    <td>${r.module}</td>
                    <td>${r.action}</td>
                    <td><span class="status-tag ${statusClass}">${priority}</span></td>
                `;
                elements.tableBody.appendChild(tr);
            });
        }

        // Update City Health
        const healthStatus = document.getElementById('health-status');
        const healthContainer = document.getElementById('city-health-container');
        const criticalCount = data.records.filter(r => r.status === 'CRITICAL').length;
        const highCount = data.records.filter(r => r.status === 'HIGH').length;

        healthContainer.className = 'city-health'; // Reset
        if (criticalCount > 0) {
            healthStatus.textContent = 'STATE: CRITICAL';
            healthContainer.classList.add('health-critical');
            addLog(`THREAT LEVEL ESCALATION: ${criticalCount} CRITICAL INCIDENTS`, "alert");
        } else if (highCount > 2) {
            healthStatus.textContent = 'STATE: CAUTION';
            healthContainer.classList.add('health-caution');
            addLog("ENVIRONMENTAL CAUTION: ELEVATED INCIDENT VOLUME", "warning");
        } else {
            healthStatus.textContent = 'STATE: OPTIMAL';
            healthContainer.classList.add('health-optimal');
        }
    };

    const handleRefresh = async () => {
        const startTime = performance.now();
        elements.loading.classList.remove('hidden');
        elements.refreshBtn.disabled = true;

        try {
            addLog("LATENCY CHECK: INITIATING UPLINK...", "info");
            const data = await fetchData();
            renderUI(data);

            const duration = Math.round(performance.now() - startTime);
            elements.loadKpi.textContent = `${duration} ms`;
            elements.loadTrend.textContent = 'Live Uplink: Active';
            
            elements.lastRefresh.textContent = formatStatusTime(new Date());
            addLog(`SYNC COMPLETE: ${data.records.length} RECORDS INGESTED (LTCY: ${duration}ms)`, "info");

        } catch (err) {
            console.error(err);
            const errorText = document.getElementById('error-text');
            errorText.textContent = "⚠️ Data link interrupted. Verify Socrata endpoint.";
            elements.error.classList.remove('hidden');
            addLog("CRITICAL: UPLINK INTERRUPTION DETECTED", "alert");
        } finally {
            elements.loading.classList.add('hidden');
            elements.refreshBtn.disabled = false;
        }
    };

    // NAVIGATION LOGIC
    const dashboardView = document.getElementById('dashboard-view');
    const briefView = document.getElementById('brief-view');
    const navDashboard = document.getElementById('nav-dashboard');
    const navBrief = document.getElementById('nav-brief');
    const kpiSection = document.querySelector('.kpi-grid');
    const visualSection = document.querySelector('.visuals-grid');

    const switchView = (target) => {
        if (target === 'dashboard') {
            dashboardView.classList.remove('hidden');
            kpiSection.classList.remove('hidden');
            visualSection.classList.remove('hidden');
            briefView.classList.add('hidden');
            navDashboard.classList.add('active');
            navBrief.classList.remove('active');
        } else {
            dashboardView.classList.add('hidden');
            kpiSection.classList.add('hidden');
            visualSection.classList.add('hidden');
            briefView.classList.remove('hidden');
            navDashboard.classList.remove('active');
            navBrief.classList.add('active');
        }
        // Always close sidebar on mobile after click
        elements.sidebar.classList.remove('open');
    };

    navDashboard.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('dashboard');
    });

    navBrief.addEventListener('click', (e) => {
        e.preventDefault();
        switchView('brief');
    });

    elements.refreshBtn.addEventListener('click', handleRefresh);

    // INITIAL LOAD
    handleRefresh();
});

// Grounded Architecture Note
console.log("SHERLOG.OS Client Logic Layer v3.0 (Strict Rationality)");
console.log("Mock data connection established.");
