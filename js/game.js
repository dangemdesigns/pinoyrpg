// Game state
const gameState = {
    money: 1000,
    day: 1,
    level: 1,
    currentActivity: null,
    activityEndTime: null,
    skills: {
        encoder: { level: 0, exp: 0, expNeeded: 100 },
        fastfood: { level: 0, exp: 0, expNeeded: 100 },
        laborer: { level: 0, exp: 0, expNeeded: 100 },
        sales: { level: 0, exp: 0, expNeeded: 100 },
        cashier: { level: 0, exp: 0, expNeeded: 100 },
        stockman: { level: 0, exp: 0, expNeeded: 100 },
        delivery: { level: 0, exp: 0, expNeeded: 100 },
        driver: { level: 0, exp: 0, expNeeded: 100 },
        OFW: { level: 0, exp: 0, expNeeded: 100 },
        jeepney: { level: 0, exp: 0, expNeeded: 100 },
        vendor: { level: 0, exp: 0, expNeeded: 100 },
        OFW_caregiver: { level: 0, exp: 0, expNeeded: 100 }
    },
    businesses: [],
    employees: [],
    inventory: {
        money: 1000,
        savings: 0
    },
    marketplace: {
        stocks: [],
        crypto: [],
        portfolio: {
            stocks: {},
            crypto: {}
        },
        transactions: []
    },
    settings: {
        notifications: true,
        sound: true,
        music: true
    }
};

// Job definitions with pay rates (per hour) - More Filipino-themed
const jobDefinitions = {
    encoder: { 
        name: "Encoder", 
        basePay: 200, 
        skillBonus: "encoder",
        icon: "fas fa-keyboard",
        description: "Do data entry work. Good starting job with moderate pay."
    }, // ₱200 per hour
    fastfood: { 
        name: "Fast-food Worker", 
        basePay: 300, 
        skillBonus: "fastfood",
        icon: "fas fa-hamburger",
        description: "Work at a restaurant. Good for restaurant business skill."
    }, // ₱300 per hour
    laborer: { 
        name: "Hard Laborer", 
        basePay: 400, 
        skillBonus: "laborer",
        icon: "fas fa-hard-hat",
        description: "Construction or factory work. Good for physical endurance."
    }, // ₱400 per hour
    sales: { 
        name: "Sales/Merchandiser", 
        basePay: 350, 
        skillBonus: "sales",
        icon: "fas fa-hand-holding-usd",
        description: "Product placement and sales. Good for sari-sari store skill."
    }, // ₱350 per hour
    cashier: { 
        name: "Cashier", 
        basePay: 250, 
        skillBonus: "cashier",
        icon: "fas fa-cash-register",
        description: "Handle transactions. Good for money management skills."
    }, // ₱250 per hour
    stockman: { 
        name: "Stockman", 
        basePay: 300, 
        skillBonus: "stockman",
        icon: "fas fa-warehouse",
        description: "Warehouse/Inventory work. Good for inventory management."
    }, // ₱300 per hour
    delivery: { 
        name: "Delivery Man", 
        basePay: 450, 
        skillBonus: "delivery",
        icon: "fas fa-shipping-fast",
        description: "Food or package delivery. Good for logistics skills."
    }, // ₱450 per hour
    driver: { 
        name: "Driver", 
        basePay: 500, 
        skillBonus: "driver",
        icon: "fas fa-car",
        description: "Tricycle, jeepney, or other vehicle driving."
    }, // ₱500 per hour
    OFW: { 
        name: "Overseas Worker", 
        basePay: 600, 
        skillBonus: "laborer",
        icon: "fas fa-plane",
        description: "Work abroad to send remittances. High pay with high risk."
    }, // ₱600 per hour
    jeepney: { 
        name: "Jeepney Driver", 
        basePay: 350, 
        skillBonus: "driver",
        icon: "fas fa-bus",
        description: "Operate the iconic Filipino jeepney. Great for driving skill."
    }, // ₱350 per hour
    vendor: { 
        name: "Street Vendor", 
        basePay: 220, 
        skillBonus: "sales",
        icon: "fas fa-shopping-cart",
        description: "Sell goods on the street. Good for sales skill and independence."
    }, // ₱220 per hour
    OFW_caregiver: { 
        name: "OFW Caregiver", 
        basePay: 400, 
        skillBonus: "fastfood",
        icon: "fas fa-hands-helping",
        description: "Care for others abroad. Good for service skills."
    } // ₱400 per hour
};

// Marketplace definitions
// Using placeholder values - will be updated with real-time data
const stockList = [
    { id: "jfc", name: "Jollibee Foods Corporation", symbol: "JFC", price: 3800, volatility: 0.03, source: "phisix" }, // 3% volatility
    { id: "sm", name: "SM Prime Holdings", symbol: "SMPH", price: 650, volatility: 0.04, source: "phisix" }, // 4% volatility
    { id: "aci", name: "Ayala Corporation", symbol: "AC", price: 950, volatility: 0.02, source: "phisix" }, // 2% volatility
    { id: "mbt", name: "Metrobank", symbol: "MBT", price: 1100, volatility: 0.05, source: "phisix" }, // 5% volatility
    { id: "bdo", name: "BDO Unibank", symbol: "BDO", price: 130, volatility: 0.03, source: "phisix" }, // 3% volatility
    { id: "pgold", name: "Puregold Price Club", symbol: "PGOLD", price: 280, volatility: 0.06, source: "phisix" }, // 6% volatility
    { id: "fgen", name: "First Gen Corporation", symbol: "FGEN", price: 175, volatility: 0.04, source: "phisix" }, // 4% volatility
    { id: "tel", name: "Globe Telecom", symbol: "TEL", price: 2050, volatility: 0.03, source: "phisix" }, // 3% volatility
    { id: "mdl", name: "Meralco", symbol: "MER", price: 580, volatility: 0.02, source: "phisix" }, // 2% volatility
    { id: "ltg", name: "LT Group", symbol: "LTG", price: 105, volatility: 0.05, source: "phisix" } // 5% volatility
];

const cryptoList = [
    { id: "btc", name: "Bitcoin", symbol: "BTC", price: 3000000, volatility: 0.25, source: "coingecko" }, // 25% volatility
    { id: "eth", name: "Ethereum", symbol: "ETH", price: 150000, volatility: 0.30, source: "coingecko" }, // 30% volatility
    { id: "bnb", name: "Binance Coin", symbol: "BNB", price: 12000, volatility: 0.35, source: "coingecko" }, // 35% volatility
    { id: "xrp", name: "Ripple", symbol: "XRP", price: 25, volatility: 0.40, source: "coingecko" }, // 40% volatility
    { id: "ada", name: "Cardano", symbol: "ADA", price: 15, volatility: 0.45, source: "coingecko" }, // 45% volatility
    { id: "sol", name: "Solana", symbol: "SOL", price: 750, volatility: 0.50, source: "coingecko" }, // 50% volatility
    { id: "doge", name: "Dogecoin", symbol: "DOGE", price: 5, volatility: 0.60, source: "coingecko" }, // 60% volatility
    { id: "dot", name: "Polkadot", symbol: "DOT", price: 90, volatility: 0.55, source: "coingecko" }, // 55% volatility
    { id: "avax", name: "Avalanche", symbol: "AVAX", price: 300, volatility: 0.48, source: "coingecko" }, // 48% volatility
    { id: "shib", name: "Shiba Inu", symbol: "SHIB", price: 0.00001, volatility: 0.80, source: "coingecko" } // 80% volatility
];

// Real-time price update functions
let lastPriceUpdate = 0;

// Update market prices with real-time data
async function updateMarketPrices() {
    const now = Date.now();
    // Only update every 5 minutes to respect API limits
    if (now - lastPriceUpdate < 5 * 60 * 1000) return; // 5 minutes
    
    lastPriceUpdate = now;
    
    try {
        // Update stocks first
        await updateStockPrices();
        
        // Update crypto prices
        await updateCryptoPrices();
        
        updateUI();
        
        if (gameState.settings.notifications) {
            showNotification('Market prices updated with real-time data!');
        }
    } catch (error) {
        console.error('Error updating market prices:', error);
        // Fallback to simulated prices if API fails
        updateSimulatedPrices();
        if (gameState.settings.notifications) {
            showNotification('Using simulated prices (API error)');
        }
    }
}

// Update stock prices from API
async function updateStockPrices() {
    // Using a free Philippine stock API
    const phisixSymbols = stockList.map(stock => stock.symbol).join(',');
    
    try {
        // Using an alternative approach since Phisix API was discontinued
        // For now, we'll use a combination of simulated movement based on real patterns
        stockList.forEach(stock => {
            // Simulate realistic movement based on market patterns
            const changeFactor = (Math.random() * stock.volatility * 2) - stock.volatility;
            stock.price = Math.max(1, stock.price * (1 + changeFactor));
        });
    } catch (error) {
        console.error('Error fetching stock prices:', error);
        // Use simulated prices as fallback
        stockList.forEach(stock => {
            const changeFactor = (Math.random() * stock.volatility * 2) - stock.volatility;
            stock.price = Math.max(1, stock.price * (1 + changeFactor));
        });
    }
}

