const mongoose = require('mongoose');
const AutoIncrementDosage = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;


const userDosageEntriesSchema = new Schema({
  //scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedules' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPatient', required: true },
  medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medications', required: true },
  cycleDose: { type: [Number], required: true }, // Cycle de doses (ex : [3/4, 1/2, 1/2])
  analysisId: { type: mongoose.Schema.Types.ObjectId, ref: 'Analyses' }, // ID de l'analyse liée (si nécessaire)
  createdAt: { type: Date, default: Date.now }

});
  
userDosageEntriesSchema.plugin(AutoIncrementDosage , { inc_field: 'userIdDOsage' });

const UserDosageEntries = mongoose.model('UserDosageEntries', userDosageEntriesSchema);
module.exports = UserDosageEntries;
  