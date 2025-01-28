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
            return issue._id.toString() == req.query._id;
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
    
    .put(async function (req, res){
      let project = req.params.project;
      let response;
      let projectResponse = await IssueTracker.findOne({ project: project });
      if (projectResponse === null) {
        response = { error: 'no such project'}; 
      } else {
        if (req.body._id) {
          let foundId = false;
          let issueIndex;
          for (let i = 0; i < projectResponse.issues.length; i++) {
            if (projectResponse.issues[i]._id.toString() === req.body._id) {
              issueIndex = i;
              foundId = true;
              break;
            }
          }
          if (req.body.issue_title || req.body.issue_text || req.body.created_by || req.body.assigned_to || req.body.status_text || req.body.open) {
            if (foundId) {
              if (req.body.issue_title) {
                projectResponse.issues[issueIndex].issue_title = req.body.issue_title;
              }
              if (req.body.issue_text) {
                projectResponse.issues[issueIndex].issue_text = req.body.issue_text;
              }
              if (req.body.created_by) {
                projectResponse.issues[issueIndex].created_by = req.body.created_by;
              }
              if (req.body.assigned_to) {
                projectResponse.issues[issueIndex].assigned_to = req.body.assigned_to;
              }
              if (req.body.status_text) {
                projectResponse.issues[issueIndex].status_text = req.body.status_text;
              }
              if (req.body.open === 'false') {
                projectResponse.issues[issueIndex].open = false;
              } else if (req.body.open === 'true') {
                projectResponse.issues[issueIndex].open = true;
              }
              projectResponse.issues[issueIndex].updated_on = new Date().toString();
              const gotSaved = await projectResponse.save();
              if (gotSaved === null) {
                response = { error: 'could not update', '_id': req.body_id };
              } else {
                response = {  result: 'successfully updated', '_id': req.body._id };
              }
            } else {
              response = { error: 'could not update', '_id': req.body._id };
            }
          } else {
            response = { error: 'no update field(s) sent', '_id': req.body._id }
          }
        } else {
          response = { error: 'missing _id' };
        } 
      } 
      res.json(response);
    })
    
    .delete(async function (req, res){
      let project = req.params.project;
      let response;
      let projectResponse = await IssueTracker.findOne({ project: project });
      if (projectResponse === null) {
        response = { error: 'no such project'}; 
      } else {
        if (req.body._id) {
          let foundId = false;
          let issueIndex;
          for (let i = 0; i < projectResponse.issues.length; i++) {
            if (projectResponse.issues[i]._id.toString() === req.body._id) {
              issueIndex = i;
              foundId = true;
              break;
            }
          }
          if (foundId) {
            projectResponse.issues = projectResponse.issues.slice(0, issueIndex).concat(projectResponse.issues.slice(issueIndex + 1));
            const gotSaved = await projectResponse.save();
            if (gotSaved === null) {
              response = { error: 'could not delete', '_id': req.body._id };
            } else {
              response = { result: 'successfully deleted', '_id': req.body._id };
            }
          } else {
            response = { error: 'could not delete', '_id': req.body._id };
          }
        } else {
          response = { error: 'missing _id' };
        }
      }
      res.json(response);
    });
    
};
