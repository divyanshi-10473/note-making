import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import bg from '../../assets/19.jpg';
import { Mic, MicOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getNoteById, updateNote } from '../../../store/note-slice';
import { toast } from '@/hooks/use-toast';

function ViewNote() {
  const { noteId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');

  const { note } = useSelector((state) => state.notes);

  // Fetch the note on mount
  useEffect(() => {
    if (noteId) {
      dispatch(getNoteById(noteId))
        .unwrap()
        .then((data) => {
          setTitle(data.title || '');
          setContent(data.content || '');
        })
        .catch((err) => console.error("Failed to fetch note:", err));
    }
  }, [dispatch, noteId]);

  // Voice recognition setup
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition not supported');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (final) setContent((prev) => prev + final);
      setInterimText(interim);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) recognition.start();

    return () => {
      recognition.stop();
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
    };
  }, [isListening, language]);

  const handleUpdate = async () => {
    try {
      await dispatch(updateNote({ id: noteId, title, content })).unwrap();
  
      toast({
        title: "Note updated successfully",
        className: "bg-green-600 text-white",
      });
  
      const updatedNote = await dispatch(getNoteById(noteId)).unwrap();
  
      setTitle(updatedNote.title || '');
      setContent(updatedNote.content || '');
  
      setIsEditing(false);
    } catch (err) {
      console.error( err);
      toast({
        title: err.message || "Failed to update note",
        variant: "bg-red-500 text-white",
      });
    }
  };
  console.log(title, content, 'title and content');

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${bg}')` }}
    >
      <div className="min-h-screen backdrop-blur-sm pt-[5%]">
      {isEditing ? (
        <div className="max-w-3xl mx-auto flex flex-col gap-6 ">
          <div className="flex justify-between items-center mx-5">
           
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                className="text-xl font-semibold bg-white/75 border border-gray-300 rounded-lg p-4 shadow-2xl w-full"
              />
           
            <div className="flex gap-2">
             
                <>
                  <Button
                    onClick={() => setIsListening((prev) => !prev)}
                    className={`ml-1 ${isListening ? 'bg-red-400' : 'bg-green-400'} rounded-full`}
                  >
                    {isListening ? <MicOff /> : <Mic />}
                  </Button>
                  {isListening && (
                    <div className="relative">
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
                    </div>
                  )}
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border rounded px-2 text-sm bg-white ml-1"
                  >
                    <option value="en-US">English</option>
                    <option value="hi-IN">Hindi</option>
                  </select>
                
                </>
           


            </div>
          </div>
         
           
              <Textarea
                rows={20}
                className="w-[93%] text-lg bg-white/55 border border-gray-300 rounded-lg p-4 shadow-2xl m-auto"
                placeholder="Type or dictate your notes..."
                value={content + interimText}
                onChange={(e) => setContent(e.target.value)}
              />
           
           
                          <Button
                          onClick={() => {
                            if (isEditing) {
                              handleUpdate();
                            } 
                          }}
                          disabled={isEditing && (!title || !content)}
                          className="border border-white bg-black/70 text-white hover:bg-white hover:text-black  w-[93%] mx-auto"
                        >
                          Update
                        </Button>
        
          </div>):

        (
           <div className='max-w-7xl m-auto'>
               <div className="flex justify-between items-center mx-5">
           
              <h1 className="text-xl font-semibold bg-white/75 border border-gray-300 rounded-lg p-2 shadow-2xl w-full"> {note?.title}</h1>
           
            <div className="flex gap-2">
             
              <Button
  onClick={() => {
   
      setTitle(note.title || '');
      setContent(note.content || '');
      setIsEditing(true);
    
  }}
  className="border border-white bg-black/50 text-white hover:bg-white hover:text-black ml-2 px-6"
>
  Edit
</Button>
            

            </div>
          </div>
                   <div className="bg-white/60 text-lg  p-4 rounded-xl border shadow-xl whitespace-pre-wrap mx-5 h-[70vh] overflow-y-scroll mt-4">
                {note?.content}
              </div>
           </div>
         )
         }
          

        </div>
      </div>
  
  );
}

export default ViewNote;