// Update crypto prices from API
async function updateCryptoPrices() {
    // Using CoinGecko API for crypto prices
    const cryptoIds = cryptoList.map(crypto => crypto.id).join(',');
    
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=php`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // Update crypto prices from API data
        cryptoList.forEach(crypto => {
            if (data[crypto.id] && data[crypto.id].php) {
                // Apply some volatility to the real price for gameplay purposes
                const volatilityFactor = (Math.random() * crypto.volatility * 2) - crypto.volatility;
                crypto.price = Math.max(0.000001, data[crypto.id].php * (1 + volatilityFactor));
            } else {
                // If API doesn't have data, apply simulated movement
                const changeFactor = (Math.random() * crypto.volatility * 2) - crypto.volatility;
                crypto.price = Math.max(0.000001, crypto.price * (1 + changeFactor));
            }
        });
    } catch (error) {
        console.error('Error fetching crypto prices:', error);
        // Use simulated prices as fallback
        cryptoList.forEach(crypto => {
            const changeFactor = (Math.random() * crypto.volatility * 2) - crypto.volatility;
            crypto.price = Math.max(0.000001, crypto.price * (1 + changeFactor));
        });
    }
}

// Update simulated prices (fallback)
function updateSimulatedPrices() {
    // Update stock prices with low volatility
    gameState.marketplace.stocks.forEach(stock => {
        const changeFactor = (Math.random() * stock.volatility * 2) - stock.volatility;
        stock.price = Math.max(1, stock.price * (1 + changeFactor));
    });
    
    // Update crypto prices with high volatility
    gameState.marketplace.crypto.forEach(crypto => {
        const changeFactor = (Math.random() * crypto.volatility * 2) - crypto.volatility;
        crypto.price = Math.max(0.000001, crypto.price * (1 + changeFactor));
    });
    
    updateUI();
}

// Business definitions with Filipino cultural elements
const businessDefinitions = {
    sari: {
        name: "Mini Sari-sari Store",
        description: "A small neighborhood store selling basic necessities",
        baseIncome: 100,
        cost: 5000,
        upgradeCost: 10000,
        skillBonus: "sales",
        employeeBonus: 0.05,
        expansionPath: [
            { level: 2, name: "Sari-sari Store with Cellphone Load", cost: 15000, incomeMultiplier: 1.5, description: "Sari-sari store that also sells cellphone load" },
            { level: 3, name: "Palengke Stall", cost: 30000, incomeMultiplier: 2.0, description: "Stall at the local market selling fruits and vegetables" },
            { level: 4, name: "Turo-turo", cost: 60000, incomeMultiplier: 3.0, description: "Home-style restaurant for take-out food" },
            { level: 5, name: "Bakery and Sari-sari", cost: 120000, incomeMultiplier: 5.0, description: "Combines fresh bread with basic store items" }
        ],
        typicalProducts: ["Biskwit", "Suka", "Ref", "Noodles", "Soy Sauce", "Sardines", "Rice"]
    },
    convenience: {
        name: "Convenience Store",
        description: "A Filipino version of a 7-Eleven style store",
        baseIncome: 500,
        cost: 50000,
        upgradeCost: 25000,
        skillBonus: "cashier",
        employeeBonus: 0.08,
        expansionPath: [
            { level: 2, name: "Multi-Outlet Store", cost: 100000, incomeMultiplier: 1.8, description: "Larger store with multiple sections" },
            { level: 3, name: "Barangay Supermarket", cost: 300000, incomeMultiplier: 3.0, description: "Full-service supermarket serving the community" }
        ],
        typicalProducts: ["All basic items", "Canned goods", "Frozen items", "Personal care", "Pharmacy items"]
    },
    agrivet: {
        name: "Agrivet Store",
        description: "Agricultural and veterinary supplies store",
        baseIncome: 300,
        cost: 30000,
        upgradeCost: 15000,
        skillBonus: "laborer",
        employeeBonus: 0.06,
        expansionPath: [
            { level: 2, name: "Agrivet & Poultry Supply Center", cost: 75000, incomeMultiplier: 1.7, description: "Expanded supplies for poultry and livestock" },
            { level: 3, name: "Rural Agricultural Hub", cost: 200000, incomeMultiplier: 3.5, description: "Full-service agricultural support center" }
        ],
        typicalProducts: ["Animal feed", "Seeds", "Fertilizers", "Pesticides", "Farm tools"]
    },
    beverage: {
        name: "Beverage Dealer",
        description: "Distributor of soft drinks and local beverages",
        baseIncome: 400,
        cost: 75000,
        upgradeCost: 20000,
        skillBonus: "delivery",
        employeeBonus: 0.07,
        expansionPath: [
            { level: 2, name: "Soft Drink Distributor", cost: 150000, incomeMultiplier: 1.9, description: "Regional distributor for major brands" },
            { level: 3, name: "Beverage Wholesaler", cost: 400000, incomeMultiplier: 4.0, description: "Major wholesale for multiple beverage types" }
        ],
        typicalProducts: ["Coke", "Pepsi", "Royal", "Bottled water", "Sago't Gulaman", "Tubig ni Mang Juan"]
    },
    department: {
        name: "Variety Store",
        description: "Drygoods store selling fabric, household items, and more",
        baseIncome: 800,
        cost: 200000,
        upgradeCost: 50000,
        skillBonus: "sales",
        employeeBonus: 0.06,
        expansionPath: [
            { level: 2, name: "Large Variety Store", cost: 500000, incomeMultiplier: 1.8, description: "Multi-level store with extensive inventory" },
            { level: 3, name: "Town Department Store", cost: 1000000, incomeMultiplier: 3.0, description: "Main department store in town" }
        ],
        typicalProducts: ["Fabric", "Clothing", "Household items", "School supplies", "Hardware"]
    },
    gadget: {
        name: "Carihan Store",
        description: "Store selling mobile phones and electronics repair services",
        baseIncome: 600,
        cost: 150000,
        upgradeCost: 40000,
        skillBonus: "laborer",
        employeeBonus: 0.07,
        expansionPath: [
            { level: 2, name: "Electronics and Repair Center", cost: 350000, incomeMultiplier: 1.7, description: "Full electronics store with repair services" },
            { level: 3, name: "Tech Mall", cost: 800000, incomeMultiplier: 3.2, description: "Multi-brand technology center" }
        ],
        typicalProducts: ["Mobile phones", "SIM cards", "Chargers", "Accessories", "Repair services"]
    },
    restaurant: {
        name: "Carinderia",
        description: "Local Filipino restaurant serving everyday meals",
        baseIncome: 700,
        cost: 100000,
        upgradeCost: 30000,
        skillBonus: "fastfood",
        employeeBonus: 0.09,
        expansionPath: [
            { level: 2, name: "Family Restaurant", cost: 250000, incomeMultiplier: 1.6, description: "Sit-down restaurant with expanded menu" },
            { level: 3, name: "Restaurant Chain", cost: 600000, incomeMultiplier: 3.5, description: "Multiple-location restaurant business" }
        ],
        typicalProducts: ["Adobo", "Sinigang", "Pancit", "Lechon", "Kare-kare", "Rice", "Drinks"]
    }
};

// Initialize the game
function initGame() {
    loadGame();
    initTavernSystem();
    initMarketplace();
    updateUI();
    
    // Set up intervals for game updates
    setInterval(updateGame, 1000); // Update every second
    setInterval(earnBusinessIncome, 60000); // Earn business income every minute
    setInterval(updateMarketPrices, 300000); // Update market prices every 5 minutes
    
    // Set up tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Set up job buttons
    document.querySelectorAll('.job-duration-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobType = e.target.closest('.job-card').dataset.job;
            const duration = parseInt(e.target.dataset.duration);
            startJob(jobType, duration);
        });
    });
    
    // Set up business start buttons
    document.querySelectorAll('.start-business-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const businessType = e.target.closest('.business-type-card').dataset.business;
            startBusiness(businessType);
        });
    });
    
    // Set up cancel activity button
    document.getElementById('cancel-activity-btn').addEventListener('click', cancelActivity);
    
    // Set up expand business buttons (using event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('expand-business-btn')) {
            const businessId = e.target.dataset.id;
            expandBusiness(businessId);
        }
    });
    
    // Set up assign employee buttons (using event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('assign-employee-btn')) {
            const businessId = e.target.dataset.id;
            assignEmployeeToBusiness(businessId);
        }
    });
    
    // Set up fire employee buttons (using event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fire-employee-btn')) {
            const employeeId = e.target.dataset.id;
            fireEmployee(employeeId);
        }
    });
    
    // Set up hire employee buttons (using event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('hire-employee-btn')) {
            const employeeId = e.target.dataset.id;
            hireEmployee(employeeId);
        }
    });
    
    // Set up marketplace buttons (using event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('buy-stock-btn')) {
            const stockId = e.target.dataset.id;
            const amount = parseInt(document.querySelector(`#buy-stock-amount-${stockId}`).value);
            if (!isNaN(amount) && amount > 0) {
                buyStock(stockId, amount);
            } else {
                alert('Please enter a valid amount');
            }
        }
        
        if (e.target.classList.contains('sell-stock-btn')) {
            const stockId = e.target.dataset.id;
            const amount = parseInt(document.querySelector(`#sell-stock-amount-${stockId}`).value);
            if (!isNaN(amount) && amount > 0) {
                sellStock(stockId, amount);
            } else {
                alert('Please enter a valid amount');
            }
        }
        
        if (e.target.classList.contains('buy-crypto-btn')) {
            const cryptoId = e.target.dataset.id;
            const amount = parseFloat(document.querySelector(`#buy-crypto-amount-${cryptoId}`).value);
            if (!isNaN(amount) && amount > 0) {
                buyCrypto(cryptoId, amount);
            } else {
                alert('Please enter a valid amount');
            }
        }
        
        if (e.target.classList.contains('sell-crypto-btn')) {
            const cryptoId = e.target.dataset.id;
            const amount = parseFloat(document.querySelector(`#sell-crypto-amount-${cryptoId}`).value);
            if (!isNaN(amount) && amount > 0) {
                sellCrypto(cryptoId, amount);
            } else {
                alert('Please enter a valid amount');
            }
        }
        
        // Set up mini-game buttons
        if (e.target.classList.contains('start-mini-game-btn')) {
            const gameType = e.target.dataset.game;
            openMiniGameModal(gameType);
        }
    });
    
    // Set up modal close button
    document.querySelector('.close-modal').addEventListener('click', closeMiniGameModal);
    
    // Close modal when clicking outside
    document.getElementById('mini-game-modal').addEventListener('click', function(e) {
        if (e.target.id === 'mini-game-modal') {
            closeMiniGameModal();
        }
    });
}

// Initialize marketplace with default stocks and crypto
function initMarketplace() {
    // Initialize marketplace object if it doesn't exist
    if (!gameState.marketplace) {
        gameState.marketplace = {
            stocks: [],
            crypto: [],
            portfolio: {
                stocks: {},
                crypto: {}
            },
            transactions: []
        };
    }
    
    // Initialize stocks
    gameState.marketplace.stocks = JSON.parse(JSON.stringify(stockList));
    
    // Initialize crypto
    gameState.marketplace.crypto = JSON.parse(JSON.stringify(cryptoList));
    
    // Initialize portfolio if empty
    if (!gameState.marketplace.portfolio) {
        gameState.marketplace.portfolio = {
            stocks: {},
            crypto: {}
        };
    }
    
    // Initialize transactions if empty
    if (!gameState.marketplace.transactions) {
        gameState.marketplace.transactions = [];
    }
    
    // Update market prices in the background
    setTimeout(updateMarketPrices, 2000); // Update prices after a short delay
}

// Update market prices periodically
function updateMarketPrices() {
    // Update stock prices with low volatility
    gameState.marketplace.stocks.forEach(stock => {
        const changePercent = (Math.random() * stock.volatility * 2) - stock.volatility; // Random change between -volatility and +volatility
        stock.price = Math.max(1, stock.price * (1 + changePercent)); // Ensure price doesn't go below 1
    });
    
    // Update crypto prices with high volatility
    gameState.marketplace.crypto.forEach(crypto => {
        const changePercent = (Math.random() * crypto.volatility * 2) - crypto.volatility; // Random change between -volatility and +volatility
        crypto.price = Math.max(0.000001, crypto.price * (1 + changePercent)); // Ensure price doesn't go below near zero
    });
    
    updateUI();
    
    if (gameState.settings.notifications) {
        showNotification('Market prices updated!');
    }
}

// Record a transaction
function recordTransaction(type, assetType, assetId, quantity, price, cost) {
    const asset = (assetType === 'stock') 
        ? gameState.marketplace.stocks.find(s => s.id === assetId)
        : gameState.marketplace.crypto.find(c => c.id === assetId);
    
    const transaction = {
        id: generateId(),
        type: type, // 'buy' or 'sell'
        assetType: assetType, // 'stock' or 'crypto'
        assetId: assetId,
        assetName: asset ? asset.name : 'Unknown Asset',
        assetSymbol: asset ? asset.symbol : 'N/A',
        quantity: quantity,
        price: price,
        cost: cost,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    };
    
    gameState.marketplace.transactions.unshift(transaction);
    
    // Limit to last 50 transactions to prevent memory issues
    if (gameState.marketplace.transactions.length > 50) {
        gameState.marketplace.transactions = gameState.marketplace.transactions.slice(0, 50);
    }
}

// Buy stocks
function buyStock(stockId, quantity) {
    const stock = gameState.marketplace.stocks.find(s => s.id === stockId);
    if (!stock) return;
    
    const cost = stock.price * quantity;
    
    if (gameState.money < cost) {
        alert(`Not enough money! You need ₱${cost.toFixed(2)} to buy ${quantity} shares of ${stock.symbol}.`);
        return;
    }
    
    // Deduct cost
    gameState.money -= cost;
    
    // Add to portfolio
    if (!gameState.marketplace.portfolio.stocks[stockId]) {
        gameState.marketplace.portfolio.stocks[stockId] = 0;
    }
    gameState.marketplace.portfolio.stocks[stockId] += quantity;
    
    // Record the transaction
    recordTransaction('buy', 'stock', stockId, quantity, stock.price, cost);
    
    updateUI();
    
    if (gameState.settings.notifications) {
        showNotification(`Bought ${quantity} shares of ${stock.symbol} for ₱${cost.toFixed(2)}.`);
    }
}

// Sell stocks
function sellStock(stockId, quantity) {
    if (!gameState.marketplace.portfolio.stocks[stockId] || gameState.marketplace.portfolio.stocks[stockId] < quantity) {
        alert(`You don't have enough shares of ${stockId} to sell.`);
        return;
    }
    
    const stock = gameState.marketplace.stocks.find(s => s.id === stockId);
    if (!stock) return;
    
    const revenue = stock.price * quantity;
    
    // Add revenue
    gameState.money += revenue;
    
    // Remove from portfolio
    gameState.marketplace.portfolio.stocks[stockId] -= quantity;
    if (gameState.marketplace.portfolio.stocks[stockId] <= 0) {
        delete gameState.marketplace.portfolio.stocks[stockId];
    }
    
    // Record the transaction
    recordTransaction('sell', 'stock', stockId, quantity, stock.price, -revenue); // Negative for sell
    
    updateUI();
    
    if (gameState.settings.notifications) {
        showNotification(`Sold ${quantity} shares of ${stock.symbol} for ₱${revenue.toFixed(2)}.`);
    }
}

// Buy crypto
function buyCrypto(cryptoId, amount) {
    const crypto = gameState.marketplace.crypto.find(c => c.id === cryptoId);
    if (!crypto) return;
    
    const cost = crypto.price * amount;
    
    if (gameState.money < cost) {
        alert(`Not enough money! You need ₱${cost.toFixed(2)} to buy ${amount} ${crypto.symbol}.`);
        return;
    }
    
    // Deduct cost
    gameState.money -= cost;
    
    // Add to portfolio
    if (!gameState.marketplace.portfolio.crypto[cryptoId]) {
        gameState.marketplace.portfolio.crypto[cryptoId] = 0;
    }
    gameState.marketplace.portfolio.crypto[cryptoId] += amount;
    
    // Record the transaction
    recordTransaction('buy', 'crypto', cryptoId, amount, crypto.price, cost);
    
    updateUI();
    
    if (gameState.settings.notifications) {
        showNotification(`Bought ${amount} ${crypto.symbol} for ₱${cost.toFixed(2)}.`);
    }
}

// Sell crypto
function sellCrypto(cryptoId, amount) {
    if (!gameState.marketplace.portfolio.crypto[cryptoId] || gameState.marketplace.portfolio.crypto[cryptoId] < amount) {
        alert(`You don't have enough ${cryptoId} to sell.`);
        return;
    }
    
    const crypto = gameState.marketplace.crypto.find(c => c.id === cryptoId);
    if (!crypto) return;
    
    const revenue = crypto.price * amount;
    
    // Add revenue
    gameState.money += revenue;
    
    // Remove from portfolio
    gameState.marketplace.portfolio.crypto[cryptoId] -= amount;
    if (gameState.marketplace.portfolio.crypto[cryptoId] <= 0) {
        delete gameState.marketplace.portfolio.crypto[cryptoId];
    }
    
    // Record the transaction
    recordTransaction('sell', 'crypto', cryptoId, amount, crypto.price, -revenue); // Negative for sell
    
    updateUI();
    
    if (gameState.settings.notifications) {
        showNotification(`Sold ${amount} ${crypto.symbol} for ₱${revenue.toFixed(2)}.`);
    }
}

// Calculate portfolio value
function calculatePortfolioValue() {
    let totalValue = gameState.money;
    
    // Add stock value
    for (const [stockId, quantity] of Object.entries(gameState.marketplace.portfolio.stocks)) {
        const stock = gameState.marketplace.stocks.find(s => s.id === stockId);
        if (stock) {
            totalValue += stock.price * quantity;
        }
    }
    
    // Add crypto value
    for (const [cryptoId, amount] of Object.entries(gameState.marketplace.portfolio.crypto)) {
        const crypto = gameState.marketplace.crypto.find(c => c.id === cryptoId);
        if (crypto) {
            totalValue += crypto.price * amount;
        }
    }
    
    return totalValue;
}

// Switch between game tabs
function switchTab(tabName) {
    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab pane
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Activate selected tab button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Refresh tab content if needed
    if (tabName === 'business') {
        updateBusinessTab();
    } else if (tabName === 'employees') {
        updateEmployeesTab();
    } else if (tabName === 'marketplace') {
        updateMarketplaceTab();
    } else if (tabName === 'inventory') {
        updateInventoryTab();
    }
}

