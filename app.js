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

    // CORE LOGIC: DATA FETCHING (REAL-TIME: MONTGOMERY COUNTY MC311)
    const fetchData = async () => {
        const API_URL = "https://data.montgomerycountymd.gov/resource/jrcn-in39.json?$limit=15&$order=created DESC";
        
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            const rawData = await response.json();

            // Transform MC311 data into Dashboard format
            return {
                kpis: {
                    total: rawData.length, // Shown as current batch
                    category: rawData[0]?.sr_area || "N/A"
                },
                trend: Array.from({ length: 12 }, () => Math.floor(Math.random() * 60) + 20),
                records: rawData.map(item => ({
                    id: item.sr_num,
                    time: new Date(item.created).toLocaleTimeString('en-US', { hour12: false }),
                    module: item.department,
                    action: item.sr_area,
                    status: item.sr_stat_id
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
            data.records.forEach(r => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${r.id}</td>
                    <td>${r.time}</td>
                    <td>${r.module}</td>
                    <td>${r.action}</td>
                    <td><span class="status-tag ${r.status === 'Closed' ? 'tag-success' : 'tag-warning'}">${r.status}</span></td>
                `;
                elements.tableBody.appendChild(tr);
            });
        }
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

    // EVENT LISTENERS
    elements.refreshBtn.addEventListener('click', handleRefresh);

    // Sidebar Mobile Toggle
    elements.openSidebar.addEventListener('click', () => elements.sidebar.classList.add('open'));
    elements.closeSidebar.addEventListener('click', () => elements.sidebar.classList.remove('open'));

    // INITIAL LOAD
    handleRefresh();
});

// Grounded Architecture Note
console.log("SHERLOG.OS Client Logic Layer v3.0 (Strict Rationality)");
console.log("Mock data connection established.");
