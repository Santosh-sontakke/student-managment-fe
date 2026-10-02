import { apiFetch } from '../services/api';

export function useAdmissionMutations(refreshData) {
  const createCourse = async (payload) => {
    await apiFetch('/api/courses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await refreshData();
  };

  const updateCourse = async (courseId, payload) => {
    await apiFetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    await refreshData();
  };

  const deleteCourse = async (courseId) => {
    await apiFetch(`/api/courses/${courseId}`, { method: 'DELETE' });
    await refreshData();
  };

  const createRegistration = async (payload) => {
    await apiFetch('/api/registrations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await refreshData();
  };

  const updateDecision = async (registrationId, payload) => {
    await apiFetch(`/api/registrations/${registrationId}/decision`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    await refreshData();
  };

  return {
    createCourse,
    updateCourse,
    deleteCourse,
    createRegistration,
    updateDecision,
  };
}
