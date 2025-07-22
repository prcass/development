/**
 * Outrank Automated Test System v2
 * A clean, modern implementation with best practices
 * 
 * Features:
 * - Realistic player behavior simulation
 * - Random blocking decisions
 * - Comprehensive error collection
 * - UI updates with headless option
 * - Detailed logging and validation
 */

class OutrankAutomatedTest {
    constructor(config = {}) {
        this.config = {
            // Test configuration
            playerCount: 4,
            playerNames: ['Alice', 'Bob', 'Charlie', 'Diana'],
            maxRounds: 6,
            
            // Behavior configuration
            bidStrategy: 'realistic',      // How players bid
            blockFrequency: 0.4,           // 40% chance to block
            rankingAccuracy: 0.7,          // 70% chance to rank correctly
            
            // Display configuration
            showUI: true,                  // Show UI updates
            uiDelay: 300,                  // Milliseconds between UI updates
            logLevel: 'normal',            // minimal, normal, detailed
            
            // Validation configuration
            validateEachStep: true,
            collectAllErrors: true,        // Don't stop on first error
            
            ...config
        };
        
        // Test state
        this.testId = `test_${Date.now()}`;
        this.startTime = null;
        this.endTime = null;
        this.currentRound = 0;
        this.currentPhase = null;
        this.errors = [];
        this.warnings = [];
        
        // Results tracking
        this.results = {
            testId: this.testId,
            config: { ...this.config },
            rounds: [],
            playerStats: {},
            errors: [],
            warnings: [],
            summary: null
        };
        
        // Initialize player stats
        this.config.playerNames.forEach(name => {
            this.results.playerStats[name] = {
                bidsWon: 0,
                bidsSuccessful: 0,
                blocksMade: 0,
                blocksWon: 0,
                tokensGained: 0,
                tokensOwned: 0,
                score: 0
            };
        });
    }
    
    // Main test execution
    async run() {
        try {
            this.log('🚀 Starting Outrank Automated Test v2', 'info');
            this.startTime = Date.now();
            
            // Setup game
            await this.setupGame();
            
            // Play rounds
            for (let round = 1; round <= this.config.maxRounds; round++) {
                this.currentRound = round;
                const roundSuccess = await this.playRound(round);
                
                if (!roundSuccess && !this.config.collectAllErrors) {
                    break;
                }
                
                // Check if game should end
                if (this.shouldEndGame()) {
                    this.log('Game ending condition met', 'info');
                    break;
                }
            }
            
            // Finalize test
            await this.finalizeTest();
            
            return this.results;
            
        } catch (error) {
            this.handleCriticalError(error);
            return this.results;
        }
    }
    
    // Setup game with test players
    async setupGame() {
        this.log('Setting up game...', 'info');
        
        try {
            // Initialize new game
            if (typeof newGame === 'function') {
                newGame();
            } else {
                throw new Error('newGame function not found');
            }
            
            // Wait for UI if needed
            await this.delay(200);
            
            // Show player setup screen
            if (typeof showScreen === 'function') {
                showScreen('playerScreen');
                await this.delay(100);
            }
            
            // Add test players using the game's player system
            const playersList = [];
            for (const playerName of this.config.playerNames) {
                playersList.push(playerName);
            }
            
            // Set players in GameState directly
            GameState.set('players.list', playersList);
            
            // Initialize player data structures
            const players = { scores: {}, blockingTokens: {}, stats: {}, ownedCards: {} };
            
            playersList.forEach(playerName => {
                players.scores[playerName] = 0;
                players.blockingTokens[playerName] = { 2: 1, 4: 1, 6: 1 };
                players.stats[playerName] = {
                    bidsWon: 0,
                    bidsSuccessful: 0,
                    bidAttempts: 0,
                    bidsPassed: 0,
                    blocksMade: 0,
                    blocksWon: 0,
                    blocksLost: 0,
                    blockingPointsEarned: 0,
                    tokensGained: 0,
                    tokensLost: 0,
                    cardsUsed: 0
                };
                players.ownedCards[playerName] = {
                    countries: [],
                    movies: [],
                    sports: [],
                    companies: []
                };
            });
            
            // Set player data in GameState
            GameState.set('players.scores', players.scores);
            GameState.set('players.blockingTokens', players.blockingTokens);
            GameState.set('players.stats', players.stats);
            GameState.set('players.ownedCards', players.ownedCards);
            
            this.log(`Added players: ${playersList.join(', ')}`, 'info');
            
            // Start the game by going to category selection
            if (typeof showScreen === 'function') {
                showScreen('categoryScreen');
                await this.delay(this.config.showUI ? this.config.uiDelay : 0);
            }
            
            this.log('✅ Game setup complete', 'success');
            
        } catch (error) {
            this.recordError('SETUP_ERROR', error.message, { phase: 'setup' });
            throw error;
        }
    }
    
