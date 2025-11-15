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
            monthsPlayed: 0,
            totalEarned: 0,
            totalSaved: 0,
            goalsAchieved: 0,
            startTime: Date.now()
        };
        this.monthlyExpenses = this.createMonthlyExpenses();
        this.jobMarket = this.createJobMarket();
        this.investmentOptions = this.createInvestmentOptions();
        this.businessOpportunities = this.createBusinessOpportunities();
        this.educationOptions = this.createEducationOptions();

        this.paused = false;
        this.monthTimer = null;

        this.init();
    }

    init() {
        this.loadGame();
        this.updateUI();
        this.startMonthTimer();
        this.initializeGoals();
        this.addActivityLog('Welcome to your financial journey, Kababayan!', '🎮');
        this.addNotification('Start your journey to financial freedom!', '🏝️');
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
                cash: 5000,
                savings: 0,
                emergencyFund: 0,
                totalNetWorth: 5000,
                monthlyIncome: 15000,
                monthlyExpenses: 12000,
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
            family: {
                members: 5,
                monthlySupport: 3000,
                happiness: 70
            },
            monthlyBudget: {
                food: 4000,
                transportation: 1500,
                utilities: 1500,
                familySupport: 3000,
                entertainment: 500,
                savings: 0,
                investments: 0
            }
        };
    }

    createMonthlyExpenses() {
        return {
            fixed: [
                { name: 'Rent/Mortgage', amount: 0, category: 'housing', icon: '🏠' },
                { name: 'Family Support', amount: 3000, category: 'family', icon: '👨‍👩‍👧‍👦' },
                { name: 'Utilities (Kuryente, Tubig)', amount: 1500, category: 'utilities', icon: '💡' }
            ],
            variable: [
                { name: 'Food & Groceries', amount: 4000, category: 'food', icon: '🍚' },
                { name: 'Transportation (Jeepney/Bus)', amount: 1500, category: 'transport', icon: '🚌' },
                { name: 'Load & Internet', amount: 500, category: 'communication', icon: '📱' },
                { name: 'Entertainment', amount: 500, category: 'entertainment', icon: '🎮' }
            ]
        };
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

    // === MONTH PROGRESSION SYSTEM ===
    startMonthTimer() {
        // Auto-advance month every 30 seconds (configurable)
        this.monthTimer = setInterval(() => {
            if (!this.paused) {
                this.advanceMonth();
            }
        }, 30000); // 30 seconds = 1 month
    }

    advanceMonth() {
        this.gameStats.monthsPlayed++;
        this.player.age += 1/12; // Age in months

        // Process monthly income
        this.processMonthlySalary();

        // Process monthly expenses
        this.processMonthlyExpenses();

        // Process investments returns
        this.processInvestmentReturns();

        // Process business income
        this.processBusinessIncome();

        // Random life events
        this.triggerRandomEvent();

        // Update UI
        this.updateUI();
        this.updateFinancialUI();

        // Check goals
        this.checkGoalsProgress();

        // Save game
        this.saveGame();

        this.addActivityLog(`Month ${this.gameStats.monthsPlayed} completed`, '📅');
        this.addNotification(`New month! Check your finances.`, '📅');
    }

    processMonthlySalary() {
        const salary = this.player.currentJob.monthlySalary;
        this.player.financials.cash += salary;
        this.player.financials.monthlyIncome = salary + this.getPassiveIncome();
        this.gameStats.totalEarned += salary;

        this.addActivityLog(`Received salary: ₱${salary.toLocaleString()}`, '💵');
    }

    processMonthlyExpenses() {
        let totalExpenses = 0;

        // Fixed expenses
        this.monthlyExpenses.fixed.forEach(expense => {
            if (expense.amount > 0) {
                this.player.financials.cash -= expense.amount;
                totalExpenses += expense.amount;
            }
        });

        // Variable expenses from budget
        totalExpenses += this.player.monthlyBudget.food;
        totalExpenses += this.player.monthlyBudget.transportation;
        totalExpenses += this.player.monthlyBudget.utilities;
        totalExpenses += this.player.monthlyBudget.familySupport;
        totalExpenses += this.player.monthlyBudget.entertainment;

        this.player.financials.cash -= totalExpenses;
        this.player.financials.monthlyExpenses = totalExpenses;

        // Process savings
        if (this.player.monthlyBudget.savings > 0) {
            this.player.financials.savings += this.player.monthlyBudget.savings;
            this.player.financials.cash -= this.player.monthlyBudget.savings;
            this.gameStats.totalSaved += this.player.monthlyBudget.savings;
        }

        this.addActivityLog(`Monthly expenses: ₱${totalExpenses.toLocaleString()}`, '💸');

        // Warning if low on cash
        if (this.player.financials.cash < 5000) {
            this.addNotification('Warning: Low on cash! Budget wisely.', '⚠️');
        }

        // Game over if negative cash and no emergency fund
        if (this.player.financials.cash < 0 && this.player.financials.emergencyFund === 0) {
            this.gameOver();
        }
    }

    processInvestmentReturns() {
        this.investments.forEach(investment => {
            const option = this.investmentOptions.find(opt => opt.id === investment.type);
            if (!option) return;

            // Monthly return
            const monthlyReturn = (investment.amount * option.expectedReturn / 100) / 12;

            // Add volatility for stocks/crypto
            let actualReturn = monthlyReturn;
            if (option.volatility) {
                const variance = (Math.random() - 0.5) * 2 * option.volatility / 100;
                actualReturn = monthlyReturn * (1 + variance);
            }

            investment.amount += actualReturn;
            investment.totalReturns += actualReturn;
        });

        this.calculateNetWorth();
    }

    processBusinessIncome() {
        this.businesses.forEach(business => {
            const template = this.businessOpportunities.find(b => b.id === business.type);
            if (!template) return;

            // Monthly profit with some variance
            const variance = 0.8 + (Math.random() * 0.4); // 80% to 120%
            const profit = Math.floor(template.monthlyProfit * variance * business.efficiency);

            this.player.financials.cash += profit;
            business.totalProfit += profit;
            this.gameStats.totalEarned += profit;

            this.addActivityLog(`${business.name} earned ₱${profit.toLocaleString()}`, template.icon);
        });
    }

    getPassiveIncome() {
        let passive = 0;

        // Business income
        this.businesses.forEach(business => {
            const template = this.businessOpportunities.find(b => b.id === business.type);
            if (template) {
                passive += template.monthlyProfit * business.efficiency;
            }
        });

        // Rental income from real estate
        this.investments.forEach(investment => {
            const option = this.investmentOptions.find(opt => opt.id === investment.type);
            if (option && option.rentalYield) {
                passive += (investment.amount * option.rentalYield / 100) / 12;
            }
        });

        return Math.floor(passive);
    }

    triggerRandomEvent() {
        const eventChance = Math.random();

        if (eventChance > 0.7) { // 30% chance per month
            const events = [
                {
                    type: 'family-emergency',
                    title: 'Family Medical Emergency',
                    desc: 'A family member needs medical help',
                    cost: 15000,
                    icon: '🚑',
                    impact: { familyHappiness: -10 }
                },
                {
                    type: 'wedding',
                    title: 'Family Wedding',
                    desc: 'Your cousin is getting married, abuloy expected',
                    cost: 3000,
                    icon: '💒',
                    impact: { familyHappiness: 5 }
                },
                {
                    type: 'fiesta',
                    title: 'Barangay Fiesta',
                    desc: 'Time to celebrate! (Optional spending)',
                    cost: 2000,
                    optional: true,
                    icon: '🎉',
                    impact: { happiness: 10 }
                },
                {
                    type: 'bonus',
                    title: 'Work Bonus!',
                    desc: 'Great job! You received a bonus',
                    gain: 5000,
                    icon: '🎁',
                    impact: { happiness: 10 }
                },
                {
                    type: 'side-hustle',
                    title: 'Side Hustle Opportunity',
                    desc: 'Weekend part-time work available',
                    gain: 8000,
                    icon: '💼',
                    impact: {}
                },
                {
                    type: 'investment-tip',
                    title: 'Investment Opportunity',
                    desc: 'Friend recommends a good investment',
                    icon: '💡',
                    action: 'Consider investing'
                }
            ];

            const randomEvent = events[Math.floor(Math.random() * events.length)];
            this.handleLifeEvent(randomEvent);
        }
    }

    handleLifeEvent(event) {
        this.addNotification(`Life Event: ${event.title}`, event.icon);
        this.addActivityLog(event.desc, event.icon);

        if (event.cost && !event.optional) {
            // Check if can afford
            if (this.player.financials.cash >= event.cost) {
                this.player.financials.cash -= event.cost;
                this.addActivityLog(`Paid ₱${event.cost.toLocaleString()} for ${event.title}`, '💸');
            } else if (this.player.financials.emergencyFund >= event.cost) {
                this.player.financials.emergencyFund -= event.cost;
                this.addActivityLog(`Used emergency fund for ${event.title}`, '🆘');
            } else {
                this.addNotification('Not enough money! Taking debt...', '⚠️');
                this.player.financials.debt += event.cost;
                this.player.family.happiness -= 20;
            }
        }

        if (event.gain) {
            this.player.financials.cash += event.gain;
            this.addActivityLog(`Earned ₱${event.gain.toLocaleString()}`, '💰');
        }

        // Apply impacts
        if (event.impact) {
            if (event.impact.familyHappiness) {
                this.player.family.happiness += event.impact.familyHappiness;
            }
        }

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
        this.updateUI();
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
            startMonth: this.gameStats.monthsPlayed
        };

        this.investments.push(investment);

        this.addNotification(`Invested ₱${amount.toLocaleString()} in ${option.name}`, option.icon);
        this.addActivityLog(`New investment: ${option.name}`, option.icon);

        // Update goal
        this.updateGoalProgress('first-investment', 1);

        this.calculateNetWorth();
        this.updateUI();
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
            startMonth: this.gameStats.monthsPlayed
        };

        this.businesses.push(newBusiness);

        this.addNotification(`Started business: ${business.name}!`, business.icon);
        this.addActivityLog(`Opened ${business.name}`, business.icon);

        // Update goal
        this.updateGoalProgress('first-business', 1);

        this.calculateNetWorth();
        this.updateUI();
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

    updateBudget(category, amount) {
        if (this.player.monthlyBudget[category] !== undefined) {
            this.player.monthlyBudget[category] = amount;
            this.saveGame();
            this.updateFinancialUI();
        }
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

        return netWorth;
    }

    // === GOALS SYSTEM ===

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
                    if (this.getPassiveIncome() >= this.player.financials.monthlyExpenses) {
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
        this.saveGame();
    }

    updatePlayerStats() {
        document.getElementById('player-level').textContent = Math.floor(this.player.age);
        document.getElementById('player-name').textContent = this.player.name;
        document.getElementById('player-name-mini').textContent = this.player.name;
        document.getElementById('player-title').textContent = this.player.title;
        document.getElementById('player-class').textContent = this.player.currentJob.title;

        // Use cash for HP, savings for MP, net worth progress for XP
        const maxCash = this.player.currentJob.monthlySalary * 3;
        const cashPercent = Math.min((this.player.financials.cash / maxCash) * 100, 100);
        document.getElementById('hp-bar').style.width = cashPercent + '%';
        document.getElementById('current-hp').textContent = '₱' + Math.floor(this.player.financials.cash).toLocaleString();
        document.getElementById('max-hp').textContent = 'Cash';

        // Savings
        const maxSavings = 100000;
        const savingsPercent = Math.min((this.player.financials.savings / maxSavings) * 100, 100);
        document.getElementById('mp-bar').style.width = savingsPercent + '%';
        document.getElementById('current-mp').textContent = '₱' + Math.floor(this.player.financials.savings).toLocaleString();
        document.getElementById('max-mp').textContent = 'Savings';

        // Net Worth Progress
        const netWorthTarget = 1000000;
        const networthPercent = Math.min((this.player.financials.totalNetWorth / netWorthTarget) * 100, 100);
        document.getElementById('xp-bar').style.width = networthPercent + '%';
        document.getElementById('current-xp').textContent = '₱' + Math.floor(this.player.financials.totalNetWorth).toLocaleString();
        document.getElementById('next-xp').textContent = 'Net Worth';
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
            document.getElementById('stat-kills').textContent = this.gameStats.monthsPlayed;
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
}

// Initialize game when page loads
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new PinoyRPG();
    window.game = game;
});
