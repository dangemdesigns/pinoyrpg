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
        if (!game) return;

        switch (viewName) {
            case 'jobs':
                this.renderJobsView();
                break;
            case 'investments':
                this.renderInvestmentsView();
                break;
            case 'crypto':
                this.renderCryptoView();
                break;
            case 'business':
                this.renderBusinessView();
                break;
            case 'education':
                this.renderEducationView();
                break;
            case 'assets':
                game.updateInventoryUI();
                this.renderActiveInvestments();
                game.updateActivityLogView();
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
        if (!game) return;

        // Update dashboard stats (times worked, level, net worth)
        if (document.getElementById('total-work-done')) {
            document.getElementById('total-work-done').textContent = game.player.totalWorkDone;
        }
        if (document.getElementById('player-level-stat')) {
            document.getElementById('player-level-stat').textContent = game.player.level;
        }
        if (document.getElementById('net-worth-stat')) {
            document.getElementById('net-worth-stat').textContent = '₱' + Math.floor(game.player.financials.totalNetWorth).toLocaleString();
        }
    }

    renderJobsView() {
        if (!game) return;
        const jobsGrid = document.getElementById('jobs-grid');

        jobsGrid.innerHTML = game.jobMarket.map(job => {
            const meetsEducation = game.meetsEducationRequirement(job.requirements.education || 'High School');
            const requiredExp = job.requirements.experience || 0;
            const currentExp = game.player.currentJob.experience || 0;
            const meetsExperience = currentExp >= requiredExp;
            const meetsAllReq = meetsEducation && meetsExperience;
            const isCurrent = game.player.currentJob.title === job.title;

            let lockReason = '';
            if (!meetsEducation) {
                lockReason = `Need ${job.requirements.education}`;
            } else if (!meetsExperience) {
                lockReason = `Need ${requiredExp} months exp`;
            }

            return `
                <div class="shop-item ${isCurrent ? 'current-job' : ''}">
                    <div class="shop-item-icon">💼</div>
                    <div class="shop-item-name">${job.title}</div>
                    <div class="shop-item-desc">${job.description}</div>
                    <div class="shop-item-price">₱${job.salary.toLocaleString()}/month</div>
                    <div style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 8px;">
                        Required: ${job.requirements.education}${requiredExp > 0 ? ` • ${requiredExp} months exp` : ''}
                    </div>
                    ${!meetsAllReq && !isCurrent ? `
                        <div style="background: rgba(255,71,87,0.1); padding: 8px; border-radius: 6px; margin-bottom: 8px;">
                            <div style="font-size: 10px; color: #FF4757; font-weight: 600;">🔒 ${lockReason}</div>
                            ${!meetsExperience ? `<div style="font-size: 9px; color: var(--text-secondary);">You have: ${currentExp} months</div>` : ''}
                        </div>
                    ` : ''}
                    ${isCurrent ? `
                        <button class="btn-secondary btn-small" disabled>
                            Current Job
                        </button>
                    ` : `
                        <button class="btn-primary btn-small"
                                onclick="game.changeJob('${job.id}')"
                                ${!meetsAllReq ? 'disabled' : ''}>
                            ${meetsAllReq ? 'Apply' : 'Locked'}
                        </button>
                    `}
                </div>
            `;
        }).join('');
    }

    renderInvestmentsView() {
        if (!game) return;
        const investmentsGrid = document.getElementById('investments-grid');

        // Update cash display
        if (document.getElementById('player-gold-invest')) {
            document.getElementById('player-gold-invest').textContent = Math.floor(game.player.financials.cash).toLocaleString();
        }

        // Show emergency fund status banner
        const emergencyFundProgress = Math.min((game.player.financials.emergencyFund / game.emergencyFundRequired) * 100, 100);
        const emergencyBanner = !game.hasEmergencyFund ? `
            <div style="background: linear-gradient(135deg, #FF4757 0%, #FF6348 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
                <div style="font-size: 14px; font-weight: 600; color: white; margin-bottom: 8px;">⚠️ EMERGENCY FUND REQUIRED</div>
                <div style="font-size: 12px; color: rgba(255,255,255,0.9); margin-bottom: 12px;">
                    Build ₱5,000 emergency fund first by investing in Savings Account
                </div>
                <div style="background: rgba(0,0,0,0.2); border-radius: 8px; overflow: hidden; height: 8px;">
                    <div style="background: #2ED573; height: 100%; width: ${emergencyFundProgress}%;"></div>
                </div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.8); margin-top: 8px;">
                    ₱${game.player.financials.emergencyFund.toLocaleString()} / ₱${game.emergencyFundRequired.toLocaleString()}
                </div>
            </div>
        ` : `
            <div style="background: linear-gradient(135deg, #2ED573 0%, #26D07C 100%); padding: 15px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
                <div style="font-size: 13px; font-weight: 600; color: white;">✅ Emergency Fund Ready: ₱${game.player.financials.emergencyFund.toLocaleString()}</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.9); margin-top: 5px;">
                    All investments unlocked! Keep emergency fund topped up.
                </div>
            </div>
        `;

        investmentsGrid.innerHTML = emergencyBanner + game.investmentOptions.map(investment => {
            const canAfford = game.player.financials.cash >= investment.minInvestment;
            const isSavingsAccount = investment.id === 'savings-account';
            const isLocked = !isSavingsAccount && !game.hasEmergencyFund;

            return `
                <div class="shop-item ${isLocked ? 'locked-item' : ''}">
                    <div class="shop-item-icon">${investment.icon}</div>
                    <div class="shop-item-name">${investment.name}</div>
                    <div class="shop-item-desc">${investment.description}</div>
                    <div class="shop-item-price">Min: ₱${investment.minInvestment.toLocaleString()}</div>
                    <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">
                        ${investment.expectedReturn}% returns | ${investment.risk} risk
                    </div>
                    ${isLocked ? `
                        <div style="background: rgba(255,71,87,0.1); padding: 8px; border-radius: 6px; margin-bottom: 8px;">
                            <div style="font-size: 10px; color: #FF4757; font-weight: 600;">🔒 LOCKED</div>
                            <div style="font-size: 9px; color: var(--text-secondary);">Build emergency fund first</div>
                        </div>
                        <button class="btn-secondary btn-small" disabled>
                            Locked
                        </button>
                    ` : `
                        <button class="btn-primary btn-small"
                                onclick="ui.showInvestmentModal('${investment.id}')"
                                ${!canAfford ? 'disabled' : ''}>
                            ${isSavingsAccount ? 'Add to Emergency Fund' : 'Invest'}
                        </button>
                    `}
                </div>
            `;
        }).join('');
    }

    renderBusinessView() {
        if (!game) return;
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
        if (!game) return;
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

    createTimedInvestment(type) {
        if (!game) return;

        // Get the input element based on type
        let inputId;
        if (type === 'interest') {
            inputId = 'interest-investment-amount';
        } else if (type === 'stocks') {
            inputId = 'stocks-investment-amount';
        } else if (type === 'mutual') {
            inputId = 'mutual-investment-amount';
        }

        const inputEl = document.getElementById(inputId);
        if (!inputEl) return;

        const amount = parseInt(inputEl.value);

        // Validate amount
        if (!amount || isNaN(amount)) {
            game.addNotification('Please enter a valid amount!', '❌');
            return;
        }

        if (amount < 5000) {
            game.addNotification('Minimum investment is ₱5,000!', '❌');
            return;
        }

        if (amount > game.player.financials.cash) {
            game.addNotification('Not enough cash!', '❌');
            return;
        }

        // Create the investment
        const success = game.createActiveInvestment(type, amount);

        if (success) {
            // Clear the input field
            inputEl.value = '';

            // Refresh the views
            this.renderInvestmentsView();
            this.renderActiveInvestments();
        }
    }

    setupEventListeners() {
        // Any additional event listeners can go here
    }

    renderInitialUI() {
        // Initial render of all UI components
        if (!game) return;

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

    renderCryptoView() {
        if (!game || !game.cryptoMarket) return;

        game.updateCryptoUI();
    }

    renderActiveInvestments() {
        if (!game) return;

        const listEl = document.getElementById('active-investments-list');
        if (!listEl) return;

        if (!game.activeInvestments || game.activeInvestments.length === 0) {
            listEl.innerHTML = '<div style="text-align: center; color: var(--text-tertiary); padding: 40px;">No active investments yet. Invest in Time Deposit, Stocks, or Mutual Funds to see progress here!</div>';
            return;
        }

        const now = Date.now();
        listEl.innerHTML = game.activeInvestments.filter(investment => {
            // Filter out matured interest accounts (they auto-withdraw)
            const elapsed = now - investment.startTime;
            const progress = Math.min(100, (elapsed / investment.duration) * 100);
            const matured = progress >= 100;
            return !(matured && investment.type === 'interest');
        }).map(investment => {
            const elapsed = now - investment.startTime;
            const progress = Math.min(100, (elapsed / investment.duration) * 100);
            const matured = progress >= 100;
            const interest = investment.principal * investment.interestRate;
            const total = investment.principal + interest;

            if (matured && !investment.matured) {
                investment.matured = true;
                game.addNotification(`Your ${investment.name} has matured! Total: ₱${total.toLocaleString()}`, '📈');

                // Auto-withdraw interest accounts when they mature
                if (investment.type === 'interest') {
                    game.player.financials.cash += total;
                    game.activeInvestments = game.activeInvestments.filter(inv => inv.id !== investment.id);
                    game.addNotification(`Auto-withdrawn ₱${total.toLocaleString()} from ${investment.name}!`, '💰');
                    game.addActivityLog(`${investment.name} matured: +₱${total.toLocaleString()}`, '💰');
                    game.saveGame();
                }
            }

            const typeIcons = {
                'interest': '💰',
                'stocks': '📈',
                'mutual': '📊'
            };
            const icon = typeIcons[investment.type] || '💎';

            return `
                <div style="padding: 20px; border: 2px solid ${matured ? 'var(--success)' : 'var(--border)'}; border-radius: 8px; margin-bottom: 15px; background: ${matured ? 'rgba(34, 197, 94, 0.1)' : 'var(--card-bg)'};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <div>
                            <div style="font-size: 24px; margin-bottom: 5px;">${icon}</div>
                            <h4 style="margin: 0 0 5px 0; color: var(--text-primary);">${investment.name}</h4>
                            <p style="margin: 0; font-size: 14px; color: var(--text-secondary);">
                                Principal: ₱${investment.principal.toLocaleString()} |
                                Interest: ${(investment.interestRate * 100).toFixed(1)}%
                            </p>
                        </div>
                        <div style="text-align: right;">
                            ${matured ? `
                                <div style="color: var(--success); font-weight: 600; margin-bottom: 5px;">✅ Matured!</div>
                                <div style="font-size: 18px; font-weight: 700; color: var(--success);">₱${total.toLocaleString()}</div>
                            ` : `
                                <div style="font-size: 14px; color: var(--text-tertiary);">In Progress</div>
                                <div style="font-size: 16px; font-weight: 600;">${progress.toFixed(1)}%</div>
                            `}
                        </div>
                    </div>

                    <div style="background: var(--bg-secondary); border-radius: 6px; height: 8px; overflow: hidden; margin-bottom: ${matured && (investment.type === 'stocks' || investment.type === 'mutual') ? '15px' : '0'};">
                        <div style="height: 100%; background: ${matured ? 'var(--success)' : 'var(--primary)'}; width: ${progress}%; transition: width 0.3s;"></div>
                    </div>

                    ${matured && (investment.type === 'stocks' || investment.type === 'mutual') ? `
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px;">
                            <button
                                onclick="game.withdrawInvestment('${investment.id}')"
                                style="padding: 10px 20px; background: var(--success); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: opacity 0.2s;"
                                onmouseover="this.style.opacity='0.9'"
                                onmouseout="this.style.opacity='1'">
                                💰 Withdraw
                            </button>
                            <button
                                onclick="game.reinvestInvestment('${investment.id}')"
                                style="padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: opacity 0.2s;"
                                onmouseover="this.style.opacity='0.9'"
                                onmouseout="this.style.opacity='1'">
                                🔄 Reinvest
                            </button>
                        </div>
                    ` : matured && investment.type === 'interest' ? `
                        <div style="margin-top: 15px; text-align: center; padding: 10px; background: rgba(34, 197, 94, 0.1); border-radius: 6px;">
                            <div style="font-size: 12px; color: var(--success); font-weight: 600;">✅ Interest account matured! Earnings automatically added to your cash.</div>
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }
}

// Initialize UI Controller when DOM is ready
let ui;
function initUI() {
    if (typeof game === 'undefined' || !game) {
        // Game not ready yet, wait and try again
        setTimeout(initUI, 50);
        return;
    }

    ui = new UIController();
    window.ui = ui; // Make UI globally accessible

    // Update UI every second
    setInterval(() => {
        if (ui && ui.currentView === 'dashboard') {
            ui.updateDashboard();
        }
    }, 1000);
}

window.addEventListener('DOMContentLoaded', () => {
    initUI();
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
