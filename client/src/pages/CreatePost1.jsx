// Fully Integrated UploadForm.jsx with bulletproof exam status
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import DashSidebar from "../components/DashSidebar";

const fieldClass =
  "block w-full px-5 py-3 text-base text-[#222] bg-white border-2 border-[#ececec] rounded-xl focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 focus:shadow-lg outline-none transition placeholder:font-normal placeholder:text-[#000000]";

const labelClass = "block font-semibold text-base text-[#222] mb-2";
const buttonClass =
  "w-full mt-2 rounded-xl bg-[#ff385c] hover:bg-[#d7043c] active:scale-95 transition text-white text-lg font-bold py-3 shadow-md focus:ring-2 focus:ring-[#ff385c]/30";
const cardClass =
  "bg-white border border-[#ececec] rounded-3xl shadow-xl w-full max-w-xl p-6 md:p-10 flex flex-col gap-10";

const SIDEBAR_COLLAPSED = 64;
const SIDEBAR_EXPANDED = 224;

// NEW: tiny normalizers so outgoing payload is always canonical
const norm = (v) => (v == null ? "" : String(v)).trim();
const normUnderscore = (v) => norm(v).toLowerCase().replace(/[-\s]+/g, "_");

const UploadForm = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [category, setCategory] = useState("notes");
  const [subject, setSubject] = useState("math");
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
  const [form, setForm] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [examType, setExamType] = useState("opener");
  const [status, setStatus] = useState("not_exam");

  const [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const handleResize = () => {
      setSidebarExpanded(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const storeFile = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const url = await storeFile(file);
      setFileUrl(url);
      setFile(null);
      setUploading(false);
    } catch (error) {
      setError("File upload failed (10MB max per file)");
      setUploading(false);
    }
  };

  // NEW: when category changes to exams, default status to exam_in_progress; otherwise not_exam
  const onCategoryChange = (e) => {
    const next = e.target.value;
    setCategory(next);
    if (next === "notes") {
      setYear("");
      setTerm("");
    }
    if (next === "exams") {
      setStatus("exam_in_progress");
    } else {
      setStatus("not_exam");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl) {
      setError("You must upload a file");
      return;
    }

    // NEW: canonicalize outgoing values
    const cat = normUnderscore(category); // 'exams' | 'notes' | ...
    const st  = normUnderscore(status);   // 'exam_in_progress' | 'past_exams' | 'not_exam'
    const et  = normUnderscore(examType); // 'opener' | 'midterm' | 'endterm'

    // CHANGED: whitelist status for exams ONLY; never send 'not_exam' for an exam
    const outgoingStatus =
      cat === "exams"
        ? (st === "exam_in_progress" ? "exam_in_progress" : "past_exams")
        : "not_exam";

    const formData = {
      userId: currentUser._id,
      fileUrl,
      category: cat, // optional to normalize; safe to keep original if you prefer
      subject,
      year: cat === "notes" ? "" : year,
      term: cat === "notes" ? "" : term,
      form,
      description,
      title,
      uploadDate: new Date(),
      examType: (cat === "exams" || cat === "marking_scheme" || cat === "results") ? et : "",
      status: outgoingStatus, // ← this is now guaranteed to match the selected option
    };

    // Optional: inspect exactly what's being sent
    // console.log("POST /api/files/upload", formData);

    try {
      await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      alert("File uploaded successfully");
      // reset
      setFileUrl("");
      setCategory("notes");
      setSubject("math");
      setYear("");
      setTerm("");
      setForm("");
      setDescription("");
      setTitle("");
      setStatus("not_exam");
      setExamType("opener");
    } catch (error) {
      setError("Failed to upload file");
    }
  };

  const marginLeft =
    typeof window !== "undefined" && window.innerWidth >= 1024
      ? sidebarExpanded
        ? SIDEBAR_EXPANDED
        : SIDEBAR_COLLAPSED
      : 0;

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans pt-16 flex">
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] z-30 transition-all duration-300 border-r border-[#ececec] backdrop-blur-lg ${sidebarExpanded ? "w-56 shadow-2xl bg-white/90" : "w-16 bg-white/80"}`}
        style={{ minHeight: "calc(100vh - 4rem)", flexShrink: 0 }}
      >
        <DashSidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded((e) => !e)} />
      </aside>

      <main
        className="flex-1 flex items-center justify-center px-2 py-10"
        style={{ marginLeft, transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)" }}
      >
        <div className={cardClass}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#222] text-center mb-2 tracking-tight">
            Upload File
          </h1>
          <form className="space-y-8" onSubmit={handleSubmit} autoComplete="off">
            <div>
              <label className={labelClass} htmlFor="title">Title</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={fieldClass} />
            </div>

            <div>
              <label className={labelClass} htmlFor="category">Category</label>
              <select id="category" value={category} onChange={onCategoryChange} className={fieldClass} required>
                <option value="notes">Notes</option>
                <option value="exams">Exams</option>
                <option value="results">Results</option>
                <option value="marking_scheme">Marking Scheme</option>
              </select>
            </div>

            {category !== "notes" && (
              <>
                <div>
                  <label className={labelClass} htmlFor="year">Year</label>
                  <input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="term">Term</label>
                  <select id="term" value={term} onChange={(e) => setTerm(e.target.value)} className={fieldClass} required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
              </>
            )}

            {(category === "exams" || category === "marking_scheme" || category === "results") && (
              <div>
                <label className={labelClass} htmlFor="examType">Exam Type</label>
                <select
                  id="examType"
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className={fieldClass}
                  required
                >
                  <option value="opener">Opener</option>
                  <option value="midterm">Midterm</option>
                  <option value="endterm">Endterm</option>
                </select>
              </div>
            )}

            {category === "exams" && (
              <div>
                <label className={labelClass} htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={fieldClass}
                  required
                >
                  {/* Values here must match backend whitelist exactly */}
                  <option value="exam_in_progress">Exam In Progress</option>
                  <option value="past_exams">Past Exams</option>
                </select>
              </div>
            )}

            <div>
              <label className={labelClass} htmlFor="form">Form</label>
              <select id="form" value={form} onChange={(e) => setForm(e.target.value)} className={fieldClass} required>
                <option value="">Select form</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="subject">Subject</label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={fieldClass}
                required
              >
                <option value="">Select Subject</option>
                <option value="math">Math</option>
                <option value="english">English</option>
                <option value="Kiswahili">Kiswahili</option>
                <option value="biology">Biology</option>
                <option value="chemistry">Chemistry</option>
                <option value="physics">Physics</option>
                <option value="history">History</option>
                <option value="geography">Geography</option>
                <option value="cre">CRE</option>
                <option value="computer">Computer</option>
                <option value="french">French</option>
                <option value="aviation">Aviation</option>
                <option value="agriculture">Agriculture</option>
                <option value="music">Music</option>
                <option value="homescience">Home Science</option>
                <option value="electricity">Electricity</option>
                <option value="business">Business</option>
                <option value="woodwork">Woodwork</option>
                <option value="art">Art</option>
                <option value="building_construction">Building Construction</option>
                <option value="all_subjects">All Subjects</option>
                <option value="drawing_design">Drawing & Design</option>
                <option value="german">German</option>
                <option value="IRE">IRE</option>
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={fieldClass + " min-h-[90px] resize-none"}
                required
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="file">Select File</label>
              <input id="file" type="file" onChange={handleFileChange} className={fieldClass} required />
              <button
                type="button"
                onClick={handleFileSubmit}
                disabled={uploading}
                className={buttonClass + (uploading ? " opacity-60 cursor-wait" : "")}
              >
                {uploading ? "Uploading..." : "Upload File"}
              </button>
              {fileUrl && (
                <div className="mt-2 text-base font-semibold text-green-700 flex items-center gap-2">
                  File uploaded!
                  <button
                    type="button"
                    onClick={() => setFileUrl("")}
                    className="underline text-[#ff385c] hover:text-[#d7043c] font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}
              {error && <p className="text-base font-semibold text-[#ff385c] mt-2">{error}</p>}
            </div>

            <button type="submit" className={buttonClass}>Submit</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadForm;
