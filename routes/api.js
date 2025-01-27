'use strict';
const mongoose = require('mongoose');
require('dotenv').config();


module.exports =  function (app) {

  mongoose.connect(process.env.MONGO_URI);

  const issueTrackerSchema = new mongoose.Schema({
    project: String,
    issues: [{
        issue_title: String,
        issue_text: String,
        created_on: Date,
        updated_on: Date,
        created_by: String,
        assigned_to: String,
        open: Boolean,
        status_text: String
      }]
  });

  const IssueTracker = mongoose.model('IssueTracker', issueTrackerSchema);
  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      let project = req.params.project;
      let response;
      const projectResponse = await IssueTracker.findOne({ project: project });
      if (projectResponse === null) {
        response = { error: 'no such project'};
      } else {
        let issues = projectResponse.issues;
        if (req.query._id) {
          issues = issues.filter((issue) => {
            return issue._id == req.query._id;
          });
        }
        if (req.query.issue_title) {
          issues = issues.filter((issue) => {
            return issue.issue_title == req.query.issue_title;
          });
        }
        if (req.query.issue_text) {
          issues = issues.filter((issue) => {
            return issue.issue_text == req.query.issue_text;
          });
        }
        if (req.query.created_on) {
          issues = issues.filter((issue) => {
            return issue.created_on == req.query.created_on;
          });
        }
        if (req.query.updated_on) {
          issues = issues.filter((issue) => {
            return issue.updated_on == req.query.updated_on;
          });
        }
        if (req.query.created_by) {
          issues = issues.filter((issue) => {
            return issue.created_by === req.query.created_by;
          });
          console.log(issues);
        }
        if (req.query.assigned_to) {
          issues = issues.filter((issue) => {
            return issue.assigned_to == req.query.assigned_to;
          });
        }
        if (req.query.status_text) {
          issues = issues.filter((issue) => {
            return issue.status_text == req.query.status_text;
          });
        }
        if (req.query.open === "true") {
          issues = issues.filter((issue) => {
            return issue.open === true;
          });
        } else if(req.query.open === "false") {
          issues = issues.filter((issue) => {
            return issue.open === false;
          });
        }
        response = issues;
      }
      res.json(response);
    })
    
    .post(async function (req, res){
      let project = req.params.project;
      let body = req.body;
      let response;
      let projectResponse = await IssueTracker.findOne({ project: project });
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
        if (projectResponse === null) {
          const newProject = new IssueTracker({ project: project, issues: [issueObject] });
          const savedProject = await newProject.save();
          response = savedProject.issues.pop();
        } else {
          projectResponse.issues.push(issueObject);
          const updatedProject = await projectResponse.save();
          response = updatedProject.issues.pop();
        }
      } else {
        response =  {error: "required field(s) missing" };
      }
      res.json(response);
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
