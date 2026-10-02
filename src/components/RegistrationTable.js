const STATUS_OPTIONS = ['PENDING', 'WAITLISTED', 'SELECTED', 'ADMITTED', 'REJECTED'];

function RegistrationTable({ registrations, statusFilter, onStatusFilterChange, onDecisionChange, onDecisionSubmit }) {
  const filteredRegistrations =
    statusFilter === 'ALL'
      ? registrations
      : registrations.filter((item) => item.status === statusFilter);

  return (
    <section className="panel admissions-panel">
      <div className="panel-header admissions-header">
        <h2>Registration Review</h2>
        <select value={statusFilter} onChange={onStatusFilterChange}>
          <option value="ALL">All statuses</option>
          {STATUS_OPTIONS.map((status) => (
            <option value={status} key={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {filteredRegistrations.length === 0 ? (
        <p className="empty-message">No registrations match the selected filter.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Registration #</th>
                <th>Student</th>
                <th>Course</th>
                <th>Status</th>
                <th>Batch</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((registration) => {
                const draft = registration.draft || {
                  status: registration.status,
                  batch: registration.batch || '',
                };

                return (
                  <tr key={registration.id}>
                    <td>{registration.id}</td>
                    <td>{registration.registrationNumber}</td>
                    <td>
                      <div className="student-cell">
                        <strong>{registration.student?.name}</strong>
                        <span>{registration.student?.email}</span>
                      </div>
                    </td>
                    <td>{registration.course?.name}</td>
                    <td>
                      <span className={`status-badge ${registration.status.toLowerCase()}`}>
                        {registration.status}
                      </span>
                    </td>
                    <td>{registration.batch || '-'}</td>
                    <td>
                      <div className="decision-editor">
                        <select
                          value={draft.status}
                          onChange={(event) => onDecisionChange(registration.id, 'status', event.target.value)}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option value={status} key={`${registration.id}-${status}`}>
                              {status}
                            </option>
                          ))}
                        </select>

                        {draft.status === 'ADMITTED' && (
                          <input
                            type="text"
                            placeholder="Batch"
                            value={draft.batch}
                            onChange={(event) => onDecisionChange(registration.id, 'batch', event.target.value)}
                          />
                        )}

                        <button
                          type="button"
                          className="primary-button small"
                          onClick={() => onDecisionSubmit(registration.id)}
                        >
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RegistrationTable;
