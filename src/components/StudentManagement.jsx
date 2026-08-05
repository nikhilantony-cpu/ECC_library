import React, { useState } from 'react';

export default function StudentManagement({
    students,
    transactions,
    books,
    onAddStudent,
    onUpdateStudent,
    onDeleteStudent,
    showToast
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [selectedStudentHistory, setSelectedStudentHistory] = useState(null);

    // Form states
    const [name, setName] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [dept, setDept] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const openAddModal = () => {
        setEditingStudent(null);
        setName('');
        setRollNo('');
        setDept('');
        setEmail('');
        setPhone('');
        setShowModal(true);
    };

    const openEditModal = (student) => {
        setEditingStudent(student);
        setName(student.name);
        setRollNo(student.rollNo);
        setDept(student.dept);
        setEmail(student.email);
        setPhone(student.phone);
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const studentData = {
            name,
            rollNo,
            dept,
            email,
            phone,
        };

        if (editingStudent) {
            onUpdateStudent(editingStudent.rollNo, studentData); // matches by rollNo primary key
        } else {
            // Check if duplicate rollNo
            const isDuplicate = students.some(s => s.rollNo.trim().toUpperCase() === rollNo.trim().toUpperCase());
            if (isDuplicate) {
                showToast('A student with this Roll/Admission Number is already registered!', 'error');
                return;
            }
            onAddStudent(studentData);
        }
        setShowModal(false);
    };

    const handleDelete = (rollNo) => {
        if (window.confirm('Are you sure you want to delete this student record? This operation cannot be undone.')) {
            onDeleteStudent(rollNo);
            if (selectedStudentHistory && selectedStudentHistory.rollNo === rollNo) {
                setSelectedStudentHistory(null);
            }
        }
    };

    // Searching
    const filteredStudents = students.filter(student => {
        return (
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.phone && student.phone.includes(searchTerm)) ||
            (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });

    const getStudentHistory = (rollNo) => {
        return transactions.filter(t => t.studentId === rollNo);
    };

    const getBookTitle = (id) => books.find(b => b.id === id)?.title || 'Unknown Book';

    return (
        <div className="view-container">
            <div className="action-header">
                <div className="search-box">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" fill="none" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search students by admission NO, name, dept..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button className="btn" style={{ maxWidth: '220px', width: '100%' }} onClick={openAddModal}>
                    <span>👤＋</span> Register Student
                </button>
            </div>

            <div className="layout-grid">
                <div className="card" style={{ padding: '0.5rem 0' }}>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Roll / Adm No</th>
                                    <th>Student Info</th>
                                    <th>Department / Class</th>
                                    <th>Contact Details</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr
                                        key={student.rollNo}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setSelectedStudentHistory(student)}
                                    >
                                        <td>
                                            <strong style={{ color: 'hsl(var(--primary))' }}>{student.rollNo}</strong>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: '600' }}>{student.name}</div>
                                        </td>
                                        <td>
                                            <span>{student.dept}</span>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.8rem' }}>{student.email}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{student.phone}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                                                    onClick={() => openEditModal(student)}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                                                    onClick={() => handleDelete(student.rollNo)}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', color: 'hsl(var(--text-muted))', padding: '3rem' }}>
                                            No students found matching the search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Panel: Student Lend History details */}
                <div>
                    {selectedStudentHistory ? (
                        <div className="card" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{selectedStudentHistory.name}</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>
                                        Roll No: {selectedStudentHistory.rollNo} • {selectedStudentHistory.dept}
                                    </p>
                                </div>
                                <button
                                    className="modal-close"
                                    style={{ padding: '0.2rem' }}
                                    onClick={() => setSelectedStudentHistory(null)}
                                >
                                    ✕
                                </button>
                            </div>

                            <h4 style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', color: 'hsl(var(--text-muted))', marginBottom: '0.75rem' }}>
                                Lending History
                            </h4>

                            <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {getStudentHistory(selectedStudentHistory.rollNo)
                                    .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
                                    .map(t => (
                                        <div
                                            key={t.id}
                                            style={{
                                                padding: '0.75rem',
                                                background: 'hsl(var(--bg-surface-glow))',
                                                borderRadius: 'var(--radius-sm)',
                                                border: '1px solid hsl(var(--border-color))',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{getBookTitle(t.bookId)}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'hsl(var(--text-secondary))', fontSize: '0.75rem' }}>
                                                <span>Issued: {t.issueDate}</span>
                                                {t.status === 'Issued' ? (
                                                    <span style={{ color: 'hsl(var(--warning))', fontWeight: '600' }}>Due: {t.dueDate}</span>
                                                ) : (
                                                    <span style={{ color: 'hsl(var(--success))' }}>Returned: {t.returnDate}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                {getStudentHistory(selectedStudentHistory.rollNo).length === 0 && (
                                    <div style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', padding: '1.5rem 0', fontSize: '0.85rem' }}>
                                        No books have been borrowed by this student.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '180px', borderStyle: 'dashed', opacity: 0.8 }}>
                            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📇</span>
                            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', textAlign: 'center' }}>
                                Tap a student row to inspect their department lending history logs.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingStudent ? 'Edit Student Details' : 'Register New Student'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" fill="none" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Roll / Admission Number*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. UC/ECC/2026/89"
                                    value={rollNo}
                                    onChange={(e) => setRollNo(e.target.value)}
                                    disabled={!!editingStudent}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Full Name*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Abishek Nair"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Class / Department / Batch*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. B.Sc. Computer Science (S5)"
                                    value={dept}
                                    onChange={(e) => setDept(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="e.g. abishek@uccollege.edu.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    placeholder="e.g. +91 9876543210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn">
                                    {editingStudent ? 'Save Changes' : 'Register'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
