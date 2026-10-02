function CourseTable({ courses, onEdit, onDelete }) {
  return (
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
                      <button type="button" className="link-button" onClick={() => onEdit(course)}>
                        Edit
                      </button>
                      <button type="button" className="link-button danger" onClick={() => onDelete(course.id)}>
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
  );
}

export default CourseTable;
