# Centralized Ranking Validation Architecture

## Overview

This document describes the new centralized ranking validation system implemented to eliminate multiple validation points and provide a single source of truth for ranking validation in the Outrank game.

## Problems Solved

### Before: Multiple Validation Points
1. **Manual gameplay validation** (around line 4958) - Used inline challenge type detection
2. **Automated test validation** - Used random success simulation  
3. **Display validation** - Repeated challenge type logic
4. **Inconsistent logic** - Different validation approaches in different contexts

### After: Centralized Architecture
- **Single RankingValidator class** handles all validation
- **Consistent challenge type detection** across all contexts
- **Proper ascending/descending support** for all challenge types
- **Detailed validation results** with error reporting

## Architecture Components

### 1. RankingValidator Class

Located in `/game.js` starting around line 4774, provides three main methods:

#### `detectChallengeType(prompt)`
- **Purpose**: Detect if challenge is ascending or descending from prompt label
- **Input**: Prompt object with label property
- **Output**: 'ascending' or 'descending'
- **Logic**: Searches prompt text for "lowest to highest" or "highest to lowest"
- **Default**: Returns 'descending' if no clear direction found

#### `calculateCorrectRanking(cardIds, challenge, prompt)`
- **Purpose**: Calculate the correct ranking order for given cards
- **Input**: Array of card IDs, challenge property name, prompt object
- **Output**: Correctly ordered array of card IDs
- **Logic**: 
  - Detects challenge type using `detectChallengeType()`
  - Sorts cards by challenge property values
  - Ascending: lowest to highest (valueA - valueB)
  - Descending: highest to lowest (valueB - valueA)
- **Error Handling**: Returns original order if data missing

#### `validatePlayerRanking(playerRanking, challenge, prompt)`
- **Purpose**: Validate player's ranking against correct order
- **Input**: Player's card ranking, challenge property, prompt object
- **Output**: Detailed validation result object
- **Features**:
  - Compares player ranking to correct ranking position by position
  - Returns first error location if invalid
  - Provides detailed error messages
  - Includes both correct and player rankings in result

#### `validateSequenceStep(prevCardId, currentCardId, challenge, prompt)`
- **Purpose**: Validate single step during card-by-card reveal
- **Input**: Previous card, current card, challenge property, prompt
- **Output**: Sequence validation result
- **Logic**:
  - Checks if current card maintains proper sequence with previous
  - Ascending: current >= previous
  - Descending: current <= previous
- **Use Case**: Used during manual reveal phase to detect sequence breaks

### 2. Integration Points

#### Manual Gameplay
- **Location**: `revealNext()` function around line 5160
- **Change**: Replaced inline validation logic with `RankingValidator.validateSequenceStep()`
- **Benefit**: Consistent validation using centralized logic

#### Display Updates  
- **Location**: `updateBidderRankingDisplay()` around line 5078
- **Change**: Replaced inline sequence checking with centralized validator
- **Benefit**: Display accuracy matches game validation

#### Automated Testing
- **Location**: `automated-test-v3.js` `executeRanking()` method
- **Change**: Replaced random success with realistic ranking simulation and validation
- **Features**:
  - Creates correct or slightly incorrect rankings based on accuracy parameter
  - Uses `RankingValidator.validatePlayerRanking()` for final validation
  - Provides detailed validation results in test output

#### Ranking Interface
- **Location**: `showRankingInterface()` around line 4521
- **Change**: Uses `RankingValidator.detectChallengeType()` for direction display
- **Benefit**: Consistent challenge type detection

### 3. Backward Compatibility

#### Legacy Function Wrapper
```javascript
function calculateCorrectRanking(cardIds, challenge) {
    var currentPrompt = GameState.get('currentPrompt');
    return RankingValidator.calculateCorrectRanking(cardIds, challenge, currentPrompt);
}
```
- Maintains compatibility with existing code that calls the old function
- Automatically uses current prompt from GameState

