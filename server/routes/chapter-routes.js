const express = require('express');

const {authMiddleware} = require('../controllers/auth-controller/index.js');
const { createChapter, getChaptersBySubject, updateChapter, deleteChapter } = require('../controllers/chapters-controller/index.js');

const router = express.Router();

router.get('/get/:subjectId',authMiddleware,  getChaptersBySubject);
router.post('/create',authMiddleware, createChapter);
router.put('/edit/:id', authMiddleware, updateChapter);
router.delete('/delete/:id',authMiddleware,  deleteChapter);


module.exports = router;
