const Note = require("../../models/notes");
const cloudinary = require('cloudinary').v2;
const { uploadPdf } = require('./../../helpers/cloudinary'); // or image upload util if reused

const handleFileUpload = async (req, res) => {
  try {
    const result = await uploadPdf(req.file); // this uses the streamifier-based util
    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
};



const createNote = async (req, res) => {
  try {
    const { title, content, chapterId, pdfUrl } = req.body;
    const userId = req.user.id;

    if (!title || !chapterId) {
      return res.status(400).json({ success: false, message: "Title and chapterId are required." });
    }

    const existingNote = await Note.findOne({ title, chapterId, userId });
    if (existingNote) {
      return res.status(409).json({ success: false, message: "A note with this title already exists in this chapter." });
    }

    // Ensure only one of content or pdfUrl is saved
    let noteContent = content;
    let finalPdfUrl = pdfUrl;

    if (noteContent) {
      finalPdfUrl = null;
    } else if (pdfUrl) {
      noteContent = null;
      
    }

    const newNote = new Note({
      title,
      content: noteContent,
      chapterId,
      userId,
      pdfUrl: finalPdfUrl,
    });

    await newNote.save();

    res.status(201).json({ success: true, message: "Note created successfully", data: newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};









const getNotesByChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;
    const notes = await Note.find({ chapterId }).sort({ createdAt: -1 });

    const notesWithDownload = notes.map(note => ({
      ...note._doc,
      downloadLink: note.pdfUrl || null,
      content: note.pdfUrl ? null : note.content,
    }));

    res.status(200).json({ success: true, data: notesWithDownload });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch notes" });
  }
};


const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    note.isFavorite = !note.isFavorite;
    await note.save();

    res.status(200).json({ success: true, message: "Favorite updated", data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update favorite status" });
  }
};


const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    if (note.pdfUrl) {
      const parts = note.pdfUrl.split("/");
      const fileName = parts[parts.length - 1];
      const publicId = `pdf_notes/${fileName.split('.')[0]}`;
      console.log(publicId);
      await cloudinary.uploader.destroy(publicId);
    }

 
    await Note.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete note" });
  }
};



const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isFavorite } = req.body;
   console.log("Update note data:", req.body);
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    if (title) note.title = title;
    if (content) note.content = content ;
    if (typeof isFavorite !== 'undefined') note.isFavorite = isFavorite;

    await note.save();

    res.status(200).json({ success: true, message: "Note updated", data: note });
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ success: false, message: "Failed to update note" });
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    res.status(200).json({ success: true, data: note });
  }
  catch (err) {
    console.error("Error fetching note:", err);
    res.status(500).json({ success: false, message: "Failed to fetch note" });
  }
}




module.exports = {
  handleFileUpload,
  createNote,
  getNotesByChapter,
  toggleFavorite,
  deleteNote,
  updateNote,
  getNoteById,

};
