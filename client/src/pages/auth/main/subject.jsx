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
import db from '../../../assets/dbb.png'
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import CircleProgress from '@/components/common/progresss-bar';
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";




function SubjectPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { subjectsList } = useSelector((state) => state.subjects);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [currentSubjectName, setCurrentSubjectName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true); // <-- NEW

  const handleView = (id) => {
    navigate(`/dashboard/chapter/${id}`);
  };

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

    dispatch(deleteSubject(id)).unwrap().then((data) => {
      if (data?.success) {
        dispatch(fetchSubjects()).unwrap();
        toast({
          title: "Subject deleted successfully",
          className: "bg-black text-white",
        });
      }
    });
  }

  useEffect(() => {
    setLoading(true);
    dispatch(fetchSubjects())
      .unwrap()
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <div className="p-4 pt-24 min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ backgroundImage: `url('${db}')` }}>

      {/* 👇 Only show if NOT loading and subjectsList is still empty */}
      {!loading && subjectsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <img src={dashboardImage} alt="No subjects" className="w-{200px} mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Subjects Yet</h2>
          <p className="text-gray-500 mb-4">Start by adding your first subject to organize your notes.</p>
          <div>
            <AddSubjectDialog open={open} setOpen={setOpen} currentEditId={currentEditId} setCurrentEditId={setCurrentEditId} currentSubjectName={currentSubjectName} setCurrentSubjectName={setCurrentSubjectName} />
          </div>
        </div>
      ) : (
        <div className="flex justify-end mb-6">
          <AddSubjectDialog open={open} setOpen={setOpen} currentEditId={currentEditId} setCurrentEditId={setCurrentEditId} currentSubjectName={currentSubjectName} setCurrentSubjectName={setCurrentSubjectName} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
        {subjectsList.map((subject) => {
          const completedCount = subject.chapters.filter((ch) => ch.isCompleted).length;
          const totalCount = subject.chapters.length;
          const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <div
              key={subject._id}
              className="relative rounded-xl shadow-2xl w-[300px] h-[300px] text-white p-4 bg-cover bg-center flex flex-col justify-between"
              style={{ backgroundImage: `url(${bg})` }}
            >
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold text-center w-full pt-7">{subject.subject_name}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="text-white cursor-pointer mt-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-orange-100 rounded shadow-md p-2 space-y-2">
                    <DropdownMenuItem
                      onClick={() => {
                        setCurrentEditId(subject._id);
                        setOpen(true);
                        setCurrentSubjectName(subject.subject_name);
                      }}
                      className="cursor-pointer text-black hover:bg-orange-300"
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(subject._id)}
                      className="cursor-pointer text-red-600 hover:bg-orange-300"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <p className="text-white text-center">Number of Chapters: {subject.chapters.length}</p>

              <div className="flex items-center justify-center mt-4 space-x-4 px-2">
                <CircleProgress percentage={progress} />
                <div className="text-sm leading-5">
                  <p className="text-white font-semibold">Total Progress</p>
                  <p className="text-white">{progress}% completed</p>
                </div>
              </div>

              <Button
                className="text-orange-950 mt-4 w-[90%] self-center"
                style={{ backgroundColor: "rgb(248, 231, 212)" }}
                onClick={() => handleView(subject._id)}
              >
                View
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export default SubjectPage;
