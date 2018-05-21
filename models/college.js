// load the things we need
var mongoose = require('mongoose');
// define the schema for our user model
var collegeSchema = mongoose.Schema({
    name : String ,
});

// create the model for Evetns and expose it to our app
module.exports = mongoose.model('College', collegeSchema);
