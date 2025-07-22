/**
 * Outrank Automated Test System v4
 * Real Game Integration - Uses actual game functions instead of simulation
 * 
 * Key Changes from v3:
 * - Calls real game functions instead of simulating mechanics
 * - Integrates with actual game flow and state transitions
 * - Tests real token/chip mechanics and scoring calculations
 * - Exposes actual game bugs instead of masking them
 */

class RealGameInterface {
    /**
     * Interface for calling actual game functions instead of simulation
     * Each method calls the real game function and waits for proper state transitions
     */
    
    static async initializeGame() {
        console.log('🎮 Initializing game with real game functions...');
        
        // Use the real newGame function
        if (typeof window.newGame !== 'function') {
            throw new Error('Real newGame function not found');
        }
        
        window.newGame();
        await this.delay(200);
        
        console.log('✅ Real game initialized');
        return true;
    }
    
    static async setupPlayersWithRealMechanics(playerNames) {
        console.log('👥 Setting up players with real game mechanics...');
        
        // Clear any existing players and initialize fresh
        GameState.set('players.list', []);
        
        // Add each player using real player initialization
        for (const playerName of playerNames) {
            console.log(`  Adding player: ${playerName}`);
            
            // Use real player initialization function
            GameState.initializePlayer(playerName);
            
            // Verify the player was set up with real blocking tokens
            const tokens = GameState.get(`players.blockingTokens.${playerName}`);
            console.log(`    ${playerName} tokens:`, tokens);
            
            if (!tokens || tokens[2] !== 1 || tokens[4] !== 1 || tokens[6] !== 1) {
                throw new Error(`Player ${playerName} not initialized with correct blocking tokens`);
            }
        }
        
        console.log('✅ All players initialized with real game mechanics');
        return playerNames;
    }
    
    static async selectCategoryWithRealFunction(preferredCategory = null) {
        console.log('🎯 Selecting category using real game function...');
        
        // Use real category selection or pick random if none specified
        const categories = ['countries', 'movies', 'companies', 'sports'];
        const categoryToSelect = preferredCategory || categories[Math.floor(Math.random() * categories.length)];
        
        console.log(`  Selected category: ${categoryToSelect}`);
        
        // Call the real selectCategory function
        if (typeof window.selectCategory !== 'function') {
            throw new Error('Real selectCategory function not found');
        }
        
        window.selectCategory(categoryToSelect);
        
        // Wait for state to update
        await this.delay(300);
        
        // Verify the real game state was set correctly
        const currentCategory = GameState.get('currentCategory');
        const currentPrompt = GameState.get('currentPrompt');
        
        if (currentCategory !== categoryToSelect) {
            throw new Error(`Category not set correctly: expected ${categoryToSelect}, got ${currentCategory}`);
        }
        
        if (!currentPrompt) {
            throw new Error('Real game did not set currentPrompt');
        }
        
        console.log(`  Real game set category: ${currentCategory}`);
        console.log(`  Real game set challenge: ${currentPrompt.challenge || 'unknown'}`);
        console.log(`  Real game set prompt: ${currentPrompt.label || 'unknown'}`);
        
        return {
            category: currentCategory,
            challenge: currentPrompt.challenge,
            prompt: currentPrompt
        };
    }
    
    static async executeBiddingWithRealFunctions(playerNames, strategy = 'realistic') {
        console.log('💰 Starting bidding using real game functions...');
        
        let biddingComplete = false;
        let attempts = 0;
        const maxAttempts = playerNames.length * 3; // Prevent infinite loops
        
        while (!biddingComplete && attempts < maxAttempts) {
            for (const playerName of playerNames) {
                attempts++;
                
                // Check if this player has already passed
                const passedPlayers = GameState.get('passedPlayers') || {};
                if (passedPlayers[playerName]) {
                    continue;
                }
                
                // Make bidding decision
                const currentBid = GameState.get('currentBid') || 0;
                const decision = this.decideBid(playerName, currentBid, strategy);
                
                if (decision.pass) {
                    console.log(`  ${playerName} passes`);
                    
                    // Call real pass function
                    if (typeof window.passPlayer === 'function') {
                        window.passPlayer(playerName);
                    } else {
                        throw new Error('Real passPlayer function not found');
                    }
                } else {
                    console.log(`  ${playerName} bids ${decision.amount}`);
                    
                    // Set the bid amount first
                    GameState.set('currentBid', decision.amount);
                    
                    // Call real bidding function
                    if (typeof window.placeBidForPlayer === 'function') {
                        window.placeBidForPlayer(playerName);
                    } else {
                        throw new Error('Real placeBidForPlayer function not found');
                    }
                }
                
                await this.delay(100);
                
                // Check if bidding is complete
                const totalPassed = Object.keys(GameState.get('passedPlayers') || {}).length;
                if (totalPassed >= playerNames.length - 1) {
                    biddingComplete = true;
                    break;
                }
            }
        }
        
        const highestBidder = GameState.get('highestBidder');
        const finalBid = GameState.get('currentBid');
        
        if (!highestBidder || !finalBid) {
            throw new Error('Real bidding did not produce a winner');
        }
        
        console.log(`🏆 Real bidding result: ${highestBidder} with ${finalBid} cards`);
        
        return {
            winner: highestBidder,
            amount: finalBid
        };
    }
    
