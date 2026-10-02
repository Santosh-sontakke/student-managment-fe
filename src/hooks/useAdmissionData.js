import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../services/api';

export function useAdmissionData() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [coursesData, studentsData, registrationsData] = await Promise.all([
        apiFetch('/api/courses'),
        apiFetch('/api/students'),
        apiFetch('/api/registrations'),
      ]);

      setCourses(coursesData || []);
      setStudents(studentsData || []);
      setRegistrations(registrationsData || []);
    } catch (err) {
      setError(err.message || 'Failed to load admission data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    courses,
    students,
    registrations,
    loading,
    error,
    refreshData,
  };
}
