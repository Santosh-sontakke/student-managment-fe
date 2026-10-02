function CourseForm({ form, onChange, onSubmit, onCancel, selectedCourseId }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{selectedCourseId ? 'Edit Course' : 'Create Course'}</h2>
        {selectedCourseId && (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="form-grid">
        <label className="input-group">
          <span>Course name</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Bachelor of Computer Science"
            required
          />
        </label>

        <label className="input-group">
          <span>Course code</span>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={onChange}
            placeholder="BCS"
            required
          />
        </label>

        <label className="input-group full-width">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows="4"
            placeholder="Course description"
          />
        </label>

        <label className="checkbox-row">
          <input type="checkbox" name="active" checked={form.active} onChange={onChange} />
          Active course
        </label>

        <div className="form-actions full-width">
          <button type="submit" className="primary-button">
            {selectedCourseId ? 'Update course' : 'Save course'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CourseForm;
