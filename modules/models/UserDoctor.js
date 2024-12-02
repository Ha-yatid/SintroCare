const mongoose = require('mongoose');
const AutoIncrementDoctor = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const usersDocteurSchema = new Schema({
  FullName: { type: String, required: true },//index in fields bd 
  DateNaissance: { type: Date, required: true },
  age: {type: Number, default: function() { return new Date().getFullYear() - this.DateNaissance.getFullYear(); } },
  email: { type: String, required: true, unique: true },
  userName: { type: String, unique: true },
  password: { type: String, required: true },
  NameCabinet: { type: String, required: true },
  AddressCabinet: { type: String, required: true },
  Speciality: { type: String, required: true },
  
  createdAt: { type: Date, default: Date.now },
  
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationCode: { type: String},
  resetPasswordToken: { type: String },
  sresetPasswordExpires: { type: Date }

});


usersDocteurSchema.plugin(AutoIncrementDoctor, { inc_field: 'userIdDoctor' });

const UsersDocteur = mongoose.model('UsersDocteur', usersDocteurSchema);

module.exports = UsersDocteur;
