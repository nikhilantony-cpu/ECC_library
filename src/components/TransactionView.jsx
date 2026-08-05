import React, { useState } from 'react';

export default function TransactionView({
    books,
    students,
    transactions,
    onIssueBook,
    onReturnBook,
    showToast
}) {
    // Autocomplete state for Book
    const [bookSearch, setBookSearch] = useState('');
    const [selectedBook, setSelectedBook] = useState(null);
    const [showBookSuggestions, setShowBookSuggestions] = useState(false);

    // Autocomplete state for Student
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showStudentSuggestions, setShowStudentSuggestions] = useState(false);

    const [loanPeriod, setLoanPeriod] = useState(14); // default 14 days
    const [filterActiveOnly, setFilterActiveOnly] = useState(true);
    const [transactionSearch, setTransactionSearch] = useState('');

    // Filtering lists for autocomplete
    const availableBooks = books.filter(b => b.status === 'Available');

    const bookSuggestions = bookSearch.trim() === '' ? [] : availableBooks.filter(b =>
        b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
        b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
        (b.isbn && b.isbn.includes(bookSearch))
    ).slice(0, 5);

    const studentSuggestions = studentSearch.trim() === '' ? [] : students.filter(s =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())
    ).slice(0, 5);

    // Handlers for selection
    const handleSelectBook = (book) => {
        setSelectedBook(book);
        setBookSearch(book.title);
        setShowBookSuggestions(false);
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setStudentSearch(`${student.name} (${student.rollNo})`);
        setShowStudentSuggestions(false);
    };

    // Issue Action
    const handleIssueSubmit = (e) => {
        e.preventDefault();
        if (!selectedBook) {
            showToast('Please select a valid book from the suggestions list.', 'warning');
            return;
        }
        if (!selectedStudent) {
            showToast('Please select a valid student from the suggestions list.', 'warning');
            return;
        }

        const todayDate = new Date();
        const dueDateObj = new Date();
        dueDateObj.setDate(todayDate.getDate() + parseInt(loanPeriod));

        const issueDate = todayDate.toISOString().split('T')[0];
        const dueDate = dueDateObj.toISOString().split('T')[0];

        onIssueBook(selectedBook.id, selectedStudent.rollNo, issueDate, dueDate);

        // Reset form states
        setSelectedBook(null);
        setBookSearch('');
        setSelectedStudent(null);
        setStudentSearch('');
        setLoanPeriod(14);
    };

    // Helper resolvers
    const getBookTitle = (id) => books.find(b => b.id === id)?.title || 'Unknown Book';
    const getStudentName = (id) => students.find(s => s.rollNo === id)?.name || 'Unknown Student';
    const getStudentDept = (id) => students.find(s => s.rollNo === id)?.dept || 'N/A';

    // Issue transaction listings
    const todayStr = new Date().toISOString().split('T')[0];

    const filteredTransactions = transactions.filter(t => {
        // Filter active only vs all
        if (filterActiveOnly && t.status !== 'Issued') return false;

        // Search query
        const bTitle = getBookTitle(t.bookId).toLowerCase();
        const sName = getStudentName(t.studentId).toLowerCase();
        const query = transactionSearch.toLowerCase();

        return bTitle.includes(query) || sName.includes(query) || t.studentId.toLowerCase().includes(query);
    });

    return (
        <div className="view-container">
            <div className="layout-grid">
                {/* Left Hand: New Book Issue Form */}
                <div className="card">
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📖</span> Register Book Loan Assignment
                    </h3>

                    <form onSubmit={handleIssueSubmit}>
                        {/* Book Selection Autocomplete */}
                        <div className="input-group autocomplete-container" style={{ zIndex: 30 }}>
                            <label>Select Book Title / Author*</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type book title to search..."
                                value={bookSearch}
                                onChange={(e) => {
                                    setBookSearch(e.target.value);
                                    setSelectedBook(null); // clear current selection
                                    setShowBookSuggestions(true);
                                }}
                                onFocus={() => setShowBookSuggestions(true)}
                                required
                            />
                            {showBookSuggestions && bookSuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {bookSuggestions.map(book => (
                                        <li
                                            key={book.id}
                                            className="suggestion-item"
                                            onClick={() => handleSelectBook(book)}
                                        >
                                            {book.title} <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>by {book.author} ({book.status})</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Student Selection Autocomplete */}
                        <div className="input-group autocomplete-container" style={{ zIndex: 20 }}>
                            <label>Select Student Name / Admission No*</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type name or roll number to search..."
                                value={studentSearch}
                                onChange={(e) => {
                                    setStudentSearch(e.target.value);
                                    setSelectedStudent(null); // clear current selection
                                    setShowStudentSuggestions(true);
                                }}
                                onFocus={() => setShowStudentSuggestions(true)}
                                required
                            />
                            {showStudentSuggestions && studentSuggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {studentSuggestions.map(student => (
                                        <li
                                            key={student.rollNo}
                                            className="suggestion-item"
                                            onClick={() => handleSelectStudent(student)}
                                        >
                                            {student.name} <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({student.rollNo})</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Loan Duration Selector */}
                        <div className="input-group">
                            <label>Lending Period Timeline</label>
                            <select
                                className="form-control"
                                value={loanPeriod}
                                onChange={(e) => setLoanPeriod(e.target.value)}
                            >
                                <option value={7}>7 Days (Short lending span)</option>
                                <option value={14}>14 Days (Standard course span)</option>
                                <option value={30}>30 Days (Extended research span)</option>
                            </select>
                        </div>

                        <div style={{ marginTop: '1.5rem' }}>
                            <button type="submit" className="btn" style={{ width: '100%' }}>
                                Confirm Issue Assignment
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Hand: Active Transactions Register */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="card">
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Active Lending Registry</h3>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className={`btn ${filterActiveOnly ? '' : 'btn-secondary'}`}
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                    onClick={() => setFilterActiveOnly(true)}
                                >
                                    Active Only
                                </button>
                                <button
                                    className={`btn ${!filterActiveOnly ? '' : 'btn-secondary'}`}
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                    onClick={() => setFilterActiveOnly(false)}
                                >
                                    Full Log
                                </button>
                            </div>
                        </div>

                        {/* Search filter for transactions */}
                        <div className="search-box" style={{ marginBottom: '1.25rem' }}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" fill="none" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search active borrowers or books..."
                                value={transactionSearch}
                                onChange={(e) => setTransactionSearch(e.target.value)}
                            />
                        </div>

                        <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {filteredTransactions.map(t => {
                                const isOverdue = t.status === 'Issued' && t.dueDate < todayStr;
                                return (
                                    <div
                                        key={t.id}
                                        className="card"
                                        style={{
                                            padding: '1rem',
                                            background: 'hsl(var(--bg-surface-glow))',
                                            borderLeft: isOverdue ? '4px solid hsl(var(--danger))' : t.status === 'Returned' ? '4px solid hsl(var(--success))' : '1px solid hsl(var(--border-color))'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <div>
                                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{getBookTitle(t.bookId)}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>
                                                    Issued to: <strong>{getStudentName(t.studentId)}</strong> ({getStudentDept(t.studentId)})
                                                </div>
                                            </div>

                                            {t.status === 'Issued' && (
                                                <button
                                                    className="btn"
                                                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', background: 'hsl(var(--success))' }}
                                                    onClick={() => onReturnBook(t.id)}
                                                >
                                                    Return
                                                </button>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                                            <span>Issued: {t.issueDate}</span>

                                            {t.status === 'Issued' ? (
                                                <span style={{ color: isOverdue ? 'hsl(var(--danger))' : 'hsl(var(--warning))', fontWeight: '600' }}>
                                                    {isOverdue ? 'OVERDUE: ' : 'Due: '} {t.dueDate}
                                                </span>
                                            ) : (
                                                <span style={{ color: 'hsl(var(--success))' }}>Returned: {t.returnDate}</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredTransactions.length === 0 && (
                                <div style={{ color: 'hsl(var(--text-muted))', textAlign: 'center', padding: '3rem 0', fontSize: '0.9rem' }}>
                                    No transaction log items found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
