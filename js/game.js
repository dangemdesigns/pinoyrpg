// ===================================
// PinoyRPG - Financial Literacy Life Simulator
// Tungo sa Tagumpay (Towards Success)
// ===================================

class PinoyRPG {
    constructor() {
        this.player = this.createPlayer();
        this.inventory = [];
        this.goals = [];
        this.barangay = this.createBarangay();
        this.investments = [];
        this.businesses = [];
        this.skills = [];
        this.activeEvents = [];
        this.gameStats = {
            totalEarned: 0,
            totalSaved: 0,
            totalWorkActions: 0,
            goalsAchieved: 0,
            startTime: Date.now()
        };
        this.jobMarket = this.createJobMarket();
        this.investmentOptions = this.createInvestmentOptions();
        this.businessOpportunities = this.createBusinessOpportunities();
        this.educationOptions = this.createEducationOptions();

        // Achievement flags
        this.achievements_100k = false;
        this.achievements_1m = false;

        // Emergency Fund Requirement
        this.emergencyFundRequired = 5000;
        this.hasEmergencyFund = false;

        // Business Emergency Fund Requirement
        this.businessEmergencyFundRequired = 30000;
        this.hasBusinessEmergencyFund = false;

        // Random Event System
        this.lastEventTime = Date.now();
        this.eventCooldown = 600000; // 10 minutes minimum between events

        // Action-based progression (not time-based)
        this.workEnergy = 100;
        this.maxWorkEnergy = 100;
        this.energyRegenRate = 1; // energy per second

        // Work progress
        this.isWorking = false;
        this.workProgress = 0;
        this.workDuration = 60; // seconds

        this.init();
    }

    init() {
        this.loadGame();
        this.initCryptoMarket();
        // Recalculate emergency fund statuses after loading
        this.checkEmergencyFundStatus();
        this.checkBusinessEmergencyFundStatus();
        this.updateUI();
        this.initializeGoals();
        this.updateGuidance();
        this.startEnergyRegen();
        this.startRandomEvents();
        this.addActivityLog('Welcome to your financial journey, Kababayan!', '🎮');
        this.addNotification('Click WORK to earn money!', '💼');
    }

    createFilipinoScenarios() {
        return [
            {
                id: 'house-repair',
                title: 'House Repair Needed',
                description: 'Your roof is leaking! You need to repair it before the rainy season gets worse.',
                cost: 5000,
                icon: '🏠'
            },
            {
                id: 'medical-emergency',
                title: 'Family Medical Emergency',
                description: 'A family member got sick and needs medicine from the pharmacy.',
                cost: 3000,
                icon: '🏥'
            },
            {
                id: 'appliance-breakdown',
                title: 'Refrigerator Broke Down',
                description: 'Your refrigerator stopped working. You need to repair it or food will spoil.',
                cost: 4000,
                icon: '❄️'
            },
            {
                id: 'phone-broken',
                title: 'Phone Broke',
                description: 'You dropped your phone and the screen cracked. Need to repair it for work.',
                cost: 2500,
                icon: '📱'
            },
            {
                id: 'motor-repair',
                title: 'Motorcycle Repair',
                description: 'Your motorcycle needs urgent repair to get to work.',
                cost: 3500,
                icon: '🏍️'
            },
            {
                id: 'hospital-bill',
                title: 'Emergency Hospital Bill',
                description: 'Unexpected hospitalization - need to pay the bill.',
                cost: 6000,
                icon: '🚑'
            },
            {
                id: 'wedding-gift',
                title: 'Family Wedding (Abuloy)',
                description: 'A close relative is getting married. You need to give abuloy.',
                cost: 2000,
                icon: '💒'
            },
            {
                id: 'funeral-expense',
                title: 'Funeral Expense (Libing)',
                description: 'A relative passed away. You need to contribute to funeral expenses.',
                cost: 3000,
                icon: '🕯️'
            },
            {
                id: 'school-emergency',
                title: 'School Project Materials',
                description: 'Your nephew needs materials for a school project urgently.',
                cost: 1500,
                icon: '📚'
            },
            {
                id: 'flooding',
                title: 'Flood Damage',
                description: 'Heavy rain flooded your area. Need to replace damaged items.',
                cost: 4500,
                icon: '🌊'
            }
        ];
    }

    startRandomEvents() {
        // Check for random events every 30 seconds
        setInterval(() => {
            this.checkRandomEvent();
        }, 30000);
    }

    checkRandomEvent() {
        // Don't trigger if no emergency fund
        if (this.player.financials.emergencyFund < this.emergencyFundRequired) {
            return;
        }

        // Check cooldown
        const timeSinceLastEvent = Date.now() - this.lastEventTime;
        if (timeSinceLastEvent < this.eventCooldown) {
            return;
        }

        // Random chance (10% every check)
        if (Math.random() > 0.1) {
            return;
        }

        // Make sure player has buffer (won't go negative)
        const totalMoney = this.player.financials.cash + this.player.financials.emergencyFund;
        if (totalMoney < 10000) { // Need at least ₱10k buffer
            return;
        }

        // Trigger random scenario
        this.triggerRandomScenario();
    }

    triggerRandomScenario() {
        const scenarios = this.createFilipinoScenarios();
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        // Deduct from emergency fund first, then cash if needed
        let remaining = scenario.cost;

        if (this.player.financials.emergencyFund >= remaining) {
            this.player.financials.emergencyFund -= remaining;
        } else {
            remaining -= this.player.financials.emergencyFund;
            this.player.financials.emergencyFund = 0;
            this.player.financials.cash = Math.max(0, this.player.financials.cash - remaining);
        }

        // Update emergency fund status
        this.checkEmergencyFundStatus();

        // Show notification
        this.showAchievement(`${scenario.title}!`, scenario.icon);
        this.addNotification(`${scenario.description} -₱${scenario.cost.toLocaleString()}`, scenario.icon);
        this.addActivityLog(`Emergency: ${scenario.title} (-₱${scenario.cost.toLocaleString()})`, scenario.icon);

        // Update last event time
        this.lastEventTime = Date.now();

        // Update UI
        this.calculateNetWorth();
        this.updateUI();
        this.updateGuidance();
    }

    checkEmergencyFundStatus() {
        const wasReady = this.hasEmergencyFund;

        // Calculate total emergency fund (includes Piggy Bank + active savings investments)
        let totalEmergencyFund = 0;

        // Add Piggy Bank balance
        totalEmergencyFund += this.player.financials.emergencyFund || 0;

        // Add active interest investments (savings account, digital bank, time deposits, pag-ibig)
        if (this.activeInvestments && this.activeInvestments.length > 0) {
            totalEmergencyFund += this.activeInvestments
                .filter(inv => inv.type === 'interest')
                .reduce((sum, inv) => sum + inv.principal, 0);
        }

        this.hasEmergencyFund = totalEmergencyFund >= this.emergencyFundRequired;

        // Notify if status changed
        if (wasReady && !this.hasEmergencyFund) {
            this.addNotification('⚠️ Emergency fund below ₱5,000! Investments locked until replenished.', '🚨');
        } else if (!wasReady && this.hasEmergencyFund) {
            this.addNotification('✅ Emergency fund ready! All investments unlocked.', '🎉');
        }
    }

    checkBusinessEmergencyFundStatus() {
        const wasReady = this.hasBusinessEmergencyFund;
        // Business emergency fund = cash reserves
        this.hasBusinessEmergencyFund = this.player.financials.cash >= this.businessEmergencyFundRequired;

        // Notify if status changed
        if (wasReady && !this.hasBusinessEmergencyFund) {
            this.addNotification('⚠️ Cash below ₱30,000! Business opportunities locked.', '🚨');
        } else if (!wasReady && this.hasBusinessEmergencyFund) {
            this.addNotification('✅ You have ₱30,000 cash! Business opportunities unlocked.', '🎉');
        }
    }

    createPlayer() {
        return {
            name: 'Juan dela Cruz',
            age: 22,
            education: 'High School',
            currentJob: {
                title: 'Informal Sector Worker',
                monthlySalary: 10000,
                experience: 0,
                skills: []
            },
            financials: {
                cash: 0,
                savings: 0,
                emergencyFund: 0,
                totalNetWorth: 0,
                totalEarned: 0,
                debt: 0
            },
            attributes: {
                financialLiteracy: 1,
                workEthic: 5,
                entrepreneurship: 1,
                networking: 3,
                discipline: 5,
                resilience: 5
            },
            location: 'Barangay Marilag, Manila',
            title: 'The Hopeful',
            totalWorkDone: 0,
            level: 1,
            xp: 0,
            xpToNextLevel: 100
        };
    }

