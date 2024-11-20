import React, { useEffect, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Theme } from '../types';

interface TypingAreaProps {
  text: string;
  onComplete: () => void;
  theme: Theme;
}

export function TypingArea({ text, onComplete, theme }: TypingAreaProps) {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<number[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Normalize Unicode characters and split by whitespace
    const normalizedText = text.normalize('NFC');
    setWords(
      normalizedText
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(word => word.trim())
    );
    setInput('');
    setCurrentWordIndex(0);
    setErrors([]);
  }, [text]);

  const validateWord = useCallback((inputWord: string, targetWord: string) => {
    const errors = [];
    // Normalize both input and target for comparison
    const normalizedInput = inputWord.normalize('NFC');
    const normalizedTarget = targetWord.normalize('NFC');
    
    // Use spread operator to properly handle surrogate pairs and combining characters
    const inputChars = [...normalizedInput.trim()];
    const targetChars = [...normalizedTarget.trim()];
    
    for (let i = 0; i < inputChars.length; i++) {
      if (inputChars[i] !== targetChars[i]) {
        errors.push(i);
      }
    }
    return errors;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    const currentWord = words[currentWordIndex];
    
    if (!currentWord) return;

    // Normalize input
    const normalizedInput = newInput.normalize('NFC').trim();
    setInput(normalizedInput);
    
    if (e.target.value.endsWith(' ') || e.key === 'Enter') {
      if (normalizedInput === currentWord.normalize('NFC')) {
        setInput('');
        setErrors([]);
        setCurrentWordIndex(prev => {
          const next = prev + 1;
          if (next >= words.length) {
            onComplete();
            return prev;
          }
          return next;
        });
      }
    } else {
      setErrors(validateWord(normalizedInput, currentWord));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const normalizedInput = input.normalize('NFC').trim();
      const currentWord = words[currentWordIndex];
      
      if (normalizedInput === currentWord.normalize('NFC')) {
        setInput('');
        setErrors([]);
        setCurrentWordIndex(prev => {
          const next = prev + 1;
          if (next >= words.length) {
            onComplete();
            return prev;
          }
          return next;
        });
      }
    }
  };

  const calculateAccuracy = useCallback(() => {
    if (!input.length) return '100.0';
    const accuracy = ((input.length - errors.length) / input.length * 100);
    return accuracy.toFixed(1);
  }, [input.length, errors.length]);

  const renderWords = () => {
    return words.map((word, index) => {
      let className = 'inline-block mr-2 ';
      
      if (index < currentWordIndex) {
        className += `${theme.accent} `;
      } else if (index === currentWordIndex) {
        className += `${theme.secondary} `;
      } else {
        className += `${theme.text} `;
      }

      return (
        <span key={index} className={className}>
          {index === currentWordIndex ? (
            <>
              <span className="text-green-500">
                {[...word].slice(0, [...input].length - errors.length).join('')}
              </span>
              <span className="text-red-500">
                {errors.length > 0 
                  ? [...word]
                      .slice([...input].length - errors.length, [...input].length)
                      .join('')
                  : ''}
              </span>
              <span>
                {[...word].slice([...input].length).join('')}
              </span>
            </>
          ) : (
            word
          )}
        </span>
      );
    });
  };

  if (!text) {
    return <div>No text available for typing practice.</div>;
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div 
        className={`p-6 ${theme.surface} rounded-lg shadow-sm min-h-[200px]`}
        onClick={() => inputRef.current?.focus()}
      >
        <p className="text-lg leading-relaxed font-mono">
          {renderWords()}
        </p>
      </div>

      <div className={`p-4 ${theme.surface} rounded-lg shadow-sm`}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 py-2 rounded-md border ${
            errors.length > 0 ? 'border-red-300' : 'border-gray-300'
          } focus:outline-none focus:ring-2 ${
            errors.length > 0 ? 'focus:ring-red-200' : 'focus:ring-blue-200'
          } ${theme.text} bg-white/50`}
          placeholder="Type here..."
          autoFocus
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {errors.length === 0 && input.length > 0 ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : errors.length > 0 ? (
            <XCircle className="w-5 h-5 text-red-500" />
          ) : null}
          <span className={theme.text}>
            Accuracy: <span className="font-semibold">{calculateAccuracy()}%</span>
          </span>
        </div>
        <span className={theme.text}>
          Words: <span className="font-semibold">{currentWordIndex}/{words.length}</span>
        </span>
      </div>
    </div>
  );
}