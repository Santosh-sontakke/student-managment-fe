import { useState } from 'react';

export function useRegistrationForm(initialForm) {
  const [form, setForm] = useState(initialForm);

  const reset = () => setForm(initialForm);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    if (name === 'courseId') {
      setForm((prev) => ({ ...prev, courseId: value }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        [name]: nextValue,
      },
    }));
  };

  return { form, setForm, reset, handleChange };
}