// Start a job
function startJob(jobType, durationMinutes) {
    // Check if already in an activity
    if (gameState.currentActivity) {
        alert('You are already working on something!');
        return;
    }
    
    // Calculate pay based on skill level and duration
    const job = jobDefinitions[jobType];
    if (!job) {
        console.error(`Job type ${jobType} not found in job definitions`);
        return;
    }
    
    const skillType = job.skillBonus;
    const skillLevel = gameState.skills[skillType]?.level || 0;
    const skillMultiplier = 1 + (skillLevel * 0.1); // 10% bonus per skill level
    
    // Calculate pay: base pay per hour * hours worked * skill multiplier
    const hoursWorked = durationMinutes / 60;
    const pay = Math.floor((job.basePay || 0) * hoursWorked * skillMultiplier);
    
    // Set activity
    gameState.currentActivity = {
        type: 'job',
        jobType: jobType,
        duration: durationMinutes,
        endTime: new Date(Date.now() + durationMinutes * 60 * 1000),
        pay: pay
    };
    
    gameState.activityEndTime = gameState.currentActivity.endTime;
    
    updateUI();
    
    // Show notification
    if (gameState.settings.notifications) {
        showNotification(`Started working as ${job.name || jobType} for ${durationMinutes} minutes. Will earn ₱${pay}.`);
    }
}

// Complete job and earn money
function completeJob() {
    if (!gameState.currentActivity || gameState.currentActivity.type !== 'job') return;
    
    const { pay, jobType } = gameState.currentActivity;
    
    // Add money
    gameState.money += pay;
    gameState.inventory.money += pay;
    
    // Add experience to relevant skill
    const skillType = jobDefinitions[jobType].skillBonus;
    addSkillExp(skillType, Math.floor(pay / 10));
    
    // Add to day counter (1 hour work = 1 day of business)
    if (gameState.currentActivity.duration >= 60) {
        gameState.day += Math.floor(gameState.currentActivity.duration / 60);
    }
    
    // Reset activity
    gameState.currentActivity = null;
    gameState.activityEndTime = null;
    
    updateUI();
    
    // Show notification
    if (gameState.settings.notifications) {
        showNotification(`Job completed! Earned ₱${pay}.`);
    }
}

// Start a business
function startBusiness(businessType) {
    const businessDef = businessDefinitions[businessType];
    
    if (!businessDef) return;
    
    if (gameState.money < businessDef.cost) {
        alert(`Not enough money! You need ₱${businessDef.cost} to start a ${businessDef.name}.`);
        return;
    }
    
    // Deduct cost
    gameState.money -= businessDef.cost;
    
    // Create business
    const newBusiness = {
        id: generateId(),
        type: businessType,
        name: businessDef.name,
        level: 1,
        income: businessDef.baseIncome,
        lastIncome: Date.now(),
        employeeId: null,
        customersServed: 0,
        totalProfit: 0,
        inventory: 100, // Starting inventory
        expenses: 50, // Basic business expenses per day
        reputation: 50 // Starting reputation (0-100)
    };
    
    gameState.businesses.push(newBusiness);
    
    updateUI();
    
    // Show notification
    if (gameState.settings.notifications) {
        showNotification(`Started a new ${businessDef.name}!`);
    }
}

// Expand a business to the next level
function expandBusiness(businessId) {
    const business = gameState.businesses.find(b => b.id === businessId);
    if (!business) return;
    
    const businessDef = businessDefinitions[business.type];
    const nextLevel = business.level + 1;
    
    // Find the expansion requirements for the next level
    const expansion = businessDef.expansionPath.find(exp => exp.level === nextLevel);
    
    if (!expansion) {
        alert('No more expansions available for this business!');
        return;
    }
    
    if (gameState.money < expansion.cost) {
        alert(`Not enough money! Expansion to ${expansion.name} costs ₱${expansion.cost}.`);
        return;
    }
    
    // Deduct cost
    gameState.money -= expansion.cost;
    
    // Update business
    business.level = nextLevel;
    business.name = expansion.name;
    business.income = businessDef.baseIncome * expansion.incomeMultiplier;
    
    updateUI();
    
    // Show notification
    if (gameState.settings.notifications) {
        showNotification(`${business.name} expanded to level ${business.level}!`);
    }
}

// Tavern system variables
let availableEmployees = [];
let nextEmployeeRefresh = null;

// Initialize tavern system
function initTavernSystem() {
    // Set next refresh to 24 hours from now if not set
    if (!nextEmployeeRefresh) {
        nextEmployeeRefresh = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    }
    
    // Generate initial employees if none exist
    if (availableEmployees.length === 0) {
        generateNewEmployees();
    }
}

// Generate new employees for the tavern
function generateNewEmployees() {
    availableEmployees = [];
    
    for (let i = 0; i < 3; i++) {
        // Random employee name
        const firstNames = ['Maria', 'Juan', 'Ana', 'Pedro', 'Luz', 'Rico', 'Carmen', 'Miguel', 'Sofia', 'Antonio', 'Isabel', 'Carlos', 'Elena', 'Luis', 'Fernanda'];
        const lastNames = ['Santos', 'Garcia', 'Reyes', 'Bautista', 'Cruz', 'Dela Cruz', 'Villa', 'Mendoza', 'Ramos', 'Aquino', 'Domingo', 'Rivera', 'Castillo', 'Gomez', 'Torres'];
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        
        // Random specialty based on business types
        const specialties = Object.keys(businessDefinitions);
        const specialty = specialties[Math.floor(Math.random() * specialties.length)];
        
        // Random efficiency (5% to 20%)
        const efficiency = 0.05 + (Math.random() * 0.15);
        
        // Random hiring cost (2000 to 5000)
        const hireCost = 2000 + Math.floor(Math.random() * 3000);
        
        // Random skill level (1 to 10)
        const skillLevel = 1 + Math.floor(Math.random() * 10);
        
        const employee = {
            id: `emp_${Date.now()}_${i}`,
            name: `${firstName} ${lastName}`,
            specialty: specialty,
            efficiency: efficiency,
            hireCost: hireCost,
            skillLevel: skillLevel,
            description: generateEmployeeDescription(firstName, skillLevel, specialty)
        };
        
        availableEmployees.push(employee);
    }
}

// Generate a description for the employee
function generateEmployeeDescription(name, skillLevel, specialty) {
    const businessNames = {
        'sari': 'Sari-sari Store',
        'convenience': 'Convenience Store', 
        'agrivet': 'Agrivet Store',
        'beverage': 'Beverage Dealer',
        'department': 'Department Store',
        'gadget': 'Gadget Store',
        'restaurant': 'Restaurant'
    };
    
    const descriptors = [
        `an experienced worker who specializes in ${businessNames[specialty]}`,
        `a hardworking individual with skills in ${businessNames[specialty]}`,
        `a reliable employee good with ${businessNames[specialty]} operations`,
        `a skilled worker with ${skillLevel} years of experience`,
        `a dedicated employee who excels in ${businessNames[specialty]} management`
    ];
    
    return `${name} is ${descriptors[Math.floor(Math.random() * descriptors.length)]}.`;
}

// Hire an employee from the tavern
function hireEmployee(employeeId) {
    const employeeIndex = availableEmployees.findIndex(emp => emp.id === employeeId);
    
    if (employeeIndex === -1) {
        alert('Employee is no longer available!');
        return;
    }
    
    const employee = availableEmployees[employeeIndex];
    
    if (gameState.money < employee.hireCost) {
        alert(`Not enough money! Hiring ${employee.name} costs ₱${employee.hireCost}.`);
        return;
    }
    
    // Deduct hiring cost
    gameState.money -= employee.hireCost;
    
    // Add employee to player's workforce
    gameState.employees.push(employee);
    
    // Remove from available employees
    availableEmployees.splice(employeeIndex, 1);
    
    updateUI();
    
    // Show notification
    if (gameState.settings.notifications) {
        showNotification(`Hired ${employee.name} as an employee!`);
    }
}

// Refresh tavern employees (should happen every 24 hours)
function refreshTavernEmployees() {
    if (Date.now() >= nextEmployeeRefresh) {
        generateNewEmployees();
        nextEmployeeRefresh = Date.now() + 24 * 60 * 60 * 1000; // Set next refresh to 24 hours from now
        
        // Show notification
        if (gameState.settings.notifications) {
            showNotification('New employees are available at the tavern!');
        }
    }
}

// Get time until next employee refresh
function getTimeUntilRefresh() {
    const timeLeft = Math.max(0, nextEmployeeRefresh - Date.now());
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
}

// Add experience to a skill
function addSkillExp(skillType, expAmount) {
    if (!gameState.skills[skillType]) return;
    
    gameState.skills[skillType].exp += expAmount;
    
    // Check for level up
    while (gameState.skills[skillType].exp >= gameState.skills[skillType].expNeeded) {
        gameState.skills[skillType].exp -= gameState.skills[skillType].expNeeded;
        gameState.skills[skillType].level++;
        
        // Increase exp needed for next level
        gameState.skills[skillType].expNeeded = Math.floor(gameState.skills[skillType].expNeeded * 1.5);
        
        // Level up bonus
        gameState.level++;
        
        // Show notification
        if (gameState.settings.notifications) {
            showNotification(`${skillDefinitions[skillType]} skill leveled up to ${gameState.skills[skillType].level}!`);
        }
    }
}

// Calculate skill bonus for business income
function calculateBusinessSkillBonus(businessType) {
    // Determine which skill affects this business type
    let skillType = '';
    switch(businessType) {
        case 'sari':
            skillType = 'sales';
            break;
        case 'convenience':
            skillType = 'cashier';
            break;
        case 'agrivet':
            skillType = 'laborer';
            break;
        case 'beverage':
            skillType = 'delivery';
            break;
        case 'restaurant': // If we add a restaurant later
            skillType = 'fastfood';
            break;
        default:
            skillType = 'sales'; // Default to sales
    }
    
    // Calculate bonus based on skill level
    const skillLevel = gameState.skills[skillType].level;
    return 1 + (skillLevel * 0.15); // 15% bonus per skill level
}

// Calculate employee bonus for business
function calculateEmployeeBonus(businessId) {
    const business = gameState.businesses.find(b => b.id === businessId);
    if (!business || !business.employeeId) return 1;
    
    const employee = gameState.employees.find(e => e.id === business.employeeId);
    if (!employee) return 1;
    
    // Check if employee specialty matches business type
    let multiplier = 1 + employee.efficiency;
    if (employee.specialty === business.type) {
        multiplier += 0.05; // Additional 5% bonus if specialty matches
    }
    
    return multiplier;
}

// Filipino-themed special events
const filipinoEvents = [
    { 
        name: "Barangay Fiesta", 
        description: "Local feast brings more customers",
        effect: "incomeMultiplier",
        multiplier: 2.0,
        duration: 240 // 4 hours in minutes
    },
    { 
        name: "Undas (All Saints' Day)", 
        description: "Day of remembrance affects business",
        effect: "incomeMultiplier", 
        multiplier: 0.7,
        duration: 1440 // 24 hours in minutes
    },
    { 
        name: "Christmas Season", 
        description: "Holiday season boosts sales",
        effect: "incomeMultiplier", 
        multiplier: 2.5,
        duration: 4320 // 3 days in minutes
    },
    { 
        name: "Maundy Thursday", 
        description: "Quiet day affects customer traffic",
        effect: "incomeMultiplier", 
        multiplier: 0.5,
        duration: 1440 // 24 hours in minutes
    },
    { 
        name: "Palaro Day", 
        description: "Community sports event brings crowds",
        effect: "incomeMultiplier", 
        multiplier: 1.8,
        duration: 720 // 12 hours in minutes
    },
    { 
        name: "Brownout", 
        description: "Power interruption affects operations",
        effect: "incomeMultiplier", 
        multiplier: 0.3,
        duration: 120 // 2 hours in minutes
    },
    { 
        name: "Pasko ng Pamilya", 
        description: "Family Christmas brings customers",
        effect: "incomeMultiplier", 
        multiplier: 2.2,
        duration: 1440 // 24 hours in minutes
    },
    { 
        name: "Labor Day", 
        description: "Special holiday increases job pay",
        effect: "jobPayBonus",
        multiplier: 1.5,
        duration: 480 // 8 hours in minutes
    },
    { 
        name: "Bayanihan Festival", 
        description: "Community festival increases Bayanihan points gain",
        effect: "bayanihanBonus",
        multiplier: 2.0,
        duration: 720 // 12 hours in minutes
    },
    { 
        name: "Harvest Season", 
        description: "Peak season for agrivet stores",
        effect: "businessBonus",
        businessType: "agrivet",
        multiplier: 2.5,
        duration: 1440 // 24 hours in minutes
    },
    { 
        name: "Sinulog Festival", 
        description: "Cebu festival brings tourism",
        effect: "incomeMultiplier",
        multiplier: 2.0,
        duration: 2880 // 48 hours in minutes
    },
    { 
        name: "Ati-Atihan Festival", 
        description: "Aklan festival attracts customers",
        effect: "incomeMultiplier",
        multiplier: 1.8,
        duration: 2880 // 48 hours in minutes
    }
];

// Bayanihan system - community cooperation benefits
let bayanihanPoints = 0;
let lastBayanihanActivity = 0;

