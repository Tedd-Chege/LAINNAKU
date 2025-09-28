// UpdatePost.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";
import DashSidebar from '../components/DashSidebar';

const fieldClass = "block w-full px-5 py-3 text-base text-[#222] bg-white border-2 border-[#ececec] rounded-xl focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 focus:shadow-lg outline-none transition placeholder:font-normal placeholder:text-[#000000]";
const labelClass = "block font-semibold text-base text-[#222] mb-2";
const buttonClass = "w-full mt-2 rounded-xl bg-[#ff385c] hover:bg-[#d7043c] active:scale-95 transition text-white text-lg font-bold py-3 shadow-md focus:ring-2 focus:ring-[#ff385c]/30";
const cardClass = "bg-white border border-[#ececec] rounded-3xl shadow-xl w-full max-w-xl p-6 md:p-10 flex flex-col gap-10 ml-10";

const UpdatePost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
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
  const [status, setStatus] = useState("past_exams");
  const [post, setPost] = useState(null); // Store the post data

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await axios.get(`/api/files/getposts/${postId}`);
        const post = response.data;
        setPost(post); // Set the post data
        setFileUrl(post.fileUrl);
        setCategory(post.category);
        setSubject(post.subject);
        setYear(post.year);
        setTerm(post.term);
        setForm(post.form);
        setDescription(post.description);
        setTitle(post.title);
        setExamType(post.examType || "opener");
        setStatus(post.status || "past_exams");
      } catch (error) {
        setError("Error fetching post data");
      }
    };
    fetchPostData();
  }, [postId]);

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
    if (!file) return setError("Please select a file to upload");
    setUploading(true);
    setError(null);
    try {
      const url = await storeFile(file);
      setFileUrl(url);
      setFile(null);
    } catch (error) {
      setError("File upload failed (10MB max per file)");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileUrl) return setError("You must upload a file");
    const formData = {
      fileUrl,
      category,
      subject,
      year: category === "notes" ? "" : year,
      term: category === "notes" ? "" : term,
      form,
      description,
      title,
      examType: category !== "notes" ? examType : "",
      status,
    };
    try {
      await axios.put(`/api/files/updatepost/${postId}`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      alert("Post updated successfully");
      navigate("/dashboard?tab=posts");
    } catch (error) {
      setError("Failed to update post");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex mt-14 relative">
      <aside className="fixed md:static top-18 left-0 h-[calc(100vh-3.5rem)] z-30 border-r border-[#fffdfd] backdrop-blur-lg shadow-2xl bg-white/90">
        <DashSidebar />
      </aside>
      <div className="flex-1 flex items-center justify-center px-2 py-10">
        <div className={cardClass}>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#222] text-center mb-2 tracking-tight">Update File</h1>
          <form className="space-y-8" onSubmit={handleSubmit} autoComplete="off">
            <div>
              <label className={labelClass} htmlFor="title">Title</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={fieldClass} />
            </div>

            <div>
              <label className={labelClass} htmlFor="file">Select File</label>
              <input id="file" type="file" onChange={handleFileChange} className={fieldClass} />
              <button type="button" onClick={handleFileSubmit} disabled={uploading} className={buttonClass + (uploading ? " opacity-60 cursor-wait" : "")}>{uploading ? "Uploading..." : "Upload"}</button>
              {fileUrl && (
                <div className="mt-2 flex justify-between items-center border rounded-xl px-4 py-3 bg-[#f8f9fa]">
                  <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-semibold break-all">Uploaded File</a>
                  <button type="button" onClick={() => setFileUrl("")} className="text-[#ff385c] hover:text-[#d7043c] font-semibold">Delete</button>
                </div>
              )}
              {error && <p className="text-base font-semibold text-[#ff385c] mt-2">{error}</p>}
            </div>

            <div>
              <label className={labelClass} htmlFor="category">Category</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className={fieldClass} required>
                <option value="notes">Notes</option>
                <option value="exams">Exams</option>
                <option value="results">Results</option>
                <option value="marking_scheme">Marking Scheme</option>
              </select>
            </div>

            {category === "exams" && (
              <div>
                <label className={labelClass} htmlFor="status">Status</label>
                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={fieldClass} required>
                  <option value="exam_in_progress">Exam In Progress</option>
                  <option value="past_exams">Past Exams</option>
                </select>
              </div>
            )}

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

            {category !== "notes" && (
              <>
                <div>
                  <label className={labelClass} htmlFor="year">Year</label>
                  <input id="year" type="number" value={year} onChange={(e) => setYear(e.target.value)} required placeholder="e.g. 2023" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="term">Term</label>
                  <select id="term" value={term} onChange={(e) => setTerm(e.target.value)} className={fieldClass} required>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="examType">Exam Type</label>
                  <select id="examType" value={examType} onChange={(e) => setExamType(e.target.value)} className={fieldClass} required>
                    <option value="opener">Opener</option>
                    <option value="midterm">Midterm</option>
                    <option value="endterm">Endterm</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className={labelClass} htmlFor="form">Form</label>
              <select id="form" value={form} onChange={(e) => setForm(e.target.value)} className={fieldClass} required>
                <option value=""></option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="description">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={fieldClass + " min-h-[90px] resize-none"} required placeholder="Describe the file..." />
            </div>

            <button type="submit" className={buttonClass}>Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePost;
