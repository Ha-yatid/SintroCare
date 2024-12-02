const mongoose = require('mongoose');
const AutoIncrementMedication = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const medicationsSchema = new Schema({
  // medicationId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  sideEffects: { type: String},
  PPV:{type:Number},//price
  doseNormale:{type:Number },
  PatientId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPatient'},
  createdAt: { type: Date, default: Date.now }
});
  
medicationsSchema.plugin(AutoIncrementMedication , { inc_field: 'userIdMedication' });

const Medications = mongoose.model('Medications', medicationsSchema);
module.exports = Medications;
