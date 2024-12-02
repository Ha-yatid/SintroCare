const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dailyDosageSchema = new Schema({
  day: Date,
  dosageAmount: Number, // Adjusting for "dosageAmount" instead of just "dosage"
  analysisId: { type: Schema.Types.ObjectId, ref: 'Analysis' }
});

const scheduleSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'UserPatient' },
  medicationId: { type: Schema.Types.ObjectId, ref: 'Medication' },
  startDate: Date,
  endDate: Date,
  analysisId: { type: Schema.Types.ObjectId, ref: 'Analysis' },
  dailyDosages: [dailyDosageSchema] // Array of daily dosage entries
});

module.exports = mongoose.model('Schedule', scheduleSchema);