## Challenge Types Supported

### Descending Challenges (Highest to Lowest)
- GDP Total, GDP Growth, Health Expenditure
- Population metrics, Patent Applications
- Life Expectancy, Broadband/Mobile subscriptions
- Most economic and demographic indicators

### Ascending Challenges (Lowest to Highest)  
- Unemployment Rate, Cost of Healthy Diet
- Pollution Index, Crime Index
- Electricity from Coal/Oil (environmental negatives)
- Metrics where lower values are better

## Validation Result Objects

### Full Ranking Validation Result
```javascript
{
    isValid: boolean,
    error: string | null,           // 'INVALID_INPUT' | 'RANKING_MISMATCH' | null
    message: string,                // Human readable description
    firstError: {                   // Details of first error found
        position: number,
        playerCard: string,
        correctCard: string,
        message: string
    } | null,
    challengeType: string,          // 'ascending' | 'descending'
    correctRanking: Array,          // Correct order
    playerRanking: Array            // Copy of player's order
}
```

### Sequence Step Validation Result
```javascript
{
    isValid: boolean,
    error: string | null,           // 'SEQUENCE_BROKEN' | 'CATEGORY_DATA_MISSING' | etc.
    message: string,                // Human readable description
    challengeType: string,          // 'ascending' | 'descending'
    prevCard: {                     // Previous card details
        id: string,
        name: string,
        value: number
    },
    currentCard: {                  // Current card details
        id: string,
        name: string,
        value: number
    }
}
```

## Testing

### Test Suite
- **File**: `/test-validation-system.js`
- **Usage**: Load game data, then call `testRankingValidationSystem()`
- **Coverage**:
  - Challenge type detection for both directions
  - Correct ranking calculation for ascending/descending
  - Player ranking validation (both correct and incorrect)
  - Sequence step validation
  - Error handling and edge cases

### Automated Test Integration
- **Enhanced ValidationEngine**: Now validates ranking consistency in automated tests
- **Realistic Simulation**: Creates plausible ranking errors instead of random success
- **Detailed Logging**: Shows challenge type, validation results, and error details

## Benefits

1. **Single Source of Truth**: All validation logic centralized in RankingValidator
2. **Consistent Behavior**: Same validation logic across manual gameplay and automated tests
3. **Proper Challenge Support**: Correctly handles both ascending and descending challenges
4. **Better Error Reporting**: Detailed validation results with specific error locations
5. **Maintainable Code**: Easier to update validation logic in one place
6. **Comprehensive Testing**: Built-in test suite validates all functionality

## Usage Examples

### Basic Challenge Type Detection
```javascript
const prompt = { label: '<div>Rank lowest to highest</div>' };
const type = RankingValidator.detectChallengeType(prompt);
// Returns: 'ascending'
```

### Calculate Correct Ranking
```javascript
const cards = ['USA', 'CHN', 'JPN'];
const prompt = { challenge: 'gdp_total', label: '<div>Rank highest to lowest</div>' };
const correct = RankingValidator.calculateCorrectRanking(cards, 'gdp_total', prompt);
// Returns cards ordered by GDP (highest to lowest)
```

### Validate Player Ranking
```javascript
const playerRanking = ['CHN', 'USA', 'JPN'];
const validation = RankingValidator.validatePlayerRanking(playerRanking, 'gdp_total', prompt);
if (!validation.isValid) {
    console.log('Error:', validation.message);
    console.log('First error at position:', validation.firstError.position);
}
```

### Sequence Step Validation (during reveal)
```javascript
const validation = RankingValidator.validateSequenceStep('USA', 'CHN', 'gdp_total', prompt);
if (!validation.isValid) {
    console.log('Sequence broken:', validation.message);
    // Show failure state
}
```

This architecture provides a robust, maintainable foundation for all ranking validation needs in the Outrank game while ensuring consistency across all game contexts.