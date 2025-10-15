import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { colors } from '../../utils/constants';
import { Modal } from '../molecules/Modal';
import { Button } from '../atoms/Button';
import { AlertBanner } from '../molecules/AlertBanner';

export const CSVImportModal = ({ isOpen, onClose, onImport }) => {
  const [csvContent, setCsvContent] = useState('');
  const [parseResult, setParseResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseError, setParseError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setParseError('File too large. Maximum 5MB allowed.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvContent(event.target.result);
        setParseError(null);
      };
      reader.onerror = () => {
        setParseError('Failed to read file');
      };
      reader.readAsText(file);
    }
  };

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    
    return result;
  };

  const parseCSV = () => {
    setIsProcessing(true);
    setParseError(null);
    
    try {
      const lines = csvContent.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        throw new Error('CSV file is empty');
      }

      const headerLine = lines[0];
      const headers = parseCSVLine(headerLine);
      
      const requiredColumns = ['user', 'name', 'staff', 'doctor'];
      const hasUserColumn = headers.some(h => 
        requiredColumns.some(col => h.toLowerCase().includes(col))
      );
      
      if (!hasUserColumn) {
        throw new Error('CSV must have a user/name/staff column');
      }

      const data = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((header, idx) => {
          row[header] = values[idx] || '';
        });
        data.push(row);
      }

      setParseResult({
        headers,
        rows: data,
        count: data.length,
      });
    } catch (error) {
      setParseError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (parseResult) {
      onImport(parseResult.rows);
      onClose();
      setCsvContent('');
      setParseResult(null);
      setParseError(null);
    }
  };

  const handleClose = () => {
    setCsvContent('');
    setParseResult(null);
    setParseError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Roster from CSV" size="large">
      <div className="space-y-6">
        {parseError && (
          <AlertBanner type="error" message={parseError} onDismiss={() => setParseError(null)} />
        )}

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.grey700 }}>
            Upload CSV File
          </label>
          <div 
            className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors"
            style={{ borderColor: colors.grey300 }}
          >
            <Upload size={32} className="mx-auto mb-2" style={{ color: colors.grey400 }} />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <span className="font-medium" style={{ color: colors.primary }}>Choose a file</span> or drag and drop
              <p className="text-sm mt-1" style={{ color: colors.grey500 }}>CSV files only (max 5MB)</p>
            </label>
          </div>
        </div>

        {csvContent && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.grey700 }}>
                CSV Preview
              </label>
              <textarea
                value={csvContent.split('\n').slice(0, 10).join('\n')}
                readOnly
                rows={6}
                className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                style={{ color: colors.grey700, borderColor: colors.grey300, backgroundColor: colors.grey50 }}
              />
              <p className="text-xs mt-1" style={{ color: colors.grey500 }}>Showing first 10 lines</p>
            </div>

            <Button variant="primary" onClick={parseCSV} disabled={isProcessing} loading={isProcessing}>
              Parse CSV
            </Button>
          </>
        )}

        {parseResult && (
          <div>
            <AlertBanner
              type="success"
              message={`Successfully parsed ${parseResult.count} rows with columns: ${parseResult.headers.join(', ')}`}
            />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border text-sm" style={{ borderColor: colors.grey200 }}>
                <thead style={{ backgroundColor: colors.grey50 }}>
                  <tr>
                    {parseResult.headers.map(header => (
                      <th 
                        key={header} 
                        className="px-3 py-2 text-left border-b font-semibold"
                        style={{ borderColor: colors.grey200 }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parseResult.rows.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="border-b" style={{ borderColor: colors.grey200 }}>
                      {parseResult.headers.map(header => (
                        <td key={header} className="px-3 py-2">
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs mt-2" style={{ color: colors.grey500 }}>Showing first 5 rows</p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: colors.grey200 }}>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" onClick={handleImport} disabled={!parseResult}>
            Import {parseResult?.count || 0} Shifts
          </Button>
        </div>
      </div>
    </Modal>
  );
};
