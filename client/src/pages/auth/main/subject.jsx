import React, { useEffect, useState } from 'react';
import bg from '../../../assets/subject-b.png';
import add from '../../../assets/add-subject.png';
import { Pencil, Trash2 } from 'lucide-react';
import AddSubjectDialog from '@/components/main/add-subject';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSubject, fetchSubjects } from '../../../../store/subject-slice/index';
import { Button } from '@/components/ui/button';
import Swal from "sweetalert2";
import dashboardImage from "../../../assets/d3.png"


function SubjectPage() {
  const dispatch = useDispatch();
  const {subjectsList}  = useSelector((state)=>state.subjects)
  const [currentEditId, setCurrentEditId]= useState(null);
  const [currentSubjectName, setCurrentSubjectName] = useState("");
  const [open, setOpen] = useState(false);

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

   dispatch(deleteSubject(id)).unwrap().then((data)=>{
    console.log(data, "delete ka result batao");
    if (data?.success) {
      dispatch(fetchSubjects()).unwrap();
      toast({
          title: "Product deleted successfully",
          className: "bg-black text-white",
      });
  }
   })
  

  }



  useEffect(()=>{
         dispatch(fetchSubjects()).unwrap(); 
},[dispatch]);

console.log(subjectsList, "subjects batao phle")
console.log(currentEditId, "currentEditId batao phle")

  return (
    <div className="min-h-screen p-4 mt-16">
     
     {subjectsList.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-center p-6">
  <img src={dashboardImage} alt="No subjects" className="w-{200px} mb-4" />
  <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Subjects Yet</h2>
  <p className="text-gray-500 mb-4">Start by adding your first subject to organize your notes.</p>
  <div >
        <AddSubjectDialog open={open} setOpen={setOpen} currentEditId ={currentEditId} setCurrentEditId ={setCurrentEditId} currentSubjectName={currentSubjectName} setCurrentSubjectName={setCurrentSubjectName}/>
      </div>
</div> : <div className="flex justify-end mb-6">
        <AddSubjectDialog open={open} setOpen={setOpen} currentEditId ={currentEditId} setCurrentEditId ={setCurrentEditId} currentSubjectName={currentSubjectName} setCurrentSubjectName={setCurrentSubjectName}/>
      </div>}

      

     
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
        {subjectsList.map((subject) => (
          <div
            key={subject._id}
            className="relative group rounded-xl shadow-2xl w-[300px] h-[300px] text-white p-4 bg-cover bg-center"
            style={{ backgroundImage: `url(${bg})` }}
          >
            <h1 className="text-center text-4xl font-semibold drop-shadow-md mt-11">
              {subject.subject_name}
            </h1>
            <p className=" text-white text-center mt-2">Number of Chapters: {subject.chapters.length}</p>

            <div className="flex justify-between items-center px-4 absolute bottom-20 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <Button className="text-orange-950 px-8" style={{ backgroundColor: "rgb(248, 231, 212)" }}  onClick={
            () => {
              setCurrentEditId(subject._id);
              setOpen(true);
              setCurrentSubjectName(subject.subject_name);
              } }>
      <Pencil size={20} className="mr-2" />
      Edit
    </Button>
    <Button className="text-orange-950 px-8" style={{ backgroundColor: "rgb(248, 231, 212)" }} onClick={() => {handleDelete(subject._id)}}>
      <Trash2 size={20} className="mr-2" />
      Delete
    </Button>
  </div>
            <Button className="absolute bottom-7 w-[90%] text-orange-950" style={{backgroundColor:"rgb(248, 231, 212)" }}>View </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectPage;
