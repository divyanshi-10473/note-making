import React, { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { UploadCloudIcon, FileIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";


function PdfUpload({ PdfFile, setPdfFile, uploadedPdfUrl, setUploadedPdfUrl, setPdfLoadingState, PdfLoadingState }) {
  const inputRef = useRef(null);

  function handleFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile?.type === "application/pdf") {
      setPdfFile(selectedFile);
    } else {
      alert("Please select a PDF file.");
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile?.type === "application/pdf") {
      setPdfFile(droppedFile);
    } else {
      alert("Only PDF files are allowed.");
    }
  }

  function handleRemoveFile() {
    setPdfFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadPdfToCloudinary(){
    setPdfLoadingState(true);
    const data = new FormData();
    data.append('file', PdfFile)
    const response = await axios.post('http://localhost:5000/api/notes/upload-pdf', data)
    console.log(response, "pdfresponsce");
    if(response.data.success) {
      console.log(response.data);
      setUploadedPdfUrl(response.data.result.secure_url)
      setPdfLoadingState(false);
    };
  }

  useEffect(()=>{
    console.log(PdfFile, "file aayi ki nhi")
    if(PdfFile!==null) uploadPdfToCloudinary()

  },[PdfFile])

  return (
    <div className="w-full mt-4">
      <Label className="text-lg font-semibold mb-2 block">Upload PDF</Label>
      <div
        className="border-2 border-dashed rounded-lg p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          ref={inputRef}
          className="hidden"
        />
        {!PdfFile ? (
          <Label htmlFor="pdf-upload" className="flex flex-col items-center justify-center h-32">
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground" />
            <span className="mt-2 text-sm text-muted-foreground">Drag & drop or click to upload PDF</span>
          </Label>
        ) : PdfLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 h-8 text-primary mr-2" />
              <p className="text-sm font-medium truncate max-w-xs">{PdfFile.name}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveFile}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfUpload;
