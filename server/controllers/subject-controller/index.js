const Subject = require("../../models/subject");


const createSubject = async (req, res) => {
  const { subject_name } = req.body;
  const userId = req.user.id;
  console.log(userId,"user id to batao")

  if (!subject_name) {
    return res.status(400).json({ success:false, message: 'Subject name is required' });
  }

  try {
    const checkSubject = await Subject.findOne({ subject_name });
    if (checkSubject) {
      return res.status(400).json({ success: false, message: "Subject already exists" });
    }
    const newSubject = new Subject({ subject_name, userId })
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (err) {
    console.error('Error creating subject:', err)
    res.status(500).json({ error: 'Failed to create subject' })
  }
};


const getSubjects = async (req, res) => {
  const userId = req.user.id;

  try {
    const subjects = await Subject.find({ userId }).populate("chapters");

    if (subjects.length <= 0) {
      return res.status(404).json({
        success: false,
        message: 'No subjects found for this user',
      });
    }

    res.status(200).json({
      success: true,
      data: subjects,
    });
  } catch (err) {
    console.error('Error fetching subjects:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects',
    });
  }
};



const updateSubject = async (req, res) => {
  const { id } = req.params;
  const { subject_name } = req.body;
  const userId = req.user.id;

  if (!subject_name) {
    return res.status(400).json({ success: false, message: 'Subject name is required' });
  }

  try {
  
    const findSubject = await Subject.findOne({ _id: id, userId });
    if (!findSubject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

  
    const duplicate = await Subject.findOne({ subject_name, userId, _id: { $ne: id } });
    if (duplicate) {
      return res.status(400).json({ success: false, message: 'Subject name already exists' });
    }

  
    findSubject.subject_name = subject_name;
    await findSubject.save();

    res.status(200).json({
      success: true,
      data: findSubject,
    });

  } catch (err) {
    console.error('Error updating subject:', err);
    res.status(500).json({ success: false, message: 'Failed to update subject' });
  }
};



 const deleteSubject = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;


  try {
    const deleteSubject = await Subject.findOneAndDelete({ _id: id, userId });

    if (!deleteSubject) {
      return res.status(404).json({success:false, message: 'Subject not found' });
    }

    res.status(200).json({success:true, message: 'Subject deleted successfully' });
  } catch (err) {
    console.error('Error deleting subject:', err);
    res.status(500).json({ success:false, message: 'Failed to delete subject' });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  updateSubject,
  deleteSubject
}
