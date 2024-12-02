const express = require('express');
const router = express.Router();
const { createScheduleFromDosageEntry,getScheduleByDate } = require('../controllers/scheduleController');

// Route pour créer un calendrier de dosage à partir d'une entrée de dosage
router.post('/create', createScheduleFromDosageEntry);
router.get('/:today/:userid', getScheduleByDate); 
// Autres routes (si nécessaires)
// router.get('/schedule/:id', getScheduleById); // Exemple : Récupérer un calendrier par ID
// router.put('/schedule/:id', updateSchedule); // Exemple : Mettre à jour un calendrier
// router.delete('/schedule/:id', deleteSchedule); // Exemple : Supprimer un calendrier

module.exports = router;
