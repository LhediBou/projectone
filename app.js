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

    // CORE LOGIC: DATA FETCHING (SIMULATED)
    const fetchData = () => {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // Occasional error simulation (5% chance)
                const rand = Math.random();
                if (rand < 0.03) {
                    reject("Connection Error");
                } else if (rand < 0.05) {
                    reject("Service Error");
                } else {
                    const recordCount = 10 + Math.floor(Math.random() * 5); // 10 to 15 records
                    const data = {
                        kpis: {
                            total: 12400 + Math.floor(Math.random() * 1000),
                            category: MOCK_DATA.categories[Math.floor(Math.random() * MOCK_DATA.categories.length)]
                        },
                        trend: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 10),
                        records: Array.from({ length: recordCount }, (_, i) => ({
                            id: `00${2400 + i}`,
                            time: new Date().toLocaleTimeString('en-US', { hour12: false }),
                            module: MOCK_DATA.modules[Math.floor(Math.random() * MOCK_DATA.modules.length)],
                            action: MOCK_DATA.actions[Math.floor(Math.random() * MOCK_DATA.actions.length)],
                            status: MOCK_DATA.statuses[Math.floor(Math.random() * MOCK_DATA.statuses.length)]
                        }))
                    };
                    resolve(data);
                }
            }, 600);
        });
    };

    // UI RENDERERS
    const renderUI = (data) => {
        // Hide states
        elements.error.classList.add('hidden');
        elements.empty.classList.add('hidden');

        // Update KPIs (duration updated in handleRefresh)
        elements.totalKpi.textContent = data.kpis.total.toLocaleString();
        elements.categoryKpi.textContent = data.kpis.category;
        elements.lastRefresh.textContent = new Date().toLocaleTimeString();

        // Render Chart
        elements.chartBars.innerHTML = '';
        data.trend.forEach(val => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${val}%`;
            elements.chartBars.appendChild(bar);
        });

        // Render Module Status (Static logic + mock data)
        elements.moduleStatuses.innerHTML = '';
        MOCK_DATA.modules.forEach(m => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.padding = '8px 0';
            li.style.borderBottom = '1px solid var(--border)';
            li.innerHTML = `<span>${m}</span> <span class="status-tag tag-success">Online</span>`;
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
                    <td><span class="status-tag ${r.status === 'Completed' ? 'tag-success' : 'tag-warning'}">${r.status}</span></td>
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

            // Calculate real duration
            const duration = Math.round(performance.now() - startTime);
            elements.loadKpi.textContent = `${duration} ms`;
            elements.loadTrend.textContent = duration > 1000 ? 'Delayed' : 'Optimal performance';

        } catch (err) {
            console.error(err);
            const errorText = document.getElementById('error-text');
            if (err === "Service Error") {
                errorText.textContent = "⚠️ Service temporarily unavailable. Retrying sync in 30s...";
            } else {
                errorText.textContent = "⚠️ Connection interrupted. Please check network status.";
            }
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
