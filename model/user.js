const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    email : {
        type: String,
        required: true,
        trim: true,
    },
    user_hasPaid : {
        type: Boolean,
        required: true,
        default: false
    },
    number_of_calls: {
      type: Number,
      default: 0
    },
    beta_access_code: {
      type: String,
      default: ""
    },
    subscription_cancelled: {
      type: Boolean,
      required: true,
      default: false
    },
    subscription_tier: {
      type: Number,
      default: 1
    },
    game: {
      type: String,
      default: "Decentraland"
    },
    number_of_searches: {
      type: Number,
      default: 0
    },
    number_of_dcl_calls: {
      type: Number,
      default: 0
    },
    num_logins : {
      type: Number,
      default: 0
    }
},{
  timestamps: true,
  versionKey: false
})

const User = mongoose.model('User', schema);

module.exports = User;
