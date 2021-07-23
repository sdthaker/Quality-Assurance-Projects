'use strict';

const mongoose = require('mongoose')

module.exports = function (app) {
  
  //DB Connection & Schema layout 
  mongoose.connect(process.env.DB,{useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true})
  const issueModel = require('../models/issue')

  //Routes
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      
      let obj = Object.assign(req.query)
      obj['project'] = project
      
      issueModel.find(obj).exec()
        .then(data => {
            if(data) {
              let obj = []
              data.forEach(data => {
                obj.push({_id: data._id, assigned_to: data.assigned_to, status_text: data.status_text, issue_title: data.issue_title, issue_text: data.issue_text, created_by: data.created_by, created_on: data.created_on, updated_on: data.updated_on, open: data.open})
              })
              return res.json(obj)
            }
          })
        .catch(err => console.log(err))
    })
    
    .post(function (req, res){
      let project = req.params.project;

      let {issue_title, issue_text, created_by, assigned_to, status_text} = req.body

      if(!issue_title || !issue_text || !created_by)
        return res.json({error: 'required field(s) missing'})

      const issue = new issueModel({
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        issue_title: issue_title,
        issue_text: issue_text,
        created_by: created_by,
        created_on: new Date(),
        updated_on: new Date(),
        project: project
      })

      issue.save((err, data) => {
        if(err) return console.log(err)
        let obj = {_id: data._id, assigned_to: data.assigned_to, status_text: data.status_text, issue_title: data.issue_title, issue_text: data.issue_text, created_by: data.created_by, created_on: data.created_on, updated_on: data.updated_on, open: data.open}
        return res.json(obj)
      })
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let obj = Object.assign(req.body)
      let flag = false

      if(Object.keys(obj).length === 0){
        flag = true
        return res.json({error: 'missing _id'})
      }
      else if(Object.keys(obj).length === 1 && obj._id){
        flag = true
        return res.json({ error: 'no update field(s) sent', '_id': obj._id })
      }
      else if(Object.keys(obj).length >= 2 && obj._id){
        flag = true
        obj.updated_on = new Date()

        issueModel.findByIdAndUpdate(obj._id, obj).exec()
        .then(data => {
          if(data) return res.json({result: 'successfully updated', '_id': obj._id})
          else return res.json({error: 'could not update', '_id': obj._id})
        })
        .catch(err => console.log(err))
      }
      
      if(!flag) return res.json({error: 'could not update', '_id': obj._id})
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let obj = Object.assign(req.body)
      //console.log(obj)
      if(!obj._id) return res.json({ error: 'missing _id'})
      else{
        issueModel.findByIdAndDelete(obj._id).exec()
        .then(data => {
          if(data) res.json({result: 'successfully deleted', '_id': obj._id})
          else res.json({ error: 'could not delete', '_id': obj._id })
        })
        .catch(err => console.log(err))
      }
    });  
};
