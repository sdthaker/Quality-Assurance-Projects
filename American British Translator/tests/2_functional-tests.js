const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let translator = require('../components/translator.js');

suite('Functional Tests', () => {

    test('Translation with text and locale fields: POST request to /api/translate', done => {
        chai
        .request(server)
        .post('/api/translate')
        .send({text: 'Have you met Mrs Kalyani?', locale: 'british-to-american'})
        .end((err, res) => {
            assert.property(res.body, 'text')
            assert.equal(res.body.text, 'Have you met Mrs Kalyani?')
            assert.property(res.body, 'translation')
            assert.equal(res.body.translation, 'Have you met <span class="highlight">Mrs.</span> Kalyani?')
            done()
        })
    })

    test('Translation with text and invalid locale field: POST request to /api/translate', done => {
        chai
        .request(server)
        .post('/api/translate')
        .send({text: 'Have you met Mrs Kalyani?', locale: 'french-to-american'})
        .end((err, res) => {
            assert.property(res.body, 'error')
            assert.equal(res.body.error, 'Invalid value for locale field')
            done()
        })
    })

    test('Translation with missing text field: POST request to /api/translate', done => {
        chai
        .request(server)
        .post('/api/translate')
        .send({locale: 'british-to-american'})
        .end((err, res) => {
            assert.property(res.body, 'error')
            assert.equal(res.body.error, 'Required field(s) missing')
            done()
        })
    })

    test('Translation with missing locale field: POST request to /api/translate', done => {
        chai
        .request(server)
        .post('/api/translate')
        .send({text:'Hi there'})
        .end((err, res) => {
            assert.property(res.body, 'error')
            assert.equal(res.body.error, 'Required field(s) missing')
            done()
        })
    })

    test('Translation with empty text: POST request to /api/translate', done => {
        chai
        .request(server)
        .post('/api/translate')
        .send({text:'', locale: 'british-to-american'})
        .end((err, res) => {
            assert.property(res.body, 'error')
            assert.equal(res.body.error, 'No text to translate')
            done()
        })
    })

    test('Translation with text that needs no translation: POST request to /api/translate', done => {
        chai
        .request(server)
        .post('/api/translate')
        .send({text:'Hi there', locale: 'british-to-american'})
        .end((err, res) => {
            assert.property(res.body, 'text')
            assert.equal(res.body.text, 'Hi there')
            assert.property(res.body, 'translation')
            assert.equal(res.body.translation, 'Everything looks good to me!')
            done()
        })
    })
});
