const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var Joi = require('joi');
var formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid/v4');
const userModel = require('../../Model/Account/userModel');
const userService = require('../../Service/userService');
const userSchema = require('../../Model/joiValidation');



module.exports ={

    signIn : async (req,res,next) => { 

        try{

            var result = await userService.getUser({userName: req.body.userName});

            if(result){

                const resultPass = await bcrypt.compare(req.body.password, result.password);

                if(resultPass){

                    const token = await jwt.sign(JSON.parse(JSON.stringify(resultPass)), process.env.jwt_key);
                    
                    // res.header['x-auth'] = token;
                    res.json({token});
                }
                else {
                    throw new Error("Username or password missmatched....!!")
                }
                      
            }
            else{
                throw new Error("NOT_FOUND");
            }

        }

        catch(err) {
            if (err.message == "NOT_FOUND") {
                err.status = 404
                err.message = "User data not found"
            }
            if (err.message == "Username or password missmatched....!!") {
                err.status = 403
            }
            next(err);
        }

    },

    
    signUp : async (req,res,next) => {

        var inputData = {
            firstName : !!req.body.firstName ? req.body.firstName.trim() : null,
            lastName : !!req.body.lastName ? req.body.lastName.trim() : null ,
            userName : !!req.body.userName ? req.body.userName.trim() : null,
            email : !!req.body.email ? req.body.email.trim() : null,
            password : !!req.body.password ? req.body.password.trim() : null
        }

        try{

            var validationerror = Joi.validate(inputData, userSchema.userSignUpSchema);

            if(validationerror.error == null){

                var signupData = await userService.signUp({email : inputData.email});
                
                if(signupData == null || signupData.isStatus == 'Inactive') {

                    var object = new userModel(inputData);

                    object =  await object.save();
                    object1 = JSON.parse(JSON.stringify(object));
                    delete object1.password;                 
                    res.send(object1);
                }
    
                else if(signupData.isStatus == "Active") {
                    throw new Error('Exists');
                }
            }

            
        }
        catch(err) {
            if(err.message == 'Exists'){
                err.status = 409 //409 is the correct status code for duplicate resource or resource already exists
                err.message = "User data already exists"
            }
            next(err);
        }

    },

    userProfile : async (req,res,next) => {

        try {
            let result ;
            if(req.params._id) {

                result = await userModel.findById({_id : req.params._id},'userName email firstName lastName');

            }
            else{

                result = await userModel.find({},'userName email firstName lastName' );
            
            }
            
            return res.status(200)
            .json({
                "status": 200,
                "success": true,
                "message" : "Data retrieved successfully based on id",
                "value":  result
            })

        }

        catch(err){
            res.status(422)
                    .json({
                        "status": 422
                        , "success": false
                        , "message":  validationerror.error.details[0].context.label
                        , "error": "Input Validation Error."
                    })
                    .end();
            res.status(500).send(err);
        };

    },

    uploadPhoto : async (req, res, next) => {

        var form = new formidable.IncomingForm();
        form.parse(req, async function (err, fields, files) {

            var file = files.file;
            var _id = fields._id;
            var FileSize = file.size;
            var FileExtension = path.extname(file.name);

            Joi.validate({_id,FileSize,FileExtension},{
                _id : Joi.string().required().label('UserId required'),
                FileSize : Joi.number().integer().max(4 * 1024 * 1024).required().label('Max FileSize 4MB'),
                FileExtension : Joi.string().valid(['.jpg', '.jpeg','.png','.PNG','.JPEG','.JPG']).required().label("'.jpg', '.jpeg','.png' allowed")
            }).then(async () => {
            
           
                try {
                    if (fs.lstatSync(path.join(__dirname + process.env.IMAGE_UPLOAD_PATH)).isDirectory());
                    else
                    fs.mkdirSync(path.join(__dirname + process.env.IMAGE_UPLOAD_PATH));
                } catch (err) {
                    
                    fs.mkdirSync(path.join(__dirname + process.env.IMAGE_UPLOAD_PATH));
              
                  }
                  
                  var filepath = path.join(__dirname +  process.env.IMAGE_UPLOAD_PATH + "/"+ uuid() +"_"  + file.name);
                 
                  fs.writeFileSync(filepath,fs.readFileSync(file.path));

                  res.send({
                      status : 200,
                      success : true,
                      message : "Photo uploaded successfully"
                  })
                }
            ).catch(err => {
                res.status(422)
                    .json({
                      "status": 422
                     , "success": false
                     , "message": error.details[0].context.label
                     , "error": error.details[0].message
        
                     });
        
            })
            
        })

    }
    
}