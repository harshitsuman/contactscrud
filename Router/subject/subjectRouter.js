var router = require('express').Router();
var subjectController = require('../../Controller/Subject/subjectController');
var auth = require('../../Middleware/authentication');


router.get('/marks', auth, subjectController.getMarks);   // id optional 
router.get('/sum-marks', auth, subjectController.sumOfMarks);
router.post('/insert/subject',auth, subjectController.postSubject);
router.post('/insert/marks',auth, subjectController.postMarks);


module.exports = router;