import { useMemo, useState } from 'react';
import './App.css';
import CourseForm from './components/CourseForm';
import CourseTable from './components/CourseTable';
import RegistrationForm from './components/RegistrationForm';
import RegistrationTable from './components/RegistrationTable';
import StatCard from './components/StatCard';
import StudentTable from './components/StudentTable';
import TopBar from './components/TopBar';
import { useAdmissionData } from './hooks/useAdmissionData';
import { useAdmissionMutations } from './hooks/useAdmissionMutations';
import { useCourseForm } from './hooks/useCourseForm';
import { useDecisionForm } from './hooks/useDecisionForm';
import { useRegistrationForm } from './hooks/useRegistrationForm';

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
  const { createCourse, updateCourse, deleteCourse, createRegistration, updateDecision } = useAdmissionMutations(refreshData);
  const { form: courseForm, setForm: setCourseForm, reset: resetCourseForm, handleChange: handleCourseInputChange } = useCourseForm(emptyCourseForm());
  const { form: registrationForm, reset: resetRegistrationForm, handleChange: handleRegistrationInputChange } = useRegistrationForm({
    courseId: '',
    student: emptyStudentForm(),
  });
  const { decisionDrafts, updateDecisionDraft } = useDecisionForm();

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCourseId, setSelectedCourseId] = useState(null);
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

  const handleCourseSubmit = async (event) => {
    event.preventDefault();
    setNotice({ type: '', message: '' });

    try {
      const payload = { ...courseForm };

      if (selectedCourseId) {
        await updateCourse(selectedCourseId, payload);
        setNotice({ type: 'success', message: 'Course updated successfully.' });
      } else {
        await createCourse(payload);
        setNotice({ type: 'success', message: 'Course created successfully.' });
      }

      resetCourseForm();
      setSelectedCourseId(null);
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
      await deleteCourse(courseId);
      setNotice({ type: 'success', message: 'Course deleted successfully.' });
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

      await createRegistration(payload);
      setNotice({ type: 'success', message: 'Student registered successfully.' });
      resetRegistrationForm();
    } catch (err) {
      setNotice({ type: 'error', message: err.message });
    }
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

      await updateDecision(registrationId, payload);
      setNotice({ type: 'success', message: 'Admission decision updated successfully.' });
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
      <TopBar />

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
              resetCourseForm();
            }}
            selectedCourseId={selectedCourseId}
          />

          <CourseTable courses={courses} onEdit={handleEditCourse} onDelete={handleDeleteCourse} />
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
