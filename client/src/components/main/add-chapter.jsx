import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import add from '../../assets/add-subject.png';
import { createChapter, editChapter, fetchChaptersBySubject } from "../../../store/chapter-slice";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";

const AddChapterDialog = ({
  open,
  setOpen,
  currentEditId,
  setCurrentEditId,
  currentChapterName,
  setCurrentChapterName,
  subjectId
}) => {
  const [chapterName, setChapterName] = useState("");
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (open && currentEditId) {
      setChapterName(currentChapterName || "");
    } else if (open && !currentEditId) {
      setChapterName("");
    }
  }, [open, currentEditId, currentChapterName]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!chapterName.trim()) {
      toast({
        title: "Chapter name cannot be empty",
        className: "text-white bg-red-600 border border-gray-300 h-10 shadow-lg",
      });
      return;
    }

    try {
      if (currentEditId) {
       
        const data = await dispatch(editChapter({ id: currentEditId, chapter_name: chapterName.trim() })).unwrap();
        console.log(data, "edit ka result batao");
        if (data?.success) {
          toast({
            title: "Chapter Updated Successfully",
            className: "bg-white text-black border border-gray-300 h-10 shadow-lg",
          });
        }
        setCurrentEditId(null);
        setCurrentChapterName("");
      } else {
        const result = await dispatch(createChapter({ chapter_name: chapterName.trim(), subjectId })).unwrap();
        toast({
          title: "Chapter Added Successfully",
          className: "bg-white text-black border border-gray-300 h-10 shadow-lg",
        });
      }
     await dispatch(fetchChaptersBySubject(subjectId)).unwrap();
    } catch (errorMessage) {
      toast({
        title: errorMessage,
        className: "text-white bg-red-600 border border-gray-300 h-10 shadow-lg",
      });
    }

    setChapterName("");
    setOpen(false);
  };

  console.log(chapterName, "chapterName batao phle");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-white w-[150px] h-[50px] px-4 py-2 rounded-lg bg-cover bg-center transition-transform duration-300 transform hover:scale-105 "
          style={{ backgroundImage: `url(${add})` }}
        >
          Add Chapter
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#f8e7d4] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Enter Chapter Name</h2>
        <Input
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          placeholder="e.g. Algebra"
          className="mb-4"
        />
        <Button onClick={handleAdd} className="bg-[rgb(62,45,26)] text-white">
          {currentEditId ? "Update" : "Add"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddChapterDialog;