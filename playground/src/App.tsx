import { useState } from 'react';
import { LexicalEditor } from '../../src';
import type { EditorState } from 'lexical';
import './App.css';

function App() {
  const [editorState, setEditorState] = useState<string | null>(null);
  
  return (
    <div className="app-container">
      <header>
        <h1>React Lexical Editor Demo</h1>
        <p>A powerful rich text editor for React applications</p>
      </header>
      
      <main>
        <div className="editor-container">
          <div className="editor-header">
            <h2>Editor</h2>
            <div className="editor-controls">
              {/* Will add toolbar controls in future versions */}
            </div>
          </div>
          
          <div className="editor-wrapper">
            <LexicalEditor 
              placeholder="Start typing something amazing..."
              onChange={(state: EditorState) => {
                setEditorState(JSON.stringify(state.toJSON()));
              }}
            />
          </div>
        </div>
        
        <div className="editor-output">
          <h2>Editor State Output</h2>
          <div className="state-output">
            <pre>{editorState ? JSON.stringify(JSON.parse(editorState), null, 2) : 'Type in the editor to see the state here...'}</pre>
          </div>
        </div>
      </main>
      
      <footer>
        <p>React Lexical Editor - Built with <a href="https://lexical.dev" target="_blank" rel="noopener noreferrer">Lexical</a></p>
      </footer>
    </div>
  );
}

export default App;
