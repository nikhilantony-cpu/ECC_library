import React, { useRef } from 'react';

export default function DataSync({
    books,
    students,
    transactions,
    onRestoreData,
    showToast
}) {
    const fileInputRef = useRef(null);

    // Export JSON backup file
    const handleExportBackup = () => {
        const backupData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            books,
            students,
            transactions
        };

        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);

        const dateStr = new Date().toISOString().split('T')[0];
        downloadAnchor.setAttribute('download', `ecc_library_backup_${dateStr}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    // Import JSON restore file
    const handleImportBackup = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!window.confirm('WARNING: Restoring data will overwrite all current library assets, registered students, and lending transactions. Are you sure you want to proceed?')) {
            // Clear file selection
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsedData = JSON.parse(event.target.result);
                if (parsedData.books && parsedData.students && parsedData.transactions) {
                    onRestoreData(parsedData.books, parsedData.students, parsedData.transactions);
                } else {
                    showToast('Invalid backup schema. The JSON file must contain books, students, and transaction lists.', 'error');
                }
            } catch (err) {
                showToast('Failed to parse backup file. Please ensure it is a valid JSON file.', 'error');
            }
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <div className="view-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>💾</span> Database Backup Registry
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem' }}>
                    Download a complete dump of the library directory to local storage. You can run backups periodically to prevent losing library records.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid hsl(var(--border-color))', fontSize: '0.85rem' }}>
                        <span>Total Books Count:</span>
                        <strong>{books.length} records</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid hsl(var(--border-color))', fontSize: '0.85rem' }}>
                        <span>Registered Students:</span>
                        <strong>{students.length} records</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid hsl(var(--border-color))', fontSize: '0.85rem' }}>
                        <span>Total Loans Logged:</span>
                        <strong>{transactions.length} entries</strong>
                    </div>
                </div>

                <button
                    className="btn"
                    style={{ width: '100%', marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}
                    onClick={handleExportBackup}
                >
                    📥 Download JSON Backup File
                </button>
            </div>

            <div className="card" style={{ borderLeft: '4px solid hsl(var(--warning))' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'hsl(var(--warning))', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>⚠️</span> Import & Restore Database
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem' }}>
                    Restore files from a valid ECC Library JSON backup dump. This action will completely replace and reset all records currently stored in the system.
                </p>

                <div className="input-group">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="form-control"
                        accept=".json"
                        onChange={handleImportBackup}
                        style={{ padding: '0.5rem' }}
                    />
                </div>
            </div>
        </div>
    );
}
