const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY); // Path to your downloaded key

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// References to the database paths
const db = admin.database();
const sensorDataRef = db.ref('sensor_data');
const sensorDataArrayRef = db.ref('sensor_data_array');

// Fetch data and convert to array
sensorDataRef.once('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    const arrayData = Object.keys(data).map(key => {
      const records = data[key];
      return Object.values(records)[0]; // Extract the nested record
    });
    sensorDataArrayRef.set(arrayData, (error) => {
      if (error) {
        console.error('Error updating array:', error);
      } else {
        console.log('Array updated successfully');
      }
      process.exit(); // Exit the script after completion
    });
  } else {
    console.log('No data to convert');
    process.exit();
  }
});
