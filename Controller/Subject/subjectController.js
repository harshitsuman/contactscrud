var Joi = require('joi');
var subjectModel = require('../../Model/Subject/subjectModel');
var marksModel = require('../../Model/Subject/marksModel');
var subjectSchema = require('../../Model/joiValidation');

module.exports = {

    postSubject : async (req,res,next) => {

        var inputData = {
            name : req.body.name
        };
        try{
            var validationerror = Joi.validate(inputData, subjectSchema.subjectSchema);

            if(validationerror.error == null){

            var object = new subjectModel(inputData)

                object =  await object.save();
                return res.status(201)
                    .json({
                        "status": 201,
                        "success": true,
                        "message" : "Subject inserted successfully",
                        "value":  object
                    })
            }
            else {
                return res.status(422)
                    .json({
                        "status": 422
                        , "success": false
                        , "message":  validationerror.error.details[0].context.label
                        , "error": "Input Validation Error."
                    })
            }
        }
        catch(err){
            console.log(err);
            next(err)
        }

    },

    postMarks : async (req,res,next) => {
    
        var inputData = {
            studentId : req.body.studentId ,
            subId : req.body.subId ,
            marks : req.body.marks,
        }


        try{
            var validationerror = Joi.validate(inputData, subjectSchema.marksSchema);
            
                if(validationerror.error == null){
                
                    var object = new marksModel(inputData)
                                                        // saving multiple data at once
                    object =  await object.save();
                    // res.send(object)
                    res.status(201)
                    .json({
                        "status": 201,
                        "success": true,
                        "message" : "Marks inserted successfully",
                        "value":  object
                    })
                    .end();
                }else {
                    res.status(422)
                        .json({
                            "status": 422
                            , "success": false
                            , "message":  validationerror.error.details[0].context.label
                            , "error": "Input Validation Error."
                        })
                        .end();
                }
         }
        catch(err){
            console.log(err);
            next(err)
        }
    
    },
    
    getMarks : async (req,res, next) => {
    
        try {
            var marksDetails = await marksModel.find()
            .populate({
                path : 'studentId',  
                model : 'user'      // model is not required if ref is not mentioned in model
            })                      // without marks should null
            .populate({
                path : 'subId',
                model : 'subject'
            })

               marksDetails = JSON.parse(JSON.stringify(marksDetails))
                var studentDetails = {};
                marksDetails.map(item => {
                    var {studentId, subId, marks} = item;
                    if(!studentDetails[studentId._id]) {
                        studentDetails[studentId._id] = {...studentId, subjects:[{name:subId.name, marks}]}
                    } 
                    else {
                      studentDetails[studentId._id].subjects.push({name:subId.name, marks});
                    }
                })
                res.send(Object.values(studentDetails));
            }
            
    
        catch(err) {
            next(err);
        }
    
        
    },
    
    sumOfMarks : async (req,res,next) => {
    
        try {
            var marksDetails = await marksModel.find()
            .populate({
                path : 'studentId',
                model : 'user'
            })
            .populate({
                path : 'subId',
                model : 'subject'
            })
        
    // single query need to calculate total marks
    // Aggreigate query
            marksDetails = JSON.parse(JSON.stringify(marksDetails))
            var totalMarks = {};
            marksDetails.map(item => {
                var {studentId, marks} = item;
                if(!totalMarks[studentId._id]) {
                    totalMarks[studentId._id] = {...studentId, total:+marks}
                } 
                else {
                    totalMarks[studentId._id].total += +marks;
                }
            })
            res.send(Object.values(totalMarks));
        }
    
    
        catch(err) {
            next(err);
        }
    }
};
