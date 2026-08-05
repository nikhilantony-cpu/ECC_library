import React, { useState } from 'react';

export default function BookManagement({
    books,
    onAddBook,
    onUpdateBook,
    onDeleteBook
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);

    // Form states
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [subject, setSubject] = useState('');
    const [location, setLocation] = useState('');
    const [isbn, setIsbn] = useState('');

    const openAddModal = () => {
        setEditingBook(null);
        setTitle('');
        setAuthor('');
        setSubject('');
        setLocation('');
        setIsbn('');
        setShowModal(true);
    };

    const openEditModal = (book) => {
        setEditingBook(book);
        setTitle(book.title);
        setAuthor(book.author);
        setSubject(book.subject || '');
        setLocation(book.location || '');
        setIsbn(book.isbn || '');
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const bookData = {
            title,
            author,
            subject,
            location,
            isbn,
        };

        if (editingBook) {
            onUpdateBook(editingBook.id, bookData);
        } else {
            onAddBook(bookData);
        }
        setShowModal(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this book record?')) {
            onDeleteBook(id);
        }
    };

    // Searching and Filtering
    const filteredBooks = books.filter(book => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (book.isbn && book.isbn.includes(searchTerm)) ||
            (book.subject && book.subject.toLowerCase().includes(searchTerm.toLowerCase()));

        if (statusFilter === 'All') return matchesSearch;
        return matchesSearch && book.status === statusFilter;
    });

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
                        placeholder="Search book title, author, catalog..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="action-filters" style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '380px' }}>
                    <select
                        className="form-control"
                        style={{ width: '45%' }}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Books</option>
                        <option value="Available">Available</option>
                        <option value="Issued">Issued</option>
                    </select>

                    <button className="btn" style={{ width: '55%', whiteSpace: 'nowrap' }} onClick={openAddModal}>
                        <span>＋</span> Add Book
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '0.5rem 0' }}>
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Title & Author</th>
                                <th>Subject</th>
                                <th>Location Details</th>
                                <th>ISBN Code</th>
                                <th>Availability</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((book) => (
                                <tr key={book.id}>
                                    <td>
                                        <div style={{ fontWeight: '600', color: 'hsl(var(--text-primary))' }}>{book.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>by {book.author}</div>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.85rem' }}>{book.subject || 'General'}</span>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>
                                            {book.location || 'Not Specified'}
                                        </span>
                                    </td>
                                    <td>
                                        <code style={{ fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                                            {book.isbn || 'N/A'}
                                        </code>
                                    </td>
                                    <td>
                                        <span className={`badge ${book.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>
                                            {book.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                                                onClick={() => openEditModal(book)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                                                onClick={() => handleDelete(book.id)}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredBooks.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', color: 'hsl(var(--text-muted))', padding: '3rem' }}>
                                        No books matched your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{editingBook ? 'Edit Book Record' : 'Register New Book Asset'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" fill="none" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Book Title*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Introduction to Algorithms"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Author / Writer*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Thomas H. Cormen"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Subject / Branch</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Computer Science / Math"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label>Location (Shelf / Rack No)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Shelf A, Rack 3"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label>ISBN Number / Barcode</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. 978-0262033848"
                                    value={isbn}
                                    onChange={(e) => setIsbn(e.target.value)}
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn">
                                    {editingBook ? 'Save Changes' : 'Register Asset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
