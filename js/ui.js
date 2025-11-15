// ===================================
// PinoyRPG - UI Controller
// Financial Literacy Edition
// ===================================

class UIController {
    constructor() {
        this.currentView = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.renderInitialUI();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.dataset.view;
                this.switchView(view);

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    switchView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show selected view
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;

            // Render view-specific content
            this.renderViewContent(viewName);
        }
    }

    renderViewContent(viewName) {
        switch (viewName) {
            case 'jobs':
                this.renderJobsView();
                break;
            case 'investments':
                this.renderInvestmentsView();
                break;
            case 'business':
                this.renderBusinessView();
                break;
            case 'education':
                this.renderEducationView();
                break;
            case 'assets':
                game.updateInventoryUI();
                break;
            case 'goals':
                game.updateGoalsUI();
                break;
            case 'dashboard':
                game.updateUI();
                this.updateDashboard();
                break;
        }
    }

    updateDashboard() {
        // Update monthly cashflow display
        const income = game.player.financials.monthlyIncome;
        const expenses = game.player.financials.monthlyExpenses;
        const netCashflow = income - expenses;

        if (document.getElementById('monthly-income')) {
            document.getElementById('monthly-income').textContent = '₱' + income.toLocaleString();
        }
        if (document.getElementById('monthly-expenses')) {
            document.getElementById('monthly-expenses').textContent = '₱' + expenses.toLocaleString();
        }
        if (document.getElementById('net-cashflow')) {
            const elem = document.getElementById('net-cashflow');
            elem.textContent = '₱' + netCashflow.toLocaleString();
            elem.style.color = netCashflow >= 0 ? '#2ED573' : '#FF4757';
        }

        // Update month counter
        if (document.getElementById('current-month')) {
            document.getElementById('current-month').textContent = game.gameStats.monthsPlayed;
        }
    }

    renderJobsView() {
        const jobsGrid = document.getElementById('jobs-grid');

        jobsGrid.innerHTML = game.jobMarket.map(job => {
            const meetsReq = game.meetsEducationRequirement(job.requirements.education || 'High School');
            const isCurrent = game.player.currentJob.title === job.title;

            return `
                <div class="shop-item ${isCurrent ? 'current-job' : ''}">
                    <div class="shop-item-icon">💼</div>
                    <div class="shop-item-name">${job.title}</div>
                    <div class="shop-item-desc">${job.description}</div>
                    <div class="shop-item-price">₱${job.salary.toLocaleString()}/month</div>
                    <div style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 8px;">
                        Required: ${job.requirements.education}
                    </div>
                    ${isCurrent ? `
                        <button class="btn-secondary btn-small" disabled>
                            Current Job
                        </button>
                    ` : `
                        <button class="btn-primary btn-small"
                                onclick="game.changeJob('${job.id}')"
                                ${!meetsReq ? 'disabled' : ''}>
                            ${meetsReq ? 'Apply' : 'Locked'}
                        </button>
                    `}
                </div>
            `;
        }).join('');
    }

    renderInvestmentsView() {
        const investmentsGrid = document.getElementById('investments-grid');

        // Update cash display
        if (document.getElementById('player-gold-invest')) {
            document.getElementById('player-gold-invest').textContent = Math.floor(game.player.financials.cash).toLocaleString();
        }

        investmentsGrid.innerHTML = game.investmentOptions.map(investment => {
            const canAfford = game.player.financials.cash >= investment.minInvestment;

            return `
                <div class="shop-item">
                    <div class="shop-item-icon">${investment.icon}</div>
                    <div class="shop-item-name">${investment.name}</div>
                    <div class="shop-item-desc">${investment.description}</div>
                    <div class="shop-item-price">Min: ₱${investment.minInvestment.toLocaleString()}</div>
                    <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">
                        ${investment.expectedReturn}% returns | ${investment.risk} risk
                    </div>
                    <button class="btn-primary btn-small"
                            onclick="ui.showInvestmentModal('${investment.id}')"
                            ${!canAfford ? 'disabled' : ''}>
                        Invest
                    </button>
                </div>
            `;
        }).join('');
    }

    renderBusinessView() {
        const businessGrid = document.getElementById('business-grid');

        // Update cash display
        if (document.getElementById('player-gold-business')) {
            document.getElementById('player-gold-business').textContent = Math.floor(game.player.financials.cash).toLocaleString();
        }

        businessGrid.innerHTML = game.businessOpportunities.map(business => {
            const canAfford = game.player.financials.cash >= business.initialCost;
            const meetsReq = business.requirements.entrepreneurship ?
                game.player.attributes.entrepreneurship >= business.requirements.entrepreneurship : true;

            return `
                <div class="shop-item">
                    <div class="shop-item-icon">${business.icon}</div>
                    <div class="shop-item-name">${business.name}</div>
                    <div class="shop-item-desc">${business.description}</div>
                    <div class="shop-item-price">₱${business.initialCost.toLocaleString()}</div>
                    <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">
                        Profit: ₱${business.monthlyProfit.toLocaleString()}/month
                    </div>
                    <button class="btn-primary btn-small"
                            onclick="game.startBusiness('${business.id}')"
                            ${!canAfford || !meetsReq ? 'disabled' : ''}>
                        ${!meetsReq ? 'Locked' : 'Start Business'}
                    </button>
                </div>
            `;
        }).join('');
    }

    renderEducationView() {
        const educationGrid = document.getElementById('education-grid');

        // Update cash display
        if (document.getElementById('player-gold-education')) {
            document.getElementById('player-gold-education').textContent = Math.floor(game.player.financials.cash).toLocaleString();
        }

        educationGrid.innerHTML = game.educationOptions.map(education => {
            const canAfford = game.player.financials.cash >= education.cost;

            return `
                <div class="shop-item">
                    <div class="shop-item-icon">${education.icon}</div>
                    <div class="shop-item-name">${education.name}</div>
                    <div class="shop-item-desc">${education.description}</div>
                    <div class="shop-item-price">₱${education.cost.toLocaleString()}</div>
                    <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">
                        Duration: ${education.duration} months
                    </div>
                    <button class="btn-primary btn-small"
                            onclick="game.enrollEducation('${education.id}')"
                            ${!canAfford ? 'disabled' : ''}>
                        Enroll
                    </button>
                </div>
            `;
        }).join('');
    }

    showInvestmentModal(investmentId) {
        const investment = game.investmentOptions.find(inv => inv.id === investmentId);
        if (!investment) return;

        const amount = prompt(
            `How much would you like to invest in ${investment.name}?\n\n` +
            `Minimum: ₱${investment.minInvestment.toLocaleString()}\n` +
            `Your Cash: ₱${Math.floor(game.player.financials.cash).toLocaleString()}\n\n` +
            `Enter amount:`,
            investment.minInvestment
        );

        if (amount) {
            const numAmount = parseInt(amount.replace(/,/g, ''));
            if (!isNaN(numAmount) && numAmount > 0) {
                game.makeInvestment(investmentId, numAmount);
                this.renderInvestmentsView();
            }
        }
    }

    setupEventListeners() {
        // Any additional event listeners can go here
    }

    renderInitialUI() {
        // Initial render of all UI components
        game.updateInventoryUI();
        game.updateGoalsUI();
        game.updateStatsUI();
        this.updateDashboard();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `toast-notification toast-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize UI Controller when DOM is ready
let ui;
window.addEventListener('DOMContentLoaded', () => {
    // Wait for game to initialize first
    setTimeout(() => {
        ui = new UIController();
        window.ui = ui; // Make UI globally accessible

        // Update UI every second
        setInterval(() => {
            if (ui.currentView === 'dashboard') {
                ui.updateDashboard();
            }
        }, 1000);
    }, 100);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Number keys 1-7 for quick navigation
    if (e.key >= '1' && e.key <= '7') {
        const navLinks = document.querySelectorAll('.nav-link');
        const index = parseInt(e.key) - 1;
        if (navLinks[index]) {
            navLinks[index].click();
        }
    }

    // 'A' for assets
    if (e.key.toLowerCase() === 'a' && !e.ctrlKey && !e.metaKey) {
        document.querySelector('.nav-link[data-view="assets"]')?.click();
    }

    // 'G' for goals
    if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.metaKey) {
        document.querySelector('.nav-link[data-view="goals"]')?.click();
    }

    // 'J' for jobs
    if (e.key.toLowerCase() === 'j' && !e.ctrlKey && !e.metaKey) {
        document.querySelector('.nav-link[data-view="jobs"]')?.click();
    }

    // 'I' for investments
    if (e.key.toLowerCase() === 'i' && !e.ctrlKey && !e.metaKey) {
        document.querySelector('.nav-link[data-view="investments"]')?.click();
    }

    // ESC to go back to dashboard
    if (e.key === 'Escape') {
        document.querySelector('.nav-link[data-view="dashboard"]')?.click();
    }
});

// Add some helpful console messages
console.log('%c🇵🇭 PinoyRPG - Tungo sa Tagumpay 🇵🇭', 'color: #FF007F; font-size: 20px; font-weight: bold;');
console.log('%cA Financial Literacy Life Simulator', 'color: #00FFFF; font-size: 14px;');
console.log('%cKeyboard Shortcuts:', 'color: #00FFFF; font-weight: bold;');
console.log('1-7: Quick navigation');
console.log('J: Jobs');
console.log('I: Investments');
console.log('A: Assets');
console.log('G: Goals');
console.log('ESC: Dashboard');
console.log('%cMabuhay! Start your journey to financial freedom! 💰', 'color: #FF007F;');
