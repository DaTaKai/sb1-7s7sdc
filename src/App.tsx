import React, { useState, useCallback } from 'react';
import { BookUploader } from './components/BookUploader';
import { TypingArea } from './components/TypingArea';
import { ProgressBar } from './components/ProgressBar';
import { ThemeSelector } from './components/ThemeSelector';
import { BookState } from './types';
import { useTheme } from './hooks/useTheme';
import { Book } from 'lucide-react';

const CHUNK_SIZE = 300;

function App() {
  const [bookState, setBookState] = useState<BookState | null>(null);
  const { theme, currentTheme, toggleTheme, themes } = useTheme();

  const handleFileUpload = useCallback((content: string) => {
    try {
      if (!content) {
        throw new Error('No content provided');
      }

      const chunks = content
        .split(/(\s+)/)
        .reduce((acc: string[], word: string) => {
          const lastChunk = acc[acc.length - 1] || '';
          if (!lastChunk || lastChunk.length + word.length > CHUNK_SIZE) {
            acc.push(word);
          } else {
            acc[acc.length - 1] = lastChunk + word;
          }
          return acc;
        }, [])
        .filter((chunk) => chunk.trim().length > 0);

      if (chunks.length === 0) {
        throw new Error('No valid content found in file');
      }

      setBookState({
        content,
        chunks,
        currentChunk: 0,
      });
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process file. Please try again with a valid text file.');
    }
  }, []);

  const handleChunkComplete = useCallback(() => {
    if (!bookState) return;

    if (bookState.currentChunk < bookState.chunks.length - 1) {
      setBookState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentChunk: prev.currentChunk + 1,
        };
      });
    }
  }, [bookState]);

  return (
    <div className={`min-h-screen ${theme.background}`}>
      <ThemeSelector
        currentTheme={currentTheme}
        onThemeChange={toggleTheme}
        themes={themes}
      />

      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className={`w-10 h-10 ${theme.accent}`} />
            <h1 className={`text-4xl font-bold ${theme.text}`}>TypeReader</h1>
          </div>
          <p className={`${theme.text} opacity-80`}>
            Improve your typing skills while reading your favorite books
          </p>
        </header>

        <main className="flex flex-col items-center justify-center">
          {!bookState ? (
            <BookUploader onFileUpload={handleFileUpload} theme={theme} />
          ) : (
            <div className="w-full max-w-4xl">
              <ProgressBar
                current={bookState.currentChunk}
                total={bookState.chunks.length - 1}
                theme={theme}
              />
              <div className="mb-6 text-center">
                <p className={`text-sm ${theme.text} opacity-80`}>
                  Chunk {bookState.currentChunk + 1} of{' '}
                  {bookState.chunks.length}
                </p>
              </div>

              <TypingArea
                text={bookState.chunks[bookState.currentChunk]}
                onComplete={handleChunkComplete}
                theme={theme}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
