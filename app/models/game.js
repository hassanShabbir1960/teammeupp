var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    name: { type: String, required: true, unique: true },
    courtNames: [{type: String, required: true}]
});

module.exports = mongoose.model('game', gameSchema);