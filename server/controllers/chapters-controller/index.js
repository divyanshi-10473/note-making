const Chapter = require('../../models/chapters')
const Subject = require('../../models/subject')


const createChapter = async (req, res) => {
  try {
    const { chapter_name, subjectId } = req.body;
    const userId = req.user.id;

    if (!chapter_name || !subjectId) {
      return res.status(400).json({
        success: false,
        message: "Chapter name and subject ID are required.",
      });
    }

    // Check if chapter already exists for the subject and user
    const existingChapter = await Chapter.findOne({
      chapter_name,
      subjectId,
      userId,
    });

    if (existingChapter) {
      return res.status(400).json({
        success: false,
        message: "Chapter already exists.",
      });
    }

    // Create the chapter
    const newChapter = new Chapter({ chapter_name, subjectId, userId });
    await newChapter.save();

    // Push the chapter's ID to the corresponding Subject
    await Subject.findByIdAndUpdate(
      subjectId,
      { $push: { chapters: newChapter._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Chapter created and added to subject successfully",
      data: newChapter,
    });

  } catch (err) {
    console.error("Error creating chapter:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


const getChaptersBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    console.log(subjectId, "subjectId batao phle")
    const userId = req.user.id;
    
    const chapters = await Chapter.find({ subjectId, userId });
    if(!chapters || chapters.length === 0) {
      return res.status(404).json({ success: false, message: "No chapters found for this subject." });
    }
    res.status(200).json({ success: true, data:chapters });
  } catch (err) {
    res.status(500).json({success:false, message: "Server Error" });
  }
}


const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { chapter_name, isCompleted } = req.body;

    if (!chapter_name) {
      return res.status(400).json({ success: false, message: "Chapter name is required." });
    }

    const chapter = await Chapter.findById(id);

    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found." });
    }

    chapter.chapter_name = chapter_name;
    if (typeof isCompleted !== "undefined") {
      chapter.isCompleted = isCompleted;
    }

    const duplicate = await Chapter.findOne({ chapter_name, subjectId: chapter.subjectId, userId: req.user.id, _id: { $ne: id } });
    if (duplicate) {
      return res.status(400).json({ success: false, message: "Chapter name already exists." });
    }
    


    await chapter.save();

    res.status(200).json({ success: true, message: "Chapter updated", data: chapter });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Chapter.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({success:false, message: "Chapter not found" });
    }

    res.status(200).json({ success: true, message: "Chapter deleted" });
  } catch (err) {
    res.status(500).json({success:false, message: "Server Error" });
  }
};


module.exports = {
  createChapter,
  getChaptersBySubject,
  updateChapter,
  deleteChapter
}
