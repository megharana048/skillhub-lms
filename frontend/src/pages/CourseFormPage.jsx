import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import api from "../services/api.js";

const emptyLesson = {
  title: "",
  content: "",
  videoUrl: "",
  resourceUrl: "",
  duration: 0,
  isPreview: false,
};

const initialForm = {
  title: "",
  shortDescription: "",
  description: "",
  category: "Web Development",
  level: "Beginner",
  language: "English",
  price: 0,
  thumbnailUrl: "",
  lessons: [{ ...emptyLesson }],
};

function CourseFormPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(courseId);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ loading: editing, saving: false, error: "" });

  useEffect(() => {
    if (!editing) return;
    async function load() {
      try {
        const { data } = await api.get(`/courses/${courseId}`);
        const c = data.course;
        setForm({
          title: c.title,
          shortDescription: c.shortDescription,
          description: c.description,
          category: c.category,
          level: c.level,
          language: c.language,
          price: c.price,
          thumbnailUrl: c.thumbnail?.url || "",
          lessons: c.lessons.length
            ? c.lessons.map(({ title, content, videoUrl, resourceUrl, duration, isPreview }) => ({
                title, content, videoUrl, resourceUrl, duration, isPreview,
              }))
            : [{ ...emptyLesson }],
        });
        setStatus({ loading: false, saving: false, error: "" });
      } catch (error) {
        setStatus({ loading: false, saving: false, error: error.response?.data?.message || "Load failed." });
      }
    }
    load();
  }, [courseId, editing]);

  function change(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.name === "price" ? Number(event.target.value) : event.target.value,
    }));
  }

  function lessonChange(index, event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      lessons: current.lessons.map((lesson, i) =>
        i === index
          ? {
              ...lesson,
              [name]: type === "checkbox" ? checked : name === "duration" ? Number(value) : value,
            }
          : lesson,
      ),
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setStatus((current) => ({ ...current, saving: true, error: "" }));
    const payload = {
      ...form,
      thumbnail: form.thumbnailUrl ? { url: form.thumbnailUrl, publicId: "" } : undefined,
    };
    delete payload.thumbnailUrl;

    try {
      if (editing) await api.put(`/courses/${courseId}`, payload);
      else await api.post("/courses", payload);
      navigate("/instructor");
    } catch (error) {
      setStatus((current) => ({
        ...current,
        saving: false,
        error: error.response?.data?.message || "Save failed.",
      }));
    }
  }

  if (status.loading) return <Loader label="Loading editor..." />;

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-16">
      <form onSubmit={submit} className="mx-auto max-w-5xl space-y-8">
        <h1 className="text-4xl font-black">{editing ? "Edit Course" : "Create Course"}</h1>

        <div className="grid gap-5 rounded-2xl bg-white p-7 shadow-sm md:grid-cols-2">
          <input name="title" value={form.title} onChange={change} placeholder="Course title" required className="rounded-xl border px-4 py-3 md:col-span-2" />
          <input name="shortDescription" value={form.shortDescription} onChange={change} placeholder="Short description" required className="rounded-xl border px-4 py-3 md:col-span-2" />
          <textarea name="description" value={form.description} onChange={change} placeholder="Full description" rows="6" required className="rounded-xl border px-4 py-3 md:col-span-2" />
          <select name="category" value={form.category} onChange={change} className="rounded-xl border bg-white px-4 py-3">
            <option>Web Development</option><option>JavaScript</option><option>UI/UX Design</option><option>Data Science</option><option>Business</option>
          </select>
          <select name="level" value={form.level} onChange={change} className="rounded-xl border bg-white px-4 py-3">
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
          <input name="language" value={form.language} onChange={change} placeholder="Language" className="rounded-xl border px-4 py-3" />
          <input name="price" type="number" min="0" value={form.price} onChange={change} placeholder="Price" className="rounded-xl border px-4 py-3" />
          <input name="thumbnailUrl" type="url" value={form.thumbnailUrl} onChange={change} placeholder="Thumbnail URL" className="rounded-xl border px-4 py-3 md:col-span-2" />
        </div>

        <div className="rounded-2xl bg-white p-7 shadow-sm">
          <div className="flex justify-between">
            <h2 className="text-2xl font-black">Lessons</h2>
            <button type="button" onClick={() => setForm({ ...form, lessons: [...form.lessons, { ...emptyLesson }] })} className="rounded-lg bg-slate-900 px-4 py-2 font-bold text-white">
              Add Lesson
            </button>
          </div>
          <div className="mt-6 space-y-6">
            {form.lessons.map((lesson, index) => (
              <div key={index} className="grid gap-4 rounded-xl bg-slate-50 p-5 md:grid-cols-2">
                <input name="title" value={lesson.title} onChange={(e) => lessonChange(index, e)} placeholder={`Lesson ${index + 1} title`} required className="rounded-xl border px-4 py-3" />
                <input name="duration" type="number" min="0" value={lesson.duration} onChange={(e) => lessonChange(index, e)} placeholder="Minutes" className="rounded-xl border px-4 py-3" />
                <input name="videoUrl" type="url" value={lesson.videoUrl} onChange={(e) => lessonChange(index, e)} placeholder="Video URL" className="rounded-xl border px-4 py-3 md:col-span-2" />
                <input name="resourceUrl" type="url" value={lesson.resourceUrl} onChange={(e) => lessonChange(index, e)} placeholder="Resource URL" className="rounded-xl border px-4 py-3 md:col-span-2" />
                <textarea name="content" value={lesson.content} onChange={(e) => lessonChange(index, e)} placeholder="Lesson notes" rows="4" className="rounded-xl border px-4 py-3 md:col-span-2" />
                <label><input name="isPreview" type="checkbox" checked={lesson.isPreview} onChange={(e) => lessonChange(index, e)} /> Free preview</label>
                {form.lessons.length > 1 ? (
                  <button type="button" onClick={() => setForm({ ...form, lessons: form.lessons.filter((_, i) => i !== index) })} className="text-right font-bold text-red-600">
                    Remove lesson
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {status.error ? <p className="rounded-xl bg-red-50 p-4 text-red-700">{status.error}</p> : null}
        <button disabled={status.saving} className="rounded-xl bg-indigo-600 px-7 py-3 font-bold text-white">
          {status.saving ? "Saving..." : "Save Course"}
        </button>
      </form>
    </section>
  );
}

export default CourseFormPage;