    // Play a single round
    async playRound(roundNumber) {
        const roundData = {
            round: roundNumber,
            category: null,
            bidWinner: null,
            bidAmount: null,
            bidSuccess: null,
            blocks: [],
            scores: {},
            errors: [],
            startTime: Date.now()
        };
        
        try {
            this.log(`\n📍 ROUND ${roundNumber} STARTING`, 'header');
            
            // Phase 1: Category Selection
            await this.selectCategory();
            roundData.category = GameState.get('currentCategory') || 'unknown';
            this.log(`Category: ${roundData.category}`, 'info');
            
            // Phase 2: Bidding
            const bidResult = await this.executeBidding();
            if (!bidResult) {
                this.recordError('BIDDING_FAILED', 'No valid bid winner', { round: roundNumber });
                return false;
            }
            
            roundData.bidWinner = bidResult.winner;
            roundData.bidAmount = bidResult.amount;
            this.log(`Bid winner: ${bidResult.winner} with ${bidResult.amount} cards`, 'info');
            
            // Phase 3: Blocking
            const blockResults = await this.executeBlocking(bidResult.winner);
            roundData.blocks = blockResults;
            
            // Phase 4: Card Selection
            const selectedCards = await this.selectCards(bidResult.winner, bidResult.amount);
            
            // Phase 5: Ranking
            const rankingResult = await this.executeRanking(bidResult.winner, selectedCards);
            roundData.bidSuccess = rankingResult.success;
            
            // Phase 6: Scoring
            await this.calculateScoring(rankingResult, blockResults);
            
            // Phase 7: Validation
            if (this.config.validateEachStep) {
                this.validateRoundIntegrity(roundData);
            }
            
            // Record round results
            roundData.endTime = Date.now();
            roundData.duration = roundData.endTime - roundData.startTime;
            this.results.rounds.push(roundData);
            
            this.log(`✅ Round ${roundNumber} complete (${roundData.duration}ms)`, 'success');
            return true;
            
        } catch (error) {
            this.recordError('ROUND_ERROR', error.message, { round: roundNumber, phase: this.currentPhase });
            roundData.errors.push(error.message);
            this.results.rounds.push(roundData);
            
            if (!this.config.collectAllErrors) {
                throw error;
            }
            
            return false;
        }
    }
    
    // Execute bidding phase
    async executeBidding() {
        this.currentPhase = 'bidding';
        this.log('Starting bidding phase...', 'phase');
        
        const players = [...this.config.playerNames];
        let currentBid = 0;
        let highestBidder = null;
        let passCount = 0;
        
        // Randomize starting player
        const startIndex = Math.floor(Math.random() * players.length);
        
        for (let i = 0; i < players.length * 2; i++) { // Max 2 rounds of bidding
            const playerIndex = (startIndex + i) % players.length;
            const player = players[playerIndex];
            
            // Skip if already passed
            if (GameState.get(`players.passed.${player}`)) {
                continue;
            }
            
            // Decide whether to bid or pass
            const shouldBid = this.decideBid(player, currentBid);
            
            if (shouldBid.bid) {
                currentBid = shouldBid.amount;
                highestBidder = player;
                
                // Make the bid - store in GameState
                GameState.set('currentBid', currentBid);
                GameState.set('highestBidder', highestBidder);
                
                await this.makeBid(player, currentBid);
                this.log(`${player} bids ${currentBid}`, 'action');
                
            } else {
                // Pass
                await this.passBid(player);
                this.log(`${player} passes`, 'action');
                passCount++;
            }
            
            // Check if bidding is complete
            if (passCount >= players.length - 1) {
                break;
            }
        }
        
        if (!highestBidder) {
            this.recordWarning('NO_BIDDER', 'All players passed');
            return null;
        }
        
        return {
            winner: highestBidder,
            amount: currentBid
        };
    }
    
