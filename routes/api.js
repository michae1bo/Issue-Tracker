'use strict';
const mongoose = require('mongoose');
require('dotenv').config();


module.exports =  function (app) {

  mongoose.connect(process.env.MONGO_URI);

  const issueTrackerSchema = new mongoose.Schema({
    issue_title: String,
    issue_text: String,
    created_on: Date,
    updated_on: Date,
    created_by: String,
    assigned_to: String,
    open: Boolean,
    status_text: String
  });

  const IssueTracker = mongoose.model('IssueTracker', issueTrackerSchema);
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      let body = req.body;
      let response;
      if (body.issue_title && body.issue_text && body.created_by) {
        const issueObject = {};
        issueObject.issue_title = body.issue_title;
        issueObject.issue_text = body.issue_text;
        issueObject.created_by = body.created_by;
        issueObject.created_on = new Date().toDateString();
        issueObject.updated_on = issueObject.created_on;
        issueObject.assigned_to = body.assigned_to ? body.assigned_to : "";
        issueObject.status_text = body.status_text ? body.status_text : "";
        issueObject.open = true;
        const newIssue = new IssueTracker(issueObject);
        response = await newIssue.save();
      } else {
        response =  {error: "required field(s) missing" };
      }
      console.log(response);
      res.json(response);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