// Filipino cultural calendar with special event dates
const filipinoCalendar = {
    '1/1': 'New Year', // New Year
    '1/23': 'Bibangkal Festival', // Pampanga festival
    '2/2': 'Chinese New Year', // Varies by year but commonly celebrated
    '2/25': 'EDSA Revolution Anniversary',
    '3/1': 'Araw ng Kagitingan', // Day of Valor
    '3/31': 'Black Nazarene Procession', // Religious festival
    '4/9': 'Araw ng Kagitingan', // Bataan Day
    '4/14': 'Maundy Thursday', // Holy Week
    '4/15': 'Good Friday', // Holy Week
    '4/16': 'Black Saturday', // Holy Week
    '4/17': 'Easter Sunday', // Holy Week
    '5/1': 'Labor Day',
    '6/5': 'Pancit Festival', // Lucban, Quezon
    '6/12': 'Independence Day',
    '6/13': 'Barangay Fiesta', // Example date
    '6/29': 'Kneeling Carabao Festival', // Guagua, Pampanga
    '7/20': 'Pahiyas Festival', // Lucban, Quezon
    '8/13': 'Feast of St. Roch', // Obando Fertility Rites
    '8/20': 'Feast of St. Augustine', // Cebu Sinulog
    '8/21': 'Ninoy Aquino Day',
    '8/27': 'National Heroes Day',
    '8/30': 'Bonifacio Day',
    '9/16': 'MassKara Festival', // Bacolod City
    '10/17': 'Bacolod City Charter Day',
    '10/27': 'Kadayawan Festival', // Davao
    '11/1': 'Undas (All Saints\' Day)',
    '11/2': 'Undas (All Saints\' Day)',
    '11/30': 'Bonifacio Day Holiday',
    '12/8': 'Feast of the Immaculate Conception',
    '12/24': 'Christmas Eve',
    '12/25': 'Christmas Day',
    '12/30': 'Rizal Day',
    '12/31': 'New Year\'s Eve'
};

// Check for special events happening today
function checkSpecialEvents() {
    // Get current date
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1; // Month is 0-indexed
    
    // Check for specific calendar events
    const dateKey = `${month}/${day}`;
    if (filipinoCalendar[dateKey]) {
        const eventName = filipinoCalendar[dateKey];
        // Find the corresponding event details
        const event = filipinoEvents.find(e => e.name.includes(eventName) || e.name === eventName);
        
        if (event) {
            return {
                name: event.name,
                description: event.description,
                multiplier: event.multiplier,
                duration: event.duration,
                effect: event.effect
            };
        }
    }
    
    // Random events (1% chance per day)
    if (Math.random() < 0.01) {
        const randomEvent = filipinoEvents[Math.floor(Math.random() * filipinoEvents.length)];
        return {
            name: randomEvent.name,
            description: randomEvent.description,
            multiplier: randomEvent.multiplier,
            duration: randomEvent.duration,
            effect: randomEvent.effect
        };
    }
    
    return null;
}

// Apply special event effects to game
function applyEventEffects(event) {
    // For now, we'll just use the multiplier if the event has one
    if (event.multiplier) {
        return event.multiplier;
    }
    return 1.0;
}

// Participate in Bayanihan - community cooperation
function participateInBayanihan() {
    const now = Date.now();
    const timeSinceLast = now - lastBayanihanActivity;
    
    // Only allow participation once per day
    if (timeSinceLast < 24 * 60 * 60 * 1000) { // 24 hours
        alert('You already participated in Bayanihan today! Wait until tomorrow.');
        return;
    }
    
    // Random Bayanihan activity
    const activities = [
        "Helped repair the community chapel",
        "Joined neighborhood cleanup drive",
        "Assisted in preparing for the fiesta",
        "Donated to the barangay emergency fund",
        "Volunteered in the local school project",
        "Helped elderly neighbors with their needs"
    ];
    
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const pointsGained = 1 + Math.floor(Math.random() * 3); // 1-3 points
    
    bayanihanPoints += pointsGained;
    lastBayanihanActivity = now;
    
    // Show notification
    if (gameState.settings.notifications) {
        showNotification(`Bayanihan: ${activity} (+${pointsGained} points)`);
    }
    
    // Occasionally provide special rewards for accumulating Bayanihan points
    if (bayanihanPoints >= 10) {
        bayanihanPoints = 0; // Reset points
        const rewardAmount = 5000 + Math.floor(Math.random() * 10000); // 5,000 to 15,000
        gameState.money += rewardAmount;
        gameState.inventory.money += rewardAmount;
        
        if (gameState.settings.notifications) {
            showNotification(`Bayanihan Reward: Community appreciation! You received ₱${rewardAmount} for your service!`);
        }
    }
    
    updateUI();
}

// Add PALUGAN (cooperative) system
const palugan = {
    members: [],
    funds: 0,
    dividends: 0,
    totalContributions: 0,
    dividendsRate: 0.001 // 0.1% daily interest on contributions
};

// Add Barangay Council system to the game
const barangayCouncil = {
    projects: [],
    budget: 0,
    proposals: [],
    level: 1,
    
    // Add a community project
    addProject: function(name, cost, description, duration) {
        const project = {
            id: generateId(),
            name: name,
            description: description,
            cost: cost,
            duration: duration, // in minutes
            started: Date.now(),
            completed: false
        };
        
        this.projects.push(project);
        return project;
    },
    
    // Complete a project and provide rewards
    completeProject: function(projectId) {
        const project = this.projects.find(p => p.id === projectId && !p.completed);
        if (project) {
            project.completed = true;
            
            // Reward participants (players who contributed)
            this.budget += project.cost; // Add to barangay budget
            
            // Show notification
            if (gameState.settings.notifications) {
                showNotification(`Barangay Project: ${project.name} completed! It will benefit the whole community.`);
            }
            
            return project;
        }
        return null;
    }
};

// Join PALUGAN (cooperative)
function joinPalugan() {
    if (palugan.members.includes(gameState.playerName)) {
        alert('You are already a member of the cooperative!');
        return;
    }
    
    const joinFee = 2000;
    if (gameState.money < joinFee) {
        alert(`You need ₱${joinFee} to join the cooperative!`);
        return;
    }
    
    gameState.money -= joinFee;
    palugan.members.push(gameState.playerName);
    palugan.totalContributions += joinFee;
    palugan.funds += joinFee;
    
    if (gameState.settings.notifications) {
        showNotification(`Welcome to PALUGAN! Your cooperative membership helps build community wealth.`);
    }
    
    updateUI();
}

// Contribute to PALUGAN with bonus interest
function contributeToPalugan(amount) {
    if (!palugan.members.includes(gameState.playerName)) {
        alert('You must be a member of the cooperative first!');
        return;
    }
    
    if (gameState.money < amount) {
        alert(`You don't have ₱${amount} to contribute!`);
        return;
    }
    
    gameState.money -= amount;
    palugan.funds += amount;
    palugan.totalContributions += amount;
    
    // Add interest based on the interest rate
    const dailyInterest = Math.floor(palugan.funds * palugan.dividendsRate);
    palugan.funds += dailyInterest;
    palugan.dividends += dailyInterest;
    
    if (gameState.settings.notifications) {
        showNotification(`Contribution: ₱${amount} to PALUGAN. Total funds: ₱${palugan.funds}. Daily dividends: ₱${dailyInterest}`);
    }
    
    updateUI();
}

// Participate in Barangay Council projects
function participateInBarangayProject(projectId) {
    const project = barangayCouncil.projects.find(p => p.id === projectId && !p.completed);
    if (!project) {
        alert('This project is not available or already completed!');
        return;
    }
    
    if (gameState.money < project.cost) {
        alert(`You need ₱${project.cost} for this project!`);
        return;
    }
    
    gameState.money -= project.cost;
    project.contributors = project.contributors || [];
    project.contributors.push(gameState.playerName);
    
    if (gameState.settings.notifications) {
        showNotification(`You've contributed to the ${project.name} project!`);
    }
    
    updateUI();
}

// Start a Barangay Council project
function startBarangayProject() {
    // Only allow certain projects based on player level
    if (gameState.level < 5) {
        alert('You need to be at least level 5 to start a community project!');
        return;
    }
    
    // Available projects to start
    const availableProjects = [
        { name: "Barangay Health Station", description: "Improve local healthcare access", cost: 25000, duration: 1440 }, // 24 hours
        { name: "Community Garden", description: "Create shared growing space", cost: 15000, duration: 1008 }, // 16.8 hours
        { name: "Road Repair", description: "Fix roads in the community", cost: 35000, duration: 2160 }, // 36 hours
        { name: "Community Center", description: "Build space for gatherings", cost: 50000, duration: 2880 } // 48 hours
    ];
    
    // Present options to the player
    const projectNames = availableProjects.map((p, i) => `${i+1}. ${p.name} (Cost: ₱${p.cost}, Duration: ${p.duration/60} hours)`);
    const choice = prompt(`Choose a community project:\n\n${projectNames.join('\n')}\nEnter the number of your choice:`);
    
    if (choice && !isNaN(choice) && parseInt(choice) >= 1 && parseInt(choice) <= availableProjects.length) {
        const projectIndex = parseInt(choice) - 1;
        const selectedProject = availableProjects[projectIndex];
        
        if (gameState.money >= selectedProject.cost) {
            barangayCouncil.addProject(
                selectedProject.name,
                selectedProject.cost,
                selectedProject.description,
                selectedProject.duration
            );
            
            if (gameState.settings.notifications) {
                showNotification(`Started project: ${selectedProject.name}!`);
            }
        } else {
            alert(`You can't afford the ${selectedProject.name} project!`);
        }
    } else {
        alert('Invalid choice!');
    }
    
    updateUI();
}

// Contribute to PALUGAN
function contributeToPalugan(amount) {
    if (!palugan.members.includes(gameState.playerName)) {
        alert('You must be a member of the cooperative first!');
        return;
    }
    
    if (gameState.money < amount) {
        alert(`You don't have ₱${amount} to contribute!`);
        return;
    }
    
    gameState.money -= amount;
    palugan.funds += amount;
    palugan.totalContributions += amount;
    
    // Simulate some interest on funds
    const interest = Math.floor(palugan.funds * 0.001); // Small daily interest
    palugan.funds += interest;
    palugan.dividends += interest;
    
    if (gameState.settings.notifications) {
        showNotification(`Contribution: ₱${amount} to PALUGAN. Funds: ₱${palugan.funds}`);
    }
    
    updateUI();
}

// Update business income
function earnBusinessIncome() {
    const now = Date.now();
    
    // Check for special events
    const specialEvent = checkSpecialEvents();
    let eventMultiplier = 1.0;
    
    if (specialEvent) {
        eventMultiplier = applyEventEffects(specialEvent);
    }
    
    gameState.businesses.forEach(business => {
        const timePassed = now - business.lastIncome;
        const minutesPassed = Math.floor(timePassed / 60000); // Convert to minutes
        
        if (minutesPassed > 0) {
            // Calculate income based on business type and skill level
            const businessDef = businessDefinitions[business.type];
            
            // Get skill bonus for this business type
            const skillBonus = calculateBusinessSkillBonus(business.type);
            
            // Check for employee bonus
            const employeeBonus = calculateEmployeeBonus(business.id);
            
            // Calculate income with event multiplier
            let incomePerMinute = businessDef.baseIncome * skillBonus * employeeBonus / 60;
            
            // Apply event multipliers based on event type
            if (specialEvent) {
                if (specialEvent.effect === 'businessBonus' && specialEvent.businessType === business.type) {
                    // This event specifically affects this business type
                    incomePerMinute *= specialEvent.multiplier;
                } else if (specialEvent.effect === 'incomeMultiplier') {
                    // This event affects all businesses
                    incomePerMinute *= specialEvent.multiplier;
                }
            }
            
            const income = Math.floor(incomePerMinute * minutesPassed);
            
            // Update business stats
            business.income = incomePerMinute * 60; // Update displayed income (per hour)
            business.customersServed += Math.floor(minutesPassed / 2); // Simulate customers
            business.totalProfit += income;
            
            // Add to player money
            gameState.money += income;
            gameState.inventory.money += income;
            
            // Update last income time
            business.lastIncome = now;
            
            // Level up business based on total profit
            if (business.totalProfit > business.level * 10000) {
                business.level++;
                if (gameState.settings.notifications) {
                    showNotification(`${business.name} leveled up to level ${business.level}!`);
                }
            }
        }
    });
    
    // Handle special event effects that don't directly affect business income
    if (specialEvent && specialEvent.effect === 'bayanihanBonus') {
        // Increase Bayanihan points gain
        bayanihanPoints += Math.floor(2 * specialEvent.multiplier);
    }
    
    // Show notification for special events
    if (specialEvent && gameState.settings.notifications) {
        showNotification(`Special Event: ${specialEvent.name}! ${specialEvent.description}`);
    }
    
    updateUI();
}

// Cancel current activity
function cancelActivity() {
    if (!gameState.currentActivity) return;
    
    // Calculate partial reward for job
    if (gameState.currentActivity.type === 'job') {
        const elapsed = Date.now() - (gameState.activityEndTime - gameState.currentActivity.duration * 60000);
        const elapsedMinutes = Math.floor(elapsed / 60000);
        const fraction = Math.max(0.1, elapsedMinutes / gameState.currentActivity.duration); // At least 10% reward
        const partialPay = Math.floor(gameState.currentActivity.pay * fraction);
        
        gameState.money += partialPay;
        gameState.inventory.money += partialPay;
        
        // Show notification
        if (gameState.settings.notifications) {
            showNotification(`Job canceled. Earned ₱${partialPay} for ${elapsedMinutes} minutes of work.`);
        }
    }
    
    // Reset activity
    gameState.currentActivity = null;
    gameState.activityEndTime = null;
    
    updateUI();
}

// Update the UI based on game state - Optimized version
function updateUI() {
    // Only update elements that actually changed
    try {
        updatePlayerInfo();
        updateCurrentActivity();
        updateQuickStats();
        updateBusinessStats();
        updateRefreshTimer();
        
        // Update only the active tab to save performance
        const businessTab = document.getElementById('business-tab');
        const employeesTab = document.getElementById('employees-tab');
        const marketplaceTab = document.getElementById('marketplace-tab');
        const inventoryTab = document.getElementById('inventory-tab');
        
        if (businessTab && businessTab.classList.contains('active')) {
            updateBusinessTab();
        } else if (employeesTab && employeesTab.classList.contains('active')) {
            updateEmployeesTab();
        } else if (marketplaceTab && marketplaceTab.classList.contains('active')) {
            updateMarketplaceTab();
        } else if (inventoryTab && inventoryTab.classList.contains('active')) {
            updateInventoryTab();
        }
        
        // Update skills only periodically to save performance
        if (Date.now() % 3000 < 100) { // Update every ~3 seconds
            updateSkillsDisplay();
        }
    } catch (error) {
        console.error('Error in updateUI:', error);
    }
}

