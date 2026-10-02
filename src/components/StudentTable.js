function StudentTable({ students }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Student Directory</h2>
      </div>

      {students.length === 0 ? (
        <p className="empty-message">No student records found.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Qualification</th>
                <th>Percent</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone || '-'}</td>
                  <td>{student.highestQualification || '-'}</td>
                  <td>{student.percentage ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default StudentTable;
