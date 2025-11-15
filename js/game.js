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

        // Action-based progression (not time-based)
        this.workEnergy = 100;
        this.maxWorkEnergy = 100;
        this.energyRegenRate = 1; // energy per second

        this.init();
    }

    init() {
        this.loadGame();
        this.updateUI();
        this.initializeGoals();
        this.updateGuidance();
        this.startEnergyRegen();
        this.addActivityLog('Welcome to your financial journey, Kababayan!', '🎮');
        this.addNotification('Click WORK to earn money!', '💼');
    }

    createPlayer() {
        return {
            name: 'Juan dela Cruz',
            age: 22,
            education: 'High School Graduate',
            currentJob: {
                title: 'Minimum Wage Worker',
                monthlySalary: 15000,
                experience: 0,
                skills: []
            },
            financials: {
                cash: 0,
                savings: 0,
                emergencyFund: 0,
                totalNetWorth: 0,
                totalEarned: 0
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

        if (this.workEnergy < energyCost) {
            this.addNotification('Not enough energy! Wait for it to regenerate.', '⚠️');
            return;
        }

        this.workEnergy -= energyCost;

        // Calculate earnings based on job
        const baseEarnings = this.player.currentJob.monthlySalary / 30; // Daily rate
        const bonus = Math.random() * 0.3; // 0-30% bonus
        const earnings = Math.floor(baseEarnings * (1 + bonus));

        this.player.financials.cash += earnings;
        this.player.financials.totalEarned += earnings;
        this.player.totalWorkDone++;
        this.gameStats.totalWorkActions++;

        // Gain XP
        this.gainXP(5);

        this.addActivityLog(`Worked and earned ₱${earnings.toLocaleString()}!`, '💼');

        // Check for work achievements
        if (this.player.totalWorkDone === 10) {
            this.showAchievement('Hard Worker! 10 work sessions', '💪');
        }
        if (this.player.totalWorkDone === 100) {
            this.showAchievement('Dedicated! 100 work sessions', '🏆');
        }

        this.updateUI();
        this.updateGuidance();
        this.calculateNetWorth();
        this.checkGoalsProgress();

        // Passive income from businesses
        this.earnPassiveIncome();
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
                id: 'savings-account',
                name: 'Savings Account',
                minInvestment: 100,
                expectedReturn: 0.25,
                risk: 'Very Low',
                description: 'Bank savings, very low returns but safe',
                icon: '🏦',
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

        if (amount < option.minInvestment) {
            this.addNotification(`Minimum investment: ₱${option.minInvestment.toLocaleString()}`, '❌');
            return;
        }

        if (this.player.financials.cash < amount) {
            this.addNotification('Not enough cash!', '❌');
            return;
        }

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

        this.calculateNetWorth();
        this.updateUI();
        this.updateGuidance();
        this.saveGame();
    }

    startBusiness(businessId) {
        const business = this.businessOpportunities.find(b => b.id === businessId);
        if (!business) return;

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
        let netWorth = this.player.financials.cash;
        netWorth += this.player.financials.savings;
        netWorth += this.player.financials.emergencyFund;

        // Add investment values
        this.investments.forEach(inv => {
            netWorth += inv.amount;
        });

        // Add business values (conservative estimate)
        this.businesses.forEach(bus => {
            netWorth += bus.initialCost * 0.8; // Depreciated value
        });

        // Subtract debt
        netWorth -= this.player.financials.debt;

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
                    goal.current = this.player.financials.emergencyFund;
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
        const levels = ['High School', 'College Level', 'College Graduate', 'Post Graduate'];
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
        if (document.getElementById('player-gold')) {
            document.getElementById('player-gold').textContent = Math.floor(this.player.financials.cash).toLocaleString();
        }
        if (document.getElementById('gold-display')) {
            document.getElementById('gold-display').textContent = Math.floor(this.player.financials.cash).toLocaleString();
        }
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
        if (document.getElementById('stat-kills')) {
            document.getElementById('stat-kills').textContent = this.gameStats.totalWorkActions;
        }
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
        if (document.getElementById('player-level-stat')) {
            document.getElementById('player-level-stat').textContent = this.player.level;
        }
        if (document.getElementById('net-worth-stat')) {
            document.getElementById('net-worth-stat').textContent = '₱' + Math.floor(this.player.financials.totalNetWorth).toLocaleString();
        }
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
        const list = document.getElementById('notifications-list');
        if (!list) return;

        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <span class="notification-icon">${icon}</span>
            <div class="notification-content">
                <div class="notification-text">${message}</div>
                <div class="notification-time">${time}</div>
            </div>
        `;

        list.insertBefore(notification, list.firstChild);

        while (list.children.length > 5) {
            list.removeChild(list.lastChild);
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
            gameStats: this.gameStats
        };

        localStorage.setItem('pinoyrpg_save', JSON.stringify(saveData));
    }

    loadGame() {
        const saveData = localStorage.getItem('pinoyrpg_save');

        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                this.player = data.player || this.player;
                this.investments = data.investments || this.investments;
                this.businesses = data.businesses || this.businesses;
                this.goals = data.goals || this.goals;
                this.barangay = data.barangay || this.barangay;
                this.gameStats = data.gameStats || this.gameStats;
            } catch (e) {
                console.error('Failed to load save data:', e);
            }
        }
    }

    resetGame() {
        if (confirm('Are you sure you want to reset your progress? This cannot be undone!')) {
            localStorage.removeItem('pinoyrpg_save');
            location.reload();
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
            message = '💼 Click the <strong>WORK</strong> button to start earning money!';
            progressPercent = 0;
        } else if (this.player.totalWorkDone < 5) {
            message = '💪 Keep working! Energy regenerates automatically. Work more to earn cash!';
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
}

// Initialize game when page loads
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new PinoyRPG();
    window.game = game;
});