    // Execute blocking phase
    async executeBlocking(bidWinner) {
        this.currentPhase = 'blocking';
        this.log('Starting blocking phase...', 'phase');
        
        const blocks = [];
        const blockingPlayers = this.config.playerNames.filter(name => name !== bidWinner);
        
        for (const player of blockingPlayers) {
            // Random decision to block
            if (Math.random() < this.config.blockFrequency) {
                const blockResult = await this.makeBlock(player);
                if (blockResult) {
                    blocks.push(blockResult);
                    this.log(`${player} blocks ${blockResult.card} with ${blockResult.tokenValue} token`, 'action');
                }
            } else {
                this.log(`${player} chooses not to block`, 'action');
            }
            
            await this.delay(this.config.showUI ? this.config.uiDelay : 0);
        }
        
        return blocks;
    }
    
    // Make a blocking decision
    async makeBlock(player) {
        try {
            // Get available tokens for this player
            const tokens = GameState.get(`players.blockingTokens.${player}`) || {};
            const availableTokens = Object.keys(tokens).filter(value => tokens[value] > 0);
            
            if (availableTokens.length === 0) {
                this.log(`${player} has no blocking tokens`, 'debug');
                return null;
            }
            
            // Get blockable cards
            const drawnCards = GameState.get('drawnCards') || [];
            const ownedCards = GameState.get(`players.ownedCards.${player}`) || {};
            const currentCategory = GameState.get('currentCategory');
            const playerOwnedInCategory = ownedCards[currentCategory] || [];
            
            // Filter out owned cards
            const blockableCards = drawnCards.filter(card => !playerOwnedInCategory.includes(card));
            
            if (blockableCards.length === 0) {
                this.log(`${player} has no blockable cards`, 'debug');
                return null;
            }
            
            // Random selections
            const randomToken = availableTokens[Math.floor(Math.random() * availableTokens.length)];
            const randomCard = blockableCards[Math.floor(Math.random() * blockableCards.length)];
            
            // Execute block through game function
            if (typeof selectBlockingToken === 'function' && typeof selectCardToBlock === 'function') {
                selectBlockingToken(parseInt(randomToken), player);
                await this.delay(50);
                selectCardToBlock(randomCard);
                
                return {
                    player: player,
                    card: randomCard,
                    tokenValue: parseInt(randomToken)
                };
            }
            
        } catch (error) {
            this.recordError('BLOCK_ERROR', error.message, { player, phase: 'blocking' });
            return null;
        }
    }
    
    // Select category for round
    async selectCategory() {
        try {
            const categories = ['countries', 'movies', 'companies', 'sports'];
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            
            // Set category and draw cards
            GameState.set('currentCategory', randomCategory);
            
            // Initialize drawn cards
            if (typeof drawCards === 'function') {
                drawCards(randomCategory);
            } else {
                // Manually set up cards
                const categoryData = window.GAME_DATA.categories[randomCategory];
                const items = Object.keys(categoryData.items);
                const shuffled = items.sort(() => Math.random() - 0.5);
                const drawnCards = shuffled.slice(0, 10);
                GameState.set('drawnCards', drawnCards);
            }
            
            this.log(`Selected category: ${randomCategory}`, 'action');
            
        } catch (error) {
            this.recordError('CATEGORY_ERROR', error.message, { phase: 'category' });
        }
    }
    
