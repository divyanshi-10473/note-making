import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';  // Import useParams to get chapterId
import bg from '../../assets/19.jpg';
import { Mic, MicOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createNote } from '../../../store/note-slice';  // Make sure this is the correct import path
import { toast } from '@/hooks/use-toast';

function AddNote() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const { chapterId } = useParams();  // Use useParams to get chapterId
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      console.log("Voice recognition started");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setContent(prev => prev + finalTranscript);
      }

      setInterimText(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setIsListening(false);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
    };
  }, [isListening, language]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!title && !content) return;
    const timer = setInterval(() => {
      console.log("Auto-saving draft...", { title, content });
    }, 30000);
    setAutoSaveTimer(timer);
    return () => clearInterval(timer);
  }, [title, content]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("chapterId", chapterId);  
  
    try {
      const result = await dispatch(createNote(formData)).unwrap();
       
      toast({
        title: "Note saved successfully!",
        className: "bg-green-500 text-white",
      });
  
      console.log("Saving note:", { title, content, chapterId });
      navigate(-1); 
    } catch (error) {
      toast({
        title: error || "Failed to save note",
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${bg}')` }}>
      <div className='min-h-screen backdrop-blur-sm pt-[5%]'>
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <div className="flex justify-between items-center mx-5">
            <Input
              placeholder="Enter note title..."
              className="text-xl font-semibold bg-white/75 border border-gray-300 rounded-lg p-4 shadow-2xl w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex gap-2">
            <Button onClick={() => setIsListening((prev) => !prev)} className={`ml-2 ${isListening ? 'bg-red-400' : 'bg-green-400'} rounded-full`}>
                {isListening ? <MicOff /> : <Mic />}
              </Button>
              <div className="relative">
                {isListening && <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full animate-ping"></span>}
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border rounded px-2 text-sm bg-white ml-2"
              >
                <option value="en-US">English</option>
                <option value="hi-IN">Hindi</option>
              </select>
             
              <Button
                onClick={handleSave}
                disabled={!title || !content}
                className='border border-white bg-black/50 text-white hover:bg-white hover:text-black transition-colors duration-200'
              >
                Save
              </Button>
            </div>
          </div>
          <div className='w-100 mx-5'>
            <Textarea
              rows={20}
              className="w-full text-lg bg-white/55 border border-gray-300 rounded-lg p-4 shadow-2xl"
              placeholder="Type or dictate your notes here..."
              value={content + interimText}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNote;
