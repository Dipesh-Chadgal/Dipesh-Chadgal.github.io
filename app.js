/* ==========================================================================
   APP DRIVER - PORTFOLIO INTERACTIVES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTerminal();
    initPipeline();
    initTopology();
    initTelemetry();
    initModals();
    initContactForm();
});

/* ==========================================================================
   1. INTERACTIVE TERMINAL EMULATOR
   ========================================================================== */
function initTerminal() {
    const terminalOutput = document.getElementById('terminal-output');
    terminalOutput.style.position = 'relative';
    const terminalTyped = document.getElementById('terminal-typed');

    // Command data
    const commands = {
        help: `Available commands:<br>
          <span class="color-blue">about</span>     - Display professional background<br>
          <span class="color-blue">skills</span>    - List core competencies & technologies<br>
          <span class="color-blue">projects</span>  - Show featured engineering projects<br>
          <span class="color-blue">clear</span>     - Clear terminal buffer<br>
          <span class="color-blue">systemctl</span> - View cluster daemon status`,
        about: `Dipesh Singh Chadgal | DevOps Engineer at Wipro<br>
          --------------------------------<br>
          I specialize in building self-healing infrastructures and optimizing deployment velocity.<br>
          Experience: 5+ Years in DevOps & Platform Engineering.<br>
          Certifications: CKA (Certified Kubernetes Administrator), AWS Solutions Architect Pro.<br>
          Mission: Automate everything. Secure the software delivery chain. Eliminate human error.`,
        skills: `Core Competencies Matrix:<br>
          ------------------------<br>
          [IaC]        Terraform, Ansible, Pulumi<br>
          [Orch]       Kubernetes (EKS/GKE), Docker, Helm<br>
          [CI/CD]      GitHub Actions, ArgoCD (GitOps), GitLab CI<br>
          [Clouds]     AWS, Google Cloud (GCP)<br>
          [Monitor]    Prometheus, Grafana, OpenTelemetry, ELK Stack<br>
          [Dev]        Python, Go, Bash, TypeScript`,
        projects: `Featured Projects:<br>
          -----------------<br>
          1. Multi-Region Kubernetes via Terraform (AWS)<br>
          2. GitOps Continuous Delivery Engine (ArgoCD)<br>
          3. Prometheus Service Level Monitoring (Grafana)<br>
          4. Kubernetes Cluster Security Hardening (Kyverno/Falco)<br>
          Type the corresponding number in the web page interface below to view structural diagrams.`,
        systemctl: `● dipesh-chadgal-portfolio.service - DevOps Engineer Portfolio<br>
             Loaded: loaded (/etc/systemd/system/dipesh-chadgal-portfolio.service; enabled)<br>
             Active: active (running) since Sat 2026-07-11 10:34:00 UTC<br>
             Main PID: 2026 (node)<br>
             CGroup: /system.slice/dipesh-chadgal-portfolio.service<br>
                     └─2026 /usr/bin/node /app/portfolio/server.js<br>
          All nodes online. Service is running optimally.`
    };

    // Welcome sequence
    const welcomeLines = [
        "Connecting to secure workspace cluster...",
        "Authorized guest session established.",
        "System initialization complete.",
        "Type 'help' to explore available commands."
    ];

    // Typist helper
    let currentInput = "";
    let autoTypingActive = true;

    // Inject hidden input to handle mobile & desktop keyboard capture smoothly
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'text';
    hiddenInput.autocomplete = 'off';
    hiddenInput.setAttribute('autocorrect', 'off');
    hiddenInput.setAttribute('autocapitalize', 'off');
    hiddenInput.setAttribute('spellcheck', 'false');

    hiddenInput.style.position = 'fixed';
    hiddenInput.style.opacity = '0.01';
    hiddenInput.style.pointerEvents = 'none';
    hiddenInput.style.left = '0';
    hiddenInput.style.top = '0';
    hiddenInput.style.width = '0px';
    hiddenInput.style.height = '0px';
    hiddenInput.style.border = 'none';
    hiddenInput.style.outline = 'none';
    hiddenInput.style.background = 'transparent';
    hiddenInput.style.caretColor = 'transparent';
    hiddenInput.style.fontSize = '16px'; // Prevent page zoom on iOS
    terminalOutput.appendChild(hiddenInput);

    // Initial output
    welcomeLines.forEach(line => {
        printLine(line, 'output');
    });

    const terminalCard = document.querySelector('.hero-terminal');

    // Auto-type start command
    setTimeout(() => {
        typeCommand("systemctl status dipesh-chadgal-portfolio.service", () => {
            executeCommand("systemctl");
            autoTypingActive = false;
            hiddenInput.focus({ preventScroll: true });
        });
    }, 1500);

    // Focus hidden input on terminal click
    terminalCard.addEventListener('click', () => {
        if (!autoTypingActive) {
            hiddenInput.focus({ preventScroll: true });
        }
    });

    // Handle focus visual state classes
    hiddenInput.addEventListener('focus', () => {
        terminalCard.classList.add('focused');
    });
    hiddenInput.addEventListener('blur', () => {
        terminalCard.classList.remove('focused');
    });

    // Capture global keystrokes and focus terminal automatically
    document.addEventListener('keydown', (e) => {
        if (autoTypingActive) return;

        // Ignore if focus is in contact form fields
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        // Ignore meta/modifier keys
        if (e.metaKey || e.ctrlKey || e.altKey) {
            return;
        }

        // Focus and let hiddenInput process the key
        if (document.activeElement !== hiddenInput) {
            hiddenInput.focus({ preventScroll: true });
        }
    });

    hiddenInput.addEventListener('input', (e) => {
        if (autoTypingActive) return;
        currentInput = e.target.value;
        terminalTyped.textContent = currentInput;
    });

    hiddenInput.addEventListener('keydown', (e) => {
        if (autoTypingActive) return;
        if (e.key === 'Enter') {
            const cmd = currentInput.trim().toLowerCase();

            // Print command line
            const promptLine = document.createElement('div');
            promptLine.className = 'terminal-line';
            promptLine.innerHTML = `<span class="color-blue">guest@dipesh-chadgal:~$</span> ${currentInput}`;

            // Insert before the current active typing line
            terminalOutput.insertBefore(promptLine, terminalTyped.closest('.terminal-line'));

            // Execute
            if (cmd) {
                if (cmd === 'clear') {
                    // Clear all lines except active input
                    const lines = Array.from(terminalOutput.querySelectorAll('.terminal-line'));
                    lines.forEach(line => {
                        if (!line.contains(terminalTyped)) {
                            line.remove();
                        }
                    });
                } else if (commands[cmd]) {
                    printLine(commands[cmd], 'output');
                } else {
                    printLine(`bash: command not found: ${cmd}. Type 'help' for options.`, 'error');
                }
            }

            // Reset input
            currentInput = "";
            hiddenInput.value = "";
            terminalTyped.textContent = "";

            // Auto scroll
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });

    function printLine(text, type = 'output') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.innerHTML = text;
        terminalOutput.insertBefore(line, terminalTyped.closest('.terminal-line'));
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function typeCommand(text, callback) {
        let i = 0;
        const interval = setInterval(() => {
            terminalTyped.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                setTimeout(callback, 200);
            }
        }, 50);
    }

    function executeCommand(cmdName) {
        // Print the active prompt line
        const promptLine = document.createElement('div');
        promptLine.className = 'terminal-line';
        promptLine.innerHTML = `<span class="color-blue">guest@dipesh-chadgal:~$</span> ${terminalTyped.textContent}`;
        terminalOutput.insertBefore(promptLine, terminalTyped.closest('.terminal-line'));

        // Print output
        printLine(commands[cmdName], 'output');

        // Reset typing cursor row
        terminalTyped.textContent = "";
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
}

/* ==========================================================================
   2. CI/CD PIPELINE SIMULATOR
   ========================================================================== */
function initPipeline() {
    const btnTrigger = document.getElementById('btn-trigger-pipeline');
    const btnClear = document.getElementById('btn-clear-logs');
    const logConsole = document.getElementById('pipeline-logs');

    const stages = [
        { id: 'stage-commit', name: 'Git Commit', duration: 1500 },
        { id: 'stage-lint', name: 'Code Quality', duration: 1800 },
        { id: 'stage-test', name: 'Unit Tests', duration: 2500 },
        { id: 'stage-build', name: 'Docker Build', duration: 2800 },
        { id: 'stage-deploy', name: 'K8s Rollout', duration: 3000 }
    ];

    const logsData = {
        'stage-commit': [
            { text: '[INFO] Initializing CI/CD build sequence for git commit e39a1c8...', type: 'info' },
            { text: '[INFO] Checking out branch refs/heads/main on origin...', type: 'info' },
            { text: '   -> Commit Author: Dipesh Singh Chadgal <dipesh@wipro.com>', type: 'info' },
            { text: '   -> Commit Message: refactor(k8s): optimize HPA scale thresholds', type: 'info' },
            { text: '[SUCCESS] Commit checked out successfully. Git SHA: e39a1c8b74f9011de393', type: 'success' }
        ],
        'stage-lint': [
            { text: '[INFO] Executing linting and static analysis checks...', type: 'info' },
            { text: '$ eslint ./src/**/*.js --quiet', type: 'info' },
            { text: '   -> Linting passed: 0 errors, 0 style warnings.', type: 'success' },
            { text: '$ checkov -d ./k8s --quiet', type: 'info' },
            { text: '   [WAR] manifest: securityContext user root check skipped (Kyverno overrides).', type: 'warning' },
            { text: '[SUCCESS] Pre-build validation checks passed. Linter compliance 100%.', type: 'success' }
        ],
        'stage-test': [
            { text: '[INFO] Starting automated unit and integration tests...', type: 'info' },
            { text: '$ npm run test --coverage', type: 'info' },
            { text: ' PASS  tests/auth.test.js (5.2s)', type: 'success' },
            { text: ' PASS  tests/metrics.test.js (4.8s)', type: 'success' },
            { text: ' PASS  tests/k8s_deploy.test.js (6.1s)', type: 'success' },
            { text: '----------------------------------------', type: 'info' },
            { text: 'File        | % Stmts | % Branch | % Funcs | % Lines', type: 'info' },
            { text: 'All Files   |    94.5 |     91.2 |    96.4 |    94.5', type: 'success' },
            { text: '----------------------------------------', type: 'info' },
            { text: '[SUCCESS] Test Suite completed. 34 tests passed, 0 failed.', type: 'success' }
        ],
        'stage-build': [
            { text: '[INFO] Initializing Docker secure image assembly...', type: 'info' },
            { text: '$ docker build -t dipesh-chadgal/portfolio:e39a1c8 . --no-cache', type: 'info' },
            { text: '   -> [1/4] FROM node:24-alpine ... Cached', type: 'info' },
            { text: '   -> [2/4] COPY package*.json ./ ... Done', type: 'info' },
            { text: '   -> [3/4] RUN npm ci --omit=dev ... Done in 1.4s', type: 'info' },
            { text: '   -> [4/4] COPY . . && EXPOSE 8080 ... Done', type: 'info' },
            { text: '[INFO] Inspecting built container image for CVEs...', type: 'info' },
            { text: '$ trivy image dipesh-chadgal/portfolio:e39a1c8', type: 'info' },
            { text: '   -> Vulnerabilities: 0 Critical, 0 High, 2 Low.', type: 'success' },
            { text: '[SUCCESS] Image pushed successfully to registry.ecr.us-east-1.amazonaws.com', type: 'success' }
        ],
        'stage-deploy': [
            { text: '[INFO] Launching GitOps synchronization to Kubernetes (EKS)...', type: 'info' },
            { text: '$ kubectl config use-context prod-eks-cluster', type: 'info' },
            { text: '$ kubectl apply -f k8s/deployment.yaml', type: 'info' },
            { text: '   -> deployment.apps/portfolio-web configured (no changes)', type: 'info' },
            { text: '   -> service/portfolio-web-svc configured (no changes)', type: 'info' },
            { text: '   -> ingress.networking.k8s.io/portfolio-ingress configured (updated endpoints)', type: 'success' },
            { text: '[INFO] Awaiting pod rollout status. Replica size: 3...', type: 'info' },
            { text: '   -> pod/portfolio-web-7fd8bb74f9-abc12: status running [READY]', type: 'success' },
            { text: '   -> pod/portfolio-web-7fd8bb74f9-xyz45: status running [READY]', type: 'success' },
            { text: '   -> pod/portfolio-web-7fd8bb74f9-mno78: status running [READY]', type: 'success' },
            { text: '[SUCCESS] GitOps sync succeeded. Deployment active on production environment.', type: 'success' }
        ]
    };

    let pipelineRunning = false;

    btnTrigger.addEventListener('click', () => {
        if (pipelineRunning) return;
        runPipeline();
    });

    btnClear.addEventListener('click', () => {
        if (pipelineRunning) return;
        logConsole.innerHTML = '';
        addLogLine('Console cleared.', 'info');
    });

    function addLogLine(text, type = 'info') {
        const row = document.createElement('div');
        row.className = `log-row ${type}`;
        row.textContent = text;
        logConsole.appendChild(row);
        logConsole.scrollTop = logConsole.scrollHeight;
    }

    async function runPipeline() {
        pipelineRunning = true;
        btnTrigger.disabled = true;
        btnTrigger.classList.add('disabled');
        btnTrigger.innerHTML = `<span class="pulse-indicator"></span> Running...`;

        // Reset all stages to idle
        stages.forEach((stg, index) => {
            const el = document.getElementById(stg.id);
            el.className = 'pipeline-stage';
            el.querySelector('.stage-status').textContent = 'Idle';
            if (index < stages.length - 1) {
                const conn = document.getElementById(`conn-${index}`);
                conn.querySelector('.connector-progress').className = 'connector-progress';
            }
        });

        logConsole.innerHTML = '';
        addLogLine('[START] Initializing deployment pipeline execution context...', 'info');

        for (let i = 0; i < stages.length; i++) {
            const stage = stages[i];
            const stageEl = document.getElementById(stage.id);

            // Set stage to active
            stageEl.classList.add('active');
            stageEl.querySelector('.stage-status').textContent = 'Running';
            addLogLine(`\n--- STAGE: ${stage.name} ---`, 'info');

            // Print stage specific logs progressively
            const stageLogs = logsData[stage.id];
            const logSteps = stageLogs.length;
            const logInterval = stage.duration / logSteps;

            for (let j = 0; j < logSteps; j++) {
                await delay(logInterval);
                addLogLine(stageLogs[j].text, stageLogs[j].type);
            }

            // Mark stage as successful
            stageEl.classList.remove('active');
            stageEl.classList.add('success');
            stageEl.querySelector('.stage-status').textContent = 'Success';

            // Animate next connector
            if (i < stages.length - 1) {
                const connEl = document.getElementById(`conn-${i}`);
                const progressEl = connEl.querySelector('.connector-progress');
                progressEl.classList.add('active');
                await delay(800);
                progressEl.classList.remove('active');
                progressEl.classList.add('success');
            }
        }

        // Completion banner
        addLogLine('\n=============================================================', 'success');
        addLogLine('   DEPLOYMENT SUCCESSFUL! 🎉', 'success');
        addLogLine('   Commit e39a1c8 is now routing 100% of public traffic.', 'success');
        addLogLine('=============================================================\n', 'success');

        pipelineRunning = false;
        btnTrigger.disabled = false;
        btnTrigger.classList.remove('disabled');
        btnTrigger.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Trigger Pipeline
        `;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/* ==========================================================================
   3. INTERACTIVE TOPOLOGY MAP INSPECTOR
   ========================================================================== */
function initTopology() {
    const detailsCard = document.getElementById('arch-details-card');
    const detailsTitle = document.getElementById('details-node-title');
    const detailsStatus = document.getElementById('details-node-status');
    const detailsDesc = document.getElementById('details-node-desc');
    const detailsStats = document.getElementById('details-stats-container');

    const detailsTech = document.getElementById('details-node-tech');
    const detailsEndpoint = document.getElementById('details-node-endpoint');
    const detailsMetricVal = document.getElementById('details-metric-val');
    const detailsMetricFill = document.getElementById('details-metric-fill');
    const detailsReplicas = document.getElementById('details-node-replicas');

    const nodeMeta = {
        'ingress': {
            title: 'Public Traffic / DNS',
            status: 'READY',
            desc: 'AWS Route53 latency-based routing handles public DNS resolution, forwarding traffic to the local Application Load Balancers.',
            tech: 'AWS Route 53',
            endpoint: 'alex-chen.dev',
            metricLabel: 'Req/Sec:',
            metricVal: 84, // % load or values
            metricText: '124 rps',
            replicas: 'Managed Multi-AZ'
        },
        'balancer': {
            title: 'Nginx Ingress Controller',
            status: 'ACTIVE',
            desc: 'Inspects HTTP requests, terminates SSL certificates, and handles routing rules, balancing load across Kubernetes service endpoints.',
            tech: 'NGINX / K8s Ingress',
            endpoint: 'ingress.alex-chen.dev',
            metricLabel: 'CPU Load:',
            metricVal: 18,
            metricText: '18% Avg',
            replicas: '2 (Active/Active)'
        },
        'pod-1': {
            title: 'Web Application Pod 1',
            status: 'RUNNING',
            desc: 'Executes core website front-end and API logic in Docker containers. Monitored continuously by Kubernetes replica sets.',
            tech: 'Node.js / Docker',
            endpoint: '10.244.1.42',
            metricLabel: 'Pod Load:',
            metricVal: 32,
            metricText: '32%',
            replicas: '1 Pod Instance'
        },
        'pod-2': {
            title: 'Web Application Pod 2',
            status: 'RUNNING',
            desc: 'Second redundant pod instance running app server container, helping satisfy high availability SLAs.',
            tech: 'Node.js / Docker',
            endpoint: '10.244.2.19',
            metricLabel: 'Pod Load:',
            metricVal: 28,
            metricText: '28%',
            replicas: '1 Pod Instance'
        },
        'pod-3': {
            title: 'Web Application Pod 3',
            status: 'RUNNING',
            desc: 'Third pod instance. Autoscaling triggers additions when traffic spikes exceed target thresholds.',
            tech: 'Node.js / Docker',
            endpoint: '10.244.3.71',
            metricLabel: 'Pod Load:',
            metricVal: 25,
            metricText: '25%',
            replicas: '1 Pod Instance'
        },
        'cache': {
            title: 'Redis In-Memory Cache',
            status: 'READY',
            desc: 'Provides fast, low-latency key-value storage. Used to cache database query results and session states, reducing primary database load.',
            tech: 'Redis (ElastiCache)',
            endpoint: 'redis.internal.net',
            metricLabel: 'Cache Hit Rate:',
            metricVal: 94,
            metricText: '94.2%',
            replicas: '3 Node Cluster'
        },
        'db-primary': {
            title: 'PostgreSQL Database (Primary)',
            status: 'ONLINE',
            desc: 'Persistent relational database storing transactional data. Set up with write-ahead logging and point-in-time recovery logs.',
            tech: 'PostgreSQL RDS',
            endpoint: 'db-master.internal.net',
            metricLabel: 'Disk Space:',
            metricVal: 48,
            metricText: '48.1% used',
            replicas: '1 Master'
        },
        'db-replica': {
            title: 'PostgreSQL Database (Replica)',
            status: 'REPLICATING',
            desc: 'Read-only slave instance synchronized via asynchronous replication stream. Offloads read traffic to scale database performance.',
            tech: 'PostgreSQL RDS',
            endpoint: 'db-read.internal.net',
            metricLabel: 'Replication Lag:',
            metricVal: 2,
            metricText: '12 ms',
            replicas: '1 Read-Replica'
        }
    };

    const nodes = document.querySelectorAll('.arch-node');

    nodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            const nodeId = node.getAttribute('data-node');
            const data = nodeMeta[nodeId];
            if (data) {
                detailsTitle.textContent = data.title;
                detailsStatus.textContent = data.status;

                // Adjust status badge color
                if (data.status === 'READY' || data.status === 'RUNNING' || data.status === 'ONLINE') {
                    detailsStatus.className = 'node-badge';
                } else {
                    detailsStatus.className = 'node-badge busy';
                }

                detailsDesc.textContent = data.desc;

                // Stats
                detailsTech.textContent = data.tech;
                detailsEndpoint.textContent = data.endpoint;

                document.getElementById('details-metric-name').textContent = data.metricLabel;
                detailsMetricVal.textContent = data.metricText;
                detailsMetricFill.style.width = `${data.metricVal}%`;

                detailsReplicas.textContent = data.replicas;

                detailsStats.style.display = 'flex';
                detailsCard.style.borderColor = 'var(--neon-cyan)';

                // Light up connection wire to this node
                highlightWire(nodeId, true);
            }
        });

        node.addEventListener('mouseleave', () => {
            const nodeId = node.getAttribute('data-node');
            detailsCard.style.borderColor = 'var(--border-color)';
            highlightWire(nodeId, false);
        });
    });

    function highlightWire(nodeId, enable) {
        let wireId = '';
        if (nodeId === 'ingress') wireId = 'wire-ingress';
        else if (nodeId === 'pod-1') wireId = 'wire-pod-1';
        else if (nodeId === 'pod-2') wireId = 'wire-pod-2';
        else if (nodeId === 'pod-3') wireId = 'wire-pod-3';
        else if (nodeId === 'db-primary') wireId = 'wire-db-primary';

        if (wireId) {
            const wire = document.getElementById(wireId);
            if (wire) {
                if (enable) {
                    wire.style.stroke = 'var(--neon-cyan)';
                    wire.style.strokeWidth = '3px';
                } else {
                    wire.style.stroke = '';
                    wire.style.strokeWidth = '';
                }
            }
        }
    }
}

/* ==========================================================================
   4. NOC TELEMETRY GRAPH SIMULATIONS
   ========================================================================== */
function initTelemetry() {
    // Stat elements
    const statLatency = document.getElementById('stat-latency');

    // Wave tracking variables
    let timeTick = 0;

    // Charts config
    const cpuChart = {
        linePath: document.querySelector('.cpu-telemetry .chart-line'),
        fillPath: document.querySelector('.cpu-telemetry .chart-fill'),
        valueText: document.getElementById('cpu-current-val'),
        history: Array(25).fill(25),
        min: 15,
        max: 65,
        current: 24,
        type: 'cpu'
    };

    const trafficChart = {
        linePath: document.querySelector('.traffic-telemetry .chart-line-violet'),
        fillPath: document.querySelector('.traffic-telemetry .chart-fill-violet'),
        valueText: document.getElementById('traffic-current-val'),
        history: Array(25).fill(110),
        min: 80,
        max: 180,
        current: 120,
        type: 'traffic'
    };

    // Gauge Config
    const ramGauge = document.getElementById('ram-gauge-fill');
    const ramPctText = document.getElementById('ram-pct');
    const ramValText = document.getElementById('ram-current-val');

    // Run interval updates
    setInterval(() => {
        timeTick++;

        // 1. Update CPU
        updateChartMetric(cpuChart);

        // 2. Update Traffic
        updateChartMetric(trafficChart);

        // 3. Update Memory Gauge
        const mockRamPct = 48 + Math.floor(Math.sin(timeTick / 3) * 6) + Math.floor(Math.random() * 3);
        const ramUsedGb = ((mockRamPct / 100) * 8).toFixed(2);

        ramPctText.textContent = `${mockRamPct}%`;
        ramValText.textContent = `${ramUsedGb} GB / 8 GB`;

        // Circle circumference is 2 * pi * r = 2 * 3.14159 * 40 = 251.3
        // Stretched arc has stroke-dasharray="188 250" (fills 188px of 250px track)
        // Adjust dashoffset starting from -31 (empty) to -31 - 188 (full)
        const trackLength = 188;
        const baseOffset = -31;
        const progressOffset = baseOffset - (trackLength * (mockRamPct / 100));
        ramGauge.style.strokeDashoffset = progressOffset;

        // 4. Update Latency display
        const trafficFactor = trafficChart.current / 120;
        const currentLatency = Math.floor(34 * trafficFactor + Math.random() * 4);
        statLatency.textContent = `${currentLatency} ms`;

    }, 1500);

    function updateChartMetric(chartObj) {
        // Compute drift
        let drift = Math.sin(timeTick / 5) * 12;
        if (chartObj.type === 'cpu') {
            drift += Math.random() * 8 - 4;
        } else {
            drift += Math.random() * 14 - 7;
        }

        let newVal = Math.floor(chartObj.history[chartObj.history.length - 1] + drift);

        // Boundaries checks
        if (newVal < chartObj.min) newVal = chartObj.min + Math.floor(Math.random() * 5);
        if (newVal > chartObj.max) newVal = chartObj.max - Math.floor(Math.random() * 5);

        chartObj.current = newVal;
        chartObj.history.push(newVal);
        chartObj.history.shift();

        // Render Value Text
        if (chartObj.type === 'cpu') {
            chartObj.valueText.textContent = `${newVal}%`;
        } else {
            chartObj.valueText.textContent = `${newVal} rps`;
        }

        // Draw path lines
        renderSvgPath(chartObj);
    }

    function renderSvgPath(chartObj) {
        const svgW = 400;
        const svgH = 150;
        const stepX = svgW / (chartObj.history.length - 1);

        let pathD = "";
        let fillD = "";

        chartObj.history.forEach((val, index) => {
            // Map value scale (min - max range maps to height index of 130 - 20)
            const range = chartObj.max - chartObj.min;
            const pct = (val - chartObj.min) / range;
            const y = svgH - 15 - (pct * (svgH - 35)); // padding at bottom/top
            const x = index * stepX;

            if (index === 0) {
                pathD = `M ${x} ${y}`;
                fillD = `M ${x} ${svgH} L ${x} ${y}`;
            } else {
                pathD += ` L ${x} ${y}`;
                fillD += ` L ${x} ${y}`;
            }

            if (index === chartObj.history.length - 1) {
                fillD += ` L ${x} ${svgH} Z`;
            }
        });

        chartObj.linePath.setAttribute('d', pathD);
        chartObj.fillPath.setAttribute('d', fillD);
    }

    // Run initial chart render
    renderSvgPath(cpuChart);
    renderSvgPath(trafficChart);
}

/* ==========================================================================
   5. MODALS & LIGHT DISMISS
   ========================================================================== */
function initModals() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            const dialog = document.getElementById(projectId);
            if (dialog) {
                dialog.showModal();
            }
        });
    });

    // Handle Light Dismiss (close modal when backdrop is clicked)
    const dialogs = document.querySelectorAll('.project-modal');
    dialogs.forEach(dialog => {
        dialog.addEventListener('click', (e) => {
            const rect = dialog.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY &&
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX &&
                e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                dialog.close();
            }
        });
    });
}

/* ==========================================================================
   6. CONTACT CLI TRANSMISSION FORM
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const responseEl = document.getElementById('contact-response');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btnSubmit = form.querySelector('.btn-submit');
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const msg = document.getElementById('form-message').value;

        // Disable input
        btnSubmit.disabled = true;
        btnSubmit.classList.add('disabled');
        responseEl.className = 'form-response';
        responseEl.style.display = 'block';
        responseEl.innerHTML = 'Connecting to dispatch socket...';

        // Step by step mock dispatch logs
        const steps = [
            'SSH connection established. Authenticating keys...',
            'Host keys verified. Creating transmission packets...',
            'Transmitting form buffers: (Name: ' + name + ', Email: ' + email + ')',
            'Sending payload payload.bin to secure webhook...',
            'Notification dispatched successfully! SRE pager alerted. 📟'
        ];

        for (let i = 0; i < steps.length; i++) {
            await new Promise(r => setTimeout(r, 600));
            responseEl.innerHTML += `<br>   -> ${steps[i]}`;
        }

        await new Promise(r => setTimeout(r, 400));
        responseEl.className = 'form-response success';
        responseEl.innerHTML = `[SUCCESS] Secure packet delivered. Shell connection closed successfully.<br>Message dispatched to Dipesh's SRE notification queue!`;

        // Reset
        form.reset();
        btnSubmit.disabled = false;
        btnSubmit.classList.remove('disabled');

        // Hide success message after 10s
        setTimeout(() => {
            responseEl.style.display = 'none';
            responseEl.innerHTML = '';
        }, 10000);
    });
}
