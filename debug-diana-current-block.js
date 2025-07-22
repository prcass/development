// Debug why Diana's current block (023) isn't giving her a token
// Run this in browser console

function debugDianaCurrentBlock() {
    console.log('🔍 DEBUGGING DIANA\'S CURRENT BLOCK PROCESSING');
    console.log('=============================================');
    
    // Get Diana's current block
    const currentBlocks = GameState.get('players.currentBlocks') || {};
    const dianaBlock = currentBlocks['Diana'];
    
    if (!dianaBlock) {
        console.log('❌ No current block found for Diana');
        return;
    }
    
    console.log('\n📋 Diana\'s Current Block:');
    console.log('  cardId:', dianaBlock.cardId);
    console.log('  tokenValue:', dianaBlock.tokenValue);
    
    // Check game state
    const gameState = GameState.data;
    const currentCategory = gameState.currentCategory || 'countries';
    console.log('\n🎯 Current Category:', currentCategory);
    
    // Check card data
    const categoryData = window.GAME_DATA.categories[currentCategory];
    const cardData = categoryData ? categoryData.items[dianaBlock.cardId] : null;
    console.log('\n📇 Card Data for', dianaBlock.cardId + ':');
    console.log('  Found:', !!cardData);
    if (cardData) {
        console.log('  Name:', cardData.name);
    }
    
    // Check Diana's owned cards
    const ownedCards = GameState.get('players.ownedCards') || {};
    console.log('\n🏆 Diana\'s Owned Cards:');
    if (ownedCards.Diana) {
        Object.keys(ownedCards.Diana).forEach(category => {
            const cards = ownedCards.Diana[category];
            console.log(`  ${category}: [${cards.join(', ')}]`);
        });
    }
    
    // Check if Diana already owns this card
    console.log('\n🔍 Ownership Check:');
    const dianaOwnedInCategory = ownedCards.Diana && ownedCards.Diana[currentCategory] ? ownedCards.Diana[currentCategory] : [];
    const alreadyOwned = dianaOwnedInCategory.includes(dianaBlock.cardId);
    console.log(`  Does Diana own ${dianaBlock.cardId} in ${currentCategory}? ${alreadyOwned}`);
    console.log(`  Diana's cards in ${currentCategory}: [${dianaOwnedInCategory.join(', ')}]`);
    
    // Check if the scoring should process this block
    const highestBidder = GameState.get('highestBidder');
    console.log('\n🎯 Scoring Context:');
    console.log('  Highest bidder:', highestBidder);
    console.log('  Diana is bidder?', highestBidder === 'Diana');
    console.log('  Should process Diana\'s block?', highestBidder !== 'Diana');
    
    // Simulate the ownership check
    console.log('\n🔄 Simulating Token Ownership Check:');
    if (ACTIVE_RULES.tokenOwnership && dianaBlock.cardId) {
        console.log('  ✅ Token ownership rule enabled and cardId exists');
        if (!alreadyOwned) {
            console.log('  ✅ Card not already owned - should give token');
        } else {
            console.log('  ❌ Card already owned - duplicate check preventing token');
        }
    } else {
        console.log('  ❌ Token ownership rule disabled or no cardId');
    }
    
    return {
        dianaBlock,
        currentCategory,
        cardData,
        alreadyOwned,
        shouldProcess: highestBidder !== 'Diana',
        shouldGiveToken: ACTIVE_RULES.tokenOwnership && dianaBlock.cardId && !alreadyOwned
    };
}

// Auto-run
debugDianaCurrentBlock();