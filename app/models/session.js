var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;


var sessionSchema = new Schema({
    player: {type: Schema.Types.ObjectId, ref: 'playerSchema' },
    opponentPlayer: {type: Schema.Types.ObjectId, ref: 'playerSchema' },
    opponentCoach: {type: Schema.Types.ObjectId, ref: 'coachSchema' },
    status: {type: Boolean, default: true},
    game: {type: String, required: true},
    court: {type: String},
    type: {type: String, required: true, default: "Practice"},
    evaluator: {type: Schema.Types.ObjectId, ref: 'coachSchema' },
    winner: {type:String},
    result: [{type:String}] // "oldRanking-newRanking" // [player, opponentPlayer]
});

module.exports = mongoose.model('Session', sessionSchema);