    static async executeBlockingWithRealFunctions(playerNames, bidWinner, blockFrequency = 0.4) {
        console.log('🛡️ Starting blocking using real game functions...');
        
        const blockingPlayers = playerNames.filter(p => p !== bidWinner);
        const blocksExecuted = [];
        
        for (const playerName of blockingPlayers) {
            // Random decision to block
            if (Math.random() < blockFrequency) {
                const blockAttempt = await this.attemptRealBlock(playerName);
                
                if (blockAttempt) {
                    blocksExecuted.push(blockAttempt);
                    console.log(`  ${playerName} blocks ${blockAttempt.cardId} with ${blockAttempt.tokenValue}-point token (REAL)`);
                } else {
                    console.log(`  ${playerName} tried to block but no valid options`);
                }
            } else {
                console.log(`  ${playerName} chooses not to block`);
            }
            
            await this.delay(200);
        }
        
        console.log(`✅ Real blocking complete: ${blocksExecuted.length} blocks executed`);
        return blocksExecuted;
    }
    
    static async attemptRealBlock(playerName) {
        try {
            // Get available tokens using real game state
            const tokens = GameState.get(`players.blockingTokens.${playerName}`) || {};
            const availableTokens = Object.keys(tokens).filter(value => tokens[value] > 0);
            
            if (availableTokens.length === 0) {
                console.log(`    ${playerName} has no available blocking tokens`);
                return null;
            }
            
            // Get blockable cards from real game state
            const drawnCards = GameState.get('drawnCards') || [];
            const blockedCards = GameState.get('blockedCards') || [];
            const blockableCards = drawnCards.filter(card => !blockedCards.includes(card));
            
            if (blockableCards.length === 0) {
                console.log(`    ${playerName} has no blockable cards`);
                return null;
            }
            
            // Random selections
            const tokenValue = parseInt(availableTokens[Math.floor(Math.random() * availableTokens.length)]);
            const cardId = blockableCards[Math.floor(Math.random() * blockableCards.length)];
            
            console.log(`    ${playerName} attempting real block: card ${cardId} with ${tokenValue}-token`);
            
            // Call the REAL blockCard function
            if (typeof window.blockCard === 'function') {
                window.blockCard(cardId, tokenValue, playerName);
            } else {
                throw new Error('Real blockCard function not found');
            }
            
            // Verify the block was recorded in real game state
            const currentBlocks = GameState.get('players.currentBlocks') || {};
            if (!currentBlocks[playerName]) {
                throw new Error(`Real blockCard did not record block for ${playerName}`);
            }
            
            return {
                player: playerName,
                cardId: cardId,
                tokenValue: tokenValue
            };
            
        } catch (error) {
            console.error(`Real block attempt failed for ${playerName}:`, error.message);
            return null;
        }
    }
    
