import React, { useEffect, useState } from 'react';
import bg from '../../../assets/notes.png';
import AddNote from '@/components/main/add-note';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createNote, deleteNote, fetchNotesByChapter, toggleFavorite } from '../../../../store/note-slice';
import { ExternalLink, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Swal from 'sweetalert2';
import PdfUpload from '@/components/main/pdf-upload';
import { toast } from '@/hooks/use-toast';

function NotePage() {
  const navigate = useNavigate();
  const { chapterId } = useParams();
  const dispatch = useDispatch();
  const { noteList } = useSelector((state) => state.notes);

  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState('');
  const [PdfLoadingState, setPdfLoadingState] = useState(false);
  const [open, setOpen] = useState(false);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const deleteResult = await dispatch(deleteNote(id)).unwrap();
      if (deleteResult?.success) {
        await dispatch(fetchNotesByChapter(chapterId)).unwrap();
        toast({
          title: "Note deleted successfully",
          className: "bg-black text-white",
        });
      }
    } catch (error) {
      console.error("Error deleting note:", error?.message);
    }
  }

  const handleToggleFavorite = (noteId) => {
    dispatch(toggleFavorite(noteId));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("pdfUrl", uploadedPdfUrl);
    formData.append("chapterId", chapterId);

    try {
      const result = await dispatch(createNote(formData)).unwrap();
      toast({
        title: "Note saved successfully!",
        className: "bg-green-500 text-white",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: error?.message || "Failed to save note",
        className: "bg-red-500 text-white",
      });
    }
  };

  useEffect(() => {
    if (chapterId) {
      setLoading(true);
      dispatch(fetchNotesByChapter(chapterId))
        .unwrap()
        .finally(() => setLoading(false));
    }
  }, [dispatch, chapterId]);

  return (
    <div className="min-h-screen pt-20 px-4 flex flex-col gap-6 bg-orange-50">
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border border-white bg-background p-6 shadow-2xl bg-black/10">
          <Tabs defaultValue="typed">
            <TabsList>
              <TabsTrigger
                value="typed"
                className="data-[state=active]:bg-[#35291D] data-[state=active]:text-white px-5 rounded-xl"
              >
                Notes
              </TabsTrigger>
              <TabsTrigger
                value="pdf"
                className="data-[state=active]:bg-[#35291D] data-[state=active]:text-white px-6 rounded-xl"
              >
                Pdf
              </TabsTrigger>
            </TabsList>

            {/* PDF Notes Tab */}
            <TabsContent value="pdf">
              <div>
                <div className="flex justify-end mb-4">
                  <Button
                    variant={showStarredOnly ? "default" : "outline"}
                    className="shadow-xl mr-3 hover:bg-white hover:text-black"
                    onClick={() => setShowStarredOnly(prev => !prev)}
                  >
                    {showStarredOnly ? "Show All" : "Show Starred"}
                  </Button>
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button className="px-3 bg-white shadow-xl hover:scale-105">Upload Pdf</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white rounded-xl">
                      <DialogHeader>
                        <DialogTitle>Upload PDF Note</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Label htmlFor="title" className="mb-2">Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter note title"
                        />
                        <PdfUpload
                          PdfFile={pdfFile}
                          setPdfFile={setPdfFile}
                          uploadedPdfUrl={uploadedPdfUrl}
                          setUploadedPdfUrl={setUploadedPdfUrl}
                          PdfLoadingState={PdfLoadingState}
                          setPdfLoadingState={setPdfLoadingState}
                        />
                      </div>
                      <DialogFooter className="gap-2">
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSubmit} disabled={!title || !pdfFile}>Upload</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-3 bg-white p-4 rounded-xl shadow-md w-[100%] max-h-[60vh] overflow-y-scroll">
                  {noteList
                    ?.filter(note => note.pdfUrl)
                    ?.filter(note => (showStarredOnly ? note.isFavorite : true))
                    ?.map(note => (
                      <div key={note._id} className="w-full">
                        <div className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition duration-200 ease-in-out w-full">
                          <div className="flex justify-start items-center w-full">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleToggleFavorite(note._id)}
                              title="Star note"
                              className="w-[30px] h-[30px] p-0"
                            >
                              {note.isFavorite ? "⭐" : <Star />}
                            </Button>
                            <p
                              className="font-medium text-lg truncate cursor-pointer w-[90%]"
                              onClick={() => window.open(note.pdfUrl, "_blank")}
                              title="Click to view PDF"
                            >
                              {note.title}
                            </p>
                          </div>
                          <div className="flex gap-2 items-center justify-end">
                            <ExternalLink
                              size={20}
                              variant="ghost"
                              onClick={() => window.open(note.pdfUrl, "_blank")}
                              title="Open external link"
                              className="w-[20px]"
                            />
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDelete(note._id)}
                              title="Delete note"
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                        <Separator className="bg-black/30" />
                      </div>
                    ))}
                  {!loading && noteList?.filter(note => note.pdfUrl)?.filter(note => (showStarredOnly ? note.isFavorite : true))?.length === 0 && (
                    <div className="flex justify-center items-center flex-col">
                      <img src={bg} alt="No PDF notes" className="object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Typed Notes Tab */}
            <TabsContent value="typed">
              <div>
                <div className="flex justify-end mb-4">
                  <Button
                    variant={showStarredOnly ? "default" : "outline"}
                    className="shadow-xl mr-3 hover:bg-white hover:text-black"
                    onClick={() => setShowStarredOnly(prev => !prev)}
                  >
                    {showStarredOnly ? "Show All" : "Show Starred"}
                  </Button>
                  <Button
                    className="px-3 bg-white shadow-xl hover:scale-105"
                    onClick={() => navigate(`/notes/add/${chapterId}`)}
                  >
                    Add Notes
                  </Button>
                </div>

                <div className="space-y-3 bg-white p-4 rounded-xl shadow-md w-[100%] max-h-[60vh] overflow-y-scroll">
                  {noteList
                    ?.filter(note => !note.pdfUrl)
                    ?.filter(note => (showStarredOnly ? note.isFavorite : true))
                    ?.map(note => (
                      <div key={note._id} className="w-full">
                        <div className="flex justify-between items-center hover:bg-gray-100 p-4 rounded-lg transition duration-200 ease-in-out w-full">
                          <div className="flex justify-start items-center w-full">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleToggleFavorite(note._id)}
                              title="Star note"
                              className="w-[30px] h-[30px] p-0"
                            >
                              {note.isFavorite ? "⭐" : <Star />}
                            </Button>
                            <p
                              className="font-medium text-lg truncate cursor-pointer w-[90%]"
                              onClick={() => navigate(`/notes/view/${note._id}`)}
                            >
                              {note.title}
                            </p>
                          </div>
                          <div className="flex gap-2 items-center justify-end">
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDelete(note._id)}
                              title="Delete note"
                            >
                              🗑️
                            </Button>
                          </div>
                        </div>
                        <Separator className="bg-black/30" />
                      </div>
                    ))}
                  {!loading && noteList?.filter(note => !note.pdfUrl)?.filter(note => (showStarredOnly ? note.isFavorite : true))?.length === 0 && (
                    <div className="flex justify-center items-center flex-col">
                      <img src={bg} alt="No notes" className="object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default NotePage;
