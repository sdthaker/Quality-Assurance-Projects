const mongoose = require('mongoose')
let mongooseHidden = require('mongoose-hidden')()

const { Schema } = mongoose
const issueSchema = new Schema({
    assigned_to: {type: String},
    status_text: {type: String},
    open: {type: Boolean, default: true, required: true},
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by: {type: String, required: true},
    created_on: {type: Date, required: true},
    updated_on: {type: Date, required: true},
    project: {type: String, hide: true}
},  {versionKey: false})

issueSchema.plugin(mongooseHidden)

module.exports = mongoose.model('issueModel', issueSchema)