    // Select cards for ranking
    async selectCards(player, bidAmount) {
        this.currentPhase = 'selection';
        this.log(`${player} selecting ${bidAmount} cards...`, 'phase');
        
        try {
            const drawnCards = GameState.get('drawnCards') || [];
            this.log(`Available cards: ${drawnCards.length}`, 'debug');
            
            if (drawnCards.length === 0) {
                this.recordError('NO_CARDS', 'No cards available for selection', { player, bidAmount });
                return [];
            }
            
            const selectedCards = [];
            
            // Randomly select cards
            const shuffled = [...drawnCards].sort(() => Math.random() - 0.5);
            for (let i = 0; i < bidAmount && i < shuffled.length; i++) {
                selectedCards.push(shuffled[i]);
            }
            
            // Store selected cards in GameState
            GameState.set('selectedCards', selectedCards);
            
            this.log(`Selected: ${selectedCards.join(', ')}`, 'debug');
            return selectedCards;
            
        } catch (error) {
            this.recordError('SELECTION_ERROR', error.message, { player, phase: 'selection' });
            return [];
        }
    }
    
    // Execute ranking phase
    async executeRanking(player, selectedCards) {
        this.currentPhase = 'ranking';
        this.log(`${player} ranking ${selectedCards.length} cards...`, 'phase');
        
        try {
            // Decide if ranking will be correct
            const willSucceed = Math.random() < this.config.rankingAccuracy;
            
            if (willSucceed) {
                // Get correct order (simplified - in real test would analyze challenge)
                const correctOrder = [...selectedCards].sort();
                GameState.set('finalRanking', correctOrder);
            } else {
                // Intentionally wrong order
                const wrongOrder = [...selectedCards].sort(() => Math.random() - 0.5);
                GameState.set('finalRanking', wrongOrder);
            }
            
            // Trigger ranking completion
            if (typeof completeRanking === 'function') {
                completeRanking();
            }
            
            await this.delay(this.config.showUI ? this.config.uiDelay : 0);
            
            return {
                player: player,
                success: willSucceed,
                cards: selectedCards
            };
            
        } catch (error) {
            this.recordError('RANKING_ERROR', error.message, { player, phase: 'ranking' });
            return { player, success: false, cards: selectedCards };
        }
    }
    
    // Calculate scoring
    async calculateScoring(rankingResult, blockResults) {
        this.currentPhase = 'scoring';
        this.log('Calculating scores...', 'phase');
        
        try {
            // Let game calculate scores
            if (typeof calculateAndApplyScores === 'function') {
                calculateAndApplyScores();
            }
            
            await this.delay(this.config.showUI ? this.config.uiDelay : 0);
            
            // Update our tracking
            const bidWinner = rankingResult.player;
            this.results.playerStats[bidWinner].bidsWon++;
            
            if (rankingResult.success) {
                this.results.playerStats[bidWinner].bidsSuccessful++;
            } else {
                // Track blocks won
                blockResults.forEach(block => {
                    this.results.playerStats[block.player].blocksWon++;
                });
            }
            
        } catch (error) {
            this.recordError('SCORING_ERROR', error.message, { phase: 'scoring' });
        }
    }
    
