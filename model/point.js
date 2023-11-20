const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    prompt : {
        type: String,
        required: true,
    },
    user_id : {
        type: String,
        required: true,
    },
    s3Link : {
        type: String,
        default: 'running',
    },
    is_approved : {
      type: Boolean,
      default: false
    },
    is_ticked : {
      type: Boolean,
      default: true
    },
    is_Hidden : {
      type: Boolean,
      default: false,
    },
    tick_score : {
      type: Number,
      default: 0
    },
    type : {
      type: String,
      default: "text"
    }
},{
  timestamps: true,
  versionKey: false
})

const Point = mongoose.model('Point', schema);

module.exports = Point;
