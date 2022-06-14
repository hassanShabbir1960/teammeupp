var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    sender: {type: String, required: true},
    receiver: {type: String, required: true},
    header: {type: String, required: true},
    message: {type: String, requred: true},
    time: {type: Date, required: true},
    shown: {type: Boolean, required: true, default:false}
});

module.exports = mongoose.model('Notification', notificationSchema);