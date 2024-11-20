export interface BookState {
  content: string;
  currentChunk: number;
  chunks: string[];
}

export interface TypingState {
  input: string;
  errors: number[];
  isComplete: boolean;
}

export type Theme = {
  name: string;
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
};

export type ThemeKey = 'default' | 'dark' | 'sepia' | 'forest' | 'ocean';