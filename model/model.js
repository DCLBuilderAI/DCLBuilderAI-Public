const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    prompt : {
        type: String,
        required: true,
    },
    completion : {
        type: String,
        required: true,
    },
    is_approved : {
      type: Boolean,
      default: false
    },
    is_ticked : {
      type: Boolean,
      default: true
    },
    tick_score : {
      type: Number,
      default: 0
    },
    mode : {
      type: String,
      default: "ScripterAI"
    },
    game: {
      type: String,
      default: "Decentraland"
    }
},{
  timestamps: true,
  versionKey: false
})

const Model = mongoose.model('Model', schema);

module.exports = Model;
