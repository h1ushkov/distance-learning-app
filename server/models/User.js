const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
  fname: {
type: String,
  },
  lname:{
    type: String,
  },
  mname:{
    type: String,
  },
  username: {
    type: String,
    required: [true, "Add username!"],
    unique:[true, "Not unique username!"]
  },
  email: {
    type: String,
    unique:[true, "Not unique email!"]
  },
  password: {
    type: String,
    required: [true, "Add pass!"],
  },
  role: {
    type: String,
    required: [true, "Add role!"],
  },
  grades: [{
    type: Array,
  }]
});

userSchema.statics.findByUsername = async function (username) {
  return this.findOne({ username });
};
const User = mongoose.model('Users', userSchema);

module.exports = User;