    // Validate round integrity
    validateRoundIntegrity(roundData) {
        this.log('Validating round integrity...', 'validation');
        
        const validations = [];
        
        // Check 1: Bidder cannot block
        const bidderBlocked = roundData.blocks.find(b => b.player === roundData.bidWinner);
        if (bidderBlocked) {
            validations.push({
                type: 'ERROR',
                rule: 'BIDDER_CANNOT_BLOCK',
                message: `Bidder ${roundData.bidWinner} made a block`,
                data: bidderBlocked
            });
        }
        
        // Check 2: Block statistics consistency
        this.config.playerNames.forEach(player => {
            const stats = GameState.get(`players.stats.${player}`) || {};
            
            // blocksWon should equal tokensGained
            if (stats.blocksWon !== stats.tokensGained) {
                validations.push({
                    type: 'ERROR',
                    rule: 'BLOCKS_TOKENS_MISMATCH',
                    message: `${player}: blocksWon(${stats.blocksWon}) != tokensGained(${stats.tokensGained})`,
                    data: stats
                });
            }
            
            // Check actual token ownership
            const ownedCards = GameState.get(`players.ownedCards.${player}`) || {};
            let actualTokenCount = 0;
            Object.values(ownedCards).forEach(cards => {
                actualTokenCount += (cards || []).length;
            });
            
            if (stats.tokensGained !== actualTokenCount) {
                validations.push({
                    type: 'ERROR',
                    rule: 'TOKENS_OWNERSHIP_MISMATCH',
                    message: `${player}: tokensGained(${stats.tokensGained}) != actualOwned(${actualTokenCount})`,
                    data: { stats, ownedCards }
                });
            }
        });
        
        // Check 3: Score consistency
        const scores = GameState.get('players.scores') || {};
        Object.keys(scores).forEach(player => {
            if (scores[player] < 0) {
                validations.push({
                    type: 'ERROR',
                    rule: 'NEGATIVE_SCORE',
                    message: `${player} has negative score: ${scores[player]}`,
                    data: scores[player]
                });
            }
        });
        
        // Process validations
        validations.forEach(v => {
            if (v.type === 'ERROR') {
                this.recordError(v.rule, v.message, v.data);
            } else {
                this.recordWarning(v.rule, v.message, v.data);
            }
        });
        
        if (validations.length === 0) {
            this.log('✅ All validations passed', 'success');
        } else {
            this.log(`❌ ${validations.length} validation issues found`, 'error');
        }
        
        return validations.length === 0;
    }
    
    // Finalize test
    async finalizeTest() {
        this.endTime = Date.now();
        const duration = this.endTime - this.startTime;
        
        this.log('\n📊 FINALIZING TEST RESULTS', 'header');
        
        // Collect final stats
        this.config.playerNames.forEach(player => {
            const stats = GameState.get(`players.stats.${player}`) || {};
            const score = GameState.get(`players.scores.${player}`) || 0;
            
            this.results.playerStats[player] = {
                ...this.results.playerStats[player],
                ...stats,
                finalScore: score
            };
        });
        
        // Generate summary
        this.results.summary = {
            duration: duration,
            roundsPlayed: this.results.rounds.length,
            totalErrors: this.errors.length,
            totalWarnings: this.warnings.length,
            testPassed: this.errors.length === 0
        };
        
        // Log summary
        this.log(`\n✨ TEST COMPLETE ✨`, 'header');
        this.log(`Duration: ${duration}ms`, 'info');
        this.log(`Rounds played: ${this.results.rounds.length}`, 'info');
        this.log(`Errors: ${this.errors.length}`, this.errors.length > 0 ? 'error' : 'success');
        this.log(`Warnings: ${this.warnings.length}`, 'info');
        
        if (this.errors.length > 0) {
            this.log('\n❌ ERRORS FOUND:', 'error');
            this.errors.forEach((error, i) => {
                this.log(`  ${i + 1}. ${error.code}: ${error.message}`, 'error');
            });
        }
        
        // Save results globally for analysis
        window.lastAutomatedTestResults = this.results;
        
        return this.results;
    }
    
    // Helper methods
    
    decideBid(player, currentBid) {
        // Realistic bidding strategy
        const minBid = currentBid + 1;
        const maxBid = Math.min(10, currentBid + 3);
        
        if (minBid > 7) {
            // High bids, more likely to pass
            return { bid: Math.random() < 0.3, amount: minBid };
        }
        
        if (currentBid === 0) {
            // First bid, usually conservative
            const amount = Math.floor(Math.random() * 3) + 2; // 2-4
            return { bid: true, amount };
        }
        
        // Normal bidding
        if (Math.random() < 0.6) {
            const amount = minBid + Math.floor(Math.random() * (maxBid - minBid + 1));
            return { bid: true, amount };
        }
        
        return { bid: false };
    }
    
    async makeBid(player, amount) {
        // Simulate player making bid
        if (typeof placeBid === 'function') {
            // Set current player context if needed
            GameState.set('currentPlayer', player);
            placeBid(amount);
        }
        await this.delay(this.config.showUI ? this.config.uiDelay : 0);
    }
    