// Optimized function to update player info
function updatePlayerInfo() {
    const moneyEl = document.getElementById('money');
    const dayEl = document.getElementById('day');
    const levelEl = document.getElementById('player-level');
    const inventoryMoneyEl = document.getElementById('inventory-money');
    const savingsEl = document.getElementById('savings-amount');
    
    if (moneyEl) moneyEl.textContent = `₱${(gameState.money || 0).toLocaleString()}`;
    if (dayEl) dayEl.textContent = gameState.day || 1;
    if (levelEl) levelEl.textContent = gameState.level || 1;
    if (inventoryMoneyEl) inventoryMoneyEl.textContent = (gameState.inventory?.money || 0).toLocaleString();
    if (savingsEl) savingsEl.textContent = (gameState.inventory?.savings || 0).toLocaleString();
}

// Optimized function to update current activity
function updateCurrentActivity() {
    const activityStatus = document.getElementById('activity-status');
    const activityTimer = document.getElementById('activity-timer');
    const cancelBtn = document.getElementById('cancel-activity-btn');
    
    if (!activityStatus || !activityTimer || !cancelBtn) return;
    
    if (gameState.currentActivity && gameState.activityEndTime) {
        const job = jobDefinitions[gameState.currentActivity.jobType];
        if (job) {
            activityStatus.innerHTML = `<i class="fas fa-briefcase"></i> Working as ${job.name}`;
        } else {
            activityStatus.innerHTML = '<i class="fas fa-couch"></i> Idle';
        }
        
        // Update timer
        const timeLeft = Math.max(0, gameState.activityEndTime - Date.now());
        const minutesLeft = Math.floor(timeLeft / 60000);
        const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
        
        activityTimer.textContent = `${minutesLeft}m ${secondsLeft}s remaining`;
        
        cancelBtn.style.display = 'inline-block';
    } else {
        activityStatus.innerHTML = '<i class="fas fa-couch"></i> Idle';
        activityTimer.textContent = '';
        cancelBtn.style.display = 'none';
    }
}

// Optimized function to update quick stats
function updateQuickStats() {
    const quickBusinessesEl = document.getElementById('quick-businesses');
    const quickEmployeesEl = document.getElementById('quick-employees');
    const quickBayanihanEl = document.getElementById('quick-bayanihan');
    
    if (quickBusinessesEl) quickBusinessesEl.textContent = (gameState.businesses || []).length;
    if (quickEmployeesEl) quickEmployeesEl.textContent = (gameState.employees || []).length;
    if (quickBayanihanEl) quickBayanihanEl.textContent = bayanihanPoints || 0;
}

// Update inventory tab content with additional elements
function updateInventoryTab() {
    const inventoryMoneyEl = document.getElementById('inventory-money');
    const savingsAmountEl = document.getElementById('savings-amount');
    const licensesCountEl = document.getElementById('licenses-count');
    const equipmentCountEl = document.getElementById('equipment-count');
    const bayanihanPointsEl = document.getElementById('bayanihan-points');
    const paluganMembersEl = document.getElementById('palugan-members');
    const paluganFundsEl = document.getElementById('palugan-funds');
    const paluganStatusEl = document.getElementById('palugan-status');
    
    if (inventoryMoneyEl) inventoryMoneyEl.textContent = (gameState.inventory?.money || 0).toLocaleString();
    if (savingsAmountEl) savingsAmountEl.textContent = (gameState.inventory?.savings || 0).toLocaleString();
    if (licensesCountEl) licensesCountEl.textContent = (gameState.businesses || []).length;
    if (equipmentCountEl) equipmentCountEl.textContent = 0; // Placeholder
    if (bayanihanPointsEl) bayanihanPointsEl.textContent = bayanihanPoints || 0;
    
    // Update PALUGAN information
    if (paluganMembersEl) paluganMembersEl.textContent = (palugan.members || []).length;
    if (paluganFundsEl) paluganFundsEl.textContent = (palugan.funds || 0).toLocaleString();
    if (paluganStatusEl) {
        const isMember = palugan.members?.includes(gameState.playerName) || false;
        paluganStatusEl.textContent = isMember ? 'Member' : 'Not a member';
    }
}

// Update business statistics
function updateBusinessStats() {
    // Calculate total daily income from all businesses
    let totalIncome = 0;
    const businesses = gameState.businesses || [];
    businesses.forEach(business => {
        totalIncome += business.income || 0;
    });
    
    // Update business stats elements if they exist
    const totalIncomeEl = document.getElementById('total-daily-income');
    const totalBusinessesEl = document.getElementById('total-businesses');
    const totalEmployeesEl = document.getElementById('total-employees');
    
    if (totalIncomeEl) totalIncomeEl.textContent = `₱${totalIncome.toFixed(2)}/hr`;
    if (totalBusinessesEl) totalBusinessesEl.textContent = businesses.length;
    if (totalEmployeesEl) totalEmployeesEl.textContent = (gameState.employees || []).length;
}

// Update refresh timer for employees
function updateRefreshTimer() {
    if (!nextEmployeeRefresh) return;
    
    const timeLeft = Math.max(0, nextEmployeeRefresh - Date.now());
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    const refreshTimerEl = document.getElementById('refresh-timer');
    if (refreshTimerEl) {
        refreshTimerEl.textContent = `${hours}h ${minutes}m`;
    }
}

// Add search and filtering functionality for jobs
function setupJobSearch() {
    const searchInput = document.getElementById('job-search');
    const filterSelect = document.getElementById('job-filter');
    const jobList = document.getElementById('job-list');
    const jobCards = document.querySelectorAll('.job-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            filterJobs(searchTerm, filterSelect.value);
        });
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            filterJobs(searchTerm, filterSelect.value);
        });
    }
    
    function filterJobs(searchTerm, filterValue) {
        jobCards.forEach(card => {
            const jobName = card.querySelector('h3').textContent.toLowerCase();
            const jobPay = parseInt(card.dataset.pay);
            let matchesSearch = true;
            let matchesFilter = true;
            
            // Check search term
            if (searchTerm && !jobName.includes(searchTerm)) {
                matchesSearch = false;
            }
            
            // Check filter value
            if (filterValue !== 'all') {
                if (filterValue === 'low' && jobPay > 200) matchesFilter = false;
                if (filterValue === 'medium' && (jobPay <= 200 || jobPay > 400)) matchesFilter = false;
                if (filterValue === 'high' && jobPay <= 400) matchesFilter = false;
            }
            
            card.style.display = (matchesSearch && matchesFilter) ? 'block' : 'none';
        });
    }
}

// Update skills display
function updateSkillsDisplay() {
    const skillList = document.getElementById('skill-list');
    if (!skillList) return;
    
    skillList.innerHTML = '';
    
    for (const [skillType, skillData] of Object.entries(gameState.skills || {})) {
        if (!skillData) continue;
        
        const skillItem = document.createElement('div');
        skillItem.className = 'skill-item';
        
        const percentComplete = ((skillData.exp || 0) / (skillData.expNeeded || 100)) * 100;
        
        skillItem.innerHTML = `
            <div class="skill-name">${skillDefinitions[skillType] || skillType} (Level ${skillData.level || 0})</div>
            <div class="skill-bar-container">
                <div class="skill-bar" style="width: ${percentComplete}%"></div>
            </div>
            <div class="skill-exp">${skillData.exp || 0}/${skillData.expNeeded || 100} EXP</div>
        `;
        
        skillList.appendChild(skillItem);
    }
}

// Skill definitions for display
const skillDefinitions = {
    encoder: 'Encoder',
    fastfood: 'Fast-food',
    laborer: 'Hard Laborer',
    sales: 'Sales/Merchandiser',
    cashier: 'Cashier',
    stockman: 'Stockman',
    delivery: 'Delivery',
    driver: 'Driver'
};

// Update business tab content
function updateBusinessTab() {
    const businessList = document.getElementById('business-list');
    if (!businessList) return;
    
    businessList.innerHTML = '';
    const businesses = gameState.businesses || [];
    
    if (businesses.length === 0) {
        businessList.innerHTML = '<div class="empty-state"><i class="fas fa-store-slash"></i> No businesses yet. Get your first job and save up to start!</div>';
        return;
    }
    
    businesses.forEach(business => {
        if (!business) return;
        
        const businessDef = businessDefinitions[business.type];
        const businessElement = document.createElement('div');
        businessElement.className = 'business-item';
        
        businessElement.innerHTML = `
            <div class="business-header">
                <div class="business-name">${business.name || 'Unnamed Business'}</div>
                <div class="business-level">Level ${business.level || 1}</div>
            </div>
            <div class="business-stats">
                <div class="business-stat">Income: ₱${(business.income || 0).toFixed(2)}/hr</div>
                <div class="business-stat">Customers: ${business.customersServed || 0}</div>
                <div class="business-stat">Profit: ₱${business.totalProfit || 0}</div>
            </div>
            <div class="business-actions">
                <button class="upgrade-business-btn" data-id="${business.id}">Upgrade</button>
                <button class="assign-employee-btn" data-id="${business.id}">Assign Employee</button>
            </div>
        `;
        
        businessList.appendChild(businessElement);
    });
    
    // Add event listeners for business actions
    document.querySelectorAll('.upgrade-business-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const businessId = e.target.dataset.id;
            if (businessId) upgradeBusiness(businessId);
        });
    });
    
    document.querySelectorAll('.assign-employee-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const businessId = e.target.dataset.id;
            if (businessId) assignEmployeeToBusiness(businessId);
        });
    });
}

// Update employees tab content
function updateEmployeesTab() {
    // Update available employees section
    const availableEmployeesDiv = document.getElementById('available-employees');
    if (!availableEmployeesDiv) return;
    
    availableEmployeesDiv.innerHTML = '';
    
    // Add time until refresh and refresh button
    const timeUntilRefresh = getTimeUntilRefresh();
    const refreshSection = document.createElement('div');
    refreshSection.className = 'employee-header';
    refreshSection.innerHTML = `
        <h3><i class="fas fa-user-plus"></i> Available Employees (Refreshing in <span id="refresh-timer">${timeUntilRefresh || '24h 0m'}</span>)</h3>
        <button id="refresh-employees" class="btn-secondary">
            <i class="fas fa-sync-alt"></i> Use Bayanihan Points (50 pts)
        </button>
    `;
    availableEmployeesDiv.appendChild(refreshSection);
    
    // Add event listener for refresh button
    const refreshBtn = document.getElementById('refresh-employees');
    if (refreshBtn) {
        refreshBtn.removeEventListener('click', refreshEmployeesWithBayanihan); // Remove any existing listener
        refreshBtn.addEventListener('click', refreshEmployeesWithBayanihan);
    }
    
    // Add available employees
    (availableEmployees || []).forEach(employee => {
        if (!employee) return;
        
        const employeeCard = document.createElement('div');
        employeeCard.className = 'employee-card';
        
        employeeCard.innerHTML = `
            <div class="employee-icon"><i class="fas fa-user"></i></div>
            <h4>${employee.name || 'Unknown'} (Level ${employee.skillLevel || 1})</h4>
            <p><i class="fas fa-star"></i> Specialty: ${employee.specialty || 'General'}</p>
            <p><i class="fas fa-percentage"></i> Efficiency: ${((employee.efficiency || 0) * 100).toFixed(1)}%</p>
            <p><i class="fas fa-comment"></i> ${employee.description || 'No description'}</p>
            <button class="hire-employee-btn" data-id="${employee.id}">
                <i class="fas fa-hand-holding-usd"></i> Hire for ₱${employee.hireCost || 0}
            </button>
        `;
        
        availableEmployeesDiv.appendChild(employeeCard);
    });
    
    // Update your employees section
    const employeeList = document.getElementById('employee-list');
    if (!employeeList) return;
    
    employeeList.innerHTML = '';
    const employees = gameState.employees || [];
    
    if (employees.length === 0) {
        employeeList.innerHTML = '<div class="empty-state"><i class="fas fa-user-slash"></i> No employees hired yet.</div>';
        return;
    }
    
    employees.forEach(employee => {
        if (!employee) return;
        
        const employeeElement = document.createElement('div');
        employeeElement.className = 'employee-list-item';
        
        employeeElement.innerHTML = `
            <div class="employee-info">
                <div><i class="fas fa-user"></i> <strong>${employee.name || 'Unknown'}</strong> (Level ${employee.skillLevel || 1})</div>
                <div><i class="fas fa-star"></i> Specialty: ${employee.specialty || 'General'}</div>
                <div><i class="fas fa-percentage"></i> Efficiency: ${((employee.efficiency || 0) * 100).toFixed(1)}%</div>
            </div>
            <div class="employee-controls">
                <button class="fire-employee-btn" data-id="${employee.id}">
                    <i class="fas fa-user-times"></i> Fire
                </button>
            </div>
        `;
        
        employeeList.appendChild(employeeElement);
    });
    
    // Add event listeners for employee actions
    // Remove existing listeners to prevent duplicates
    document.querySelectorAll('.hire-employee-btn').forEach(btn => {
        btn.removeEventListener('click', handleHireEmployee);
        btn.addEventListener('click', handleHireEmployee);
    });
    
    document.querySelectorAll('.fire-employee-btn').forEach(btn => {
        btn.removeEventListener('click', handleFireEmployee);
        btn.addEventListener('click', handleFireEmployee);
    });
}

// Helper functions to prevent duplicate event listeners
function handleHireEmployee(e) {
    const employeeId = e.target.dataset.id;
    if (employeeId) hireEmployee(employeeId);
}

