const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { expect } = require('chai');
const Issue = require('../models/issue');
const { ObjectId } = require('mongodb');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('Test POST', () =>{
        
        test('Test POST with every field filled in', done => {
            chai
            .request(server)
            .post('/api/issues/apitest')
            .send({
                assigned_to: 'Soham',
                status_text: 'Not yet completed',
                issue_title: 'to be deleted',
                issue_text: 'Auth error',
                created_by: 'John',
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.equal(res.body.assigned_to, 'Soham')
                assert.equal(res.body.status_text, 'Not yet completed')
                assert.equal(res.body.issue_title, 'to be deleted')
                assert.equal(res.body.issue_text, 'Auth error')
                assert.equal(res.body.created_by, 'John')
                done()
            })
        })

        test('Test POST with only required fields', done => {
            chai
            .request(server)
            .post('/api/issues/apitest')
            .send({
                issue_title: 'to be deleted',
                issue_text: 'Auth error',
                created_by: 'John',
            })
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.equal(res.body.issue_title, 'to be deleted')
                assert.equal(res.body.issue_text, 'Auth error')
                assert.equal(res.body.created_by, 'John')
                assert.equal(res.body.assigned_to, '')
                assert.equal(res.body.status_text, '')
                done()
            })
        })

        test('Test POST with missing required fields', done => {
            chai
            .request(server)
            .post('/api/issues/apitest')
            .send({
                issue_title: 'Text',
            })
            .end((err, res) => {
                assert.equal(res.body.error, 'required field(s) missing')
                //assert.deepEqual(res.body, {error: 'required field(s) missing'})
                done()
            })
        })
    })

    suite('Test GET', () =>{
        
        test('Test GET to obtain an array of all issues for specific project', done => {
            chai
            .request(server)
            .get('/api/issues/apitest')
            .query({})
            .end((err, res) => {
                assert.equal(res.status, 200)
                assert.isArray(res.body, 'is array')
                assert.property(res.body[0], 'assigned_to')
                assert.property(res.body[0], 'status_text')
                assert.property(res.body[0], 'open')
                assert.property(res.body[0], 'issue_title')
                assert.property(res.body[0], 'issue_text')
                assert.property(res.body[0], 'created_by')
                assert.property(res.body[0], 'created_on')
                assert.property(res.body[0], 'updated_on')
                done()
            })
        })

        test('Test GET to apply one filter', done => {
            chai
            .request(server)
            .get('/api/issues/apitest')
            .query({created_by: 'Sam'})
            .end((err, res) => {
                assert.isArray(res.body, 'is array')
                res.body.forEach(issue => {
                    assert.equal(issue.created_by, 'Sam')
               })
               done()
            })
        })

        test('Test GET to apply multiple filters', done => {
            chai
            .request(server)
            .get('/api/issues/apitest')
            .query({created_by: 'Sam'}, {open: true})
            .end((err, res) => {
                assert.isArray(res.body, 'is array')
                res.body.forEach(issue => {
                    assert.equal(issue.created_by, 'Sam')
                    assert.equal(issue.open, true)
               })
               done()
            })
        })
    })

    suite('Test PUT', () =>{
        
        test('Test PUT to update one field', done => {
            chai
            .request(server)
            .put('/api/issues/apitest')
            .send({_id: '60f1e7716e4fbb24fcd38dc0', created_by: 'Sam'})
            .end((err, res) => {
                //assert.deepEqual(res.body, {result: 'successfully updated', '_id': '60f1e7716e4fbb24fcd38dc0'})
                assert.equal(res.body.result, 'successfully updated')
                assert.equal(res.body._id, '60f1e7716e4fbb24fcd38dc0')
                done()
            })
        })

        test('Test PUT to update multiple fields', done => {
            chai
            .request(server)
            .put('/api/issues/apitest')
            .send({_id: '60f1e7716e4fbb24fcd38dc0', created_by: 'Sam', issue_text: 'Sir'})
            .end((err, res) => {
                //assert.deepEqual(res.body, {result: 'successfully updated', '_id': '60f1e7716e4fbb24fcd38dc0'})
                assert.equal(res.body.result, 'successfully updated')
                assert.equal(res.body._id, '60f1e7716e4fbb24fcd38dc0')
                done()
            })
        })

        test('Test PUT to update issue with missing id', done => {
            chai
            .request(server)
            .put('/api/issues/apitest')
            .send({})
            .end((err, res) => {
                //assert.deepEqual(res.body, {error: 'missing _id'})
                assert.equal(res.body.error, 'missing _id')
                done()
            })
        })

        test('Test PUT to update issue with no fields to update', done => {
            chai
            .request(server)
            .put('/api/issues/apitest')
            .send({_id: '60f1e7716e4fbb24fcd38dc0'})
            .end((err, res) => {
                //assert.deepEqual(res.body, {error: 'no update field(s) sent', _id: '60f1e7716e4fbb24fcd38dc0'})
                assert.equal(res.body.error, 'no update field(s) sent')
                assert.equal(res.body._id, '60f1e7716e4fbb24fcd38dc0')
                done()
            })
        })

        test('Test PUT to update issue with invalid id', done => {
            chai
            .request(server)
            .put('/api/issues/apitest')
            .send({_id: '60f1bee4521da62c5ccd7641', issue_text:'sam'})
            .end((err, res) => {
                //assert.deepEqual(res.body, {error: 'could not update', '_id': '60f1bee4521da62c5ccd7641'})
                assert.equal(res.body.error, 'could not update')
                assert.equal(res.body._id, '60f1bee4521da62c5ccd7641')
                done()
            })
        })
    })

    suite('Test Delete', () =>{
        
        
        test('Test DELETE to delete an issue', async () => {
            const toDelete = await Issue.findOne({issue_title: 'to be deleted'}).exec()
            chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({_id: toDelete._id})
            .end((err, res) => {
                // assert.deepEqual(res.body, { 
                //     result: 'successfully deleted',
                //     '_id': ObjectId(toDelete._id).toString()
                // })
                assert.equal(res.body.result, 'successfully deleted')
                assert.equal(res.body._id, ObjectId(toDelete._id).toString())
                //done()
            })
        })

        test('Test DELETE with invalid id', done => {
            chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({_id: '60f1c7cd0e7e0e0a74771d25'})
            .end((err, res) => {
                //assert.deepEqual(res.body, {error: 'could not delete', '_id': '60f1c7cd0e7e0e0a74771d25'})
                assert.equal(res.body.error, 'could not delete')
                assert.equal(res.body._id, '60f1c7cd0e7e0e0a74771d25')
                done()
            })
        })

        test('Test DELETE with missing id', done => {
            chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({})
            .end((err, res) => {
                assert.equal(res.body.error, 'missing _id')
                //assert.deepEqual(res.body, {error: 'missing _id'})
                done()
            })
        })
    })
});
