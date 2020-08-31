const userModel = require('../Model/Account/userModel');

module.exports = {

    signUp : async inputData => {

        return userModel.findOne(inputData);
    },

    getUser : async inputData => {
        
        return userModel.findOne(inputData)
    
    }
};
