import React from 'react';

export default function DashboardView({
    books,
    students,
    transactions,
    onNavigate
}) {
    // Compute metrics
    const totalBooks = books.length;
    const activeLends = transactions.filter(t => t.status === 'Issued');
    const totalIssued = activeLends.length;
    const totalStudents = students.length;

    // Calculate Overdue
    const today = new Date().toISOString().split('T')[0];
    const overdueTransactions = activeLends.filter(t => t.dueDate < today);
    const totalOverdue = overdueTransactions.length;

    // Available books
    const totalAvailable = totalBooks - totalIssued;

    // Utilization rate percentage
    const utilizationRate = totalBooks > 0 ? Math.round((totalIssued / totalBooks) * 100) : 0;

    // Recents (last 5 transactions)
    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
        .slice(0, 5);

    const getBookTitle = (id) => books.find(b => b.id === id)?.title || 'Unknown Book';
    const getStudentName = (id) => students.find(s => s.rollNo === id)?.name || 'Unknown Student';

    return (
        <div className="view-container">
            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon primary">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" fill="none" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>{totalBooks}</h3>
                        <p>Total Books</p>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon success">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" fill="none" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>{totalIssued}</h3>
                        <p>Books Issued</p>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon danger">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" fill="none" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>{totalOverdue}</h3>
                        <p>Overdue Lends</p>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon warning">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" fill="none" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div className="stat-info">
                        <h3>{totalStudents}</h3>
                        <p>Active Students</p>
                    </div>
                </div>
            </div>

            <div className="layout-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Overdue Alert Table */}
                    {overdueTransactions.length > 0 ? (
                        <div className="card" style={{ borderLeft: '4px solid hsl(var(--danger))' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <span style={{ color: 'hsl(var(--danger))', fontSize: '1.25rem' }}>🚨</span>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Critical Overdue Alert List</h3>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Book Title</th>
                                            <th>Issued To</th>
                                            <th>Due Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {overdueTransactions.map(ot => (
                                            <tr key={ot.id}>
                                                <td style={{ fontWeight: '500' }}>{getBookTitle(ot.bookId)}</td>
                                                <td>{getStudentName(ot.studentId)}</td>
                                                <td style={{ color: 'hsl(var(--danger))', fontWeight: '500' }}>{ot.dueDate}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                                                        onClick={() => onNavigate('issue-return')}
                                                    >
                                                        Go to Return
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ fontSize: '1.5rem', color: 'hsl(var(--success))' }}>✓</span>
                            <div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: '600' }}>All clear! No overdue books today.</h3>
                                <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>The librarians are keeping everything on time.</p>
                            </div>
                        </div>
                    )}

                    {/* Recent Operations */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Recent Operations History</h3>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Book</th>
                                        <th>Student</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.map(t => (
                                        <tr key={t.id}>
                                            <td>
                                                <span className={`badge ${t.status === 'Issued' ? 'badge-warning' : 'badge-success'}`}>
                                                    {t.status === 'Issued' ? 'Loan' : 'Return'}
                                                </span>
                                            </td>
                                            <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {getBookTitle(t.bookId)}
                                            </td>
                                            <td>{getStudentName(t.studentId)}</td>
                                            <td>{t.status === 'Issued' ? t.issueDate : t.returnDate}</td>
                                            <td>
                                                <span className={`badge ${t.status === 'Issued' ? 'badge-warning' : 'badge-success'}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentTransactions.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ textAlign: 'center', color: 'hsl(var(--text-muted))', padding: '2rem' }}>
                                                No transactions recorded yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right side - Graph / Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Library Utilization Chart */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '705', alignSelf: 'flex-start', marginBottom: '0.5rem' }}>Lending Ratio</h3>
                        <div className="chart-display">
                            {/* Custom Pure SVG Radial Donut Chart */}
                            <svg width="180" height="180" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                                {/* Background Ring */}
                                <circle
                                    cx="18"
                                    cy="18"
                                    r="15.915"
                                    fill="transparent"
                                    stroke="hsl(var(--bg-surface-glow))"
                                    strokeWidth="3.2"
                                />
                                {/* Foreground segments */}
                                {totalBooks > 0 && (
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.915"
                                        fill="transparent"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth="3.2"
                                        strokeDasharray={`${utilizationRate} ${100 - utilizationRate}`}
                                        strokeDashoffset="0"
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dasharray 0.5s ease-in-out' }}
                                    />
                                )}
                            </svg>
                            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <span style={{ fontSize: '1.75rem', fontWeight: '800' }}>{utilizationRate}%</span>
                                <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issued</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(var(--primary))' }} />
                                <span>Issued ({totalIssued})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(var(--bg-surface-glow))' }} />
                                <span>Available ({totalAvailable})</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Shortcuts */}
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Librarian Shortcuts</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                                className="btn"
                                style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
                                onClick={() => onNavigate('issue-return')}
                            >
                                <span>➕</span> Issue a Book
                            </button>

                            <button
                                className="btn btn-secondary"
                                style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
                                onClick={() => onNavigate('books')}
                            >
                                <span>📚</span> Add New Book Asset
                            </button>

                            <button
                                className="btn btn-secondary"
                                style={{ justifyContent: 'flex-start', padding: '0.85rem 1rem' }}
                                onClick={() => onNavigate('students')}
                            >
                                <span>👤</span> Register a Student
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
