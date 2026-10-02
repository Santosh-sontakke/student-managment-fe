import { useMemo, useState } from 'react';
import './App.css';
import CourseForm from './components/CourseForm';
import RegistrationForm from './components/RegistrationForm';
import RegistrationTable from './components/RegistrationTable';
import StatCard from './components/StatCard';
import StudentTable from './components/StudentTable';
import { useAdmissionData } from './hooks/useAdmissionData';
import { apiFetch, API_BASE_URL } from './services/api';

const emptyCourseForm = () => ({
  name: '',
  code: '',
  description: '',
  active: true,
});

const emptyStudentForm = () => ({
  name: '',
  email: '',
  phone: '',
  address: '',
  dateOfBirth: '',
  gender: '',
  guardianName: '',
  highestQualification: '',
  percentage: '',
  category: '',
  religion: '',
  occupation: '',
  physicallyChallenged: false,
});

function App() {
  const { courses, students, registrations, loading, error, refreshData } = useAdmissionData();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [courseForm, setCourseForm] = useState(emptyCourseForm());
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [registrationForm, setRegistrationForm] = useState({
    courseId: '',
    student: emptyStudentForm(),
  });
  const [decisionDrafts, setDecisionDrafts] = useState({});
  const [notice, setNotice] = useState({ type: '', message: '' });

  const summary = useMemo(() => {
    const admitted = registrations.filter((item) => item.status === 'ADMITTED').length;
    const pending = registrations.filter((item) => item.status === 'PENDING').length;
    const waitlisted = registrations.filter((item) => item.status === 'WAITLISTED').length;

    return {
      courses: courses.length,
      students: students.length,
      pending,
      admitted,
      waitlisted,
    };
  }, [courses, students, registrations]);

  const handleCourseInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCourseForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRegistrationInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    if (name === 'courseId') {
      setRegistrationForm((prev) => ({ ...prev, courseId: value }));
      return;
    }

    setRegistrationForm((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        [name]: nextValue,
      },
    }));
  };

  const handleCourseSubmit = async (event) => {
    event.preventDefault();
    setNotice({ type: '', message: '' });

    try {
      const payload = { ...courseForm };

      if (selectedCourseId) {
        await apiFetch(`/api/courses/${selectedCourseId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setNotice({ type: 'success', message: 'Course updated successfully.' });
      } else {
        await apiFetch('/api/courses', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setNotice({ type: 'success', message: 'Course created successfully.' });
      }

      setCourseForm(emptyCourseForm());
      setSelectedCourseId(null);
      await refreshData();
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourseId(course.id);
    setCourseForm({
      name: course.name,
      code: course.code,
      description: course.description || '',
      active: course.active,
    });
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Delete this course?')) return;

    try {
      await apiFetch(`/api/courses/${courseId}`, { method: 'DELETE' });
      setNotice({ type: 'success', message: 'Course deleted successfully.' });
      await refreshData();
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    }
  };

  const handleRegistrationSubmit = async (event) => {
    event.preventDefault();
    setNotice({ type: '', message: '' });

    try {
      const payloadStudent = { ...registrationForm.student };
      if (payloadStudent.percentage === '') delete payloadStudent.percentage;
      else payloadStudent.percentage = Number(payloadStudent.percentage);

      if (!payloadStudent.dateOfBirth) delete payloadStudent.dateOfBirth;
      if (!payloadStudent.religion) delete payloadStudent.religion;

      const payload = {
        courseId: Number(registrationForm.courseId),
        student: payloadStudent,
      };

      await apiFetch('/api/registrations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setNotice({ type: 'success', message: 'Student registered successfully.' });
      setRegistrationForm({
        courseId: '',
        student: emptyStudentForm(),
      });
      await refreshData();
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    }
  };

  const updateDecisionDraft = (registrationId, field, value) => {
    setDecisionDrafts((prev) => ({
      ...prev,
      [registrationId]: {
        ...(prev[registrationId] || { status: 'PENDING', batch: '' }),
        [field]: value,
      },
    }));
  };

  const handleDecisionSubmit = async (registrationId) => {
    try {
      const draft = decisionDrafts[registrationId] || { status: 'PENDING', batch: '' };
      const payload = { status: draft.status };

      if (draft.status === 'ADMITTED') {
        if (!draft.batch || !draft.batch.trim()) {
          throw new Error('Batch is required when admitting a student.');
        }
        payload.batch = draft.batch.trim();
      }

      await apiFetch(`/api/registrations/${registrationId}/decision`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });

      setNotice({ type: 'success', message: 'Admission decision updated successfully.' });
      await refreshData();
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    }
  };

  const registrationsWithDrafts = registrations.map((item) => ({
    ...item,
    draft: decisionDrafts[item.id] || {
      status: item.status,
      batch: item.batch || '',
    },
  }));

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Admissions portal</p>
          <h1>Student Admission System</h1>
        </div>
        <div className="topbar-badge">API: {API_BASE_URL}</div>
      </header>

      {notice.message && <div className={`notice ${notice.type}`}>{notice.message}</div>}
      {error && <div className="notice error">{error}</div>}

      <section className="stats-grid">
        <StatCard label="Total Courses" value={summary.courses} />
        <StatCard label="Students" value={summary.students} />
        <StatCard label="Pending" value={summary.pending} />
        <StatCard label="Admitted" value={summary.admitted} accent />
        <StatCard label="Waitlisted" value={summary.waitlisted} />
      </section>

      <div className="content-grid">
        <div className="course-column">
          <CourseForm
            form={courseForm}
            onChange={handleCourseInputChange}
            onSubmit={handleCourseSubmit}
            onCancel={() => {
              setSelectedCourseId(null);
              setCourseForm(emptyCourseForm());
            }}
            selectedCourseId={selectedCourseId}
          />

          <section className="panel list-panel">
            <h3>Courses</h3>
            {courses.length === 0 ? (
              <p className="empty-message">No courses yet.</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Code</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.name}</td>
                        <td>{course.code}</td>
                        <td>
                          <span className={`status-badge ${course.active ? 'success' : 'muted'}`}>
                            {course.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="inline-actions">
                            <button type="button" className="link-button" onClick={() => handleEditCourse(course)}>
                              Edit
                            </button>
                            <button type="button" className="link-button danger" onClick={() => handleDeleteCourse(course.id)}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <RegistrationForm form={registrationForm} onChange={handleRegistrationInputChange} onSubmit={handleRegistrationSubmit} />
      </div>

      <RegistrationTable
        registrations={registrationsWithDrafts}
        statusFilter={statusFilter}
        onStatusFilterChange={(event) => setStatusFilter(event.target.value)}
        onDecisionChange={updateDecisionDraft}
        onDecisionSubmit={handleDecisionSubmit}
      />

      <StudentTable students={students} />

      {loading && <div className="loading-overlay">Loading data...</div>}
    </div>
  );
}

export default App;
