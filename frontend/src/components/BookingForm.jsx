/**
 * BookingForm.jsx — Form component for booking a new hospital appointment.
 *
 * Collects: name, age, gender, phone, department, doctor, date, time, slot, symptoms.
 * On successful submission, triggers onBookingSuccess callback and shows a success message.
 */

import { useState } from 'react';
import { createAppointment } from '../api/api';
import './BookingForm.css';

/* Static option lists (can be moved to a config file for larger apps) */
const DEPARTMENTS = [
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'General Medicine',
  'Nephrology',
  'Neurology',
  'Obstetrics & Gynaecology',
  'Oncology',
  'Ophthalmology',
  'Orthopaedics',
  'Paediatrics',
  'Psychiatry',
  'Pulmonology',
  'Urology',
];

const DOCTORS = [
  'Dr. A. Sharma',
  'Dr. B. Patel',
  'Dr. C. Reddy',
  'Dr. D. Kumar',
  'Dr. E. Nair',
  'Dr. F. Choudhury',
  'Dr. G. Rao',
  'Dr. H. Menon',
  'Dr. I. Verma',
  'Dr. J. Singh',
];

const SLOTS = ['Morning (9 AM – 12 PM)', 'Afternoon (1 PM – 4 PM)', 'Evening (5 PM – 8 PM)'];

const GENDERS = ['Male', 'Female', 'Other'];

/* Initial form state */
const INITIAL_FORM = {
  name: '',
  age: '',
  gender: '',
  phone: '',
  department: '',
  doctor: '',
  date: '',
  time: '',
  slot: '',
  symptoms: '',
};

export default function BookingForm({ onBookingSuccess }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  /** Generic change handler for all form fields */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear messages when user starts typing again
    if (successMsg) setSuccessMsg('');
    if (error) setError('');
  };

  /** Validate required fields before submission */
  const validate = () => {
    const required = ['name', 'age', 'gender', 'phone', 'department', 'doctor', 'date', 'time', 'slot'];
    for (const field of required) {
      if (!form[field]) {
        setError(`Please fill in the "${field}" field.`);
        return false;
      }
    }
    if (form.age && (isNaN(form.age) || form.age < 0 || form.age > 150)) {
      setError('Please enter a valid age (0 – 150).');
      return false;
    }
    if (form.phone && form.phone.length < 5) {
      setError('Please enter a valid phone number.');
      return false;
    }
    return true;
  };

  /** Submit handler */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const payload = { ...form, age: parseInt(form.age, 10) };
      await createAppointment(payload);

      // Success — show message, reset form, notify parent
      setSuccessMsg(`Appointment booked successfully for ${form.name}!`);
      setForm(INITIAL_FORM);
      if (onBookingSuccess) onBookingSuccess();

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      const detail = err?.response?.data?.detail || 'Booking failed. Please try again.';
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-form-card">
      <h2 className="form-title">📅 Book an Appointment</h2>

      {/* --- Success message toast --- */}
      {successMsg && (
        <div className="success-toast" role="alert">
          <span>✅</span> {successMsg}
        </div>
      )}

      {/* --- Error message --- */}
      {error && (
        <div className="error-toast" role="alert">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Row 1: Patient info */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter patient name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age *</label>
            <input
              id="age"
              name="age"
              type="number"
              min="0"
              max="150"
              placeholder="e.g. 35"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender *</label>
            <select id="gender" name="gender" value={form.gender} onChange={handleChange}>
              <option value="">Select gender</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone *</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 2: Appointment details */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="department">Department *</label>
            <select id="department" name="department" value={form.department} onChange={handleChange}>
              <option value="">Select department</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="doctor">Doctor *</label>
            <select id="doctor" name="doctor" value={form.doctor} onChange={handleChange}>
              <option value="">Select doctor</option>
              {DOCTORS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Time *</label>
            <input
              id="time"
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 3: Slot & symptoms */}
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="slot">Slot *</label>
            <select id="slot" name="slot" value={form.slot} onChange={handleChange}>
              <option value="">Select time slot</option>
              {SLOTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="symptoms">Symptoms</label>
            <textarea
              id="symptoms"
              name="symptoms"
              rows="3"
              placeholder="Describe your symptoms (optional)"
              value={form.symptoms}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="btn-primary btn-submit" disabled={loading}>
            {loading ? 'Booking…' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
}
