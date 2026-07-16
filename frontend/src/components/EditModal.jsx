/**
 * EditModal.jsx — Modal dialog for editing an existing appointment.
 *
 * Props:
 *   appointment — the appointment object to edit (null → modal hidden)
 *   onClose     — callback to close the modal
 *   onSave      — callback(updatedAppointment) after successful PUT
 */

import { useState, useEffect } from 'react';
import { updateAppointment } from '../api/api';
import './EditModal.css';

/* Same static data used in BookingForm */
const DEPARTMENTS = [
  'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
  'General Medicine', 'Nephrology', 'Neurology', 'Obstetrics & Gynaecology',
  'Oncology', 'Ophthalmology', 'Orthopaedics', 'Paediatrics',
  'Psychiatry', 'Pulmonology', 'Urology',
];

const DOCTORS = [
  'Dr. A. Sharma', 'Dr. B. Patel', 'Dr. C. Reddy', 'Dr. D. Kumar',
  'Dr. E. Nair', 'Dr. F. Choudhury', 'Dr. G. Rao', 'Dr. H. Menon',
  'Dr. I. Verma', 'Dr. J. Singh',
];

const SLOTS = ['Morning (9 AM – 12 PM)', 'Afternoon (1 PM – 4 PM)', 'Evening (5 PM – 8 PM)'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function EditModal({ appointment, onClose, onSave }) {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /** Pre-populate form when appointment prop changes */
  useEffect(() => {
    if (appointment) {
      setForm({
        name: appointment.name || '',
        age: appointment.age ?? '',
        gender: appointment.gender || '',
        phone: appointment.phone || '',
        department: appointment.department || '',
        doctor: appointment.doctor || '',
        // Format date as 'YYYY-MM-DD' for the date input
        date: appointment.date ? appointment.date.slice(0, 10) : '',
        // Format time as 'HH:MM' for the time input
        time: appointment.time ? appointment.time.slice(0, 5) : '',
        slot: appointment.slot || '',
        symptoms: appointment.symptoms || '',
      });
    }
  }, [appointment]);

  /** Generic change handler */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  /** Submit the PUT request */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ['name', 'age', 'gender', 'phone', 'department', 'doctor', 'date', 'time', 'slot'];
    for (const field of required) {
      if (!form[field]) {
        setError(`Please fill in the "${field}" field.`);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const payload = { ...form, age: parseInt(form.age, 10) };
      const { data } = await updateAppointment(appointment.id, payload);
      if (onSave) onSave(data);
      onClose(); // close modal on success
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Update failed.';
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  /** Close when clicking backdrop (outside the modal content) */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!appointment) return null; // modal hidden

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className="modal-content">
        <div className="modal-header">
          <h2>✏️ Edit Appointment</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {error && (
          <div className="error-toast" role="alert">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Row 1 */}
          <div className="modal-grid">
            <div className="form-group">
              <label htmlFor="edit-name">Full Name *</label>
              <input id="edit-name" name="name" type="text" value={form.name || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="edit-age">Age *</label>
              <input id="edit-age" name="age" type="number" min="0" max="150" value={form.age ?? ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="edit-gender">Gender *</label>
              <select id="edit-gender" name="gender" value={form.gender || ''} onChange={handleChange}>
                <option value="">Select</option>
                {GENDERS.map((g) => (<option key={g} value={g}>{g}</option>))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-phone">Phone *</label>
              <input id="edit-phone" name="phone" type="tel" value={form.phone || ''} onChange={handleChange} />
            </div>
          </div>

          {/* Row 2 */}
          <div className="modal-grid">
            <div className="form-group">
              <label htmlFor="edit-dept">Department *</label>
              <select id="edit-dept" name="department" value={form.department || ''} onChange={handleChange}>
                <option value="">Select</option>
                {DEPARTMENTS.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-doctor">Doctor *</label>
              <select id="edit-doctor" name="doctor" value={form.doctor || ''} onChange={handleChange}>
                <option value="">Select</option>
                {DOCTORS.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-date">Date *</label>
              <input id="edit-date" name="date" type="date" value={form.date || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="edit-time">Time *</label>
              <input id="edit-time" name="time" type="time" value={form.time || ''} onChange={handleChange} />
            </div>
          </div>

          {/* Row 3 */}
          <div className="modal-grid">
            <div className="form-group">
              <label htmlFor="edit-slot">Slot *</label>
              <select id="edit-slot" name="slot" value={form.slot || ''} onChange={handleChange}>
                <option value="">Select</option>
                {SLOTS.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div className="form-group full-width">
              <label htmlFor="edit-symptoms">Symptoms</label>
              <textarea id="edit-symptoms" name="symptoms" rows="3" value={form.symptoms || ''} onChange={handleChange} />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
