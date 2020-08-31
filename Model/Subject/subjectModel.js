const mongoose = require('mongoose');

var subject = new mongoose.Schema({

    name : {
        type : String,
        required : [true,'Subject name required'],
        trim : true,
    }    
},{
    versionKey : false,
    timestamps : true
});


subject.index({name : 1}, {unique : 1})

module.exports = mongoose.model('subject', subject );
