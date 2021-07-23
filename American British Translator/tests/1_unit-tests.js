const chai = require('chai');
const assert = chai.assert;

const translator = require('../components/translator.js');

suite('Unit Tests', () => {

    test('Translate Mangoes are my favorite fruit. to British English', (done) => {
        assert.equal(translator('Mangoes are my favorite fruit.', 'american-to-british')[0], 'Mangoes are my favourite fruit.')
        done()
    })

    test('Translate I ate yogurt for breakfast. to British English', (done) => {
        assert.equal(translator('I ate yogurt for breakfast.', 'american-to-british')[0], 'I ate yoghurt for breakfast.')
        done()
    })
    test('Translate We had a party at my friend\'s condo. to British English', (done) => {
        assert.equal(translator('We had a party at my friend\'s condo.', 'american-to-british')[0], 'We had a party at my friend\'s flat.')
        done()
    })

    test('Translate Can you toss this in the trashcan for me? to British English', (done) => {
        assert.equal(translator('Can you toss this in the trashcan for me?', 'american-to-british')[0], 'Can you toss this in the bin for me?')
        done()
    })

    test('Translate The parking lot was full. to British English', (done) => {
        assert.equal(translator('The parking lot was full.', 'american-to-british')[0], 'The car park was full.')
        done()
    })

    test('Translate Like a high tech Rube Goldberg machine. to British English', (done) => {
        assert.equal(translator('Like a high tech Rube Goldberg machine.', 'american-to-british')[0], 'Like a high tech Heath Robinson device.')
        done()
    })

    test('Translate To play hooky means to skip class or work. to British English', (done) => {
        assert.equal(translator('To play hooky means to skip class or work.', 'american-to-british')[0], 'To bunk off means to skip class or work.')
        done()
    })

    test('Translate No Mr. Bond, I expect you to die. to British English', (done) => {
        assert.equal(translator('Mr. Bond, I expect you to die.', 'american-to-british')[0], 'Mr Bond, I expect you to die.')
        done()
    })

    test('Translate Dr. Grosh will see you now. to British English', (done) => {
        assert.equal(translator('Dr. Grosh will see you now.', 'american-to-british')[0], 'Dr Grosh will see you now.')
        done()
    })
    test('Translate Lunch is at 12:15 today. to British English', (done) => {
        assert.equal(translator('Lunch is at 12:15 today.', 'american-to-british')[0], 'Lunch is at 12.15 today.')
        done()
    })

    test('Translate We watched the footie match for a while. to American English', (done) => {
        assert.equal(translator('We watched the footie match for a while.', 'british-to-american')[0], 'We watched the soccer match for a while.')
        done()
    })

    test('Translate Paracetamol takes up to an hour to work. to American English', (done) => {
        assert.equal(translator('Paracetamol takes up to an hour to work.', 'british-to-american')[0], 'Tylenol takes up to an hour to work.')
        done()
    })
    test('Translate First, caramelise the onions. to American English', (done) => {
        assert.equal(translator('First, caramelise the onions.', 'british-to-american')[0], 'First, caramelize the onions.')
        done()
    })
    test('Translate I spent the bank holiday at the funfair. to American English', (done) => {
        assert.equal(translator('I spent the bank holiday at the funfair.', 'british-to-american')[0], 'I spent the public holiday at the carnival.')
        done()
    })
    test('Translate I had a bicky then went to the chippy. to American English', (done) => {
        assert.equal(translator('I had a bicky then went to the chippy.', 'british-to-american')[0], 'I had a cookie then went to the fish-and-chip shop.')
        done()
    })
    test('Translate I\'ve just got bits and bobs in my bum bag. to American English', (done) => {
        assert.equal(translator('I\'ve just got bits and bobs in my bum bag.', 'british-to-american')[0], 'I\'ve just got odds and ends in my fanny pack.')
        done()
    })
    test('Translate The car boot sale at Boxted Airfield was called off. to American English', (done) => {
        assert.equal(translator('The car boot sale at Boxted Airfield was called off.', 'british-to-american')[0], 'The swap meet at Boxted Airfield was called off.')
        done()
    })
    
    test('Translate Have you met Mrs Kalyani? to American English', (done) => {
        assert.equal(translator('Have you met Mrs Kalyani?', 'british-to-american')[0], 'Have you met Mrs. Kalyani?')
        done()
    })

    test('Translate Prof Joyner of King\'s College, London. to American English', (done) => {
        assert.equal(translator('Prof Joyner of King\'s College, London.', 'british-to-american')[0], 'Prof. Joyner of King\'s College, London.')
        done()
    })

    test('Translate Tea time is usually around 4 or 4.30. to American English', (done) => {
        assert.equal(translator('Tea time is usually around 4 or 4.30.', 'british-to-american')[0], 'Tea time is usually around 4 or 4:30.')
        done()
    })

    test('Highlight translation in Mangoes are my favorite fruit.', (done) => {
        assert.equal(translator('Mangoes are my favorite fruit.', 'american-to-british')[1], 'Mangoes are my <span class=\"highlight\">favourite</span> fruit.')
        done()
    })

    test('Highlight translation in I ate yogurt for breakfast.', (done) => {
        assert.equal(translator('I ate yogurt for breakfast.','american-to-british')[1], 'I ate <span class=\"highlight\">yoghurt</span> for breakfast.')
        done()
    })

    test('Highlight translation in We watched the footie match for a while.', (done) => {
        assert.equal(translator('We watched the footie match for a while.', 'british-to-american')[1], 'We watched the <span class=\"highlight\">soccer</span> match for a while.')
        done()
    })

    test('Highlight translation in Paracetamol takes up to an hour to work.', (done) => {
        assert.equal(translator('Paracetamol takes up to an hour to work.','british-to-american')[1], '<span class=\"highlight\">Tylenol</span> takes up to an hour to work.')
        done()
    })
});
