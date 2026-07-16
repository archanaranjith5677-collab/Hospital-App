/**
 * AppointmentsTable.jsx — Displays all appointments in a table with edit & delete actions.
 *
 * Props:
 *   appointments  — Array of appointment objects from the API
 *   onEdit        — callback(appointment)  → opens the edit modal
 *   onDelete      — callback(id)           → deletes after confirmation
 *   loading       — boolean                → shows spinner while data loads
 */

import './AppointmentsTable.css';

export default function AppointmentsTable({ appointments, onEdit, onDelete, loading }) {
  /** Handle delete with a confirm dialog */
  const handleDelete = (appt) => {
    if (window.confirm(`Delete appointment for "${appt.name}"? This cannot be undone.`)) {
      onDelete(appt.id);
    }
  };

  /** Format a date string for display */
  const fmtDate = (raw) => {
    if (!raw) return '—';
    const d = new Date(raw);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  /** Format a time string for display */
  const fmtTime = (raw) => {
    if (!raw) return '—';
    // FastAPI returns time as "HH:MM:SS" or "HH:MM"
    return raw.slice(0, 5);
  };

  if (loading) {
    return (
      <div className="table-card">
        <h2 className="table-title">📋 All Appointments</h2>
        <div className="table-spinner">Loading appointments…</div>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="table-card">
        <h2 className="table-title">📋 All Appointments</h2>
        <div className="table-empty">
          <p>No appointments booked yet.</p>
          <p className="text-muted">Use the form above to book your first appointment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      <h2 className="table-title">
        📋 All Appointments <span className="badge">{appointments.length}</span>
      </h2>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Slot</th>
              <th>Symptoms</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, idx) => (
              <tr key={appt.id}>
                <td className="cell-id">{idx + 1}</td>
                <td className="cell-name">{appt.name}</td>
                <td>{appt.age}</td>
                <td>{appt.gender}</td>
                <td>{appt.phone}</td>
                <td>{appt.department}</td>
                <td>{appt.doctor}</td>
                <td>{fmtDate(appt.date)}</td>
                <td className="cell-time">{fmtTime(appt.time)}</td>
                <td>{appt.slot}</td>
                <td className="cell-symptoms" title={appt.symptoms || ''}>
                  {appt.symptoms ? (appt.symptoms.length > 40 ? appt.symptoms.slice(0, 40) + '…' : appt.symptoms) : '—'}
                </td>
                <td className="cell-actions">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(appt)}
                    title="Edit appointment"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(appt)}
                    title="Delete appointment"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