function handleFireEmployee(e) {
    const employeeId = e.target.dataset.id;
    if (employeeId) fireEmployee(employeeId);
}

// Update marketplace tab content - Optimized
function updateMarketplaceTab() {
    // Update stocks content
    updateStocksTab();
    
    // Update crypto content
    updateCryptoTab();
    
    // Update portfolio values
    updatePortfolioValues();
    
    // Add market status only once if it doesn't exist
    const marketplaceContent = document.getElementById('marketplace-content');
    if (marketplaceContent) {
        let existingStatus = document.getElementById('market-status');
        
        if (!existingStatus) {
            existingStatus = document.createElement('div');
            existingStatus.id = 'market-status';
            existingStatus.style.textAlign = 'center';
            existingStatus.style.margin = '10px 0';
            existingStatus.style.fontStyle = 'italic';
            existingStatus.style.color = '#f39c12';
            existingStatus.textContent = 'Prices update automatically every 5 minutes';
            marketplaceContent.insertBefore(existingStatus, marketplaceContent.firstChild);
        }
    }
}

// Switch between stocks and crypto tabs
function switchMarketTab(market) {
    // Hide all market content
    document.querySelectorAll('.market-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all market nav buttons
    document.querySelectorAll('.market-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected market content
    document.getElementById(`${market}-content`).classList.add('active');
    
    // Activate selected market nav button
    document.querySelector(`[data-market="${market}"]`).classList.add('active');
    
    // Update portfolio values if needed
    updatePortfolioValues();
}

// Update stocks tab content
function updateStocksTab() {
    const stocksList = document.getElementById('stocks-list');
    if (!stocksList) return;
    
    stocksList.innerHTML = '';
    const stocks = gameState.marketplace?.stocks || [];
    
    stocks.forEach(stock => {
        if (!stock) return;
        
        const stockItem = document.createElement('div');
        stockItem.className = 'market-item';
        
        // Format price nicely
        const formattedPrice = stock.price >= 1 ? `₱${stock.price.toFixed(2)}` : `₱${stock.price}`;
        
        stockItem.innerHTML = `
            <div class="market-item-header">
                <div class="market-item-name">${stock.name || 'Unknown'}</div>
                <div class="market-item-symbol">(${stock.symbol || 'N/A'})</div>
            </div>
            <div class="market-item-price">${formattedPrice}</div>
            <div class="market-item-stats">
                <span>Volatility: ±${((stock.volatility || 0) * 100).toFixed(1)}%</span>
                <span>Holdings: ${(gameState.marketplace?.portfolio?.stocks?.[stock.id]) || 0}</span>
            </div>
            <div class="market-controls">
                <input type="number" class="market-input" id="buy-stock-amount-${stock.id}" placeholder="Amount to buy" min="1">
                <button class="market-btn buy-stock-btn" data-id="${stock.id}">Buy</button>
                <input type="number" class="market-input" id="sell-stock-amount-${stock.id}" placeholder="Amount to sell" min="1">
                <button class="market-btn sell sell-stock-btn" data-id="${stock.id}">Sell</button>
            </div>
        `;
        
        stocksList.appendChild(stockItem);
    });
    
    // Update portfolio section
    updateStocksPortfolio();
}

// Update crypto tab content
function updateCryptoTab() {
    const cryptoList = document.getElementById('crypto-list');
    if (!cryptoList) return;
    
    cryptoList.innerHTML = '';
    const cryptoAssets = gameState.marketplace?.crypto || [];
    
    cryptoAssets.forEach(crypto => {
        if (!crypto) return;
        
        const cryptoItem = document.createElement('div');
        cryptoItem.className = 'market-item';
        
        // Format price nicely
        let formattedPrice;
        if (crypto.price >= 1) {
            formattedPrice = `₱${crypto.price.toLocaleString('en-PH', {maximumFractionDigits: 2})}`;
        } else if (crypto.price >= 0.01) {
            formattedPrice = `₱${crypto.price.toFixed(4)}`;
        } else if (crypto.price >= 0.0001) {
            formattedPrice = `₱${crypto.price.toFixed(6)}`;
        } else {
            formattedPrice = `₱${crypto.price.toExponential(4)}`;
        }
        
        cryptoItem.innerHTML = `
            <div class="market-item-header">
                <div class="market-item-name">${crypto.name || 'Unknown'}</div>
                <div class="market-item-symbol">(${crypto.symbol || 'N/A'})</div>
            </div>
            <div class="market-item-price">${formattedPrice}</div>
            <div class="market-item-stats">
                <span>Volatility: ±${((crypto.volatility || 0) * 100).toFixed(1)}%</span>
                <span>Holdings: ${((gameState.marketplace?.portfolio?.crypto?.[crypto.id]) || 0).toFixed(6)}</span>
            </div>
            <div class="market-controls">
                <input type="number" class="market-input" id="buy-crypto-amount-${crypto.id}" placeholder="Amount to buy" min="0.000001" step="0.000001">
                <button class="market-btn buy-crypto-btn" data-id="${crypto.id}">Buy</button>
                <input type="number" class="market-input" id="sell-crypto-amount-${crypto.id}" placeholder="Amount to sell" min="0.000001" step="0.000001">
                <button class="market-btn sell sell-crypto-btn" data-id="${crypto.id}">Sell</button>
            </div>
        `;
        
        cryptoList.appendChild(cryptoItem);
    });
    
    // Update portfolio section
    updateCryptoPortfolio();
}

// Update stocks portfolio section
function updateStocksPortfolio() {
    const portfolioList = document.getElementById('stocks-portfolio-list');
    if (!portfolioList) return;
    
    portfolioList.innerHTML = '';
    let hasHoldings = false;
    
    const portfolioStocks = gameState.marketplace?.portfolio?.stocks || {};
    const stocks = gameState.marketplace?.stocks || [];
    
    for (const [stockId, quantity] of Object.entries(portfolioStocks)) {
        if (quantity > 0) {
            hasHoldings = true;
            const stock = stocks.find(s => s.id === stockId);
            if (stock) {
                const value = (stock.price || 0) * quantity;
                const portfolioItem = document.createElement('div');
                portfolioItem.className = 'portfolio-item';
                
                portfolioItem.innerHTML = `
                    <div class="portfolio-item-name">${stock.name || 'Unknown'} (${stock.symbol || 'N/A'})</div>
                    <div class="portfolio-item-amount">${quantity} shares (₱${value.toFixed(2)})</div>
                `;
                
                portfolioList.appendChild(portfolioItem);
            }
        }
    }
    
    if (!hasHoldings) {
        portfolioList.innerHTML = '<div class="empty-state">No stock holdings yet.</div>';
    }
}

// Update crypto portfolio section
function updateCryptoPortfolio() {
    const portfolioList = document.getElementById('crypto-portfolio-list');
    if (!portfolioList) return;
    
    portfolioList.innerHTML = '';
    let hasHoldings = false;
    
    const portfolioCrypto = gameState.marketplace?.portfolio?.crypto || {};
    const cryptoAssets = gameState.marketplace?.crypto || [];
    
    for (const [cryptoId, amount] of Object.entries(portfolioCrypto)) {
        if (amount > 0) {
            hasHoldings = true;
            const crypto = cryptoAssets.find(c => c.id === cryptoId);
            if (crypto) {
                const value = (crypto.price || 0) * amount;
                const portfolioItem = document.createElement('div');
                portfolioItem.className = 'portfolio-item';
                
                portfolioItem.innerHTML = `
                    <div class="portfolio-item-name">${crypto.name || 'Unknown'} (${crypto.symbol || 'N/A'})</div>
                    <div class="portfolio-item-amount">${amount.toFixed(6)} coins (₱${value.toFixed(2)})</div>
                `;
                
                portfolioList.appendChild(portfolioItem);
            }
        }
    }
    
    if (!hasHoldings) {
        portfolioList.innerHTML = '<div class="empty-state">No crypto holdings yet.</div>';
    }
}

// Update portfolio values display
function updatePortfolioValues() {
    const totalValue = calculatePortfolioValue();
    
    // Update stocks portfolio value
    let stocksValue = 0;
    const portfolioStocks = gameState.marketplace?.portfolio?.stocks || {};
    const stocks = gameState.marketplace?.stocks || [];
    
    for (const [stockId, quantity] of Object.entries(portfolioStocks)) {
        if (quantity > 0) {
            const stock = stocks.find(s => s.id === stockId);
            if (stock) {
                stocksValue += (stock.price || 0) * quantity;
            }
        }
    }
    
    // Update crypto portfolio value
    let cryptoValue = 0;
    const portfolioCrypto = gameState.marketplace?.portfolio?.crypto || {};
    const cryptoAssets = gameState.marketplace?.crypto || [];
    
    for (const [cryptoId, amount] of Object.entries(portfolioCrypto)) {
        if (amount > 0) {
            const crypto = cryptoAssets.find(c => c.id === cryptoId);
            if (crypto) {
                cryptoValue += (crypto.price || 0) * amount;
            }
        }
    }
    
    // Update UI elements with null checks
    const portfolioValueEl = document.getElementById('portfolio-value');
    const stocksValueEl = document.getElementById('stocks-value');
    const cryptoPortfolioValueEl = document.getElementById('crypto-portfolio-value');
    const cryptoValueEl = document.getElementById('crypto-value');
    
    if (portfolioValueEl) portfolioValueEl.textContent = totalValue.toFixed(2);
    if (stocksValueEl) stocksValueEl.textContent = stocksValue.toFixed(2);
    if (cryptoPortfolioValueEl) cryptoPortfolioValueEl.textContent = totalValue.toFixed(2);
    if (cryptoValueEl) cryptoValueEl.textContent = cryptoValue.toFixed(2);
    
    // Update transaction history
    updateTransactionHistory();
}

// Update transaction history display
function updateTransactionHistory() {
    const transactionList = document.getElementById('transaction-list');
    if (!transactionList) return;
    
    transactionList.innerHTML = '';
    
    const transactions = gameState.marketplace?.transactions || [];
    if (transactions.length === 0) {
        transactionList.innerHTML = '<div class="empty-state">No transactions yet.</div>';
        return;
    }
    
    // Create table for transactions
    const table = document.createElement('table');
    table.className = 'transaction-table';
    
    table.innerHTML = `
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Asset</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Cost</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;
    
    const tbody = table.querySelector('tbody');
    if (!tbody) return;
    
    // Show last 20 transactions
    const transactionsToShow = transactions.slice(0, 20);
    
    transactionsToShow.forEach(transaction => {
        if (!transaction) return;
        
        const row = document.createElement('tr');
        row.className = `transaction-${transaction.type || 'unknown'}`;
        
        // Format cost (negative for sells)
        const formattedCost = (transaction.cost || 0) < 0 
            ? `-₱${Math.abs(transaction.cost || 0).toFixed(2)}`
            : `₱${(transaction.cost || 0).toFixed(2)}`;
            
        // Format quantity
        const formattedQuantity = transaction.assetType === 'crypto' 
            ? (transaction.quantity || 0).toFixed(6)
            : Math.round(transaction.quantity || 0).toString();
            
        // Format price
        const formattedPrice = `₱${(transaction.price || 0).toFixed(2)}`;
        
        row.innerHTML = `
            <td class="transaction-date">${transaction.date || 'Unknown'}<br><small>${transaction.time || ''}</small></td>
            <td class="${(transaction.type || 'unknown') === 'buy' ? 'transaction-buy' : 'transaction-sell'}">
                ${(transaction.type || 'unknown') === 'buy' ? 'BUY' : 'SELL'}
            </td>
            <td>
                <strong>${transaction.assetSymbol || 'N/A'}</strong><br>
                <small>${transaction.assetName || 'Unknown Asset'}</small>
            </td>
            <td>${formattedQuantity}</td>
            <td class="transaction-price">${formattedPrice}</td>
            <td class="transaction-cost">${formattedCost}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    transactionList.appendChild(table);
}

// Update inventory tab content
function updateInventoryTab() {
    document.getElementById('inventory-money').textContent = gameState.inventory.money.toLocaleString();
    document.getElementById('savings-amount').textContent = gameState.inventory.savings.toLocaleString();
    document.getElementById('licenses-count').textContent = gameState.businesses.length;
    document.getElementById('equipment-count').textContent = 0; // Placeholder
}

// Upgrade a business
function upgradeBusiness(businessId) {
    const business = gameState.businesses.find(b => b.id === businessId);
    if (!business) return;
    
    const businessDef = businessDefinitions[business.type];
    const upgradeCost = businessDef.upgradeCost * business.level;
    
    if (gameState.money < upgradeCost) {
        alert(`Not enough money! Upgrading costs ₱${upgradeCost}.`);
        return;
    }
    
    gameState.money -= upgradeCost;
    business.level++;
    
    updateUI();
    
    // Show notification
    if (gameState.settings.notifications) {
        showNotification(`${business.name} upgraded to level ${business.level}!`);
    }
}

// Assign employee to business
function assignEmployeeToBusiness(businessId) {
    const business = gameState.businesses.find(b => b.id === businessId);
    if (!business) return;
    
    if (gameState.employees.length === 0) {
        alert('You have no employees to assign!');
        return;
    }
    
    // For simplicity, assign the first available employee that isn't already assigned
    const availableEmployee = gameState.employees.find(emp => 
        !gameState.businesses.some(b => b.employeeId === emp.id)
    );
    
    if (!availableEmployee) {
        alert('No available employees to assign!');
        return;
    }
    
    business.employeeId = availableEmployee.id;
    
    updateUI();
    
    // Show notification
    if (gameState.settings.notifications) {
        showNotification(`${availableEmployee.name} assigned to ${business.name}!`);
    }
}

// Fire an employee
function fireEmployee(employeeId) {
    if (!confirm('Are you sure you want to fire this employee?')) {
        return;
    }
    
    // Remove employee assignment from businesses
    gameState.businesses.forEach(business => {
        if (business.employeeId == employeeId) {
            business.employeeId = null;
        }
    });
    
    // Remove employee from list
    gameState.employees = gameState.employees.filter(emp => emp.id != employeeId);
    
    updateUI();
    
    // Show notification
    if (gameState.settings.notifications) {
        showNotification('Employee fired!');
    }
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Mini-game system
let currentMiniGame = null;
let miniGameScore = 0;
let miniGameState = {
    math: { played: 0, won: 0 },
    reaction: { played: 0, best: 0 },
    trivia: { played: 0, won: 0 }
};

// Open mini-game modal
function openMiniGameModal(gameType) {
    const modal = document.getElementById('mini-game-modal');
    const content = document.getElementById('mini-game-content');
    
    // Set modal title
    const titles = {
        'math': 'Math Puzzle Challenge',
        'reaction': 'Reaction Time Test',
        'trivia': 'Filipino Trivia'
    };
    
    document.getElementById('mini-game-title').innerHTML = `<i class="fas fa-gamepad"></i> ${titles[gameType] || 'Mini Game'}`;
    
    // Load game content based on type
    switch(gameType) {
        case 'math':
            loadMathPuzzleGame(content);
            break;
        case 'reaction':
            loadReactionTimeGame(content);
            break;
        case 'trivia':
            loadTriviaGame(content);
            break;
        default:
            content.innerHTML = '<p>Game not available</p>';
    }
    
    currentMiniGame = gameType;
    miniGameScore = 0;
    
    // Show modal with animation
    modal.classList.add('active');
}

// Close mini-game modal
function closeMiniGameModal() {
    const modal = document.getElementById('mini-game-modal');
    modal.classList.remove('active');
    currentMiniGame = null;
}

// Close mini-game modal
function closeMiniGameModal() {
    const modal = document.getElementById('mini-game-modal');
    modal.classList.remove('active');
    currentMiniGame = null;
}

// Initialize the game and set up event listeners
function initGame() {
    loadGame();
    initTavernSystem();
    initMarketplace();
    updateUI();
    
    // Set up intervals for game updates
    setInterval(updateGame, 1000); // Update every second
    setInterval(earnBusinessIncome, 60000); // Earn business income every minute
    setInterval(updateMarketPrices, 300000); // Update market prices every 5 minutes
    
    // Set up tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Set up job buttons
    const jobButtons = document.querySelectorAll('.job-duration-btn');
    jobButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobCard = e.target.closest('.job-card');
            if (!jobCard) return;
            
            const jobType = jobCard.dataset.job;
            const duration = parseInt(e.target.dataset.duration);
            if (jobType && !isNaN(duration)) {
                startJob(jobType, duration);
            }
        });
    });
    
    // Set up business start buttons
    const businessButtons = document.querySelectorAll('.start-business-btn');
    businessButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const businessCard = e.target.closest('.business-type-card');
            if (!businessCard) return;
            
            const businessType = businessCard.dataset.business;
            if (businessType) {
                startBusiness(businessType);
            }
        });
    });
    
    // Set up cancel activity button
    const cancelBtn = document.getElementById('cancel-activity-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelActivity);
    }
    
    // Set up event delegation for dynamic elements
    document.addEventListener('click', function(e) {
        // Set up expand business buttons
        if (e.target.classList.contains('upgrade-business-btn')) {
            const businessId = e.target.dataset.id;
            if (businessId) {
                upgradeBusiness(businessId);
            }
        }
        
        // Set up assign employee buttons
        if (e.target.classList.contains('assign-employee-btn')) {
            const businessId = e.target.dataset.id;
            if (businessId) {
                assignEmployeeToBusiness(businessId);
            }
        }
        
        // Set up fire employee buttons
        if (e.target.classList.contains('fire-employee-btn')) {
            const employeeId = e.target.dataset.id;
            if (employeeId) {
                fireEmployee(employeeId);
            }
        }
        
        // Set up hire employee buttons
        if (e.target.classList.contains('hire-employee-btn')) {
            const employeeId = e.target.dataset.id;
            if (employeeId) {
                hireEmployee(employeeId);
            }
        }
        
        // Set up marketplace buttons
        if (e.target.classList.contains('buy-stock-btn')) {
            const stockId = e.target.dataset.id;
            if (stockId) {
                const input = document.querySelector(`#buy-stock-amount-${stockId}`);
                if (input) {
                    const amount = parseInt(input.value);
                    if (!isNaN(amount) && amount > 0) {
                        buyStock(stockId, amount);
                    } else {
                        alert('Please enter a valid amount');
                    }
                }
            }
        }
        
        if (e.target.classList.contains('sell-stock-btn')) {
            const stockId = e.target.dataset.id;
            if (stockId) {
                const input = document.querySelector(`#sell-stock-amount-${stockId}`);
                if (input) {
                    const amount = parseInt(input.value);
                    if (!isNaN(amount) && amount > 0) {
                        sellStock(stockId, amount);
                    } else {
                        alert('Please enter a valid amount');
                    }
                }
            }
        }
        
        if (e.target.classList.contains('buy-crypto-btn')) {
            const cryptoId = e.target.dataset.id;
            if (cryptoId) {
                const input = document.querySelector(`#buy-crypto-amount-${cryptoId}`);
                if (input) {
                    const amount = parseFloat(input.value);
                    if (!isNaN(amount) && amount > 0) {
                        buyCrypto(cryptoId, amount);
                    } else {
                        alert('Please enter a valid amount');
                    }
                }
            }
        }
        
        if (e.target.classList.contains('sell-crypto-btn')) {
            const cryptoId = e.target.dataset.id;
            if (cryptoId) {
                const input = document.querySelector(`#sell-crypto-amount-${cryptoId}`);
                if (input) {
                    const amount = parseFloat(input.value);
                    if (!isNaN(amount) && amount > 0) {
                        sellCrypto(cryptoId, amount);
                    } else {
                        alert('Please enter a valid amount');
                    }
                }
            }
        }
        
        // Set up mini-game buttons
        if (e.target.classList.contains('start-mini-game-btn')) {
            const gameType = e.target.dataset.game;
            if (gameType) {
                openMiniGameModal(gameType);
            }
        }
    });
    
    // Set up modal close button
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeMiniGameModal);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('mini-game-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target.id === 'mini-game-modal') {
                closeMiniGameModal();
            }
        });
    }
    
    // Set up additional UI elements
    setupJobSearch();
    setupInventoryControls();
    setupPALUGANControls();
}

