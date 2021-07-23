const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    suite('Test POST to POST on api/solve/', () => {

        test('test POST with valid puzzle string', done => {
            chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'solution')
                assert.equal(res.body.solution, '769235418851496372432178956174569283395842761628713549283657194516924837947381625')
                done()
            })
        })

        test('test POST with missing puzzle string', done => {
            chai
            .request(server)
            .post('/api/solve')
            .send({})
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Required field missing')
                done()
            })
        })

        test('test POST with invlaid characters', done => {
            chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.g.....6.62.71...9......1945....4.37.4.3..6.a'})
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Invalid characters in puzzle')
                done()
            })
        })

        test('test POST with incorrect length', done => {
            chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83.......6.62.71...9......1945....4.37.4.3..6....'})
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                done()
            })
        })

        test('test POST to solve puzzle that cannot be solved', done => {
            chai
            .request(server)
            .post('/api/solve')
            .send({puzzle: '..9..5.1.85.4....2432......1...69.83999999.6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'error')
                assert.equal(res.body.error, 'Puzzle cannot be solved')
                done()
            })
        })
    })

    suite('Test POST to POST on api/check/', () => {

        test('check a puzzle placement with all fields', done => {
            chai
            .request(server)
            .post('/api/check')
            .send({value: '7', coordinate: 'A1', puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                assert.isObject(res.body)
                assert.property(res.body, 'valid')
                assert.equal(res.body.valid, true)
                done()
            })
        })       
        
        test('check a puzzle placement with single placement conflict', done => {
            chai
            .request(server)
            .post('/api/check')
            .send({value: '1', coordinate: 'A4', puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                let arr =  { "valid": false, "conflict": [ "row" ] }

                assert.isObject(res.body)
                assert.property(res.body, 'valid')
                assert.property(res.body, 'conflict')
                assert.deepEqual(res.body, arr)
                done()
            })
        })       

        test('check a puzzle placement with multiple placement conflict', done => {
            chai
            .request(server)
            .post('/api/check')
            .send({value: '9', coordinate: 'A1', puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                let arr =  { "valid": false, "conflict": [ "row", "region" ] }

                assert.isObject(res.body)
                assert.property(res.body, 'valid')
                assert.property(res.body, 'conflict')
                assert.deepEqual(res.body, arr)
                done()
            })
        })      
        
        test('check a puzzle placement with all placement conflict', done => {
            chai
            .request(server)
            .post('/api/check')
            .send({value: '5', coordinate: 'A1', puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                let arr =  { "valid": false, "conflict": [ "row", "column","region" ] }

                assert.isObject(res.body)
                assert.property(res.body, 'valid')
                assert.property(res.body, 'conflict')
                assert.deepEqual(res.body, arr)
                done()
            })
        })
        
        test('check a puzzle placement with missing required fields', done => {
            chai
            .request(server)
            .post('/api/check')
            .send({value: '5', puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                let arr =  { "error": "Required field(s) missing" }

                assert.isObject(res.body)
                assert.property(res.body, 'error')
                assert.deepEqual(res.body, arr)
                done()
            })
        })   
        
        test('check a puzzle placement with invalid characters', done => {
            chai
            .request(server)
            .post('/api/check')
            .send({value: '5', coordinate: 'A1', puzzle: '..9..5.1.85.4....2432......1...69.83.9..a..6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                let arr =  { "error": "Invalid characters in puzzle" }

                assert.isObject(res.body)
                assert.property(res.body, 'error')
                assert.deepEqual(res.body, arr)
                done()
            })
        })   

        test('check a puzzle placement with incorrect length', done => {
            chai
            .request(server)
            .post('/api/check')
            .send({value: '5', coordinate: 'A1', puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.....'})
            .end((err, res) => {
                let arr =  { "error": 'Expected puzzle to be 81 characters long'}

                assert.isObject(res.body)
                assert.property(res.body, 'error')
                assert.deepEqual(res.body, arr)
                done()
            })
        })   

        test('check a puzzle placement with invalid placement coordinate', done => {
            chai
            .request(server)
            .post('/api/check')
            .send({value: '5', coordinate: 'A10', puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                let arr =  { "error": 'Invalid coordinate'}

                assert.isObject(res.body)
                assert.property(res.body, 'error')
                assert.deepEqual(res.body, arr)
                done()
            })
        })   

        test('check a puzzle placement with invalid placement value', done => {
            chai
            .request(server)
            .post('/api/check')
            .send({value: '50', coordinate: 'A1', puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'})
            .end((err, res) => {
                let arr =  { 'error': 'Invalid value'}

                assert.isObject(res.body)
                assert.property(res.body, 'error')
                assert.deepEqual(res.body, arr)
                done()
            })
        })   

    })

});

