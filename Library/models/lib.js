const mongoose = require('mongoose')
const {Schema} = mongoose

const librarySchema = new Schema ({
title: {type: String},
comments: [{type: String}],
commentcount: {type: Number , default: 0}
})

module.exports = mongoose.model('libraryModel',librarySchema)