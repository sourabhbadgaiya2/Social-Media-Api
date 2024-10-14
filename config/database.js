const mongoose = require("mongoose");

exports.connectdatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(`data base is connected`);
  } catch (error) {
    console.log(error.message);
  }
};
