const mongoose = require('mongoose');
const AutoIncrementAnalyse = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const analysesSchema = new Schema({
    //analysisId: { type: String, required: true, unique: true },
    PatientId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPatient' , required: true},
    analysisDate: { type: Date, required: true },
    tpInrResult: { type: Number, required: true },
    recommendations: { type: String, required: false },
    dosageRecomand: { type: Number, required: false },
    NbreJrAnalyseProchaine: { type: Number, required: true, default:30 },
    // nextAnalysisDateRecomander: { type: Date, default: function() { return new Date(this.analysisDate + this.NbreJrAnalyseProchaine * 24 * 60 * 60 * 1000); } },
    createdAt: { type: Date, default: Date.now }
  });
  
// Middleware to calculate nextAnalysisDateRecomander based on NbreJrAnalyseProchaine
// analysesSchema.pre('save', function(next) {
//   if (this.NbreJrAnalyseProchaine) {
//       this.nextAnalysisDateRecomander = new Date(this.analysisDate.getTime() + this.NbreJrAnalyseProchaine * 24 * 60 * 60 * 1000);
//   }
//   next();
// });
analysesSchema.virtual('nextAnalysisDateRecomander').get(function () {
  if (this.analysisDate && this.NbreJrAnalyseProchaine) {
      return new Date(
          this.analysisDate.getTime() + this.NbreJrAnalyseProchaine * 24 * 60 * 60 * 1000
      );
  }
  return null;
});

// Activer les `virtuals` dans les JSON et objets
analysesSchema.set('toJSON', { virtuals: true });
analysesSchema.set('toObject', { virtuals: true });


analysesSchema.plugin(AutoIncrementAnalyse, { inc_field: 'userIdAnalyse' });

  
const Analyses = mongoose.model('Analyses', analysesSchema);
module.exports = Analyses;
  