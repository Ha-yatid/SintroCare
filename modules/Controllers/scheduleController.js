const DosageEntry = require('../models/UserDosageEntry');
const UserPatient = require('../models/UserPatient');
const Medication = require('../models/Medication');
const Analysis = require('../models/Analyse');
const Schedule = require('../models/Schedule');

const mongoose = require('mongoose');

// Function to retrieve and verify dosage entry, user, medication, and analysis data
const getDosageEntryData = async (dosageEntryId) => {
  const dosageEntry = await DosageEntry.findById(dosageEntryId);
  if (!dosageEntry) throw new Error('Dosage Entry not found');
  
  //console.log("Fetched Dosage Entry:", dosageEntry);

  const { userId, medicationId, cycleDose, analysisId } = dosageEntry;
  
  if (!cycleDose || cycleDose.length === 0) throw new Error('Cycle dose data is missing');

  const user = await UserPatient.findById(userId);
  if (!user) throw new Error('User not found');

  const medication = await Medication.findById(medicationId);
  if (!medication) throw new Error('Medication not found');

  const analysis = await Analysis.findById(analysisId);
  if (!analysis) throw new Error('Analysis not found');

  //console.log("Fetched Dosage Entry:", dosageEntry);
  //console.log("Fetched User:", user);
  //console.log("Fetched Medication:", medication);
  //console.log("Fetched Analysis:", analysis);

  
  const endDate = analysis.nextAnalysisDateRecomander;

  //console.log("Fetched ENDDATE:", endDate, cycleDose);
  if (!endDate) throw new Error('Next analysis date not found for this analysis');

  return { dosageEntry, user, medication, analysis, cycleDose, endDate };
};

const calculateDailyDosages = (startDate, endDate, cycleDose, analysisId) => {
  const diffInTime = new Date(endDate) - startDate;
  const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24)) + 1;

  let dailyDosages = [];
  for (let i = 0; i < diffInDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);

    // Calculate the dosage based on the cycle
    const cycleIndex = i % cycleDose.length;
    const dosageAmount = cycleDose[cycleIndex];

    dailyDosages.push({
      day: currentDate,
      dosageAmount, // Use "dosageAmount" instead of "dosage"
      analysisId,
    });
  }
  return dailyDosages;
};


// Function to create and save the dosage schedule in the database
const saveSchedule = async (userId, medicationId, startDate, endDate, analysisId, dailyDosages) => {
  const newSchedule = new Schedule({
    userId,
    medicationId,
    startDate,
    endDate,
    analysisId,
    dailyDosages,
  });

  await newSchedule.save();
  return newSchedule;
};

// Main function to create a dosage schedule
const createScheduleFromDosageEntry = async (req, res) => {
  try {

    const { dosageEntryId } = req.body;

    //console.log("11111111111111111111111111",dosageEntryId)
    // Step 1: Get required data
    const { dosageEntry, user, medication, analysis, cycleDose, endDate } = await getDosageEntryData(dosageEntryId);
    
    //console.log("22222222222222222222222",dosageEntry, user, medication, analysis, cycleDose, endDate)

    // Step 2: Calculate daily dosages
    const startDate = new Date();
    const dailyDosages = calculateDailyDosages(startDate, endDate, cycleDose, analysis._id);
    //console.log("333333333333333333333333",dailyDosages)
    // Step 3: Save the schedule to the database
    const newSchedule = await saveSchedule(user._id, medication._id, startDate, endDate, analysis._id, dailyDosages);

    //console.log("444444444444444444444444",newSchedule)

    return res.status(201);
    
  } catch (error) {
    console.error('Error creating schedule:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};



const getScheduleByDate= async (req, res) => {
  try {
    

    const today = new Date(req.params.today);
    const idpatient = req.params.userid;
    const idpatientCo = new mongoose.Types.ObjectId(idpatient);
    //console.log("dateana " ,idpatient ,today);

    const todayString = today.toISOString().split('T')[0]; // Get YYYY-MM-DD part
    //console.log("dateana ", todayString);
    //console.log("dateanaé ", normalizedToday);

    const schedule = await Schedule.findOne({
      "userId": idpatientCo,
      "dailyDosages.day": {
        $gte: new Date(todayString + "T00:00:00.000Z"),
        $lt: new Date(todayString + "T23:59:59.999Z") 
      } 
    }).select("dailyDosages"); 
    //console.log("sheduel", schedule)

    if (!schedule) {
      //return res.status(404).json({ message: 'No schedule found for today' });
      return res.status(200).json({ 
        message: 'No schedule found for today', 
        data: null 
      });
    }

    // Find the dosage for today from the dailyDosages array
    const todaysDosage = schedule.dailyDosages.find(dosage => {
      const dosageDate = new Date(dosage.day);
      const dosageDateString = dosageDate.toISOString().split('T')[0]; 
      //console.log('dosageDateString', dosageDateString)
      return dosageDateString=== todayString; 
    });

    if (todaysDosage) {
      res.status(200).json({ dosageAmount: todaysDosage.dosageAmount });
    } else {
      res.status(404).json({ message: 'No dosage found for today' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createScheduleFromDosageEntry,
  getScheduleByDate
};

