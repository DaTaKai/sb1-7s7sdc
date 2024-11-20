import React from 'react';
import { Upload } from 'lucide-react';
import { Theme } from '../types';

interface BookUploaderProps {
  onFileUpload: (content: string) => void;
  theme: Theme;
}

export function BookUploader({ onFileUpload, theme }: BookUploaderProps) {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.type && !file.type.includes('text')) {
        alert('Please upload a valid text file');
        return;
      }

      const reader = new FileReader();

      const content = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            // Normalize Unicode characters
            const normalizedContent = result
              .normalize('NFC') // Normalization to NFC (can try NFD if needed)
              .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters (optional)
            resolve(normalizedContent);
          } else {
            reject(new Error('Failed to read file content'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file, 'UTF-8'); // Explicitly specify UTF-8 encoding
      });

      if (!content.trim()) {
        throw new Error('File is empty');
      }

      onFileUpload(content);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${theme.surface} rounded-lg shadow-lg`}
    >
      <div className="mb-6 text-center">
        <Upload className={`w-12 h-12 mx-auto mb-4 ${theme.accent}`} />
        <h2 className={`text-2xl font-bold ${theme.text}`}>Upload a Book</h2>
        <p className={`mt-2 ${theme.text} opacity-80`}>
          Choose a .txt file to start practicing
        </p>
      </div>

      <label className="relative cursor-pointer">
        <input
          type="file"
          accept=".txt,text/plain"
          onChange={handleFileChange}
          className="hidden"
        />
        <div
          className={`px-6 py-3 text-sm font-medium ${theme.primary} rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
        >
          Select File
        </div>
      </label>
    </div>
  );
}
