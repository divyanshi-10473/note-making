import React, { useEffect, useState } from 'react'
import chapterImage from '../../../assets/chapters.png'
import chap from '../../../assets/chap.png'
import bg from '../../../assets/bg.png'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import AddChapterDialog from '@/components/main/add-chapter'
import { deleteChapter, editChapter, fetchChaptersBySubject } from '../../../../store/chapter-slice'
import { Button } from '@/components/ui/button'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'
import dashboardImage from "../../../assets/addchap.png"
import { toast } from '@/hooks/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MoreVertical } from "lucide-react";


function ChapterPage() {
  const navigate = useNavigate();
  const { subjectId } = useParams();
  const dispatch = useDispatch();
  const {chapterList} = useSelector((state)=> state.chapters)
  const [currentEditId, setCurrentEditId] = useState(null);
  const [currentChapterName, setCurrentChapterName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log(chapterList, "chapters batao phle");

  
  const handleView = (id) => {
    console.log(id);
    navigate(`/dashboard/notes/${id}`);
  }

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
  
     dispatch(deleteChapter(id)).unwrap().then((data)=>{
      console.log(data, "delete ka result batao");
      if (data?.success) {
        dispatch(fetchChaptersBySubject(subjectId)).unwrap();
        toast({
            title: "Product deleted successfully",
            className: "bg-black text-white",
        });
    }
     })
    
  
    }


    const handleCheckboxChange = async (id, currentName, currentStatus) => {
      try {
        const result = await dispatch(editChapter({
          id,
          chapter_name: currentName,
          isCompleted: !currentStatus,
        })).unwrap();
    
        if (result?.success) {
          dispatch(fetchChaptersBySubject(subjectId));
          toast({
            title: "Chapter status updated",
            className: "bg-black text-white",
          });
        }
      } catch (err) {
        toast({
          title: err,
          className: "bg-red-600 text-white",
        });
      }
    };
    
  



   

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          await dispatch(fetchChaptersBySubject(subjectId)).unwrap();
        } catch (error) {
          console.error("Failed to fetch chapters", error);
        }
        setLoading(false);
      };
    
      fetchData();
    }, [dispatch, subjectId]);
    


  return (

    <div className="min-h-screen bg-cover bg-center bg-no-repeat pt-20"
    style={{ backgroundImage: `url('${bg}')` }}>
  
    {loading ? null : chapterList.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <img src={dashboardImage} alt="No subjects" className="w-{200px} mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Chapters Yet</h2>
        <p className="text-gray-500 mb-4">Start by adding your first chapter to organize your notes.</p>
        <AddChapterDialog open={open} setOpen={setOpen} currentEditId={currentEditId} setCurrentEditId={setCurrentEditId} currentChapterName={currentChapterName} setCurrentChapterName={setCurrentChapterName} subjectId={subjectId}/>
      </div>
    ) : (
      <div className="flex justify-end mb-6 px-4">
        <AddChapterDialog open={open} setOpen={setOpen} currentEditId={currentEditId} setCurrentEditId={setCurrentEditId} currentChapterName={currentChapterName} setCurrentChapterName={setCurrentChapterName} subjectId={subjectId}/>
      </div>
    )}
  
    {!loading && chapterList.length > 0 && chapterList.map((chapter) => (
     <div
     className='w-[80%] m-auto mt-10 flex flex-col  justify-center relative group  px-4'
     style={{
       height: "100px",
       border: "10px solid rgb(62, 45, 26)",
       borderTop: "5px solid rgb(62, 45, 26)",
       borderLeft: "3px solid rgb(62, 45, 26)",
       backgroundColor: "rgba(198, 162, 122, 0.521)",
       borderRadius: "20px",
       boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
     }}
   >
     <div className="flex items-center gap-4">
     <input
  type="checkbox"
  checked={chapter.isCompleted}
  onChange={() =>
    handleCheckboxChange(chapter._id, chapter.chapter_name, chapter.isCompleted)
  }
  className="w-5 h-5 cursor-pointer accent-black border-2 border-[rgb(62,45,26)] rounded-md"
/>


       <h1 className="text-3xl font-semibold drop-shadow-md">
         {chapter.chapter_name}
       </h1>
     </div>
   
     <div className="flex items-center justify-end">
     <div className="flex items-center justify-end gap-2 ml-auto mt-2 sm:mt-0">
  {/* 👇 Hidden by default, only show on sm and up */}
  <div className="hidden sm:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <Button
      className="text-orange-950"
      style={{ backgroundColor: "rgb(248, 231, 212)" }}
      onClick={() => {
        setCurrentEditId(chapter._id);
        setOpen(true);
        setCurrentChapterName(chapter.chapter_name);
      }}
    >
      <Pencil size={20} className="mr-2" />
      Edit
    </Button>
    <Button
      className="text-orange-950"
      style={{ backgroundColor: "rgb(248, 231, 212)" }}
      onClick={() => handleDelete(chapter._id)}
    >
      <Trash2 size={20} className="mr-2" />
      Delete
    </Button>
  </div>

  {/* 👇 Only show on small screens */}
  <div className="sm:hidden">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical className="text-white cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-orange-100 rounded shadow-md p-2 space-y-2">
        <DropdownMenuItem
          onClick={() => {
            setCurrentEditId(chapter._id);
            setOpen(true);
            setCurrentChapterName(chapter.chapter_name);
          }}
          className="cursor-pointer text-black hover:bg-orange-300"
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDelete(chapter._id)}
          className="cursor-pointer text-red-600 hover:bg-orange-300"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  {/* View Button always shown */}
  <Button
    className="text-orange-950"
    style={{ backgroundColor: "rgb(248, 231, 212)" }}
    onClick={() => handleView(chapter._id)}
  >
    <Eye size={20} className="mr-2" />
    View
  </Button>
</div>

       
     </div>
   </div>
   

      ))}




    </div>
  )
}

export default ChapterPage
