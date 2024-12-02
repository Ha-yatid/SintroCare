const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const userPatientSchema = new Schema({
  FullName: { type: String, required: true },
  DateNaissance: { type: Date, required: true },
  age: { type: Number, default: function() { return new Date().getFullYear() - this.DateNaissance.getFullYear(); } },
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  TypeDeMaladie: { type: String, required: true },
  Address: { type: String, required: false },
  Ncin: { type: String, required: false },
  DateOperation: { type: Date},
  DoctorID: { type: mongoose.Schema.Types.ObjectId, ref: 'usersDocteur',required:false },

  createdAt: { type: Date, default: Date.now },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationCode: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});


userPatientSchema.plugin(AutoIncrement, { inc_field: 'userIdPatient' });

const UserPatient = mongoose.model('UserPatient', userPatientSchema);
module.exports = UserPatient;
