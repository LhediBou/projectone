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
        moduleStatuses: document.getElementById('module-status-container')
    };

    // MOCK DATA ADAPTER
    const MOCK_DATA = {
        modules: ["SHERLOG", "ATHENA", "SPLASH", "INTERACTION", "LOOP"],
        actions: ["File Audit", "Batch Sync", "State Update", "Event Hook", "Logic Link"],
        categories: ["Monitoring", "Sync", "Auth", "IO", "AI"],
        statuses: ["Completed", "Processing", "Warning"]
    };

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
                    time: formatTwoLineDate(item.start_time),
                    module: "POLICE DISPATCH",
                    action: item.initial_type,
                    status: item.priority === "1" ? "CRITICAL" : (item.priority === "2" ? "HIGH" : "NORMAL")
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

        // Render Chart (Simulated load pattern for now)
        elements.chartBars.innerHTML = '';
        data.trend.forEach(val => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${val}%`;
            elements.chartBars.appendChild(bar);
        });

        // Update Module Status (Dynamic based on departments in feed)
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
                const priority = r.status; // Using the mapped status as priority label
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
    };

    const formatTwoLineDate = (dateInput) => {
        const d = new Date(dateInput);
        const time = d.toLocaleTimeString('en-US', { hour12: false });
        const day = String(d.getDate()).padStart(2, '0');
        const months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juill.", "août", "sept.", "oct.", "nov.", "déc."];
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        return `<div class="time-part">${time}</div><div class="date-part">${day}/${month}/${year}</div>`;
    };

    const handleRefresh = async () => {
        const startTime = performance.now();
        elements.loading.classList.remove('hidden');
        elements.refreshBtn.disabled = true;

        try {
            const data = await fetchData();
            renderUI(data);

            const duration = Math.round(performance.now() - startTime);
            elements.loadKpi.textContent = `${duration} ms`;
            elements.loadTrend.textContent = 'Live Uplink: Active';
            
            elements.refreshTime.innerHTML = formatTwoLineDate(new Date());

        } catch (err) {
            console.error(err);
            const errorText = document.getElementById('error-text');
            errorText.textContent = "⚠️ Data link interrupted. Verify Socrata endpoint.";
            elements.error.classList.remove('hidden');
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

    // INITIAL LOAD
    handleRefresh();
});

// Grounded Architecture Note
console.log("SHERLOG.OS Client Logic Layer v3.0 (Strict Rationality)");
console.log("Mock data connection established.");
