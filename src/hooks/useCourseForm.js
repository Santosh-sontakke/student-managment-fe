import { useState } from 'react';

export function useCourseForm(initialForm) {
  const [form, setForm] = useState(initialForm);

  const reset = () => setForm(initialForm);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return { form, setForm, reset, handleChange };
}
