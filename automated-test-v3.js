/**
 * Outrank Automated Test System v3
 * Complete refactor with clean architecture and proper game integration
 * 
 * Architecture:
 * - GameInterface: Handles all game function calls
 * - TestOrchestrator: Manages test flow and validation
 * - PlayerSimulator: Simulates realistic player behavior
 * - ValidationEngine: Comprehensive rule checking
 */

class GameInterface {
    /**
     * Clean abstraction layer for all game interactions
     * Ensures proper integration with existing game functions
     */
    
    static async initializeGame() {
        console.log('🎮 Initializing game state...');
        
        if (typeof newGame !== 'function') {
            throw new Error('Game not loaded: newGame function not found');
        }
        
        // Reset game to clean state
        newGame();
        await this.delay(200);
        
        return true;
    }
    
    static async setupPlayers(playerNames) {
        console.log('👥 Setting up players:', playerNames.join(', '));
        
        // Use game's existing player setup
        GameState.set('players.list', playerNames);
        
        // Initialize all player data structures properly
        const playerData = {
            scores: {},
            blockingTokens: {},
            stats: {},
            ownedCards: {}
        };
        
        playerNames.forEach(name => {
            playerData.scores[name] = 0;
            playerData.blockingTokens[name] = { 2: 1, 4: 1, 6: 1 };
            playerData.stats[name] = {
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
            playerData.ownedCards[name] = {
                countries: [],
                movies: [],
                sports: [],
                companies: []
            };
        });
        
        // Commit to GameState
        Object.keys(playerData).forEach(key => {
            GameState.set(`players.${key}`, playerData[key]);
        });
        
        return playerNames;
    }
    
    static async selectCategoryAndDrawCards() {
        const categories = ['countries', 'movies', 'companies', 'sports'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        console.log('🎯 Selected category:', category);
        
        // Set category in game state
        GameState.set('currentCategory', category);
        
        // Draw cards using game data
        const categoryData = window.GAME_DATA?.categories?.[category];
        if (!categoryData) {
            throw new Error(`Category data not found for: ${category}`);
        }
        
        const allItems = Object.keys(categoryData.items);
        const shuffled = allItems.sort(() => Math.random() - 0.5);
        const drawnCards = shuffled.slice(0, 10);
        
        GameState.set('drawnCards', drawnCards);
        
        // Select a random challenge for this category
        const prompts = categoryData.prompts || {};
        const challengeKeys = Object.keys(prompts);
        if (challengeKeys.length === 0) {
            throw new Error(`No challenges found for category: ${category}`);
        }
        
        const randomChallenge = challengeKeys[Math.floor(Math.random() * challengeKeys.length)];
        const currentPrompt = prompts[randomChallenge];
        
        // Set the challenge and prompt in GameState
        GameState.set('currentChallenge', randomChallenge);
        GameState.set('currentPrompt', {
            ...currentPrompt,
            challenge: randomChallenge
        });
        
        console.log('🃏 Drew cards:', drawnCards.slice(0, 3).join(', '), '...');
        console.log('🎯 Challenge:', randomChallenge);
        console.log('🎯 Prompt:', currentPrompt.label);
        
        return { category, drawnCards, challenge: randomChallenge, prompt: currentPrompt };
    }
    
    static async executeBidding(players, strategy = 'realistic') {
        console.log('💰 Starting bidding phase...');
        
        let currentBid = 0;
        let highestBidder = null;
        const passedPlayers = new Set();
        
        // Realistic bidding simulation
        for (let round = 0; round < players.length * 2; round++) {
            const player = players[round % players.length];
            
            if (passedPlayers.has(player)) continue;
            
            const decision = PlayerSimulator.decideBid(player, currentBid, strategy);
            
            if (decision.pass) {
                passedPlayers.add(player);
                console.log(`  ${player} passes`);
            } else {
                currentBid = decision.amount;
                highestBidder = player;
                
                // Update game state
                GameState.set('currentBid', currentBid);
                GameState.set('highestBidder', highestBidder);
                
                console.log(`  ${player} bids ${currentBid}`);
            }
            
            // Check if bidding complete
            if (passedPlayers.size >= players.length - 1) {
                break;
            }
        }
        
        if (!highestBidder) {
            throw new Error('All players passed - no bidder');
        }
        
        console.log(`🏆 Winning bid: ${highestBidder} with ${currentBid} cards`);
        
        return { winner: highestBidder, amount: currentBid };
    }
    
    static async executeBlocking(players, bidWinner, blockFrequency = 0.4) {
        console.log('🛡️ Starting blocking phase...');
        
        const blockingPlayers = players.filter(p => p !== bidWinner);
        const blocks = [];
        
        for (const player of blockingPlayers) {
            if (Math.random() < blockFrequency) {
                const block = await this.attemptBlock(player);
                if (block) {
                    blocks.push(block);
                    console.log(`  ${player} blocks ${block.cardId} with ${block.tokenValue}-point token`);
                }
            } else {
                console.log(`  ${player} chooses not to block`);
            }
        }
        
        return blocks;
    }
    
    static async attemptBlock(player) {
        try {
            // CRITICAL: Check "one chip value per round" rule
            const usedBlockingTokens = GameState.get('usedBlockingTokens') || {2: false, 4: false, 6: false};
            
            // Get player's available tokens that haven't been used this round
            const tokens = GameState.get(`players.blockingTokens.${player}`) || {};
            const availableTokens = Object.keys(tokens).filter(value => {
                return tokens[value] > 0 && !usedBlockingTokens[value];
            });
            
            if (availableTokens.length === 0) {
                const usedValues = Object.keys(usedBlockingTokens).filter(v => usedBlockingTokens[v]);
                console.log(`    ${player} cannot block - no tokens available (used this round: ${usedValues.join(', ')})`);
                return null;
            }
            
            // Get blockable cards from the selected cards (not random drawn cards)
            const selectedCards = GameState.get('selectedCards') || [];
            const blockedCards = GameState.get('blockedCards') || [];
            const blockableCards = selectedCards.filter(card => !blockedCards.includes(card));
            
            if (blockableCards.length === 0) {
                console.log(`    ${player} has no blockable cards from selected cards`);
                return null;
            }
            
            // Random selections
            const tokenValue = parseInt(availableTokens[Math.floor(Math.random() * availableTokens.length)]);
            const cardId = blockableCards[Math.floor(Math.random() * blockableCards.length)];
            
            console.log(`    ${player} attempting REAL block: card ${cardId} with ${tokenValue}-point token`);
            
            // Call the REAL blockCard function (this will handle all the real game mechanics)
            if (typeof window.blockCard === 'function') {
                window.blockCard(cardId, tokenValue, player);
                
                // Verify the real block was recorded
                const currentBlocks = GameState.get('players.currentBlocks') || {};
                const usedTokensAfter = GameState.get('usedBlockingTokens') || {};
                
                if (currentBlocks[player] && usedTokensAfter[tokenValue]) {
                    console.log(`    ✅ REAL block successful: ${player} blocked ${cardId} with ${tokenValue}-token`);
                    return { player, cardId, tokenValue };
                } else {
                    console.log(`    ❌ REAL block failed: not properly recorded`);
                    return null;
                }
            } else {
                throw new Error('Real blockCard function not found');
            }
            
        } catch (error) {
            console.error(`REAL block error for ${player}:`, error.message);
            return null;
        }
    }
    
    static async executeRanking(bidWinner, bidAmount, accuracy = 0.7) {
        console.log(`🎯 ${bidWinner} ranking ${bidAmount} cards...`);
        
        const drawnCards = GameState.get('drawnCards') || [];
        
        if (drawnCards.length < bidAmount) {
            throw new Error(`Not enough cards: need ${bidAmount}, have ${drawnCards.length}`);
        }
        
        // Select cards
        const selectedCards = drawnCards.slice(0, bidAmount);
        GameState.set('selectedCards', selectedCards);
        GameState.set('selectedCardsForRanking', selectedCards);
        
        // Get current prompt for validation
        const currentPrompt = GameState.get('currentPrompt');
        if (!currentPrompt) {
            throw new Error('No current prompt available for ranking validation');
        }
        
        // Create player ranking with realistic accuracy simulation
        // FORCE more failures to test token ownership bugs
        let playerRanking;
        let willSucceed;
        const shouldSucceed = Math.random() < (accuracy * 0.01); // Force only 1% success rate
        
        // Get correct ranking first
        const correctRanking = window.RankingValidator.calculateCorrectRanking(
            selectedCards, 
            currentPrompt.challenge, 
            currentPrompt
        );
        
        if (shouldSucceed) {
            // Use correct ranking to guarantee success
            playerRanking = correctRanking.slice();
            willSucceed = true;
            console.log(`  🎯 FORCED SUCCESS: Using correct ranking`);
        } else {
            // Create guaranteed incorrect ranking by completely reversing
            playerRanking = correctRanking.slice().reverse();
            willSucceed = false;
            console.log(`  💥 FORCED FAILURE: Reversed ranking to guarantee failure`);
        }
        
        // Set the player's ranking
        GameState.set('finalRanking', playerRanking);
        
        // Validate the ranking using centralized validator (for logging purposes)
        const validation = window.RankingValidator.validatePlayerRanking(
            playerRanking,
            currentPrompt.challenge,
            currentPrompt
        );
        
        // Override validation result with our forced result
        console.log(`  📊 Validator says: ${validation.isValid}, but we're forcing: ${willSucceed}`);
        GameState.set('bidderSuccess', willSucceed);
        
        console.log(`  Selected: ${selectedCards.slice(0, 3).join(', ')}${selectedCards.length > 3 ? '...' : ''}`);
        console.log(`  Player ranking: ${playerRanking.join(' → ')}`);
        console.log(`  Correct ranking: ${validation.correctRanking.join(' → ')}`);
        console.log(`  Validation: ${validation.isValid ? 'VALID' : 'INVALID'} (${validation.challengeType})`);
        if (!validation.isValid && validation.firstError) {
            console.log(`  Error: ${validation.firstError.message}`);
        }
        console.log(`  Result: ${willSucceed ? 'SUCCESS' : 'FAILED'}`);
        
        return { 
            success: willSucceed, 
            cards: selectedCards,
            validation: validation,
            playerRanking: playerRanking
        };
    }
    
    static async calculateScores() {
        console.log('📊 Calculating scores using REAL game function...');
        
        // Call the REAL calculateAndApplyScores function to test actual token mechanics
        if (typeof window.calculateAndApplyScores === 'function') {
            console.log('🎯 Calling REAL calculateAndApplyScores() - this will expose real token bugs!');
            window.calculateAndApplyScores();
            
            // Log the real results
            const players = GameState.get('players.list') || [];
            console.log('📊 REAL scoring results:');
            players.forEach(player => {
                const score = GameState.get(`players.scores.${player}`) || 0;
                const stats = GameState.get(`players.stats.${player}`) || {};
                const tokens = GameState.get(`players.blockingTokens.${player}`) || {};
                console.log(`  ${player}: score=${score}, blocksMade=${stats.blocksMade}, blocksWon=${stats.blocksWon}, tokensGained=${stats.tokensGained}`);
                console.log(`    blocking chips: ${JSON.stringify(tokens)}`);
            });
        } else {
            console.warn('❌ Real calculateAndApplyScores function not found');
        }
        
        await this.delay(200);
    }
    
    static async prepareRound(roundNumber) {
        console.log(`🔄 Preparing round ${roundNumber}...`);
        
        // Set the current round in game state
        GameState.set('currentRound', roundNumber);
        
        // Reset scoring flag for this round
        GameState.set('players.scoresCalculatedThisRound', false);
        
        // CRITICAL: Reset usedBlockingTokens for new round (enforce "one chip value per round" rule)
        GameState.set('usedBlockingTokens', {2: false, 4: false, 6: false});
        
        // Reset other round-specific state
        GameState.set('blockedCards', []);
        GameState.set('players.currentBlocks', {});
        
        console.log(`  Round set to: ${roundNumber}`);
        console.log(`  Scoring flag reset: false`);
        console.log(`  Used blocking tokens reset: {2: false, 4: false, 6: false}`);
        
        await this.delay(50);
    }
    
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class PlayerSimulator {
    /**
     * Realistic player behavior simulation
     */
    
    static decideBid(player, currentBid, strategy = 'realistic') {
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
}

class ValidationEngine {
    /**
     * Comprehensive game rule validation
     */
    
    static validateRoundIntegrity(roundData) {
        const errors = [];
        const warnings = [];
        
        console.log('🔍 Validating round integrity...');
        
        // Rule 1: Bidder cannot block
        const bidderBlocked = roundData.blocks?.find(b => b.player === roundData.bidWinner);
        if (bidderBlocked) {
            errors.push({
                rule: 'BIDDER_CANNOT_BLOCK',
                message: `Bidder ${roundData.bidWinner} attempted to block`,
                data: bidderBlocked
            });
        }
        
        // Rule 2: Stats consistency
        const players = GameState.get('players.list') || [];
        players.forEach(player => {
            const stats = GameState.get(`players.stats.${player}`) || {};
            
            // blocksWon should equal tokensGained
            if ((stats.blocksWon || 0) !== (stats.tokensGained || 0)) {
                errors.push({
                    rule: 'BLOCKS_TOKENS_MISMATCH',
                    message: `${player}: blocksWon(${stats.blocksWon || 0}) != tokensGained(${stats.tokensGained || 0})`,
                    data: { player, stats }
                });
            }
            
            // Verify actual token ownership
            const ownedCards = GameState.get(`players.ownedCards.${player}`) || {};
            let actualTokenCount = 0;
            Object.values(ownedCards).forEach(cards => {
                actualTokenCount += (cards || []).length;
            });
            
            if ((stats.tokensGained || 0) !== actualTokenCount) {
                errors.push({
                    rule: 'TOKENS_OWNERSHIP_MISMATCH',
                    message: `${player}: tokensGained(${stats.tokensGained || 0}) != actualOwned(${actualTokenCount})`,
                    data: { player, stats, ownedCards, actualTokenCount }
                });
            }
        });
        
        // Rule 3: Score consistency
        const scores = GameState.get('players.scores') || {};
        Object.keys(scores).forEach(player => {
            if (scores[player] < 0) {
                errors.push({
                    rule: 'NEGATIVE_SCORE',
                    message: `${player} has negative score: ${scores[player]}`,
                    data: { player, score: scores[player] }
                });
            }
        });
        
        // Rule 4: Ranking validation (if round has ranking data)
        if (roundData.bidSuccess !== null && window.RankingValidator) {
            const finalRanking = GameState.get('finalRanking');
            const currentPrompt = GameState.get('currentPrompt');
            
            if (finalRanking && finalRanking.length > 0 && currentPrompt) {
                const validation = window.RankingValidator.validatePlayerRanking(
                    finalRanking,
                    currentPrompt.challenge,
                    currentPrompt
                );
                
                // Check if bidder success matches validation result
                if (roundData.bidSuccess !== validation.isValid) {
                    errors.push({
                        rule: 'RANKING_VALIDATION_MISMATCH',
                        message: `Bidder success (${roundData.bidSuccess}) doesn't match validation result (${validation.isValid})`,
                        data: { 
                            reportedSuccess: roundData.bidSuccess, 
                            validationResult: validation.isValid,
                            validation: validation
                        }
                    });
                }
                
                // Log ranking validation details
                if (!validation.isValid) {
                    warnings.push({
                        rule: 'RANKING_DETAILS',
                        message: `Ranking failed: ${validation.message}`,
                        data: validation
                    });
                }
            }
        }
        
        // Log results
        if (errors.length === 0) {
            console.log('  ✅ All validations passed');
        } else {
            console.log(`  ❌ ${errors.length} validation errors found`);
            errors.forEach(error => {
                console.log(`    - ${error.rule}: ${error.message}`);
            });
        }
        
        if (warnings.length > 0) {
            console.log(`  ⚠️ ${warnings.length} warnings found`);
            warnings.forEach(warning => {
                console.log(`    - ${warning.rule}: ${warning.message}`);
            });
        }
        
        return { errors, warnings };
    }
    
    static validateGameState() {
        const issues = [];
        
        // Check required functions exist
        const requiredFunctions = ['newGame', 'calculateAndApplyScores', 'GameState'];
        requiredFunctions.forEach(fn => {
            if (typeof window[fn] === 'undefined') {
                issues.push(`Required function missing: ${fn}`);
            }
        });
        
        // Check game data
        if (!window.GAME_DATA?.categories) {
            issues.push('Game data not loaded');
        }
        
        return issues;
    }
}

class TestOrchestrator {
    /**
     * Main test coordination and execution
     */
    
    constructor(config = {}) {
        this.config = {
            playerNames: ['Alice', 'Bob', 'Charlie', 'Diana'],
            maxRounds: 6,
            blockFrequency: 0.4,
            rankingAccuracy: 0.7,
            logLevel: 'normal',
            validateEachRound: true,
            continueOnError: true,
            ...config
        };
        
        this.results = {
            testId: `test_${Date.now()}`,
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
            console.log('🚀 Starting Outrank Automated Test v3');
            console.log('=====================================');
            
            this.results.startTime = Date.now();
            
            // Pre-flight checks
            await this.validateEnvironment();
            
            // Initialize game
            await GameInterface.initializeGame();
            await GameInterface.setupPlayers(this.config.playerNames);
            
            // Play rounds
            for (let round = 1; round <= this.config.maxRounds; round++) {
                const roundResult = await this.playRound(round);
                this.results.rounds.push(roundResult);
                
                if (roundResult.errors.length > 0 && !this.config.continueOnError) {
                    console.log('⏹️ Stopping test due to errors');
                    break;
                }
                
                if (this.shouldEndGame()) {
                    console.log('🏁 Game ending condition met');
                    break;
                }
            }
            
            // Finalize
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
    
    async validateEnvironment() {
        console.log('🔍 Validating test environment...');
        
        const issues = ValidationEngine.validateGameState();
        if (issues.length > 0) {
            throw new Error(`Environment validation failed: ${issues.join(', ')}`);
        }
        
        console.log('✅ Environment validation passed');
    }
    
    async playRound(roundNumber) {
        const roundData = {
            round: roundNumber,
            category: null,
            bidWinner: null,
            bidAmount: null,
            bidSuccess: null,
            blocks: [],
            errors: [],
            warnings: [],
            startTime: Date.now()
        };
        
        try {
            console.log(`\\n📍 ROUND ${roundNumber}`);
            console.log('='.repeat(20));
            
            // Phase 0: Prepare round state
            await GameInterface.prepareRound(roundNumber);
            
            // Phase 1: Category selection and card drawing
            const categoryResult = await GameInterface.selectCategoryAndDrawCards();
            roundData.category = categoryResult.category;
            
            // Phase 2: Bidding
            const bidResult = await GameInterface.executeBidding(this.config.playerNames, 'realistic');
            roundData.bidWinner = bidResult.winner;
            roundData.bidAmount = bidResult.amount;
            
            // Phase 3: Blocking
            const blocks = await GameInterface.executeBlocking(
                this.config.playerNames, 
                bidResult.winner, 
                this.config.blockFrequency
            );
            roundData.blocks = blocks;
            
            // Phase 4: Ranking
            const rankingResult = await GameInterface.executeRanking(
                bidResult.winner,
                bidResult.amount,
                this.config.rankingAccuracy
            );
            roundData.bidSuccess = rankingResult.success;
            
            // Phase 5: Scoring
            await GameInterface.calculateScores();
            
            // Phase 6: Validation
            if (this.config.validateEachRound) {
                const validation = ValidationEngine.validateRoundIntegrity(roundData);
                roundData.errors = validation.errors;
                roundData.warnings = validation.warnings;
                
                // Add to overall results
                this.results.errors.push(...validation.errors);
                this.results.warnings.push(...validation.warnings);
            }
            
            roundData.endTime = Date.now();
            roundData.duration = roundData.endTime - roundData.startTime;
            
            console.log(`✅ Round ${roundNumber} complete (${roundData.duration}ms)`);
            
            return roundData;
            
        } catch (error) {
            console.error(`❌ Round ${roundNumber} failed:`, error.message);
            
            roundData.errors.push({
                type: 'ROUND_ERROR',
                message: error.message,
                phase: 'unknown'
            });
            
            roundData.endTime = Date.now();
            roundData.duration = roundData.endTime - roundData.startTime;
            
            return roundData;
        }
    }
    
    shouldEndGame() {
        // Simple ending conditions
        const drawnCards = GameState.get('drawnCards') || [];
        return drawnCards.length < 10;
    }
    
    async finalizeResults() {
        this.results.endTime = Date.now();
        
        // Collect final player stats
        this.config.playerNames.forEach(player => {
            const stats = GameState.get(`players.stats.${player}`) || {};
            const score = GameState.get(`players.scores.${player}`) || 0;
            
            this.results.playerStats[player] = {
                ...stats,
                finalScore: score
            };
        });
        
        // Generate summary
        this.results.summary = {
            duration: this.results.endTime - this.results.startTime,
            roundsPlayed: this.results.rounds.length,
            totalErrors: this.results.errors.length,
            totalWarnings: this.results.warnings.length,
            testPassed: this.results.errors.length === 0
        };
        
        // Log summary
        console.log('\\n📊 TEST COMPLETE');
        console.log('=================');
        console.log(`Duration: ${this.results.summary.duration}ms`);
        console.log(`Rounds: ${this.results.summary.roundsPlayed}`);
        console.log(`Errors: ${this.results.summary.totalErrors}`);
        console.log(`Status: ${this.results.summary.testPassed ? '✅ PASSED' : '❌ FAILED'}`);
        
        if (this.results.errors.length > 0) {
            console.log('\\n❌ Errors found:');
            this.results.errors.forEach((error, i) => {
                console.log(`  ${i + 1}. ${error.rule || error.type}: ${error.message}`);
            });
        }
        
        // Save globally for inspection
        window.lastTestResults = this.results;
    }
}

// Export for use
window.OutrankTestV3 = TestOrchestrator;

// Convenience function
window.runTestV3 = async function(config = {}) {
    const test = new TestOrchestrator(config);
    return await test.run();
};

// Predefined configurations
window.testConfigsV3 = {
    quick: {
        playerNames: ['Alice', 'Bob', 'Charlie', 'Diana'],
        maxRounds: 5,
        blockFrequency: 0.8,
        rankingAccuracy: 0.8,
        logLevel: 'normal',
        continueOnError: true
    },
    
    thorough: {
        maxRounds: 8,
        blockFrequency: 0.6,
        rankingAccuracy: 0.5,
        logLevel: 'detailed'
    },
    
    stress: {
        maxRounds: 15,
        blockFrequency: 0.8,
        rankingAccuracy: 0.3,
        logLevel: 'minimal'
    }
};

console.log('✅ Outrank Automated Test v3 loaded');
console.log('Usage: runTestV3(config)');
console.log('Configs: testConfigsV3.quick, testConfigsV3.thorough, testConfigsV3.stress');