const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var user = new mongoose.Schema({

    userName : {
        type : String,
        required : ['true','userName required'],
        trim : true,
        minlength : 1,
    },
    email : {
        type : String,
        required : [true,'email required'],
        trim : true,
        match : (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/),
    },
    firstName : {
        type : String,
        required : ['true','firstName required'],
        trim : true,
        minlength : 1
    },
    lastName : {
        type : String,
        required : ['true','lastName required'],
        trim : true,
        minlength : 1
    },
    password : {
        type : String,
        required : [true, 'password required'],
        trim : true,
        // match : (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/), //without special character
        match : (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/) // with special character
    },
    isStatus : {
        type : String,
        default : 'Active',
        trim : true
    }

    
},{
    versionKey : false,
    timestamps : true
});

user.pre('save', function(next){
    bcrypt.hash(this.password, 10, (err, hashpassword) => {
        if(err) next(err);
        this.password = hashpassword;
        next();
    }) 
})

// Save pre hook (middleware)
// userSchema.pre('save', async function() {
// 	let _this = this;
// 	// hash password
// 	if (this.password && (this.isNew || this.isModified('password'))) {
// 		this.password = await passwordHelper.hashPassword(this.password);
// 	}
// });

// user.index({email : 1}, {unique:1})

module.exports = mongoose.model('user',user );