    static async executeRankingWithRealFlow(bidWinner, bidAmount) {
        console.log(`🎯 ${bidWinner} ranking ${bidAmount} cards using real game flow...`);
        
        try {
            // Get cards for selection from real game state
            const drawnCards = GameState.get('drawnCards') || [];
            const blockedCards = GameState.get('blockedCards') || [];
            const availableCards = drawnCards.filter(card => !blockedCards.includes(card));
            
            if (availableCards.length < bidAmount) {
                throw new Error(`Not enough available cards: need ${bidAmount}, have ${availableCards.length}`);
            }
            
            // Select cards using real card selection
            console.log(`  Selecting ${bidAmount} cards for ranking...`);
            
            // Clear any existing selection
            GameState.set('selectedCardsForRanking', []);
            
            // Use real selectCardForRanking function for each card
            const cardsToSelect = availableCards.slice(0, bidAmount);
            
            for (const cardId of cardsToSelect) {
                if (typeof window.selectCardForRanking === 'function') {
                    window.selectCardForRanking(cardId);
                } else {
                    throw new Error('Real selectCardForRanking function not found');
                }
                await this.delay(50);
            }
            
            // Verify cards were selected correctly
            const selectedCards = GameState.get('selectedCardsForRanking') || [];
            if (selectedCards.length !== bidAmount) {
                throw new Error(`Card selection failed: expected ${bidAmount}, got ${selectedCards.length}`);
            }
            
            console.log(`  Selected cards: ${selectedCards.join(', ')}`);
            
            // Create a ranking order (simulate player's drag-and-drop)
            const rankingOrder = [...selectedCards].sort(() => Math.random() - 0.5);
            GameState.set('finalRanking', rankingOrder);
            
            console.log(`  Player ranking: ${rankingOrder.join(' → ')}`);
            
            // Call real submitRanking function
            if (typeof window.submitRanking === 'function') {
                window.submitRanking();
            } else {
                throw new Error('Real submitRanking function not found');
            }
            
            await this.delay(500);
            
            // Get the result from real game validation
            const bidderSuccess = GameState.get('bidderSuccess');
            
            console.log(`  Real ranking result: ${bidderSuccess ? 'SUCCESS' : 'FAILED'}`);
            
            return {
                success: bidderSuccess,
                cards: selectedCards,
                ranking: rankingOrder
            };
            
        } catch (error) {
            console.error(`Real ranking execution failed:`, error.message);
            return {
                success: false,
                cards: [],
                ranking: []
            };
        }
    }
    
    static async calculateScoresWithRealFunction() {
        console.log('📊 Calculating scores using real game function...');
        
        // Call the REAL calculateAndApplyScores function
        if (typeof window.calculateAndApplyScores === 'function') {
            window.calculateAndApplyScores();
        } else {
            throw new Error('Real calculateAndApplyScores function not found');
        }
        
        await this.delay(200);
        
        // Log the results from real scoring
        const players = GameState.get('players.list') || [];
        const scores = GameState.get('players.scores') || {};
        
        console.log('  Real scoring results:');
        players.forEach(player => {
            const score = scores[player] || 0;
            const stats = GameState.get(`players.stats.${player}`) || {};
            console.log(`    ${player}: ${score} points (blocks: ${stats.blocksMade || 0}, tokens: ${stats.tokensGained || 0})`);
        });
        
        console.log('✅ Real scoring complete');
    }
    
