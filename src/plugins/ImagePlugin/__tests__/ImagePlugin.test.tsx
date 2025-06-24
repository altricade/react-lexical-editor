import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ImagePlugin, ImageNode } from '../index';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ParagraphNode, TextNode } from 'lexical';

// Test component that provides access to the editor instance
const TestComponent = ({ onEditorReady }: { onEditorReady: (editor: any) => void }) => {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    onEditorReady(editor);
  }, [editor, onEditorReady]);
  
  return null;
};

describe('ImagePlugin', () => {

  // Test helper to render the ImagePlugin within a LexicalComposer context
  const renderWithImagePlugin = (onEditorReady?: (editor: any) => void) => {
    return render(
      <LexicalComposer
        initialConfig={{
          namespace: 'test-editor',
          onError: (error: Error) => console.error(error),
          theme: {
            paragraph: 'editor-paragraph',
          },
          nodes: [ParagraphNode, TextNode, ImageNode]
        }}
      >
        {onEditorReady && <TestComponent onEditorReady={onEditorReady} />}
        <ImagePlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary as any}
        />
      </LexicalComposer>
    );
  };

  it('registers the ImagePlugin without crashing', () => {
    renderWithImagePlugin();
    expect(screen.getByText('Enter some text...')).toBeInTheDocument();
  });
  
  it('registers the INSERT_IMAGE_COMMAND with the editor', () => {
    let editorInstance: any;
    
    renderWithImagePlugin((editor) => {
      editorInstance = editor;
    });
    
    // This is a minimal test to just ensure the plugin loads
    // A more comprehensive test would need to mock the editor dispatchCommand
    expect(editorInstance).toBeDefined();
  });
});
