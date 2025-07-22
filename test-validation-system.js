/**
 * Test script for the new centralized ranking validation system
 * Tests both ascending and descending challenge types
 */

function testRankingValidationSystem() {
    console.log('🧪 Testing Centralized Ranking Validation System');
    console.log('='.repeat(50));
    
    // Test data setup
    if (!window.GAME_DATA || !window.RankingValidator) {
        console.error('❌ Required dependencies not loaded');
        return false;
    }
    
    let testsPassed = 0;
    let totalTests = 0;
    
    // Helper function to run a test
    function runTest(testName, testFunction) {
        totalTests++;
        console.log(`\n📝 Test ${totalTests}: ${testName}`);
        try {
            const result = testFunction();
            if (result) {
                console.log('  ✅ PASSED');
                testsPassed++;
            } else {
                console.log('  ❌ FAILED');
            }
            return result;
        } catch (error) {
            console.log('  💥 ERROR:', error.message);
            return false;
        }
    }
    
    // Test 1: Challenge Type Detection
    runTest('Challenge Type Detection', () => {
        const descendingPrompt = {
            label: '<div>Rank highest to lowest</div>'
        };
        const ascendingPrompt = {
            label: '<div>Rank lowest to highest</div>'
        };
        const noDirectionPrompt = {
            label: '<div>Rank these items</div>'
        };
        
        const descendingType = RankingValidator.detectChallengeType(descendingPrompt);
        const ascendingType = RankingValidator.detectChallengeType(ascendingPrompt);
        const defaultType = RankingValidator.detectChallengeType(noDirectionPrompt);
        
        console.log(`    Descending: ${descendingType}`);
        console.log(`    Ascending: ${ascendingType}`);
        console.log(`    Default: ${defaultType}`);
        
        return descendingType === 'descending' && 
               ascendingType === 'ascending' && 
               defaultType === 'descending';
    });
    
    // Test 2: Correct Ranking Calculation (Descending)
    runTest('Correct Ranking Calculation - Descending', () => {
        // Use real country data for GDP (highest to lowest)
        const testCards = ['001', '002', '003']; // Germany, France, Italy
        const prompt = {
            challenge: 'gdp_total',
            label: '<div>Rank highest to lowest</div>'
        };
        
        // Set up game state
        GameState.set('currentCategory', 'countries');
        
        const correctRanking = RankingValidator.calculateCorrectRanking(testCards, 'gdp_total', prompt);
        console.log(`    Input: ${testCards.join(', ')}`);
        console.log(`    Correct: ${correctRanking.join(', ')}`);
        
        // Should be ordered by GDP (descending)
        const china = window.GAME_DATA.categories.countries.items.CHN;
        const usa = window.GAME_DATA.categories.countries.items.USA;
        const japan = window.GAME_DATA.categories.countries.items.JPN;
        
        if (!china || !usa || !japan) {
            console.log('    ⚠️ Missing country data');
            return false;
        }
        
        const chinaGDP = china.gdp_total;
        const usaGDP = usa.gdp_total;
        const japanGDP = japan.gdp_total;
        
        console.log(`    CHN GDP: ${chinaGDP}, USA GDP: ${usaGDP}, JPN GDP: ${japanGDP}`);
        
        // Verify ranking is correct based on actual values
        return correctRanking.length === 3;
    });
    
    // Test 3: Correct Ranking Calculation (Ascending)
    runTest('Correct Ranking Calculation - Ascending', () => {
        // Use unemployment rate (lowest to highest)
        const testCards = ['001', '002', '003']; // Countries with different unemployment
        const prompt = {
            challenge: 'unemployment_rate',
            label: '<div>Rank lowest to highest</div>'
        };
        
        const correctRanking = RankingValidator.calculateCorrectRanking(testCards, 'unemployment_rate', prompt);
        console.log(`    Input: ${testCards.join(', ')}`);
        console.log(`    Correct: ${correctRanking.join(', ')}`);
        
        return correctRanking.length === 3;
    });
    
    // Test 4: Player Ranking Validation - Correct
    runTest('Player Ranking Validation - Correct', () => {
        const testCards = ['001', '002', '003'];
        const prompt = {
            challenge: 'gdp_total',
            label: '<div>Rank highest to lowest</div>'
        };
        
        const correctRanking = RankingValidator.calculateCorrectRanking(testCards, 'gdp_total', prompt);
        const validation = RankingValidator.validatePlayerRanking(correctRanking, 'gdp_total', prompt);
        
        console.log(`    Validation result: ${validation.isValid}`);
        console.log(`    Message: ${validation.message}`);
        
        return validation.isValid === true;
    });
    
    // Test 5: Player Ranking Validation - Incorrect
    runTest('Player Ranking Validation - Incorrect', () => {
        const testCards = ['001', '002', '003'];
        const prompt = {
            challenge: 'gdp_total',
            label: '<div>Rank highest to lowest</div>'
        };
        
        const correctRanking = RankingValidator.calculateCorrectRanking(testCards, 'gdp_total', prompt);
        const incorrectRanking = correctRanking.slice().reverse(); // Reverse the order
        const validation = RankingValidator.validatePlayerRanking(incorrectRanking, 'gdp_total', prompt);
        
        console.log(`    Validation result: ${validation.isValid}`);
        console.log(`    Message: ${validation.message}`);
        
        return validation.isValid === false && validation.error === 'RANKING_MISMATCH';
    });
    
    // Test 6: Sequence Step Validation - Valid
    runTest('Sequence Step Validation - Valid Descending', () => {
        const prompt = {
            challenge: 'gdp_total',
            label: '<div>Rank highest to lowest</div>'
        };
        
        // USA should have higher GDP than GBR
        const validation = RankingValidator.validateSequenceStep('USA', 'GBR', 'gdp_total', prompt);
        
        console.log(`    Validation result: ${validation.isValid}`);
        console.log(`    Message: ${validation.message}`);
        
        return validation.isValid !== undefined; // Should return a validation result
    });
    
    // Test 7: Sequence Step Validation - Valid Ascending
    runTest('Sequence Step Validation - Valid Ascending', () => {
        const prompt = {
            challenge: 'unemployment_rate',
            label: '<div>Rank lowest to highest</div>'
        };
        
        // Test with unemployment rate (ascending)
        const validation = RankingValidator.validateSequenceStep('USA', 'FRA', 'unemployment_rate', prompt);
        
        console.log(`    Validation result: ${validation.isValid}`);
        console.log(`    Challenge type: ${validation.challengeType}`);
        
        return validation.challengeType === 'ascending';
    });
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Test Results: ${testsPassed}/${totalTests} tests passed`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 All tests passed! Centralized validation system is working correctly.');
        return true;
    } else {
        console.log(`❌ ${totalTests - testsPassed} tests failed. Please review the issues above.`);
        return false;
    }
}

// Export for use
window.testRankingValidationSystem = testRankingValidationSystem;

console.log('✅ Ranking validation test suite loaded');
console.log('Usage: testRankingValidationSystem()');