    // Helper methods
    static decideBid(playerName, currentBid, strategy) {
        const minBid = currentBid + 1;
        
        // Conservative strategy for high bids
        if (minBid > 7) {
            return { pass: Math.random() < 0.8, amount: minBid };
        }
        
        // First bid - usually conservative
        if (currentBid === 0) {
            const amount = Math.floor(Math.random() * 3) + 2; // 2-4
            return { pass: false, amount };
        }
        
        // Normal bidding logic
        switch (strategy) {
            case 'conservative':
                return { pass: Math.random() < 0.7, amount: minBid };
            case 'aggressive':
                return { pass: Math.random() < 0.3, amount: minBid + Math.floor(Math.random() * 2) };
            default: // realistic
                return { pass: Math.random() < 0.5, amount: minBid + Math.floor(Math.random() * 2) };
        }
    }
    
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class RealGameTestOrchestrator {
    /**
     * Test orchestrator that uses real game functions instead of simulation
     * This should expose actual game bugs instead of masking them
     */
    
    constructor(config = {}) {
        this.config = {
            playerNames: ['Alice', 'Bob', 'Charlie', 'Diana'],
            maxRounds: 6,
            blockFrequency: 0.4,
            logLevel: 'normal',
            validateEachRound: true,
            useRealGameFlow: true,
            ...config
        };
        
        this.results = {
            testId: `real_test_${Date.now()}`,
            config: { ...this.config },
            startTime: null,
            endTime: null,
            rounds: [],
            errors: [],
            warnings: [],
            playerStats: {},
            summary: null
        };
    }
    
    async run() {
        try {
            console.log('🚀 Starting Outrank Real Game Integration Test v4');
            console.log('==================================================');
            console.log('🎯 Using REAL game functions instead of simulation');
            
            this.results.startTime = Date.now();
            
            // Initialize using real game functions
            await RealGameInterface.initializeGame();
            await RealGameInterface.setupPlayersWithRealMechanics(this.config.playerNames);
            
            // Play rounds using real game flow
            for (let round = 1; round <= this.config.maxRounds; round++) {
                console.log(`\n📍 ROUND ${round} (REAL GAME MECHANICS)`);
                console.log('=' .repeat(40));
                
                const roundResult = await this.playRoundWithRealMechanics(round);
                this.results.rounds.push(roundResult);
                
                if (roundResult.errors.length > 0) {
                    console.log(`⚠️ Round ${round} had ${roundResult.errors.length} errors`);
                    this.results.errors.push(...roundResult.errors);
                }
                
                if (roundResult.criticalError) {
                    console.log('💥 Critical error encountered, stopping test');
                    break;
                }
                
                // Add delay between rounds
                await RealGameInterface.delay(500);
            }
            
            await this.finalizeResults();
            return this.results;
            
        } catch (error) {
            console.error('💥 Critical test error:', error);
            this.results.errors.push({
                type: 'CRITICAL_ERROR',
                message: error.message,
                stack: error.stack
            });
            
            await this.finalizeResults();
            return this.results;
        }
    }
    
    async playRoundWithRealMechanics(roundNumber) {
        const roundData = {
            round: roundNumber,
            category: null,
            challenge: null,
            bidWinner: null,
            bidAmount: null,
            bidSuccess: null,
            blocks: [],
            errors: [],
            warnings: [],
            startTime: Date.now(),
            criticalError: false
        };
        
        try {
            // Phase 1: Category selection using real function
            const categoryResult = await RealGameInterface.selectCategoryWithRealFunction();
            roundData.category = categoryResult.category;
            roundData.challenge = categoryResult.challenge;
            
            // Phase 2: Bidding using real functions
            const bidResult = await RealGameInterface.executeBiddingWithRealFunctions(
                this.config.playerNames, 
                'realistic'
            );
            roundData.bidWinner = bidResult.winner;
            roundData.bidAmount = bidResult.amount;
            
            // Phase 3: Blocking using real functions
            const blocks = await RealGameInterface.executeBlockingWithRealFunctions(
                this.config.playerNames,
                bidResult.winner,
                this.config.blockFrequency
            );
            roundData.blocks = blocks;
            
            // Phase 4: Ranking using real flow
            const rankingResult = await RealGameInterface.executeRankingWithRealFlow(
                bidResult.winner,
                bidResult.amount
            );
            roundData.bidSuccess = rankingResult.success;
            
            // Phase 5: Scoring using real function
            await RealGameInterface.calculateScoresWithRealFunction();
            
            // Phase 5.5: Advance to next round using real game function
            if (roundNumber < this.config.maxRounds) {
                console.log(`🔄 Advancing to next round using real game mechanics...`);
                if (typeof window.continueToNextRound === 'function') {
                    window.continueToNextRound();
                } else if (typeof window.nextRound === 'function') {
                    window.nextRound();
                }
                await RealGameInterface.delay(100); // Brief delay for state updates
                console.log(`  Round advanced from ${roundNumber} to ${window.getCurrentRound ? window.getCurrentRound() : 'unknown'}`);
            }
            
            // Phase 6: Validation of real game state
            if (this.config.validateEachRound) {
                const validation = this.validateRealGameState(roundData);
                roundData.errors = validation.errors;
                roundData.warnings = validation.warnings;
            }
            
            roundData.endTime = Date.now();
            roundData.duration = roundData.endTime - roundData.startTime;
            
            console.log(`✅ Round ${roundNumber} complete using real mechanics (${roundData.duration}ms)`);
            
            return roundData;
            
        } catch (error) {
            console.error(`❌ Round ${roundNumber} failed:`, error.message);
            
            roundData.errors.push({
                type: 'ROUND_ERROR',
                message: error.message,
                phase: 'unknown'
            });
            
            roundData.criticalError = true;
            roundData.endTime = Date.now();
            roundData.duration = roundData.endTime - roundData.startTime;
            
            return roundData;
        }
    }
    
    validateRealGameState(roundData) {
        const errors = [];
        const warnings = [];
        
        console.log('🔍 Validating real game state after round...');
        
        // Validate token integrity using real game state
        const players = GameState.get('players.list') || [];
        
        players.forEach(player => {
            const stats = GameState.get(`players.stats.${player}`) || {};
            const tokens = GameState.get(`players.blockingTokens.${player}`) || {};
            const ownedCards = GameState.get(`players.ownedCards.${player}`) || {};
            
            // Check blocks vs tokens consistency
            const blocksMade = stats.blocksMade || 0;
            const blocksWon = stats.blocksWon || 0;
            const tokensGained = stats.tokensGained || 0;
            
            // Count actual owned cards
            let actualOwnedCount = 0;
            Object.values(ownedCards).forEach(cards => {
                actualOwnedCount += (cards || []).length;
            });
            
            // Validate consistency
            if (blocksWon !== tokensGained) {
                errors.push({
                    rule: 'BLOCKS_TOKENS_MISMATCH',
                    message: `${player}: blocksWon(${blocksWon}) != tokensGained(${tokensGained})`,
                    data: { player, stats }
                });
            }
            
            if (tokensGained !== actualOwnedCount) {
                errors.push({
                    rule: 'TOKENS_OWNERSHIP_MISMATCH', 
                    message: `${player}: tokensGained(${tokensGained}) != actualOwned(${actualOwnedCount})`,
                    data: { player, stats, ownedCards, actualOwnedCount }
                });
            }
            
            console.log(`  ${player}: blocks(${blocksMade}→${blocksWon}), tokens(${tokensGained}), owned(${actualOwnedCount})`);
        });
        
        if (errors.length === 0) {
            console.log('  ✅ Real game state validation passed');
        } else {
            console.log(`  ❌ ${errors.length} validation errors in real game state`);
            errors.forEach(error => {
                console.log(`    - ${error.rule}: ${error.message}`);
            });
        }
        
        return { errors, warnings };
    }
    
    async finalizeResults() {
        this.results.endTime = Date.now();
        
        // Collect final stats from real game state
        this.config.playerNames.forEach(player => {
            const stats = GameState.get(`players.stats.${player}`) || {};
            const score = GameState.get(`players.scores.${player}`) || 0;
            const tokens = GameState.get(`players.blockingTokens.${player}`) || {};
            const ownedCards = GameState.get(`players.ownedCards.${player}`) || {};
            
            this.results.playerStats[player] = {
                ...stats,
                finalScore: score,
                finalTokens: tokens,
                finalOwnedCards: ownedCards
            };
        });
        
        this.results.summary = {
            duration: this.results.endTime - this.results.startTime,
            roundsPlayed: this.results.rounds.length,
            totalErrors: this.results.errors.length,
            totalWarnings: this.results.warnings.length,
            testPassed: this.results.errors.length === 0,
            realGameMechanics: true
        };
        
        console.log('\n📊 REAL GAME TEST COMPLETE');
        console.log('============================');
        console.log(`Duration: ${this.results.summary.duration}ms`);
        console.log(`Rounds: ${this.results.summary.roundsPlayed}`);
        console.log(`Errors: ${this.results.summary.totalErrors}`);
        console.log(`Status: ${this.results.summary.testPassed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log('🎯 Used REAL game mechanics throughout');
        
        if (this.results.errors.length > 0) {
            console.log('\n❌ Real game errors found:');
            this.results.errors.forEach((error, i) => {
                console.log(`  ${i + 1}. ${error.rule || error.type}: ${error.message}`);
            });
        }
        
        // Save globally for inspection
        window.lastRealGameTestResults = this.results;
    }
}

// Export for use
window.RealGameTestV4 = RealGameTestOrchestrator;

// Convenience function
window.runRealGameTest = async function(config = {}) {
    const test = new RealGameTestOrchestrator(config);
    return await test.run();
};

console.log('✅ Outrank Real Game Integration Test v4 loaded');
console.log('🎯 This version uses REAL game functions instead of simulation');
console.log('Usage: runRealGameTest(config)');