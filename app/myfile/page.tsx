"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "../component/myfile/Navbar";
import Navbar2 from "../component/myfile/Navbar2";
import Icon from "@mdi/react";
import { mdiFileAccount } from "@mdi/js";
import axios from "axios";
import Loader from "../component/Loader";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { jsPDF } from "jspdf";

interface File {
  fileName: string;
  fileType: string;
  fileURL: string;
}

function MyFile() {
  const { status, data: session } = useSession();
  const router = useRouter();

  const [loader, setLoader] = useState<boolean>(true);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [updatedPdf, setUpdatedPdf] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isAddingText, setIsAddingText] = useState<boolean>(false);
  const [isMovingText, setIsMovingText] = useState<boolean>(false);

  const [textElements, setTextElements] = useState<{
    text: string;
    x: number;
    y: number;
  }[]>([]);
  const [draggingTextIndex, setDraggingTextIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggingOffsets, setDraggingOffsets] = useState<{
    offsetX: number;
    offsetY: number;
  } | null>(null);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (!session) {
      router.replace("/login");
      setLoader(false);
    }

    if (session?.user?.idUser) {
      getFiles(session?.user?.idUser);
    }
  }, [session, status]);

  useEffect(() => {
    if (!isPopupOpen) {
      setTextElements([]);
    }
  }, [isPopupOpen]);

  async function getFiles(id: string) {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/upload/${id}`
      );
      setFiles(res.data.files || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  }

  const handleOpenPopup = async (fileUrl: string) => {
    setSelectedFile(fileUrl);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedFile(null);
  };

  const handlePdfClick = (e: React.MouseEvent) => {
    if (!isAddingText) return;

    const pdfContainer = e.currentTarget as HTMLElement;
    const x = e.clientX - pdfContainer.offsetLeft;
    const y = e.clientY - pdfContainer.offsetTop;

    const text = prompt("กรอกข้อความที่ต้องการเพิ่ม");
    if (text) {
      setTextElements([
        ...textElements,
        { text: text, x: x, y: y },
      ]);
    }
  };

  const handleTextDragStart = (index: number, e: React.MouseEvent) => {
    if (!isMovingText) return;
    setIsDragging(true);
    setDraggingTextIndex(index);

    const textElement = textElements[index];
    const offsetX = e.clientX - textElement.x;
    const offsetY = e.clientY - textElement.y;
    setDraggingOffsets({ offsetX, offsetY });
  };

  const handleTextDrag = (e: React.MouseEvent) => {
    if (!isDragging || draggingTextIndex === null || !draggingOffsets) return;

    const newTextElements = [...textElements];
    const newX = e.clientX - draggingOffsets.offsetX;
    const newY = e.clientY - draggingOffsets.offsetY;

    newTextElements[draggingTextIndex].x = newX;
    newTextElements[draggingTextIndex].y = newY;
    setTextElements(newTextElements);
  };

  const handleTextDragEnd = () => {
    setIsDragging(false);
    setDraggingTextIndex(null);
    setDraggingOffsets(null);
  };

  const savePdf = async () => {
    try {
      const { PDFDocument, rgb } = await import("pdf-lib");
  
      // โหลดไฟล์ PDF ต้นฉบับ
      const existingPdfBytes = await fetch(selectedFile!).then((res) =>
        res.arrayBuffer()
      );
  
      // โหลด PDF และสร้างเอกสารใหม่
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();
      const firstPage = pages[0]; // เพิ่มข้อความในหน้าที่หนึ่ง
  
      // เพิ่มข้อความลงใน PDF
      textElements.forEach((element) => {
        const y = firstPage.getHeight() - element.y; // คำนวณแกน Y
        if (y >= 0 && y <= firstPage.getHeight()) {
          firstPage.drawText(element.text, {
            x: element.x,
            y: y,
            size: 12,
            color: rgb(0, 0, 0), // สีดำ
          });
        } else {
          console.warn(
            `ตำแหน่งข้อความ (${element.text}) อยู่นอกกรอบหน้ากระดาษ`
          );
        }
      });
  
      // บันทึกไฟล์ PDF ใหม่
      const pdfBytes = await pdfDoc.save();
  
      // ดาวน์โหลด PDF ใหม่
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "updated-file.pdf";
      link.click();
    } catch (error) {
      console.error("Error saving PDF:", error);
    }
  };
  
  

  // ฟังก์ชันโหลดไฟล์
const loadFile = async () => {
    try {
      const { PDFDocument } = await import("pdf-lib");
  
      // สร้าง PDF เปล่าหรือโหลดไฟล์ต้นฉบับ
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      page.drawText("ไฟล์ PDF ที่มีการแก้ไขข้อความแล้ว", {
        x: 50,
        y: 750,
        size: 12,
      });
  
      // ดาวน์โหลดไฟล์
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "downloaded-file.pdf";
      link.click();
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  };

  return (
    <>
      <head>
        <title>MyFile</title>
      </head>
      <div className="p-5 flex">
        <Navbar status="myfile" />
        <div className="bg-white rounded-3xl p-10 min-h-screen w-full">
          <Navbar2 title="เอกสารของฉัน" />

          <div className="mt-10 border p-10 rounded-3xl">
            <p className="text-xl font-medium">ไฟล์เริ่มต้น</p>
            <div className="my-5 grid grid-cols-4 gap-5">
              {loader ? (
                <Loader />
              ) : files.length > 0 ? (
                files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded-xl p-4 bg-gray-100 cursor-pointer"
                    onClick={() => handleOpenPopup(file.fileURL)}
                  >
                    <div className="flex gap-3 overflow-hidden">
                      <Icon path={mdiFileAccount} size={1} />
                      <p className="text-ellipsis">{file.fileName}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>ยังไม่มีไฟล์ที่อัพโหลด</p>
              )}
            </div>
          </div>

          {isPopupOpen && selectedFile && (
            <div
              className="popup-overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
              onClick={handleClosePopup}
            >
              <div
                className="popup-content bg-white p-5 rounded-lg w-4/5 h-4/5 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: "90%", maxHeight: "90%", overflow: "auto" }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "80%",
                    position: "relative",
                    overflow: "auto",
                  }}
                  onClick={handlePdfClick}
                  onMouseMove={handleTextDrag}
                  onMouseUp={handleTextDragEnd}
                  onMouseLeave={handleTextDragEnd}
                >
                  <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                    <Viewer
                      fileUrl={selectedFile}
                      renderLoader={() => <div>Loading...</div>}
                    />
                  </Worker>

                  {textElements.map((element, index) => (
                    <div
                      key={index}
                      style={{
                        position: "absolute",
                        left: `${element.x}px`,
                        top: `${element.y}px`,
                        color: "red",
                        cursor: "move",
                        userSelect: "none",
                      }}
                      onMouseDown={(e) => handleTextDragStart(index, e)}
                    >
                      {element.text}
                    </div>
                  ))}
                </div>

                <div className="sticky bottom-0 bg-white z-10 border-t p-3">
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={savePdf}
                      className="p-2 bg-blue-500 text-white rounded"
                    >
                      บันทึกไฟล์
                    </button>
                    <button
                      onClick={loadFile}
                      className="p-2 bg-yellow-500 text-white rounded"
                    >
                      โหลดไฟล์
                    </button>
                    <button
                      onClick={handleClosePopup}
                      className="p-2 bg-red-500 text-white rounded"
                    >
                      ปิดเอกสาร
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={() => {
                        setIsAddingText(true);
                        setIsMovingText(false);
                      }}
                      className="p-2 bg-blue-500 text-white rounded"
                    >
                      เพิ่มข้อความ
                    </button>
                    <button
                      onClick={() => {
                        setIsMovingText(true);
                        setIsAddingText(false);
                      }}
                      className="p-2 bg-green-500 text-white rounded"
                    >
                      เคลื่อนย้ายข้อความ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default MyFile;
