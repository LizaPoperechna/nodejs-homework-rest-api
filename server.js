const mongoose = require('mongoose');
const app = require('./app');

const { DB_HOST } = process.env;

//const DB_HOST = "mongodb+srv://liza:mar12345@nodejs.i9ijh6q.mongodb.net/db-contacts?retryWrites=true&w=majority";

mongoose.set('strictQuery', false);

mongoose.connect(DB_HOST || "mongodb://127.0.0.1:27017/db-contacts")
  .then(() => {
    app.listen(3000)
    console.log('Server running. Use our API on port: 3000');
    console.log("Database connection successful");
  }).catch(err => { 
    console.log(err.message);
    process.exit(1);
  }
  )




  