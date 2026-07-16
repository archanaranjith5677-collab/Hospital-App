/**
 * App.jsx — Root component for the Hospital Appointment Booking app.
 *
 * State management:
 *   - appointments       → list of all appointments (fetched from API)
 *   - tableLoading       → loading indicator for the table
 *   - editingAppointment → currently selected appointment for the edit modal (null = hidden)
 *
 * Data flow:
 *   BookingForm  ──(onBookingSuccess)──> refreshAppointments()
 *   AppointmentsTable ──(onEdit)────────> set editingAppointment → opens EditModal
 *   AppointmentsTable ──(onDelete)──────> deleteAppointment(id) → refreshAppointments()
 *   EditModal    ──(onSave)─────────────> refreshAppointments() + close modal
 */

import { useState, useEffect, useCallback } from 'react';
import BookingForm from './components/BookingForm';
import AppointmentsTable from './components/AppointmentsTable';
import EditModal from './components/EditModal';
import { fetchAppointments, deleteAppointment } from './api/api';
import './App.css';

export default function App() {
  const [appointments, setAppointments] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  /**
   * Fetch all appointments from the backend.
   * Wrapped in useCallback so it can be safely passed as a dependency.
   */
  const loadAppointments = useCallback(async () => {
    setTableLoading(true);
    try {
      const { data } = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setTableLoading(false);
    }
  }, []);

  /** Load appointments on mount */
  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  /**
   * Called by BookingForm after a successful booking.
   * Refreshes the table to include the new appointment.
   */
  const handleBookingSuccess = () => {
    loadAppointments();
  };

  /**
   * Called by AppointmentsTable when the "edit" button is clicked.
   * Opens the EditModal with the selected appointment.
   */
  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
  };

  /**
   * Called by AppointmentsTable when the "delete" button is confirmed.
   */
  const handleDelete = async (id) => {
    try {
      await deleteAppointment(id);
      // Remove the deleted item from local state for instant UI feedback
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete appointment:', err);
    }
  };

  /**
   * Called by EditModal after a successful save.
   */
  const handleSave = () => {
    loadAppointments();
  };

  /** Close the edit modal */
  const handleCloseModal = () => {
    setEditingAppointment(null);
  };

  return (
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <h1 className="app-logo">🏥 Hospital Appointment Booking</h1>
          <p className="app-subtitle">Book, view, edit, and manage patient appointments</p>
        </div>
      </header>

      {/* Main content */}
      <main className="container app-main">
        {/* Section 1: Booking Form */}
        <BookingForm onBookingSuccess={handleBookingSuccess} />

        {/* Section 2: Appointments Table */}
        <AppointmentsTable
          appointments={appointments}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={tableLoading}
        />
      </main>

      {/* Section 3: Edit Modal (conditionally rendered) */}
      <EditModal
        appointment={editingAppointment}
        onClose={handleCloseModal}
        onSave={handleSave}
      />

      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <p>© 2026 Hospital Appointment Booking System · Built with React + FastAPI + PostgreSQL</p>
        </div>
      </footer>
    </div>
  );
}
