var Joi = require('joi');

const userSignUpSchema = Joi.object().keys({

    firstName : Joi.string().required().label('FirstName required'),
    lastName : Joi.string().allow(null),
    userName : Joi.string().required().label('UserName required'),
    email : Joi.string().regex(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/).required().label('Please enter the valid email id "harshit@example.com "'),
    password : Joi.string().required().label('Password Required')

})

const subjectSchema = Joi.object().keys({
    name : Joi.string().required().label('Subject required')
});

const marksSchema = Joi.object().keys({
    studentId : Joi.string().required().label('student id required'),
    subId : Joi.string().required().label('Subject id required'),
    marks : Joi.number().required().label('Marks required'),
})

var joiSchema = {
    userSignUpSchema,
    subjectSchema,
    marksSchema
}

module.exports = joiSchema;