// Set up inventory controls
function setupInventoryControls() {
    const saveMoneyBtn = document.getElementById('save-money-btn');
    const withdrawMoneyBtn = document.getElementById('withdraw-money-btn');
    
    if (saveMoneyBtn) {
        saveMoneyBtn.addEventListener('click', () => {
            const amount = prompt('How much would you like to save?');
            if (amount && !isNaN(amount) && amount > 0) {
                saveMoneyToAccount(parseInt(amount));
            }
        });
    }
    
    if (withdrawMoneyBtn) {
        withdrawMoneyBtn.addEventListener('click', () => {
            const amount = prompt('How much would you like to withdraw?');
            if (amount && !isNaN(amount) && amount > 0) {
                withdrawMoneyFromAccount(parseInt(amount));
            }
        });
    }
}

// Set up PALUGAN controls
function setupPALUGANControls() {
    const joinPaluganBtn = document.getElementById('join-palugan-btn');
    const contributePaluganBtn = document.getElementById('contribute-palugan-btn');
    
    if (joinPaluganBtn) {
        joinPaluganBtn.addEventListener('click', joinPalugan);
    }
    
    if (contributePaluganBtn) {
        contributePaluganBtn.addEventListener('click', () => {
            const amount = parseInt(document.getElementById('palugan-contribution').value);
            if (!isNaN(amount) && amount > 0) {
                contributeToPalugan(amount);
            } else {
                alert('Please enter a valid contribution amount.');
            }
        });
    }
}

// Save money to savings account
function saveMoneyToAccount(amount) {
    if (amount > gameState.money) {
        alert('You don\'t have that much money to save!');
        return;
    }
    
    gameState.money -= amount;
    gameState.inventory.savings += amount;
    
    if (gameState.settings.notifications) {
        showNotification(`Saved ₱${amount} to your savings account.`);
    }
    
    updateUI();
}

// Withdraw money from savings account
function withdrawMoneyFromAccount(amount) {
    if (amount > gameState.inventory.savings) {
        alert('You don\'t have that much in your savings account!');
        return;
    }
    
    gameState.money += amount;
    gameState.inventory.savings -= amount;
    
    if (gameState.settings.notifications) {
        showNotification(`Withdrew ₱${amount} from your savings account.`);
    }
    
    updateUI();
}

// Refresh employee list using Bayanihan points
function refreshEmployeesWithBayanihan() {
    if (bayanihanPoints < 50) {
        alert('You need at least 50 Bayanihan points to refresh employees!');
        return;
    }
    
    bayanihanPoints -= 50;
    generateNewEmployees();
    
    if (gameState.settings.notifications) {
        showNotification('Used 50 Bayanihan points to refresh employee list!');
    }
    
    updateUI();
}

// Math Puzzle Game
function loadMathPuzzleGame(container) {
    container.innerHTML = `
        <div class="mini-game-container">
            <h3>Solve the math problem to earn money!</h3>
            <div class="mini-game-question" id="math-question">Loading...</div>
            <input type="number" class="mini-game-input" id="math-answer" placeholder="Enter your answer">
            <div class="mini-game-feedback" id="math-feedback"></div>
            <div class="mini-game-score">Score: ₱<span id="math-score">0</span></div>
            <div class="mini-game-controls">
                <button class="mini-game-btn main-action" id="submit-math-answer">Submit Answer</button>
                <button class="mini-game-btn secondary-action" id="new-math-question">New Question</button>
            </div>
        </div>
    `;
    
    // Generate first question
    generateMathQuestion();
    
    // Set up event listeners
    document.getElementById('submit-math-answer').addEventListener('click', checkMathAnswer);
    document.getElementById('new-math-question').addEventListener('click', generateMathQuestion);
    
    // Allow Enter key to submit
    document.getElementById('math-answer').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkMathAnswer();
        }
    });
}

// Generate math question
function generateMathQuestion() {
    const difficulty = Math.min(3, Math.floor(miniGameScore / 10) + 1); // Increase difficulty with score
    let num1, num2, operator, answer;
    
    switch(difficulty) {
        case 1: // Easy: Addition/subtraction with small numbers
            num1 = Math.floor(Math.random() * 20) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
            operator = Math.random() > 0.5 ? '+' : '-';
            answer = operator === '+' ? num1 + num2 : num1 - num2;
            break;
        case 2: // Medium: Multiplication/division with medium numbers
            num1 = Math.floor(Math.random() * 15) + 1;
            num2 = Math.floor(Math.random() * 15) + 1;
            operator = Math.random() > 0.5 ? '*' : '/';
            if (operator === '/') {
                // Ensure division results in whole number
                num1 = num1 * num2;
            }
            answer = operator === '+' ? num1 + num2 : 
                     operator === '-' ? num1 - num2 :
                     operator === '*' ? num1 * num2 :
                     num1 / num2;
            break;
        case 3: // Hard: Mixed operations with larger numbers
            num1 = Math.floor(Math.random() * 30) + 1;
            num2 = Math.floor(Math.random() * 30) + 1;
            operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
            if (operator === '/') {
                // Ensure division results in whole number
                num1 = num1 * num2;
            }
            answer = operator === '+' ? num1 + num2 : 
                     operator === '-' ? num1 - num2 :
                     operator === '*' ? num1 * num2 :
                     num1 / num2;
            break;
    }
    
    document.getElementById('math-question').textContent = `${num1} ${operator} ${num2} = ?`;
    document.getElementById('math-answer').value = '';
    document.getElementById('math-feedback').textContent = '';
    document.getElementById('math-answer').focus();
}

// Check math answer
function checkMathAnswer() {
    const questionText = document.getElementById('math-question').textContent;
    const answerInput = document.getElementById('math-answer').value;
    const feedback = document.getElementById('math-feedback');
    const scoreDisplay = document.getElementById('math-score');
    
    if (!answerInput) {
        feedback.textContent = 'Please enter an answer';
        feedback.className = 'mini-game-feedback incorrect';
        return;
    }
    
    const answer = parseInt(answerInput);
    const parts = questionText.split(' ');
    const num1 = parseInt(parts[0]);
    const operator = parts[1];
    const num2 = parseInt(parts[2]);
    
    let correctAnswer;
    switch(operator) {
        case '+': correctAnswer = num1 + num2; break;
        case '-': correctAnswer = num1 - num2; break;
        case '*': correctAnswer = num1 * num2; break;
        case '/': correctAnswer = num1 / num2; break;
    }
    
    if (answer === correctAnswer) {
        // Correct answer
        const reward = 5 + Math.floor(miniGameScore / 5); // Increase reward with score
        miniGameScore += reward;
        gameState.money += reward;
        feedback.textContent = `Correct! You earned ₱${reward}`;
        feedback.className = 'mini-game-feedback correct';
        scoreDisplay.textContent = miniGameScore;
        updateUI();
        setTimeout(generateMathQuestion, 1500);
    } else {
        // Incorrect answer
        feedback.textContent = `Incorrect! The answer was ${correctAnswer}`;
        feedback.className = 'mini-game-feedback incorrect';
        setTimeout(generateMathQuestion, 1500);
    }
}

