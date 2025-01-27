'use strict';
const mongoose = require('mongoose');
require('dotenv').config();


module.exports = async function (app) {

  await mongoose.connect(process.env.MONGO_URI);

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
    
    .post(function (req, res){
      let project = req.params.project;
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
