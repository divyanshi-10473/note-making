const express = require('express');
const { createSubject, getSubjects, updateSubject, deleteSubject } = require('../controllers/subject-controller/index.js');
const {authMiddleware} = require('../controllers/auth-controller/index.js')

const router = express.Router();

router.get('/get/',authMiddleware,  getSubjects);
router.post('/create',authMiddleware, createSubject);
router.put('/edit/:id', authMiddleware, updateSubject);
router.delete('/delete/:id',authMiddleware,  deleteSubject);


module.exports = router;
