import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import add from '../../assets/add-subject.png';
import { createSubject, editSubject, fetchSubjects } from "../../../store/subject-slice/index";
import { useDispatch } from "react-redux";
import { useToast } from "@/hooks/use-toast";

const AddSubjectDialog = ({open,setOpen, currentEditId, setCurrentEditId, currentSubjectName, setCurrentSubjectName}) => {
 
  const [subjectName, setSubjectName] = useState("");
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (open && currentEditId) {
      setSubjectName(currentSubjectName || ""); // pre-fill the subject name
    } else if (open && !currentEditId) {
      setSubjectName(""); // reset if adding new
    }
  }, [open, currentEditId, currentSubjectName]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      toast({
        title: "Subject name cannot be empty",
        className: "text-white bg-red-600 border border-gray-300 h-10 shadow-lg",
      });
      return;
    }
  
    try {
      if (currentEditId) {
        const data = await dispatch(editSubject({ id: currentEditId, subject_name: subjectName.trim() })).unwrap();
        console.log(data, "edit ka result batana");
        if (data?.success) {
          toast({
            title: "Subject Updated Successfully",
            className: "bg-white text-black border border-gray-300 h-10 shadow-lg",
          });
        }
        setCurrentEditId(null);
        setCurrentSubjectName("");
      } else {
        const result = await dispatch(createSubject({ subject_name: subjectName.trim() })).unwrap();
        console.log(result, "resutl batao phle");
        toast({
          title: "Subject Added Successfully",
          className: "bg-white text-black border border-gray-300 h-10 shadow-lg",
        });
      }
      await dispatch(fetchSubjects()).unwrap();
    } catch (errorMessage) {
      console.log(errorMessage, "error batao phle");
      toast({
        title: errorMessage,
        className: "text-white bg-red-600 border border-gray-300 h-10 shadow-lg",
      });
    }
  
    setSubjectName("");
    setOpen(false);
  };
  
  console.log(subjectName, "subjectName batao phle")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="text-white w-[150px] h-[50px] px-4 py-2 rounded-lg bg-cover bg-center transition-transform duration-300 transform hover:scale-105 "
          style={{ backgroundImage: `url(${add})` }}
        >
          Add Subject
        </button>
      </DialogTrigger>
      <DialogContent className="bg-[#f8e7d4] rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Enter Subject Name</h2>
        <Input
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          placeholder="e.g. Mathematics"
          className="mb-4"
        />
        <Button onClick={handleAdd} className="bg-[rgb(62,45,26)] text-white">
         {currentEditId ? "Update" : "Add"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog;