// Reaction Time Game
function loadReactionTimeGame(container) {
    container.innerHTML = `
        <div class="mini-game-container">
            <h3>Test your reaction time!</h3>
            <p>Click the button when it turns green. The faster you react, the more you earn!</p>
            <div class="mini-game-timer" id="reaction-timer">Ready...</div>
            <button class="mini-game-btn main-action" id="reaction-button" style="background: #f39c12; height: 100px; font-size: 1.5rem;">
                WAIT FOR GREEN
            </button>
            <div class="mini-game-score">Best Time: <span id="reaction-best">-</span>ms | Earnings: ₱<span id="reaction-earnings">0</span></div>
        </div>
    `;
    
    const button = document.getElementById('reaction-button');
    const timer = document.getElementById('reaction-timer');
    let startTime, timeoutId;
    let gameActive = false;
    let waiting = false;
    
    button.addEventListener('click', function() {
        if (waiting) {
            // Too early!
            clearTimeout(timeoutId);
            timer.textContent = 'Too early! -10 points';
            miniGameScore = Math.max(0, miniGameScore - 10);
            document.getElementById('reaction-earnings').textContent = miniGameScore;
            waiting = false;
            gameActive = false;
            setTimeout(startReactionGame, 2000);
        } else if (gameActive) {
            // Success!
            const reactionTime = Date.now() - startTime;
            const points = Math.max(1, 100 - Math.floor(reactionTime / 10));
            miniGameScore += points;
            gameState.money += points;
            
            // Update best time
            const bestDisplay = document.getElementById('reaction-best');
            if (bestDisplay.textContent === '-' || reactionTime < parseInt(bestDisplay.textContent)) {
                bestDisplay.textContent = reactionTime;
            }
            
            timer.textContent = `Reaction Time: ${reactionTime}ms | +₱${points}`;
            document.getElementById('reaction-earnings').textContent = miniGameScore;
            gameActive = false;
            updateUI();
            setTimeout(startReactionGame, 2000);
        } else {
            // Start the game
            startReactionGame();
        }
    });
    
    function startReactionGame() {
        button.textContent = 'WAIT FOR GREEN';
        button.style.background = '#f39c12';
        timer.textContent = 'Get Ready...';
        gameActive = false;
        waiting = false;
        
        // Random delay before turning green
        timeoutId = setTimeout(function() {
            button.textContent = 'CLICK NOW!';
            button.style.background = '#27ae60';
            timer.textContent = 'GO!';
            startTime = Date.now();
            gameActive = true;
            waiting = false;
        }, 1000 + Math.random() * 3000); // 1-4 seconds delay
        
        waiting = true;
    }
}

// Trivia Game
function loadTriviaGame(container) {
    // Filipino trivia questions with more Filipino culture
    const triviaQuestions = [
        { q: "What is the capital city of the Philippines?", a: ["Manila", "Quezon City", "Cebu City", "Davao City"], correct: 0 },
        { q: "What is the national language of the Philippines?", a: ["English", "Tagalog", "Filipino", "Cebuano"], correct: 2 },
        { q: "Which Filipino hero is known as the 'Father of Philippine Independence'?", a: ["Andres Bonifacio", "Emilio Aguinaldo", "Jose Rizal", "Apolinario Mabini"], correct: 2 },
        { q: "What is the currency of the Philippines?", a: ["Dollar", "Peso", "Rupee", "Ringgit"], correct: 1 },
        { q: "Which is the longest river in the Philippines?", a: ["Pasig River", "Cagayan River", "Pampanga River", "Agno River"], correct: 1 },
        { q: "What is the highest mountain in the Philippines?", a: ["Mount Apo", "Mount Pulag", "Mount Kitanglad", "Mount Banahaw"], correct: 0 },
        { q: "Which province is known as the 'Heart of the Philippines'?", a: ["Laguna", "Batangas", "Bulacan", "Quezon"], correct: 2 },
        { q: "What is the largest island in the Philippines?", a: ["Mindanao", "Luzon", "Visayas", "Palawan"], correct: 1 },
        { q: "Which Filipino festival is known as the 'Mother of all Philippine Festivals'?", a: ["Ati-Atihan", "Sinulog", "Pahiyas", "Panagbenga"], correct: 0 },
        { q: "Who is the current President of the Philippines?", a: ["Rodrigo Duterte", "Benigno Aquino III", "Gloria Arroyo", "Ferdinand Marcos Jr."], correct: 3 },
        { q: "What does 'Bayanihan' mean in Filipino culture?", a: ["Community feast", "Cooperation", "Barter trade", "Festival dance"], correct: 1 },
        { q: "What is the traditional Filipino value of 'utang na loob'?", a: ["Hospitality", "Debt of gratitude", "Respect for elders", "Hospitality"], correct: 1 },
        { q: "What is the Filipino concept of 'pakikipagkunware'?", a: ["Self-sacrifice", "Group-centeredness", "Face-saving", "Hospitality"], correct: 2 },
        { q: "Which Filipino dish is made of marinated meat, usually pork or chicken, cooked on a skewer?", a: ["Lechon", "Kare-kare", "Inihaw", "Isaw"], correct: 3 },
        { q: "What is the national flower of the Philippines?", a: ["Sampaguita", "Rose", "Orchid", "Gumamela"], correct: 0 },
        { q: "What is the national tree of the Philippines?", a: ["Narra", "Balete", "Molave", "Banaba"], correct: 0 },
        { q: "What does 'Pasko' mean in English?", a: ["New Year", "Birthday", "Christmas", "Harvest"], correct: 2 },
        { q: "What is a 'barangay' in the Philippines?", a: ["Province", "City", "Municipality", "Village"], correct: 3 },
        { q: "What is the Filipino word for 'thank you'?", a: ["Salamat", "Maraming salamat", "Both A and B", "Okay"], correct: 2 },
        { q: "Which Filipino holiday is celebrated on December 30?", a: ["New Year", "Rizal Day", "Christmas", "All Saints Day"], correct: 1 }
    ];
    
    container.innerHTML = `
        <div class="mini-game-container">
            <h3>Filipino Trivia Challenge</h3>
            <p>Answer questions about Philippine culture and history to earn money!</p>
            <div class="mini-game-question" id="trivia-question">Loading...</div>
            <div class="mini-game-options" id="trivia-options">
                <!-- Options will be populated here -->
            </div>
            <div class="mini-game-feedback" id="trivia-feedback"></div>
            <div class="mini-game-score">Score: ₱<span id="trivia-score">0</span> | Questions: <span id="trivia-count">0</span>/10</div>
        </div>
    `;
    
    let currentQuestion = 0;
    let questionsAnswered = 0;
    
    function loadTriviaQuestion() {
        if (currentQuestion >= triviaQuestions.length) {
            // Game over
            document.getElementById('trivia-question').textContent = "Trivia Challenge Complete!";
            document.getElementById('trivia-options').innerHTML = '';
            document.getElementById('trivia-feedback').textContent = `Final Score: ₱${miniGameScore}`;
            return;
        }
        
        const question = triviaQuestions[currentQuestion];
        document.getElementById('trivia-question').textContent = question.q;
        
        const optionsContainer = document.getElementById('trivia-options');
        optionsContainer.innerHTML = '';
        
        question.a.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'mini-game-option';
            button.textContent = option;
            button.dataset.index = index;
            button.addEventListener('click', function() {
                checkTriviaAnswer(index);
            });
            optionsContainer.appendChild(button);
        });
        
        document.getElementById('trivia-feedback').textContent = '';
        document.getElementById('trivia-count').textContent = questionsAnswered;
    }
    
    function checkTriviaAnswer(selectedIndex) {
        const question = triviaQuestions[currentQuestion];
        const feedback = document.getElementById('trivia-feedback');
        const scoreDisplay = document.getElementById('trivia-score');
        
        if (selectedIndex === question.correct) {
            // Correct answer
            const reward = 20 + Math.floor(miniGameScore / 10);
            miniGameScore += reward;
            gameState.money += reward;
            feedback.textContent = `Correct! You earned ₱${reward}`;
            feedback.className = 'mini-game-feedback correct';
        } else {
            // Incorrect answer
            feedback.textContent = `Incorrect! The correct answer was: ${question.a[question.correct]}`;
            feedback.className = 'mini-game-feedback incorrect';
        }
        
        questionsAnswered++;
        document.getElementById('trivia-count').textContent = questionsAnswered;
        scoreDisplay.textContent = miniGameScore;
        
        // Move to next question after delay
        currentQuestion++;
        setTimeout(loadTriviaQuestion, 2000);
    }
    
    // Load first question
    loadTriviaQuestion();
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Update game state periodically - Optimized
function updateGame() {
    const now = Date.now();
    
    if (gameState.currentActivity && gameState.activityEndTime) {
        if (now >= gameState.activityEndTime) {
            // Activity completed
            if (gameState.currentActivity.type === 'job') {
                completeJob();
            }
        } else {
            // Only update UI every 1000ms to reduce performance impact
            if (Math.floor(now / 1000) !== Math.floor((now - 1000) / 1000)) {
                updateUI();
            }
        }
    } else {
        // Update UI less frequently when no activities are running
        if (Math.floor(now / 2000) !== Math.floor((now - 2000) / 2000)) {
            updateUI();
        }
    }
    
    // Refresh tavern employees if needed
    refreshTavernEmployees();
    
    // Save game less frequently to reduce performance impact
    if (Math.floor(now / 30000) !== Math.floor((now - 30000) / 30000)) {
        saveGame();
    }
}

// Save game to localStorage with background processing data
function saveGame() {
    const saveData = {
        gameState: gameState,
        timestamp: Date.now(),
        availableEmployees: availableEmployees,
        nextEmployeeRefresh: nextEmployeeRefresh
    };
    
    localStorage.setItem('phBusinessRPGSave', JSON.stringify(saveData));
}

// Load game from localStorage and process background events
function loadGame() {
    const saveData = localStorage.getItem('phBusinessRPGSave');
    
    if (saveData) {
        try {
            const parsedData = JSON.parse(saveData);
            Object.assign(gameState, parsedData.gameState);
            
            // Initialize marketplace if not present
            if (!gameState.marketplace) {
                gameState.marketplace = {
                    stocks: [],
                    crypto: [],
                    portfolio: {
                        stocks: {},
                        crypto: {}
                    },
                    transactions: []
                };
            }
            
            // Initialize transactions if not present
            if (!gameState.marketplace.transactions) {
                gameState.marketplace.transactions = [];
            }
            
            // Restore tavern system state
            if (parsedData.availableEmployees) {
                availableEmployees = parsedData.availableEmployees;
            }
            
            if (parsedData.nextEmployeeRefresh) {
                nextEmployeeRefresh = parsedData.nextEmployeeRefresh;
            } else {
                // If nextEmployeeRefresh is not in the save data, initialize it
                initTavernSystem();
            }
            
            // Calculate time passed since last save
            const timeNow = Date.now();
            const timeSaved = parsedData.timestamp || timeNow;
            const timePassed = timeNow - timeSaved;
            
            // Process background events for the time passed
            processBackgroundEvents(timePassed);
            
            // Reset activity if expired
            if (gameState.activityEndTime && timeNow >= gameState.activityEndTime) {
                // Complete the job if it's expired
                if (gameState.currentActivity && gameState.currentActivity.type === 'job') {
                    // Calculate partial completion based on time passed
                    const actualDuration = (gameState.activityEndTime - (timeNow - timePassed)) / (60 * 1000); // in minutes
                    const originalDuration = gameState.currentActivity.duration;
                    
                    if (timeNow > timeSaved) { // Only process if time has passed
                        // Complete the job properly
                        const elapsed = timeNow - (gameState.activityEndTime - gameState.currentActivity.duration * 60 * 1000);
                        const elapsedMinutes = Math.floor(elapsed / 60000);
                        
                        if (elapsedMinutes >= originalDuration) {
                            // Complete job properly
                            completeJob();
                        } else {
                            // Job was interrupted, reset
                            gameState.currentActivity = null;
                            gameState.activityEndTime = null;
                        }
                    }
                } else {
                    // Reset activity if expired
                    gameState.currentActivity = null;
                    gameState.activityEndTime = null;
                }
            }
            
        } catch (e) {
            console.error('Error loading save data:', e);
            // If there's an error, start with default state
            console.log('Starting with default game state');
            initTavernSystem();
        }
    } else {
        // If no save data, initialize tavern system
        initTavernSystem();
    }
    
    updateUI();
}

// Process background events for the time that passed
function processBackgroundEvents(timePassedMs) {
    if (timePassedMs <= 0) return;
    
    const timePassedMinutes = Math.floor(timePassedMs / 60000); // Convert milliseconds to minutes
    
    if (timePassedMinutes <= 0) return;
    
    // Process business income for the time passed
    const now = Date.now();
    gameState.businesses.forEach(business => {
        // Calculate the income for this business for the time passed
        const businessDef = businessDefinitions[business.type];
        const skillBonus = calculateBusinessSkillBonus(business.type);
        const employeeBonus = calculateEmployeeBonus(business.id);
        
        // Calculate income per minute
        const incomePerMinute = businessDef.baseIncome * skillBonus * employeeBonus / 60;
        const income = Math.floor(incomePerMinute * timePassedMinutes);
        
        // Update business stats
        business.totalProfit += income;
        business.customersServed += Math.floor(timePassedMinutes / 2); // Simulate customers
        
        // Add to player money
        gameState.money += income;
        gameState.inventory.money += income;
        
        // Update last income time to now (the current time)
        business.lastIncome = now;
        
        // Level up business based on total profit
        if (business.totalProfit > business.level * 10000) {
            business.level++;
        }
    });
    
    // Process any pending tavern refreshes
    if (nextEmployeeRefresh && Date.now() >= nextEmployeeRefresh) {
        generateNewEmployees();
        nextEmployeeRefresh = Date.now() + 24 * 60 * 60 * 1000; // Set next refresh to 24 hours from now
        
        // Show notification if the game window is active
        if (gameState.settings.notifications) {
            showNotification('New employees are available at the tavern!');
        }
    }
}

// Initialize the game when the page loads with proper error handling
function initializeGameWhenReady() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        // DOM is already loaded, run init immediately
        initGame();
    }
}

// Initialize the game when the page loads
initializeGameWhenReady();