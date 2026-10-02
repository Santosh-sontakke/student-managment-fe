function RegistrationForm({ form, onChange, onSubmit }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>New Registration</h2>
      </div>

      <form onSubmit={onSubmit} className="form-grid">
        <label className="input-group">
          <span>Course ID</span>
          <input
            type="number"
            name="courseId"
            value={form.courseId}
            onChange={onChange}
            placeholder="1"
            required
          />
        </label>

        <label className="input-group">
          <span>Student name</span>
          <input
            type="text"
            name="name"
            value={form.student.name}
            onChange={onChange}
            required
          />
        </label>

        <label className="input-group">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={form.student.email}
            onChange={onChange}
            required
          />
        </label>

        <label className="input-group">
          <span>Phone</span>
          <input type="tel" name="phone" value={form.student.phone} onChange={onChange} />
        </label>

        <label className="input-group">
          <span>Date of birth</span>
          <input type="date" name="dateOfBirth" value={form.student.dateOfBirth} onChange={onChange} />
        </label>

        <label className="input-group">
          <span>Gender</span>
          <input type="text" name="gender" value={form.student.gender} onChange={onChange} />
        </label>

        <label className="input-group">
          <span>Guardian name</span>
          <input type="text" name="guardianName" value={form.student.guardianName} onChange={onChange} />
        </label>

        <label className="input-group">
          <span>Highest qualification</span>
          <input type="text" name="highestQualification" value={form.student.highestQualification} onChange={onChange} />
        </label>

        <label className="input-group">
          <span>Percentage</span>
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            name="percentage"
            value={form.student.percentage}
            onChange={onChange}
          />
        </label>

        <label className="input-group">
          <span>Category</span>
          <input type="text" name="category" value={form.student.category} onChange={onChange} />
        </label>

        <label className="input-group">
          <span>Religion</span>
          <input type="text" name="religion" value={form.student.religion} onChange={onChange} />
        </label>

        <label className="input-group">
          <span>Occupation</span>
          <input type="text" name="occupation" value={form.student.occupation} onChange={onChange} />
        </label>

        <label className="input-group full-width">
          <span>Address</span>
          <textarea name="address" rows="3" value={form.student.address} onChange={onChange} />
        </label>

        <label className="checkbox-row full-width">
          <input
            type="checkbox"
            name="physicallyChallenged"
            checked={form.student.physicallyChallenged}
            onChange={onChange}
          />
          Physically challenged
        </label>

        <div className="form-actions full-width">
          <button type="submit" className="primary-button">
            Register applicant
          </button>
        </div>
      </form>
    </section>
  );
}

export default RegistrationForm;
