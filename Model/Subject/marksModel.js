const mongoose = require('mongoose');

var marks = new mongoose.Schema({

    studentId : {
        type : mongoose.Schema.Types.ObjectId,
        required : [true,'studentId required'],
        ref : "usersModel",
        validate : function name(params) {
            
        }
    },
    subId : {
        type : mongoose.Schema.Types.ObjectId,
        required : ['true','subjectId required'],
        ref : "subjectModel"
    },
    marks : {
        type : Number,
        required : ['true','marks required'],
        trim : true,
        maxlength :3
    },
    
},{
    versionKey : false,
    timestamps : true
});


module.exports = mongoose.model('marks',marks );