    // === WORK & ENERGY SYSTEM ===
    doWork() {
        const energyCost = 10;

        // Check if already working
        if (this.isWorking) {
            this.addNotification('Already working! Please wait...', '⚠️');
            return;
        }

        if (this.workEnergy < energyCost) {
            this.addNotification('Not enough energy! Wait for it to regenerate.', '⚠️');
            return;
        }

        // Start working
        this.isWorking = true;
        this.workEnergy -= energyCost;
        this.workProgress = 0;

        // Update work button UI
        this.updateWorkButton();

        // Progress timer
        const startTime = Date.now();
        const workInterval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            this.workProgress = Math.min((elapsed / this.workDuration) * 100, 100);

            this.updateWorkButton();

            if (elapsed >= this.workDuration) {
                clearInterval(workInterval);
                this.completeWork();
            }
        }, 100); // Update every 100ms for smooth progress
    }

    completeWork() {
        // Calculate earnings based on job
        const baseEarnings = this.player.currentJob.monthlySalary / 30; // Daily rate
        const bonus = Math.random() * 0.3; // 0-30% bonus
        const earnings = Math.floor(baseEarnings * (1 + bonus));

        this.player.financials.cash += earnings;
        this.player.financials.totalEarned += earnings;
        this.player.totalWorkDone++;
        this.gameStats.totalWorkActions++;

        // Check business emergency fund status when cash changes
        this.checkBusinessEmergencyFundStatus();

        // Track work experience (every 10 work sessions = 1 month of experience)
        if (this.player.totalWorkDone % 10 === 0) {
            this.player.currentJob.experience++;
            this.addNotification(`Gained 1 month of work experience! Total: ${this.player.currentJob.experience} months`, '📚');
        }

        // Gain XP
        this.gainXP(5);

        this.addActivityLog(`Worked and earned ₱${earnings.toLocaleString()}!`, '💼');
        this.addNotification(`Earned ₱${earnings.toLocaleString()}!`, '💰');

        // Check for work achievements
        if (this.player.totalWorkDone === 10) {
            this.showAchievement('Hard Worker! 10 work sessions', '💪');
        }
        if (this.player.totalWorkDone === 100) {
            this.showAchievement('Dedicated! 100 work sessions', '🏆');
        }

        // Passive income from businesses
        this.earnPassiveIncome();

        // Reset working state
        this.isWorking = false;
        this.workProgress = 0;

        this.updateUI();
        this.updateGuidance();
        this.calculateNetWorth();
        this.checkGoalsProgress();
        this.updateWorkButton();
    }

    updateWorkButton() {
        const btn = document.getElementById('work-btn');
        const progressBar = document.getElementById('work-progress-bar');
        const progressFill = document.getElementById('work-progress-fill');

        if (!btn) return;

        if (this.isWorking) {
            btn.disabled = true;
            btn.innerHTML = `💼 WORKING... ${Math.floor(this.workProgress)}%`;
            if (progressBar) progressBar.style.display = 'block';
            if (progressFill) progressFill.style.width = this.workProgress + '%';
        } else {
            btn.disabled = this.workEnergy < 10;
            btn.innerHTML = '💼 WORK';
            if (progressBar) progressBar.style.display = 'none';
            if (progressFill) progressFill.style.width = '0%';
        }
    }

    startEnergyRegen() {
        setInterval(() => {
            if (this.workEnergy < this.maxWorkEnergy) {
                this.workEnergy = Math.min(this.workEnergy + this.energyRegenRate, this.maxWorkEnergy);
                this.updateEnergyDisplay();
            }
        }, 1000); // Regen every second
    }

    updateEnergyDisplay() {
        const energyPercent = (this.workEnergy / this.maxWorkEnergy) * 100;
        const energyBar = document.getElementById('mp-bar');
        const energyText = document.getElementById('current-mp');
        const energyMax = document.getElementById('max-mp');

        if (energyBar) energyBar.style.width = energyPercent + '%';
        if (energyText) energyText.textContent = Math.floor(this.workEnergy);
        if (energyMax) energyMax.textContent = this.maxWorkEnergy;
    }

    earnPassiveIncome() {
        // Businesses earn when you work
        this.businesses.forEach(business => {
            const template = this.businessOpportunities.find(b => b.id === business.type);
            if (!template) return;

            const profit = Math.floor((template.monthlyProfit / 30) * business.efficiency);
            this.player.financials.cash += profit;
            business.totalProfit += profit;

            if (profit > 0) {
                this.addActivityLog(`${business.name} earned ₱${profit.toLocaleString()}`, template.icon);
            }
        });
    }

    createJobMarket() {
        return [
            {
                id: 'informal-sector',
                title: 'Informal Sector Worker',
                salary: 10000,
                requirements: { education: 'None', experience: 0 },
                description: 'Laborer, tindera, helper - no formal employment',
                growth: 'Limited'
            },
            {
                id: 'minimum-wage',
                title: 'Minimum Wage Worker',
                salary: 15000,
                requirements: { education: 'High School', experience: 0 },
                description: 'Entry-level position, basic work',
                growth: 'Limited'
            },
            {
                id: 'call-center',
                title: 'Call Center Agent',
                salary: 25000,
                requirements: { education: 'High School', experience: 0 },
                description: 'BPO work, night shift, good benefits',
                growth: 'Moderate'
            },
            {
                id: 'admin-assistant',
                title: 'Administrative Assistant',
                salary: 22000,
                requirements: { education: 'College Level', experience: 0 },
                description: 'Office work, regular hours',
                growth: 'Moderate'
            },
            {
                id: 'teacher',
                title: 'Public School Teacher',
                salary: 28000,
                requirements: { education: 'College Graduate - Education', experience: 0 },
                description: 'Stable government job, benefits',
                growth: 'Moderate'
            },
            {
                id: 'programmer',
                title: 'Junior Programmer',
                salary: 35000,
                requirements: { education: 'College Graduate - IT', experience: 0 },
                description: 'Tech industry, work from home possible',
                growth: 'High'
            },
            {
                id: 'senior-programmer',
                title: 'Senior Programmer',
                salary: 70000,
                requirements: { education: 'College Graduate - IT', experience: 36 },
                description: 'High-paying tech role',
                growth: 'High'
            },
            {
                id: 'ofw-domestic',
                title: 'OFW - Domestic Helper',
                salary: 45000,
                requirements: { education: 'High School', experience: 6 },
                description: 'Work abroad, sacrifice time with family',
                growth: 'Limited',
                special: 'Away from family, homesickness'
            },
            {
                id: 'ofw-nurse',
                title: 'OFW - Nurse',
                salary: 80000,
                requirements: { education: 'College Graduate - Nursing', experience: 12 },
                description: 'Work abroad, high pay, sacrifice family time',
                growth: 'High',
                special: 'Away from family'
            },
            {
                id: 'freelancer',
                title: 'Freelancer (VA/Writer/Designer)',
                salary: 30000,
                requirements: { education: 'High School', experience: 3 },
                description: 'Flexible hours, work from home, unstable income',
                growth: 'High'
            }
        ];
    }

    createInvestmentOptions() {
        return [
            {
                id: 'piggy-bank',
                name: 'Piggy Bank (Emergency Fund)',
                minInvestment: 100,
                expectedReturn: 0,
                risk: 'None',
                description: 'Safe storage for emergency fund. No interest, just protection.',
                icon: '🐷',
                liquidity: 'High'
            },
            {
                id: 'savings-account',
                name: 'Savings Account',
                minInvestment: 100,
                expectedReturn: 0.25,
                risk: 'Very Low',
                description: 'Traditional bank savings, very low returns but safe',
                icon: '🏦',
                liquidity: 'High'
            },
            {
                id: 'digital-bank',
                name: 'Digital Banking',
                minInvestment: 1000,
                expectedReturn: 4.0,
                risk: 'Very Low',
                description: 'Online banking with better interest rates',
                icon: '📱',
                liquidity: 'High'
            },
            {
                id: 'time-deposit',
                name: 'Time Deposit',
                minInvestment: 10000,
                expectedReturn: 2.0,
                risk: 'Very Low',
                description: '1-year time deposit, better than savings',
                icon: '📅',
                liquidity: 'Low'
            },
            {
                id: 'pag-ibig-mp2',
                name: 'Pag-IBIG MP2',
                minInvestment: 500,
                expectedReturn: 6.0,
                risk: 'Low',
                description: 'Government savings program, tax-free dividends',
                icon: '🏛️',
                liquidity: 'Low'
            },
            {
                id: 'stocks-index',
                name: 'PSEi Index Fund',
                minInvestment: 5000,
                expectedReturn: 8.0,
                risk: 'Medium',
                description: 'Philippine stock market index fund',
                icon: '📈',
                liquidity: 'Medium',
                volatility: 15
            },
            {
                id: 'mutual-fund',
                name: 'Mutual Fund (Balanced)',
                minInvestment: 5000,
                expectedReturn: 7.0,
                risk: 'Medium',
                description: 'Professionally managed investments',
                icon: '💼',
                liquidity: 'Medium'
            },
            {
                id: 'real-estate',
                name: 'Real Estate (Condo)',
                minInvestment: 500000,
                expectedReturn: 5.0,
                risk: 'Medium',
                description: 'Property investment, can rent out',
                icon: '🏢',
                liquidity: 'Very Low',
                rentalYield: 4.0
            },
            {
                id: 'crypto',
                name: 'Cryptocurrency',
                minInvestment: 1000,
                expectedReturn: 15.0,
                risk: 'Very High',
                description: 'High risk, high reward digital assets',
                icon: '₿',
                liquidity: 'High',
                volatility: 40
            }
        ];
    }

    createBusinessOpportunities() {
        return [
            {
                id: 'sari-sari-small',
                name: 'Small Sari-Sari Store',
                initialCost: 15000,
                monthlyProfit: 3000,
                timeRequired: 4, // hours per day
                description: 'Small neighborhood store, steady income',
                icon: '🏪',
                requirements: { cash: 15000 }
            },
            {
                id: 'sari-sari-large',
                name: 'Large Sari-Sari Store',
                initialCost: 50000,
                monthlyProfit: 10000,
                timeRequired: 8,
                description: 'Bigger store, more inventory, better profits',
                icon: '🏪',
                requirements: { cash: 50000, entrepreneurship: 3 }
            },
            {
                id: 'food-cart',
                name: 'Food Cart (Fishball, Kwek-Kwek)',
                initialCost: 25000,
                monthlyProfit: 8000,
                timeRequired: 6,
                description: 'Street food business, popular items',
                icon: '🍡',
                requirements: { cash: 25000 }
            },
            {
                id: 'carinderia',
                name: 'Carinderia (Eatery)',
                initialCost: 80000,
                monthlyProfit: 20000,
                timeRequired: 10,
                description: 'Small eatery, serve Filipino meals',
                icon: '🍽️',
                requirements: { cash: 80000, entrepreneurship: 4 }
            },
            {
                id: 'online-selling',
                name: 'Online Selling (Facebook/Shopee)',
                initialCost: 10000,
                monthlyProfit: 5000,
                timeRequired: 3,
                description: 'Sell products online, low overhead',
                icon: '📱',
                requirements: { cash: 10000, networking: 3 }
            },
            {
                id: 'tricycle',
                name: 'Tricycle Franchise',
                initialCost: 150000,
                monthlyProfit: 15000,
                timeRequired: 0, // passive if you hire driver
                description: 'Buy tricycle, hire driver, passive income',
                icon: '🛺',
                requirements: { cash: 150000 }
            },
            {
                id: 'jeepney',
                name: 'Jeepney Franchise',
                initialCost: 800000,
                monthlyProfit: 40000,
                timeRequired: 0,
                description: 'Iconic Filipino transport, hire driver',
                icon: '🚐',
                requirements: { cash: 800000, entrepreneurship: 6 }
            },
            {
                id: 'boarding-house',
                name: 'Boarding House',
                initialCost: 1000000,
                monthlyProfit: 50000,
                timeRequired: 2,
                description: 'Rent rooms to students/workers',
                icon: '🏘️',
                requirements: { cash: 1000000, realEstate: true }
            }
        ];
    }

    createEducationOptions() {
        return [
            {
                id: 'college-diploma',
                name: 'College Degree',
                cost: 200000,
                duration: 48, // months
                benefits: {
                    financialLiteracy: 3,
                    networking: 2,
                    salaryMultiplier: 1.5
                },
                description: '4-year college degree, better job opportunities',
                icon: '🎓'
            },
            {
                id: 'vocational',
                name: 'TESDA Vocational Course',
                cost: 15000,
                duration: 6,
                benefits: {
                    workEthic: 2,
                    specificSkill: true,
                    salaryMultiplier: 1.2
                },
                description: 'Practical skills training, quick job entry',
                icon: '🔧'
            },
            {
                id: 'online-course',
                name: 'Online Course (Coursera/Udemy)',
                cost: 5000,
                duration: 3,
                benefits: {
                    financialLiteracy: 1,
                    entrepreneurship: 1
                },
                description: 'Learn new skills online, flexible schedule',
                icon: '💻'
            },
            {
                id: 'financial-literacy',
                name: 'Financial Literacy Workshop',
                cost: 3000,
                duration: 1,
                benefits: {
                    financialLiteracy: 3,
                    discipline: 2
                },
                description: 'Learn budgeting, investing, and money management',
                icon: '💰'
            },
            {
                id: 'english-training',
                name: 'English Communication Training',
                cost: 8000,
                duration: 3,
                benefits: {
                    networking: 2,
                    salaryMultiplier: 1.3
                },
                description: 'Better English = better job opportunities',
                icon: '🗣️'
            }
        ];
    }

    createBarangay() {
        return {
            name: 'Barangay Marilag',
            population: 150,
            development: 50,
            communityProjects: [],
            events: []
        };
    }

    initializeGoals() {
        this.goals = [
            {
                id: 'emergency-fund',
                name: 'Build Emergency Fund',
                desc: 'Save 6 months worth of expenses (₱72,000)',
                target: 72000,
                current: 0,
                type: 'savings',
                reward: 500,
                completed: false,
                icon: '🆘'
            },
            {
                id: 'first-investment',
                name: 'Make Your First Investment',
                desc: 'Start your investment journey',
                target: 1,
                current: 0,
                type: 'investment',
                reward: 1000,
                completed: false,
                icon: '📈'
            },
            {
                id: 'college-degree',
                name: 'Complete College Education',
                desc: 'Get your college diploma',
                target: 1,
                current: 0,
                type: 'education',
                reward: 5000,
                completed: false,
                icon: '🎓'
            },
            {
                id: 'first-business',
                name: 'Start Your First Business',
                desc: 'Become an entrepreneur',
                target: 1,
                current: 0,
                type: 'business',
                reward: 3000,
                completed: false,
                icon: '🏪'
            },
            {
                id: 'net-worth-100k',
                name: 'Reach ₱100,000 Net Worth',
                desc: 'Build wealth through savings and investments',
                target: 100000,
                current: 5000,
                type: 'networth',
                reward: 2000,
                completed: false,
                icon: '💎'
            },
            {
                id: 'net-worth-1m',
                name: 'Reach ₱1,000,000 Net Worth',
                desc: 'Become a millionaire!',
                target: 1000000,
                current: 5000,
                type: 'networth',
                reward: 10000,
                completed: false,
                icon: '💰'
            },
            {
                id: 'passive-income',
                name: 'Build Passive Income (₱20k/month)',
                desc: 'Earn money while you sleep',
                target: 20000,
                current: 0,
                type: 'passive',
                reward: 5000,
                completed: false,
                icon: '💵'
            },
            {
                id: 'own-home',
                name: 'Own Your First Home',
                desc: 'Buy your own property',
                target: 1,
                current: 0,
                type: 'property',
                reward: 10000,
                completed: false,
                icon: '🏠'
            },
            {
                id: 'financial-freedom',
                name: 'Achieve Financial Freedom',
                desc: 'Passive income > Monthly expenses',
                target: 1,
                current: 0,
                type: 'freedom',
                reward: 50000,
                completed: false,
                icon: '🎯'
            }
        ];
    }

    // === XP & LEVELING ===
    gainXP(amount) {
        this.player.xp += amount;

        while (this.player.xp >= this.player.xpToNextLevel) {
            this.levelUp();
        }

        this.updateUI();
    }

    levelUp() {
        this.player.xp -= this.player.xpToNextLevel;
        this.player.level++;
        this.player.xpToNextLevel = Math.floor(this.player.xpToNextLevel * 1.5);

        // Increase max energy
        this.maxWorkEnergy += 10;
        this.workEnergy = this.maxWorkEnergy; // Refill on level up

        // Increase attributes slightly
        this.player.attributes.workEthic += 1;
        this.player.attributes.discipline += 1;

        this.showAchievement(`Level Up! Now level ${this.player.level}!`, '🎉');
        this.addActivityLog(`Level Up! Now level ${this.player.level}`, '🎉');

        // Update title
        this.updatePlayerTitle();
        this.updateUI();
    }

    // === FINANCIAL ACTIONS ===

    changeJob(jobId) {
        const job = this.jobMarket.find(j => j.id === jobId);
        if (!job) return;

        // Check requirements
        if (job.requirements.education && !this.meetsEducationRequirement(job.requirements.education)) {
            this.addNotification('You do not meet the education requirements', '❌');
            return;
        }

        this.player.currentJob = {
            title: job.title,
            monthlySalary: job.salary,
            experience: 0,
            skills: job.requirements.skills || []
        };

        this.addNotification(`New job: ${job.title}!`, '🎉');
        this.addActivityLog(`Started working as ${job.title}`, '💼');

        // Show achievement
        if (job.salary >= 25000) {
            this.showAchievement(`New Career: ${job.title}!`, '💼');
        }

        this.updateUI();
        this.updateGuidance();
        this.saveGame();
    }

    makeInvestment(investmentId, amount) {
        const option = this.investmentOptions.find(opt => opt.id === investmentId);
        if (!option) return;

        // Check emergency fund requirement (except for Piggy Bank, Savings Account, and Digital Bank)
        if (investmentId !== 'piggy-bank' && investmentId !== 'savings-account' && investmentId !== 'digital-bank' && !this.hasEmergencyFund) {
            this.addNotification('🚨 Build ₱5,000 emergency fund first! Use Piggy Bank.', '⚠️');
            return;
        }

        if (amount < option.minInvestment) {
            this.addNotification(`Minimum investment: ₱${option.minInvestment.toLocaleString()}`, '❌');
            return;
        }

        if (this.player.financials.cash < amount) {
            this.addNotification('Not enough cash!', '❌');
            return;
        }

        // Piggy Bank: directly add to emergency fund (no active investment, instant)
        if (investmentId === 'piggy-bank') {
            this.player.financials.cash -= amount;
            this.player.financials.emergencyFund += amount;
            this.checkEmergencyFundStatus();
            this.addNotification(`Added ₱${amount.toLocaleString()} to Emergency Fund`, option.icon);
            this.addActivityLog(`Emergency Fund: +₱${amount.toLocaleString()}`, option.icon);

            if (this.hasEmergencyFund && this.player.financials.emergencyFund >= this.emergencyFundRequired) {
                this.showAchievement('Emergency Fund Complete! 🎉', '💰');
                this.addNotification('🎉 All investments are now unlocked!', '✅');
            }

            this.calculateNetWorth();
            this.updateUI();
            this.updateGuidance();
            this.saveGame();
            return;
        }

        // Check if this investment type should create an active investment with progress bar
        if (investmentId === 'savings-account' || investmentId === 'digital-bank' || investmentId === 'time-deposit' || investmentId === 'pag-ibig-mp2') {
            // Create interest account active investment (very slow progress - 10 min)
            this.createActiveInvestment('interest', amount, option.name, option.expectedReturn);

            // For savings account or digital bank, also track emergency fund
            if (investmentId === 'savings-account' || investmentId === 'digital-bank') {
                this.checkEmergencyFundStatus();
                if (this.hasEmergencyFund) {
                    this.showAchievement('Emergency Fund Complete! 🎉', '💰');
                    this.addNotification('🎉 All investments are now unlocked!', '✅');
                }
            }
        } else if (investmentId === 'stocks-index') {
            // Create stocks active investment (slower progress - 5 min)
            this.createActiveInvestment('stocks', amount, option.name, option.expectedReturn);
        } else if (investmentId === 'mutual-fund') {
            // Create mutual fund active investment (slower progress - 5 min)
            this.createActiveInvestment('mutual', amount, option.name, option.expectedReturn);
        } else {
            // Regular passive investment (real estate, crypto, etc.)
            this.player.financials.cash -= amount;

            const investment = {
                id: Date.now(),
                type: investmentId,
                name: option.name,
                amount: amount,
                initialAmount: amount,
                totalReturns: 0,
                startTime: Date.now()
            };

            this.investments.push(investment);

            this.addNotification(`Invested ₱${amount.toLocaleString()} in ${option.name}`, option.icon);
            this.addActivityLog(`New investment: ${option.name}`, option.icon);

            // Show achievement for first investment
            if (this.investments.length === 1) {
                this.showAchievement('First Investment! 📈', '🎉');
            }

            // Update goal
            this.updateGoalProgress('first-investment', 1);
        }

        this.calculateNetWorth();
        this.updateUI();
        this.updateGuidance();
        this.saveGame();
    }

    startBusiness(businessId) {
        const business = this.businessOpportunities.find(b => b.id === businessId);
        if (!business) return;

        // Check business emergency fund requirement
        if (!this.hasBusinessEmergencyFund) {
            this.addNotification('🚨 Build ₱30,000 cash reserve first! This protects your business from emergencies.', '⚠️');
            return;
        }

        if (this.player.financials.cash < business.initialCost) {
            this.addNotification('Not enough capital!', '❌');
            return;
        }

        this.player.financials.cash -= business.initialCost;

        const newBusiness = {
            id: Date.now(),
            type: businessId,
            name: business.name,
            initialCost: business.initialCost,
            monthlyProfit: business.monthlyProfit,
            totalProfit: 0,
            efficiency: 1.0,
            startTime: Date.now()
        };

        this.businesses.push(newBusiness);

        this.addNotification(`Started business: ${business.name}!`, business.icon);
        this.addActivityLog(`Opened ${business.name}`, business.icon);

        // Show achievement for first business
        if (this.businesses.length === 1) {
            this.showAchievement('First Business! 🏪', '🎉');
        }

        // Update goal
        this.updateGoalProgress('first-business', 1);

        this.calculateNetWorth();
        this.updateUI();
        this.updateGuidance();
        this.saveGame();
    }

    enrollEducation(educationId) {
        const education = this.educationOptions.find(e => e.id === educationId);
        if (!education) return;

        if (this.player.financials.cash < education.cost) {
            this.addNotification('Cannot afford this education!', '❌');
            return;
        }

        this.player.financials.cash -= education.cost;

        // Apply benefits immediately for simplicity
        // In a more complex system, this would take time
        Object.keys(education.benefits).forEach(benefit => {
            if (this.player.attributes[benefit] !== undefined) {
                this.player.attributes[benefit] += education.benefits[benefit];
            }
        });

        if (educationId === 'college-diploma') {
            this.player.education = 'College Graduate';
            this.updateGoalProgress('college-degree', 1);
        }

        this.addNotification(`Completed: ${education.name}!`, education.icon);
        this.addActivityLog(`Finished ${education.name}`, education.icon);

        this.updateUI();
        this.saveGame();
    }

    calculateNetWorth() {
        let netWorth = this.player.financials.cash || 0;
        netWorth += this.player.financials.savings || 0;

        // Add active investments
        if (this.activeInvestments && this.activeInvestments.length > 0) {
            this.activeInvestments.forEach(inv => {
                netWorth += inv.principal || 0;
            });
        }

        // Add passive investment values
        this.investments.forEach(inv => {
            netWorth += inv.amount || 0;
        });

        // Add business values (conservative estimate)
        this.businesses.forEach(bus => {
            netWorth += (bus.initialCost * 0.8) || 0; // Depreciated value
        });

        // Subtract debt (if any)
        netWorth -= this.player.financials.debt || 0;

        this.player.financials.totalNetWorth = Math.floor(netWorth);

        // Check for net worth achievements
        if (netWorth >= 100000 && !this.achievements_100k) {
            this.showAchievement('₱100,000 Net Worth! 💎', '🎉');
            this.achievements_100k = true;
        }
        if (netWorth >= 1000000 && !this.achievements_1m) {
            this.showAchievement('MILLIONAIRE! ₱1,000,000! 💰', '🏆');
            this.achievements_1m = true;
        }

        return netWorth;
    }

    // === GOALS SYSTEM ===

    getPassiveIncome() {
        let totalPassive = 0;
        this.businesses.forEach(business => {
            const template = this.businessOpportunities.find(b => b.id === business.type);
            if (template) {
                totalPassive += template.monthlyProfit * business.efficiency;
            }
        });
        return totalPassive;
    }

    checkGoalsProgress() {
        this.goals.forEach(goal => {
            if (goal.completed) return;

            switch (goal.type) {
                case 'savings':
                    // Calculate current emergency fund (active interest investments)
                    let currentEmergencyFund = 0;
                    if (this.activeInvestments && this.activeInvestments.length > 0) {
                        currentEmergencyFund = this.activeInvestments
                            .filter(inv => inv.type === 'interest')
                            .reduce((sum, inv) => sum + inv.principal, 0);
                    }
                    goal.current = currentEmergencyFund;
                    break;
                case 'networth':
                    goal.current = this.player.financials.totalNetWorth;
                    break;
                case 'passive':
                    goal.current = this.getPassiveIncome();
                    break;
                case 'freedom':
                    // Financial freedom when passive income is substantial
                    if (this.getPassiveIncome() >= 20000) {
                        goal.current = 1;
                    }
                    break;
            }

            if (goal.current >= goal.target) {
                this.completeGoal(goal.id);
            }
        });

        this.updateGoalsUI();
    }

    updateGoalProgress(goalId, amount) {
        const goal = this.goals.find(g => g.id === goalId);
        if (goal && !goal.completed) {
            goal.current += amount;

            if (goal.current >= goal.target) {
                this.completeGoal(goalId);
            }

            this.updateGoalsUI();
        }
    }

    completeGoal(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;

        goal.completed = true;
        this.player.financials.cash += goal.reward;
        this.gameStats.goalsAchieved++;

        this.addNotification(`Goal Complete: ${goal.name}! +₱${goal.reward.toLocaleString()}`, '🎉');
        this.addActivityLog(`Achieved: ${goal.name}`, goal.icon);

        // Update title based on achievements
        this.updatePlayerTitle();

        this.updateGoalsUI();
        this.saveGame();
    }

    updatePlayerTitle() {
        const netWorth = this.player.financials.totalNetWorth;
        const goalsCompleted = this.gameStats.goalsAchieved;

        if (netWorth >= 10000000) this.player.title = 'The Multi-Millionaire';
        else if (netWorth >= 1000000) this.player.title = 'The Millionaire';
        else if (goalsCompleted >= 5) this.player.title = 'The Achiever';
        else if (this.businesses.length >= 2) this.player.title = 'The Entrepreneur';
        else if (this.investments.length >= 3) this.player.title = 'The Investor';
        else if (netWorth >= 100000) this.player.title = 'The Saver';
        else if (this.player.currentJob.monthlySalary >= 30000) this.player.title = 'The Professional';
        else this.player.title = 'The Hopeful';
    }

    meetsEducationRequirement(required) {
        const levels = ['None', 'High School', 'College Level', 'College Graduate', 'Post Graduate'];
        const playerLevel = levels.indexOf(this.player.education);
        const requiredLevel = levels.indexOf(required);
        return playerLevel >= requiredLevel;
    }

    gameOver() {
        this.paused = true;
        this.addNotification('Game Over! You ran out of money...', '💀');
        // Could show restart option here
    }

    // === UI UPDATE METHODS ===

    updateUI() {
        this.updatePlayerStats();
        this.updateFinancialDisplay();
        this.updateAttributesDisplay();
        this.updateStatsUI();
        this.saveGame();
    }

    updatePlayerStats() {
        const setTextIfExists = (id, text) => {
            const elem = document.getElementById(id);
            if (elem) elem.textContent = text;
        };

        const setStyleIfExists = (id, prop, value) => {
            const elem = document.getElementById(id);
            if (elem) elem.style[prop] = value;
        };

        setTextIfExists('player-level', this.player.level);
        setTextIfExists('player-name', this.player.name);
        setTextIfExists('player-name-mini', this.player.name);
        setTextIfExists('player-title', this.player.title);
        setTextIfExists('player-class', this.player.currentJob.title);

        // Cash (no bar, just display)
        setTextIfExists('current-hp', '₱' + Math.floor(this.player.financials.cash).toLocaleString());
        setTextIfExists('max-hp', '');
        setStyleIfExists('hp-bar', 'width', '100%');

        // Energy
        const energyPercent = (this.workEnergy / this.maxWorkEnergy) * 100;
        setStyleIfExists('mp-bar', 'width', energyPercent + '%');
        setTextIfExists('current-mp', Math.floor(this.workEnergy));
        setTextIfExists('max-mp', this.maxWorkEnergy);

        // XP Progress
        const xpPercent = (this.player.xp / this.player.xpToNextLevel) * 100;
        setStyleIfExists('xp-bar', 'width', xpPercent + '%');
        setTextIfExists('current-xp', Math.floor(this.player.xp));
        setTextIfExists('next-xp', this.player.xpToNextLevel);
    }

    updateFinancialDisplay() {
        const cashDisplay = Math.floor(this.player.financials.cash).toLocaleString();

        // Update all cash displays across different pages
        const cashElements = [
            'player-gold',
            'gold-display',
            'player-gold-dashboard',
            'player-gold-jobs',
            'player-gold-invest',
            'player-gold-crypto',
            'player-gold-business',
            'player-gold-education',
            'player-gold-assets',
            'player-gold-goals'
        ];

        cashElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = cashDisplay;
            }
        });
    }

    updateAttributesDisplay() {
        const attrs = this.player.attributes;
        document.getElementById('attr-str').textContent = attrs.financialLiteracy;
        document.getElementById('attr-dex').textContent = attrs.workEthic;
        document.getElementById('attr-con').textContent = attrs.entrepreneurship;
        document.getElementById('attr-int').textContent = attrs.networking;
        document.getElementById('attr-wis').textContent = attrs.discipline;
        document.getElementById('attr-cha').textContent = attrs.resilience;
    }

    updateFinancialUI() {
        // To be called when viewing financial dashboard
    }

    updateInventoryUI() {
        // Show assets instead
        const inventoryGrid = document.getElementById('inventory-grid');

        if (this.investments.length === 0 && this.businesses.length === 0) {
            inventoryGrid.innerHTML = '<div class="empty-state">No investments or businesses yet</div>';
        } else {
            let html = '';

            // Show investments
            this.investments.forEach(inv => {
                const option = this.investmentOptions.find(opt => opt.id === inv.type);
                const returns = ((inv.amount - inv.initialAmount) / inv.initialAmount * 100).toFixed(2);
                html += `
                    <div class="inventory-item">
                        <div class="inventory-item-icon">${option.icon}</div>
                        <div class="inventory-item-name">${inv.name}</div>
                        <div class="inventory-item-quantity">₱${Math.floor(inv.amount).toLocaleString()}</div>
                        <div class="stat-value" style="font-size: 10px; color: ${returns >= 0 ? '#2ED573' : '#FF4757'}">
                            ${returns >= 0 ? '+' : ''}${returns}%
                        </div>
                    </div>
                `;
            });

            // Show businesses
            this.businesses.forEach(bus => {
                const template = this.businessOpportunities.find(b => b.id === bus.type);
                html += `
                    <div class="inventory-item">
                        <div class="inventory-item-icon">${template.icon}</div>
                        <div class="inventory-item-name">${bus.name}</div>
                        <div class="inventory-item-quantity">₱${Math.floor(bus.totalProfit).toLocaleString()} profit</div>
                    </div>
                `;
            });

            inventoryGrid.innerHTML = html;
        }
    }

    updateGoalsUI() {
        const activeGoals = document.getElementById('active-quests');
        const completedGoals = document.getElementById('available-quests');

        const active = this.goals.filter(g => !g.completed);
        const completed = this.goals.filter(g => g.completed);

        if (active.length === 0) {
            activeGoals.innerHTML = '<div class="empty-state">No active goals</div>';
        } else {
            activeGoals.innerHTML = active.map(goal => {
                const progressPercent = Math.min((goal.current / goal.target) * 100, 100);
                return `
                    <div class="quest-item">
                        <div class="quest-header">
                            <div class="quest-name">${goal.icon} ${goal.name}</div>
                            <div class="quest-reward">₱${goal.reward.toLocaleString()}</div>
                        </div>
                        <div class="quest-desc">${goal.desc}</div>
                        <div class="quest-progress">
                            <div class="quest-progress-bar">
                                <div class="quest-progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                            <div class="quest-progress-text">${progressPercent.toFixed(0)}%</div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        if (completed.length === 0) {
            completedGoals.innerHTML = '<div class="empty-state">No completed goals yet</div>';
        } else {
            completedGoals.innerHTML = completed.map(goal => `
                <div class="quest-item" style="opacity: 0.7;">
                    <div class="quest-header">
                        <div class="quest-name">✅ ${goal.name}</div>
                        <div class="quest-reward">₱${goal.reward.toLocaleString()}</div>
                    </div>
                    <div class="quest-desc">${goal.desc}</div>
                </div>
            `).join('');
        }
    }

    updateStatsUI() {
        if (document.getElementById('stat-quests')) {
            document.getElementById('stat-quests').textContent = this.gameStats.goalsAchieved;
        }
        if (document.getElementById('stat-playtime')) {
            const playtime = Math.floor((Date.now() - this.gameStats.startTime) / 60000);
            document.getElementById('stat-playtime').textContent = playtime + 'm';
        }
        if (document.getElementById('stat-gold-earned')) {
            document.getElementById('stat-gold-earned').textContent = '₱' + this.gameStats.totalEarned.toLocaleString();
        }

        // Update dashboard progress stats
        if (document.getElementById('total-work-done')) {
            document.getElementById('total-work-done').textContent = this.player.totalWorkDone;
        }

        // Update portfolio
        this.updatePortfolio();
    }

    updatePortfolio() {
        // Calculate individual portfolio values
        let investmentsValue = 0;
        this.investments.forEach(inv => {
            investmentsValue += inv.amount || 0;
        });

        let businessesValue = 0;
        this.businesses.forEach(bus => {
            businessesValue += (bus.initialCost * 0.8) || 0;
        });

        // Update portfolio displays
        const setTextIfExists = (id, text) => {
            const elem = document.getElementById(id);
            if (elem) elem.textContent = text;
        };

        setTextIfExists('portfolio-networth', '₱' + Math.floor(this.player.financials.totalNetWorth).toLocaleString());
        setTextIfExists('portfolio-cash', Math.floor(this.player.financials.cash).toLocaleString());
        setTextIfExists('portfolio-emergency', Math.floor(this.player.financials.emergencyFund).toLocaleString());
        setTextIfExists('portfolio-investments', Math.floor(investmentsValue).toLocaleString());
        setTextIfExists('portfolio-businesses', Math.floor(businessesValue).toLocaleString());

        // Calculate today's change (simplified - just show total earned)
        const changeAmount = this.player.financials.totalEarned || 0;
        const changePercent = this.player.financials.totalNetWorth > 0
            ? ((changeAmount / this.player.financials.totalNetWorth) * 100).toFixed(1)
            : 0;
        setTextIfExists('portfolio-change', `+₱${changeAmount.toLocaleString()} (${changePercent}%) lifetime`);
    }

    addActivityLog(message, icon = '📝') {
        const feed = document.getElementById('activity-feed');
        if (!feed) return;

        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const entry = document.createElement('div');
        entry.className = 'activity-item';
        entry.innerHTML = `
            <span class="activity-icon">${icon}</span>
            <span class="activity-text">${message}</span>
            <span class="activity-time">${time}</span>
        `;

        feed.insertBefore(entry, feed.firstChild);

        while (feed.children.length > 10) {
            feed.removeChild(feed.lastChild);
        }
    }

    addNotification(message, icon = '📢') {
        // Notifications now go to activity feed (combined with activity log)
        const feed = document.getElementById('activity-feed');
        if (!feed) return;

        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const activity = document.createElement('div');
        activity.className = 'activity-item';
        activity.innerHTML = `
            <span class="activity-icon">${icon}</span>
            <span class="activity-text">${message}</span>
            <span class="activity-time">${time}</span>
        `;

        feed.insertBefore(activity, feed.firstChild);

        // Keep only last 50 items
        while (feed.children.length > 50) {
            feed.removeChild(feed.lastChild);
        }
    }

    startPlaytimeCounter() {
        setInterval(() => {
            const playtime = Math.floor((Date.now() - this.gameStats.startTime) / 60000);
            if (document.getElementById('stat-playtime')) {
                document.getElementById('stat-playtime').textContent = playtime + 'm';
            }
        }, 60000);
    }

    // === SAVE/LOAD SYSTEM ===

    saveGame() {
        const saveData = {
            player: this.player,
            investments: this.investments,
            businesses: this.businesses,
            goals: this.goals,
            barangay: this.barangay,
            gameStats: this.gameStats,
            cryptoMarket: this.cryptoMarket,
            activeInvestments: this.activeInvestments,
            activityLog: this.activityLog
        };

        localStorage.setItem('pinoyrpg_save', JSON.stringify(saveData));
    }

    loadGame() {
        const saveData = localStorage.getItem('pinoyrpg_save');
        const saveVersion = localStorage.getItem('pinoyrpg_version');
        const currentVersion = '2.0'; // Action-based version

        if (saveData) {
            try {
                // Check if save is from old version (time-based)
                if (!saveVersion || saveVersion !== currentVersion) {
                    console.log('🔄 Old save detected. Clearing for new version...');
                    localStorage.removeItem('pinoyrpg_save');
                    localStorage.setItem('pinoyrpg_version', currentVersion);
                    this.addNotification('Save data reset for new version!', 'ℹ️');
                    return;
                }

                const data = JSON.parse(saveData);

                // Validate and migrate player data
                if (data.player) {
                    this.player = data.player;

                    // Ensure all required financial properties exist
                    this.player.financials = this.player.financials || {};
                    this.player.financials.cash = this.player.financials.cash || 0;
                    this.player.financials.savings = this.player.financials.savings || 0;
                    this.player.financials.emergencyFund = this.player.financials.emergencyFund || 0;
                    this.player.financials.totalNetWorth = this.player.financials.totalNetWorth || 0;
                    this.player.financials.totalEarned = this.player.financials.totalEarned || 0;
                    this.player.financials.debt = this.player.financials.debt || 0;

                    // Ensure player progression properties exist
                    this.player.totalWorkDone = this.player.totalWorkDone || 0;
                    this.player.level = this.player.level || 1;
                    this.player.xp = this.player.xp || 0;
                    this.player.xpToNextLevel = this.player.xpToNextLevel || 100;
                }

                this.investments = data.investments || this.investments;
                this.businesses = data.businesses || this.businesses;
                this.goals = data.goals || this.goals;
                this.barangay = data.barangay || this.barangay;
                this.gameStats = data.gameStats || this.gameStats;
                this.cryptoMarket = data.cryptoMarket || this.cryptoMarket;
                this.activeInvestments = data.activeInvestments || [];
                this.activityLog = data.activityLog || [];

                console.log('✅ Save data loaded successfully!');
            } catch (e) {
                console.error('❌ Failed to load save data:', e);
                console.log('🔄 Resetting to prevent errors...');
                localStorage.removeItem('pinoyrpg_save');
                this.addNotification('Save corrupted. Starting fresh!', '⚠️');
            }
        } else {
            // First time playing, set version
            localStorage.setItem('pinoyrpg_version', currentVersion);
        }
    }

    resetGame() {
        if (confirm('Are you sure you want to reset your progress? This cannot be undone!')) {
            localStorage.removeItem('pinoyrpg_save');
            localStorage.removeItem('pinoyrpg_version');
            this.addNotification('Game reset! Reloading...', '🔄');
            setTimeout(() => location.reload(), 1000);
        }
    }

    // === GUIDANCE SYSTEM ===
    updateGuidance() {
        const guidance = document.getElementById('guidance-text');
        const progress = document.getElementById('guidance-progress');

        if (!guidance) return;

        let message = '';
        let progressPercent = 0;

        // Smart guidance based on player progress (action-based)
        if (this.player.totalWorkDone === 0) {
            message = '💼 Go to <strong>Career</strong> → Click <strong>WORK</strong> to start earning money!';
            progressPercent = 0;
        } else if (this.player.totalWorkDone < 5) {
            message = '💪 Keep working in the Career page! Each work takes 60 seconds.';
            progressPercent = 5;
        } else if (this.player.currentJob.title === 'Minimum Wage Worker' && this.player.financials.cash >= 1000) {
            message = '💼 Get a better job! Click <strong>Career</strong> and apply for Call Center Agent (₱25k/month)';
            progressPercent = 10;
        } else if (this.businesses.length === 0 && this.player.financials.cash >= 15000) {
            message = '🏪 You have enough cash! Click <strong>Business</strong> and start a Sari-Sari Store for passive income!';
            progressPercent = 30;
        } else if (this.investments.length === 0 && this.player.financials.cash >= 5000) {
            message = '📈 Start investing! Click <strong>Investments</strong> and try Pag-IBIG MP2 (₱500 min)';
            progressPercent = 40;
        } else if (this.player.financials.emergencyFund < 50000 && this.player.financials.cash >= 10000) {
            message = '🆘 Build your emergency fund! Check <strong>Goals</strong> to track progress';
            progressPercent = 50;
        } else if (this.player.financials.totalNetWorth < 100000) {
            message = '💎 Keep growing! Net worth: ₱' + Math.floor(this.player.financials.totalNetWorth).toLocaleString() + ' / ₱100,000';
            progressPercent = (this.player.financials.totalNetWorth / 100000) * 100;
        } else if (this.player.financials.totalNetWorth < 1000000) {
            message = '💰 Millionaire path! Net worth: ₱' + Math.floor(this.player.financials.totalNetWorth).toLocaleString() + ' / ₱1M';
            progressPercent = (this.player.financials.totalNetWorth / 1000000) * 100;
        } else {
            message = '🎉 MILLIONAIRE STATUS! Keep building businesses and investments!';
            progressPercent = 100;
        }

        guidance.innerHTML = message;
        if (progress) {
            progress.style.width = Math.min(progressPercent, 100) + '%';
        }
    }

    showAchievement(text, icon = '🎉') {
        const popup = document.getElementById('achievement-popup');
        const textElem = document.getElementById('achievement-text');
        const iconElem = popup.querySelector('.achievement-icon');

        if (popup && textElem && iconElem) {
            textElem.textContent = text;
            iconElem.textContent = icon;
            popup.classList.add('show');

            setTimeout(() => {
                popup.classList.remove('show');
            }, 4000);
        }
    }

    // ===================================
    // CRYPTO TRADING SYSTEM
    // ===================================

    initCryptoMarket() {
        if (!this.cryptoMarket) {
            this.cryptoMarket = {
                lastPriceUpdate: Date.now(),
                nextPriceUpdate: Date.now() + (5 * 60 * 1000), // 5 minutes (represents 24 hours)
                cryptoData: [
                    { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: 3000000, priceChange: 0, balance: 0 },
                    { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: 150000, priceChange: 0, balance: 0 },
                    { id: 'bnb', name: 'Binance Coin', symbol: 'BNB', price: 15000, priceChange: 0, balance: 0 },
                    { id: 'xrp', name: 'Ripple', symbol: 'XRP', price: 30, priceChange: 0, balance: 0 },
                    { id: 'ada', name: 'Cardano', symbol: 'ADA', price: 20, priceChange: 0, balance: 0 },
                    { id: 'sol', name: 'Solana', symbol: 'SOL', price: 8000, priceChange: 0, balance: 0 },
                    { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', price: 5, priceChange: 0, balance: 0 },
                    { id: 'dot', name: 'Polkadot', symbol: 'DOT', price: 400, priceChange: 0, balance: 0 },
                    { id: 'ltc', name: 'Litecoin', symbol: 'LTC', price: 5000, priceChange: 0, balance: 0 },
                    { id: 'trx', name: 'TRON', symbol: 'TRX', price: 8, priceChange: 0, balance: 0 }
                ]
            };
        }

        // Check if prices need updating
        const now = Date.now();
        if (now >= this.cryptoMarket.nextPriceUpdate) {
            this.updateCryptoPrices();
        }

        // Start timer update interval
        setInterval(() => this.updateCryptoTimer(), 1000);
    }

    updateCryptoPrices() {
        const now = Date.now();

        this.cryptoMarket.cryptoData.forEach(crypto => {
            // Main probability: 60% no change, 20% increase, 20% decrease
            const mainRoll = Math.random();
            let priceChange = 0;

            if (mainRoll < 0.6) {
                priceChange = 0;
            } else if (mainRoll < 0.8) {
                // 20% increase path
                const increaseRoll = Math.random();
                if (increaseRoll < 0.5) {
                    priceChange = 0;
                } else if (increaseRoll < 0.8) {
                    priceChange = Math.random() * 0.10;
                } else if (increaseRoll < 0.95) {
                    priceChange = Math.random() * 0.20;
                } else {
                    priceChange = Math.random() * 0.30;
                }
            } else {
                // 20% decrease path
                const decreaseRoll = Math.random();
                if (decreaseRoll < 0.5) {
                    priceChange = 0;
                } else if (decreaseRoll < 0.8) {
                    priceChange = -(Math.random() * 0.10);
                } else if (decreaseRoll < 0.95) {
                    priceChange = -(Math.random() * 0.20);
                } else {
                    priceChange = -(Math.random() * 0.30);
                }
            }

            const oldPrice = crypto.price;
            crypto.price = Math.max(0.01, crypto.price * (1 + priceChange));
            crypto.priceChange = ((crypto.price - oldPrice) / oldPrice) * 100;
        });

        this.cryptoMarket.lastPriceUpdate = now;
        this.cryptoMarket.nextPriceUpdate = now + (5 * 60 * 1000);

        this.addNotification('Crypto prices have been updated!', '₿');
        this.addActivityLog('Cryptocurrency prices updated', '₿');
        this.updateCryptoUI();
        this.saveGame();
    }

    updateCryptoTimer() {
        const timerDisplay = document.getElementById('crypto-timer-display');
        if (!timerDisplay || !this.cryptoMarket) return;

        const now = Date.now();
        const timeRemaining = this.cryptoMarket.nextPriceUpdate - now;

        if (timeRemaining <= 0) {
            timerDisplay.textContent = '00:00:00';
            this.updateCryptoPrices();
        } else {
            const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
            timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    buyCrypto(cryptoId, amount) {
        const crypto = this.cryptoMarket.cryptoData.find(c => c.id === cryptoId);
        if (!crypto || amount <= 0) return;

        const cost = amount * crypto.price;

        if (this.player.financials.cash < cost) {
            this.addNotification('Insufficient funds!', '❌');
            return;
        }

        this.player.financials.cash -= cost;
        crypto.balance += amount;

        this.addNotification(`Bought ${amount.toFixed(8)} ${crypto.symbol} for ₱${cost.toLocaleString()}!`, '₿');
        this.addActivityLog(`Purchased ${amount.toFixed(8)} ${crypto.symbol}`, '₿');
        this.updateCryptoUI();
        this.updateUI();
        this.saveGame();
    }

    sellCrypto(cryptoId, amount) {
        const crypto = this.cryptoMarket.cryptoData.find(c => c.id === cryptoId);
        if (!crypto || amount <= 0) return;

        if (crypto.balance < amount) {
            this.addNotification('Insufficient crypto balance!', '❌');
            return;
        }

        const value = amount * crypto.price;
        this.player.financials.cash += value;
        crypto.balance -= amount;

        this.addNotification(`Sold ${amount.toFixed(8)} ${crypto.symbol} for ₱${value.toLocaleString()}!`, '💰');
        this.addActivityLog(`Sold ${amount.toFixed(8)} ${crypto.symbol}`, '💰');
        this.updateCryptoUI();
        this.updateUI();
        this.saveGame();
    }

    getTotalCryptoValue() {
        if (!this.cryptoMarket) return 0;
        return this.cryptoMarket.cryptoData.reduce((total, crypto) => {
            return total + (crypto.balance * crypto.price);
        }, 0);
    }

    updateCryptoUI() {
        const cryptoGrid = document.getElementById('crypto-trading-grid');
        const totalValueEl = document.getElementById('total-crypto-value');
        const playerGoldEl = document.getElementById('player-gold-crypto');

        if (!cryptoGrid || !this.cryptoMarket) return;

        // Update total value
        const totalValue = this.getTotalCryptoValue();
        if (totalValueEl) {
            totalValueEl.textContent = `₱${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
        }

        // Update player cash display
        if (playerGoldEl) {
            playerGoldEl.textContent = Math.floor(this.player.financials.cash).toLocaleString();
        }

        // Render crypto cards
        cryptoGrid.innerHTML = this.cryptoMarket.cryptoData.map(crypto => {
            const priceChangeClass = crypto.priceChange > 0 ? 'positive' : crypto.priceChange < 0 ? 'negative' : 'neutral';
            const priceChangeIcon = crypto.priceChange > 0 ? '📈' : crypto.priceChange < 0 ? '📉' : '➖';
            const borderColor = crypto.priceChange > 0 ? '#22C55E' : crypto.priceChange < 0 ? '#EF4444' : 'var(--border-color)';

            return `
                <div style="padding: 24px; border: 3px solid ${borderColor}; border-radius: 16px; background: var(--card-bg); box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: all 0.3s ease;" onmouseover="this.style.transform='translateY(-6px)'; this.style.boxShadow='0 12px 24px rgba(0,0,0,0.15)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.1)'">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 2px solid var(--border-color);">
                        <div>
                            <div style="font-size: 26px; font-weight: 800; color: var(--primary); letter-spacing: -0.5px;">${crypto.symbol}</div>
                            <div style="font-size: 13px; color: var(--text-secondary); font-weight: 500; margin-top: 2px;">${crypto.name}</div>
                        </div>
                        <div style="text-align: right; background: ${priceChangeClass === 'positive' ? 'rgba(34, 197, 94, 0.15)' : priceChangeClass === 'negative' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(128, 128, 128, 0.15)'}; padding: 8px 12px; border-radius: 8px;">
                            <div style="font-size: 18px; margin-bottom: 2px;">${priceChangeIcon}</div>
                            <div style="font-size: 15px; font-weight: 700; color: ${priceChangeClass === 'positive' ? '#22C55E' : priceChangeClass === 'negative' ? '#EF4444' : 'var(--text-tertiary)'};">
                                ${crypto.priceChange >= 0 ? '+' : ''}${crypto.priceChange.toFixed(2)}%
                            </div>
                        </div>
                    </div>

                    <div style="background: var(--bg-secondary); padding: 12px; border-radius: 10px; margin-bottom: 12px; border: 1px solid var(--border-color);">
                        <div style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">💎 Your Balance</div>
                        <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); font-family: monospace;">${crypto.balance.toFixed(8)} ${crypto.symbol}</div>
                    </div>

                    <div style="background: var(--bg-secondary); padding: 12px; border-radius: 10px; margin-bottom: 18px; border: 1px solid var(--border-color);">
                        <div style="font-size: 11px; color: var(--text-tertiary); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">💰 Current Price</div>
                        <div style="font-size: 18px; font-weight: 800; color: var(--primary); font-family: monospace;">₱${crypto.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    </div>

                    <div style="margin-bottom: 14px;">
                        <label style="display: block; font-size: 12px; color: var(--text-secondary); font-weight: 600; margin-bottom: 6px;">Amount to Trade</label>
                        <input
                            type="number"
                            id="crypto-amount-${crypto.id}"
                            placeholder="0.00000000"
                            min="0"
                            step="0.00000001"
                            style="width: 100%; padding: 14px; background: var(--bg-primary); border: 2px solid var(--border-color); border-radius: 10px; color: var(--text-primary); font-size: 15px; font-weight: 600; font-family: monospace; transition: all 0.2s; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);"
                            onfocus="this.style.borderColor='var(--primary)'; this.style.boxShadow='inset 0 2px 4px rgba(0,0,0,0.05), 0 0 0 3px rgba(59, 130, 246, 0.1)'"
                            onblur="this.style.borderColor='var(--border-color)'; this.style.boxShadow='inset 0 2px 4px rgba(0,0,0,0.05)'"
                        />
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <button
                            onclick="game.buyCrypto('${crypto.id}', parseFloat(document.getElementById('crypto-amount-${crypto.id}').value) || 0)"
                            style="padding: 14px; background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 14px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3); text-transform: uppercase; letter-spacing: 0.5px;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(34, 197, 94, 0.4)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(34, 197, 94, 0.3)'"
                            onmousedown="this.style.transform='translateY(0)'"
                            onmouseup="this.style.transform='translateY(-2px)'">
                            🛒 Buy
                        </button>
                        <button
                            onclick="game.sellCrypto('${crypto.id}', parseFloat(document.getElementById('crypto-amount-${crypto.id}').value) || 0)"
                            style="padding: 14px; background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 700; font-size: 14px; transition: all 0.2s; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3); text-transform: uppercase; letter-spacing: 0.5px;"
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(239, 68, 68, 0.4)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(239, 68, 68, 0.3)'"
                            onmousedown="this.style.transform='translateY(0)'"
                            onmouseup="this.style.transform='translateY(-2px)'">
                            💸 Sell
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ===================================
    // INVESTMENT MANAGEMENT SYSTEM
    // ===================================

    createActiveInvestment(type, amount, investmentName = null, customInterestRate = null) {
        if (this.player.financials.cash < amount) {
            this.addNotification('Insufficient funds!', '❌');
            return false;
        }

        let duration, interestRate, name;
        if (type === 'interest') {
            duration = 10 * 60 * 1000; // 10 minutes (represents 1 year)
            interestRate = customInterestRate !== null ? customInterestRate / 100 : 0.05;
            name = investmentName || 'Interest Account';
        } else if (type === 'stocks') {
            duration = 5 * 60 * 1000; // 5 minutes (represents 6 months)
            interestRate = customInterestRate !== null ? customInterestRate / 100 : 0.03;
            name = investmentName || 'Stock Investment';
        } else if (type === 'mutual') {
            duration = 5 * 60 * 1000; // 5 minutes (represents 6 months)
            interestRate = customInterestRate !== null ? customInterestRate / 100 : 0.04;
            name = investmentName || 'Mutual Fund';
        }

        if (!this.activeInvestments) {
            this.activeInvestments = [];
        }

        const investment = {
            id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: name,
            type: type,
            principal: amount,
            interestRate: interestRate,
            startTime: Date.now(),
            duration: duration,
            matured: false
        };

        this.player.financials.cash -= amount;
        this.activeInvestments.push(investment);

        this.addNotification(`Created ${name} with ₱${amount.toLocaleString()}!`, '📈');
        this.addActivityLog(`Invested ₱${amount.toLocaleString()} in ${name}`, '📈');
        this.updateUI();
        this.saveGame();
        return true;
    }

    withdrawInvestment(investmentId) {
        const investment = this.activeInvestments.find(inv => inv.id === investmentId);
        if (!investment || !investment.matured) {
            this.addNotification('Investment not ready for withdrawal!', '❌');
            return;
        }

        const total = investment.principal + (investment.principal * investment.interestRate);
        this.player.financials.cash += total;

        this.activeInvestments = this.activeInvestments.filter(inv => inv.id !== investmentId);

        this.addNotification(`Withdrew ₱${total.toLocaleString()} from ${investment.name}!`, '💰');
        this.addActivityLog(`Withdrew ₱${total.toLocaleString()} from ${investment.name}`, '💰');
        this.checkEmergencyFundStatus();
        this.calculateNetWorth();
        this.updateUI();
        this.saveGame();
    }

    reinvestInvestment(investmentId) {
        const investment = this.activeInvestments.find(inv => inv.id === investmentId);
        if (!investment || !investment.matured) {
            this.addNotification('Investment not ready for reinvestment!', '❌');
            return;
        }

        const total = investment.principal + (investment.principal * investment.interestRate);
        this.activeInvestments = this.activeInvestments.filter(inv => inv.id !== investmentId);

        this.player.financials.cash += total;
        this.createActiveInvestment(investment.type, total);

        this.addNotification(`Reinvested ₱${total.toLocaleString()} in ${investment.name}!`, '🔄');
    }

    // ===================================
    // ACTIVITY LOG SYSTEM (Enhanced)
    // ===================================

    updateActivityLogView() {
        const logList = document.getElementById('activity-log-list');
        if (!logList) return;

        if (!this.activityLog || this.activityLog.length === 0) {
            logList.innerHTML = '<div style="text-align: center; color: var(--text-tertiary); padding: 20px;">No activities yet. Start your journey!</div>';
            return;
        }

        logList.innerHTML = this.activityLog.slice(0, 50).map(log => {
            const date = new Date(log.timestamp);
            const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return `
                <div style="display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid var(--border); align-items: start;">
                    <div style="font-size: 24px; flex-shrink: 0;">${log.icon}</div>
                    <div style="flex: 1;">
                        <div style="font-size: 14px; color: var(--text-primary);">${log.message}</div>
                        <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 4px;">${dateStr} at ${timeStr}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    addActivityLog(message, icon = '📝') {
        if (!this.activityLog) {
            this.activityLog = [];
        }

        this.activityLog.unshift({
            message: message,
            icon: icon,
            timestamp: Date.now()
        });

        // Keep only last 100 entries
        if (this.activityLog.length > 100) {
            this.activityLog = this.activityLog.slice(0, 100);
        }

        // Update the view if we're on the assets page
        this.updateActivityLogView();

        // Also update the feed
        const feed = document.getElementById('activity-feed');
        if (!feed) return;

        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const item = document.createElement('div');
        item.className = 'feed-item';
        item.innerHTML = `
            <span class="feed-icon">${icon}</span>
            <span class="feed-message">${message}</span>
            <span class="feed-time">${time}</span>
        `;

        feed.insertBefore(item, feed.firstChild);

        while (feed.children.length > 10) {
            feed.removeChild(feed.lastChild);
        }
    }
}

// Initialize game when page loads
let game;
window.addEventListener('DOMContentLoaded', () => {
    try {
        game = new PinoyRPG();
        window.game = game;

        // Enable the WORK button once game is loaded
        const workBtn = document.getElementById('work-btn');
        if (workBtn) {
            workBtn.disabled = false;
        }

        console.log('✅ PinoyRPG initialized successfully!');
    } catch (error) {
        console.error('❌ Failed to initialize PinoyRPG:', error);
    }
});
