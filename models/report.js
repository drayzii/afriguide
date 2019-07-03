const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    onType: {
        type: String,
        required: true
    },
    reportOn: {
        type: String,
        required: true
    }
})

const Report = mongoose.model('Report', ReportSchema)

module.exports = Report