    async passBid(player) {
        if (typeof passBidding === 'function') {
            GameState.set('currentPlayer', player);
            passBidding();
        }
        await this.delay(this.config.showUI ? this.config.uiDelay : 0);
    }
    
    addPlayer(name) {
        if (typeof addPlayer === 'function') {
            // Set player name in input
            const input = document.getElementById('player1') || document.getElementById('playerNameInput');
            if (input) {
                input.value = name;
            }
            addPlayer();
        }
    }
    
    shouldEndGame() {
        // Check game ending conditions
        const currentRound = GameState.get('currentRound') || 0;
        const maxRounds = GameState.get('maxRounds') || this.config.maxRounds;
        
        if (currentRound >= maxRounds) {
            return true;
        }
        
        // Check if enough cards available
        const drawnCards = GameState.get('drawnCards') || [];
        if (drawnCards.length < 10) {
            return true;
        }
        
        return false;
    }
    
    delay(ms) {
        if (ms <= 0) return Promise.resolve();
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    log(message, level = 'info') {
        const levels = {
            'header': '📌',
            'phase': '🔄',
            'action': '▶️',
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️',
            'debug': '🔍',
            'validation': '🔎'
        };
        
        const emoji = levels[level] || '';
        const formattedMessage = `${emoji} ${message}`;
        
        // Always log headers and errors
        if (level === 'header' || level === 'error' || this.config.logLevel !== 'minimal') {
            console.log(formattedMessage);
        }
        
        // Store in results
        if (!this.results.logs) {
            this.results.logs = [];
        }
        this.results.logs.push({
            timestamp: Date.now(),
            level,
            message,
            phase: this.currentPhase,
            round: this.currentRound
        });
    }
    
    recordError(code, message, data = {}) {
        const error = {
            code,
            message,
            data,
            timestamp: Date.now(),
            round: this.currentRound,
            phase: this.currentPhase
        };
        
        this.errors.push(error);
        this.results.errors.push(error);
        this.log(`ERROR: ${code} - ${message}`, 'error');
    }
    
    recordWarning(code, message, data = {}) {
        const warning = {
            code,
            message,
            data,
            timestamp: Date.now(),
            round: this.currentRound,
            phase: this.currentPhase
        };
        
        this.warnings.push(warning);
        this.results.warnings.push(warning);
        this.log(`WARNING: ${code} - ${message}`, 'warning');
    }
    
    handleCriticalError(error) {
        this.log(`CRITICAL ERROR: ${error.message}`, 'error');
        this.recordError('CRITICAL_ERROR', error.message, {
            stack: error.stack,
            phase: this.currentPhase,
            round: this.currentRound
        });
        
        // Try to save partial results
        this.results.summary = {
            duration: Date.now() - this.startTime,
            roundsPlayed: this.results.rounds.length,
            totalErrors: this.errors.length,
            totalWarnings: this.warnings.length,
            testPassed: false,
            criticalError: true
        };
        
        window.lastAutomatedTestResults = this.results;
    }
}

// Export for use
window.OutrankAutomatedTest = OutrankAutomatedTest;

// Convenience function to run test
window.runAutomatedTestV2 = async function(config = {}) {
    const test = new OutrankAutomatedTest(config);
    return await test.run();
};

// Quick test configurations
window.testConfigs = {
    quick: {
        maxRounds: 3,
        uiDelay: 100,
        logLevel: 'minimal'
    },
    
    thorough: {
        maxRounds: 10,
        uiDelay: 200,
        logLevel: 'detailed',
        rankingAccuracy: 0.5  // More failures to test
    },
    
    headless: {
        showUI: false,
        uiDelay: 0,
        logLevel: 'normal'
    },
    
    debug: {
        maxRounds: 2,
        uiDelay: 500,
        logLevel: 'detailed',
        blockFrequency: 1.0,  // Always block
        rankingAccuracy: 0.0  // Always fail
    }
};

console.log('✅ Outrank Automated Test v2 loaded');
console.log('Usage: runAutomatedTestV2(config)');
console.log('Quick configs: testConfigs.quick, testConfigs.thorough, testConfigs.headless, testConfigs.debug');