import React, { useState, useEffect } from 'react';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import BookManagement from './components/BookManagement';
import StudentManagement from './components/StudentManagement';
import TransactionView from './components/TransactionView';
import DataSync from './components/DataSync';

// --- Default Mock/Seed Data ---
const DEFAULT_BOOKS = [
  { id: 'b1', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', subject: 'Computer Science', location: 'Rack 3, Shelf A', isbn: '978-0262033848', status: 'Available' },
  { id: 'b2', title: 'Clean Code: A Handbook of Agile Software Craftsmanship', author: 'Robert C. Martin', subject: 'Software Engineering', location: 'Rack 1, Shelf B', isbn: '978-0132350884', status: 'Available' },
  { id: 'b3', title: 'Design Patterns: Elements of Reusable Object-Oriented Software', author: 'Erich Gamma', subject: 'Software Engineering', location: 'Rack 1, Shelf C', isbn: '978-0201633610', status: 'Issued' },
  { id: 'b4', title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', subject: 'Web Development', location: 'Rack 2, Shelf D', isbn: '978-0596517748', status: 'Available' },
  { id: 'b5', title: 'Computer Networking: A Top-Down Approach', author: 'James Kurose', subject: 'Networking', location: 'Rack 4, Shelf A', isbn: '978-0133594140', status: 'Issued' },
  { id: 'b6', title: 'Database System Concepts', author: 'Abraham Silberschatz', subject: 'Database Systems', location: 'Rack 3, Shelf B', isbn: '978-0073523309', status: 'Available' },
  { id: 'b7', title: 'Compilers: Principles, Techniques, and Tools', author: 'Alfred V. Aho', subject: 'Compiler Design', location: 'Rack 4, Shelf C', isbn: '978-0321486813', status: 'Available' },
  { id: 'b8', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', subject: 'Artificial Intelligence', location: 'Rack 5, Shelf A', isbn: '978-0136083207', status: 'Available' },
  { id: 'b9', title: 'Operating System Concepts', author: 'Abraham Silberschatz', subject: 'Operating Systems', location: 'Rack 3, Shelf D', isbn: '978-1118063330', status: 'Available' },
  { id: 'b10', title: 'The Pragmatic Programmer', author: 'Andy Hunt', subject: 'Software Engineering', location: 'Rack 1, Shelf E', isbn: '978-0135957059', status: 'Available' }
];

const DEFAULT_STUDENTS = [
  { rollNo: 'UC/ECC/2026/01', name: 'Arjun K S', dept: 'B.Sc. Computer Science (S5)', email: 'arjun.ks@uccollege.edu.in', phone: '9845123456' },
  { rollNo: 'UC/ECC/2026/02', name: 'Nandana Roy', dept: 'B.Sc. Computer Science (S5)', email: 'nandana.r@uccollege.edu.in', phone: '8129456789' },
  { rollNo: 'UC/ECC/2026/03', name: 'Fida Fathima', dept: 'M.Sc. Computer Science (S3)', email: 'fida.f@uccollege.edu.in', phone: '9446123789' },
  { rollNo: 'UC/ECC/2026/04', name: 'Sidarth P', dept: 'B.Sc. Computer Science (S3)', email: 'sidarth.p@uccollege.edu.in', phone: '7025123456' },
  { rollNo: 'UC/ECC/2026/05', name: 'Priya Mohan', dept: 'M.Sc. Computer Science (S1)', email: 'priya.m@uccollege.edu.in', phone: '9048123456' }
];

const DEFAULT_TRANSACTIONS = [
  // A returned transaction
  { id: 't1', bookId: 'b1', studentId: 'UC/ECC/2026/01', issueDate: '2026-07-10', dueDate: '2026-07-24', returnDate: '2026-07-20', status: 'Returned' },
  // An active transaction
  { id: 't2', bookId: 'b3', studentId: 'UC/ECC/2026/02', issueDate: '2026-07-28', dueDate: '2026-08-11', returnDate: null, status: 'Issued' },
  // An active transaction that is overdue (assumes current date is Aug 5, 2026)
  { id: 't3', bookId: 'b5', studentId: 'UC/ECC/2026/04', issueDate: '2026-07-15', dueDate: '2026-07-29', returnDate: null, status: 'Issued' }
];

export default function App() {
  // Authentication status
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('ecc_library_user') || '';
  });

  // Toasts state
  const [toasts, setToasts] = useState([]);

  // Toast trigger helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Database lists
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('ecc_library_books');
    return saved ? JSON.parse(saved) : DEFAULT_BOOKS;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('ecc_library_students');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('ecc_library_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  // Current active viewport tab: 'dashboard', 'books', 'students', 'issue-return', 'sync'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sidebars sync with localStorage
  useEffect(() => {
    localStorage.setItem('ecc_library_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('ecc_library_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ecc_library_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Auth operations
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('ecc_library_user', user);
  };

  const handleLogout = () => {
    setCurrentUser('');
    localStorage.removeItem('ecc_library_user');
  };

  // --- CRUD Operation Triggers ---

  // Book Ops
  const handleAddBook = (bookInfo) => {
    const newBook = {
      ...bookInfo,
      id: 'b_' + Date.now(),
      status: 'Available'
    };
    setBooks(prev => [newBook, ...prev]);
    showToast(`Book "${bookInfo.title}" registered successfully!`, "success");
  };

  const handleUpdateBook = (id, updatedInfo) => {
    setBooks(prev => prev.map(book => {
      if (book.id === id) {
        return { ...book, ...updatedInfo };
      }
      return book;
    }));
    showToast("Book record updated successfully.", "success");
  };

  const handleDeleteBook = (id) => {
    // Check if currently issued. If so, return error.
    const isIssued = transactions.some(t => t.bookId === id && t.status === 'Issued');
    if (isIssued) {
      showToast("Cannot delete this book asset! It is currently issued to a student. Return it first.", "error");
      return;
    }
    setBooks(prev => prev.filter(book => book.id !== id));
    showToast("Book record removed successfully.", "success");
  };


  // Student Ops
  const handleAddStudent = (studentInfo) => {
    const cleanStudent = {
      ...studentInfo,
      rollNo: studentInfo.rollNo.toUpperCase().trim()
    };
    setStudents(prev => [...prev, cleanStudent]);
    showToast(`Student ${studentInfo.name} registered successfully.`, "success");
  };

  const handleUpdateStudent = (rollNo, updatedInfo) => {
    setStudents(prev => prev.map(student => {
      if (student.rollNo === rollNo) {
        return { ...student, ...updatedInfo };
      }
      return student;
    }));
    showToast("Student profile updated successfully.", "success");
  };

  const handleDeleteStudent = (rollNo) => {
    // Check active loans
    const hasActiveLoans = transactions.some(t => t.studentId === rollNo && t.status === 'Issued');
    if (hasActiveLoans) {
      showToast("Cannot delete student record! This student currently holds issued books. Complete returns first.", "error");
      return;
    }
    setStudents(prev => prev.filter(s => s.rollNo !== rollNo));
    showToast("Student record removed successfully.", "success");
  };


  // Transactions Ops
  const handleIssueBook = (bookId, studentId, issueDate, dueDate) => {
    // 1. Create transaction log
    const newTransaction = {
      id: 't_' + Date.now(),
      bookId,
      studentId,
      issueDate,
      dueDate,
      returnDate: null,
      status: 'Issued'
    };

    // 2. Set book status to Issued
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: 'Issued' } : b));

    // 3. Append transaction
    setTransactions(prev => [newTransaction, ...prev]);

    const bTitle = books.find(b => b.id === bookId)?.title || "Book";
    showToast(`Issued "${bTitle}" successfully.`, "success");
  };

  const handleReturnBook = (transactionId) => {
    // Find transaction
    const targetTx = transactions.find(t => t.id === transactionId);
    if (!targetTx) return;

    const returnDateStr = new Date().toISOString().split('T')[0];

    // 1. Set transaction returned
    setTransactions(prev => prev.map(t =>
      t.id === transactionId
        ? { ...t, status: 'Returned', returnDate: returnDateStr }
        : t
    ));

    // 2. Reset book status to Available
    setBooks(prev => prev.map(b =>
      b.id === targetTx.bookId
        ? { ...b, status: 'Available' }
        : b
    ));

    const bTitle = books.find(b => b.id === targetTx.bookId)?.title || "Book";
    showToast(`Returned "${bTitle}" successfully.`, "success");
  };

  // Restore Dump Operation
  const handleRestoreData = (newBooks, newStudents, newTransactions) => {
    setBooks(newBooks);
    setStudents(newStudents);
    setTransactions(newTransactions);
    showToast("Library database state restored successfully.", "success");
  };

  // Render Authentication overlay if not logged in
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  // Header Title Resolver
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Librarian Overview Council';
      case 'books': return 'Library Assets Directory';
      case 'students': return 'Department Student Register';
      case 'issue-return': return 'Book Loans & Returns desk';
      case 'sync': return 'Resilience & Database Sync';
      default: return 'ECC Library Manager';
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar for Desktop layouts */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-logo">UC</div>
          <div className="brand-info">
            <h1>ECC Library Manager</h1>
            <p>Union Christian College</p>
          </div>
        </div>

        <nav>
          <ul className="nav-links">
            <li>
              <button
                className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <span>📊</span> Dashboard
              </button>
            </li>
            <li>
              <button
                className={`nav-btn ${activeTab === 'books' ? 'active' : ''}`}
                onClick={() => setActiveTab('books')}
              >
                <span>📚</span> Manage Books
              </button>
            </li>
            <li>
              <button
                className={`nav-btn ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
              >
                <span>👥</span> Register Students
              </button>
            </li>
            <li>
              <button
                className={`nav-btn ${activeTab === 'issue-return' ? 'active' : ''}`}
                onClick={() => setActiveTab('issue-return')}
              >
                <span>🔄</span> Issue & Return
              </button>
            </li>
            <li>
              <button
                className={`nav-btn ${activeTab === 'sync' ? 'active' : ''}`}
                onClick={() => setActiveTab('sync')}
              >
                <span>💾</span> Backup & Sync
              </button>
            </li>
          </ul>
        </nav>

        <footer className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">L</div>
            <div className="user-info">
              <h4>Librarian Console</h4>
              <p>Active Session</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Exit Session
          </button>
        </footer>
      </aside>

      {/* Main viewport Container */}
      <main className="main-content">
        <header className="top-bar">
          <div className="page-title">
            <h2>{getHeaderTitle()}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="header-brand-label" style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', fontWeight: '500' }}>
              ECC UC College
            </div>
            <button
              className="btn btn-secondary header-logout-btn"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </header>

        {/* View Switcher based on Nav State */}
        {activeTab === 'dashboard' && (
          <DashboardView
            books={books}
            students={students}
            transactions={transactions}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'books' && (
          <BookManagement
            books={books}
            onAddBook={handleAddBook}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
            showToast={showToast}
          />
        )}
        {activeTab === 'students' && (
          <StudentManagement
            students={students}
            transactions={transactions}
            books={books}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            showToast={showToast}
          />
        )}
        {activeTab === 'issue-return' && (
          <TransactionView
            books={books}
            students={students}
            transactions={transactions}
            onIssueBook={handleIssueBook}
            onReturnBook={handleReturnBook}
            showToast={showToast}
          />
        )}
        {activeTab === 'sync' && (
          <DataSync
            books={books}
            students={students}
            transactions={transactions}
            onRestoreData={handleRestoreData}
            showToast={showToast}
          />
        )}

        {/* Sticky menu navigation for mobile layouts */}
        <nav className="mobile-nav">
          <button
            className={`mobile-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span>📊</span> Dashboard
          </button>
          <button
            className={`mobile-nav-btn ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <span>📚</span> Books
          </button>
          <button
            className={`mobile-nav-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <span>👥</span> Students
          </button>
          <button
            className={`mobile-nav-btn ${activeTab === 'issue-return' ? 'active' : ''}`}
            onClick={() => setActiveTab('issue-return')}
          >
            <span>🔄</span> Transactions
          </button>
          <button
            className={`mobile-nav-btn ${activeTab === 'sync' ? 'active' : ''}`}
            onClick={() => setActiveTab('sync')}
          >
            <span>💾</span> Sync
          </button>
        </nav>
      </main>

      {/* Global Toast Notification System Layout */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>
              {t.type === 'success' ? '✅' : t.type === 'error' || t.type === 'danger' ? '❌' : t.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <div>{t.message}</div>
            <button
              className="toast-close"
              onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
