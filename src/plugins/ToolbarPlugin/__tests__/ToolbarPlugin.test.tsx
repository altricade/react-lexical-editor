import { render, screen, fireEvent } from '@testing-library/react';
import { ToolbarPlugin } from '../index';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

describe('ToolbarPlugin', () => {
  // Test helper to render the ToolbarPlugin within a LexicalComposer context
  const renderToolbar = () => {
    return render(
      <LexicalComposer
        initialConfig={{
          namespace: 'test-editor',
          onError: (error) => console.error(error),
        }}
      >
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary as any}
        />
      </LexicalComposer>
    );
  };

  it('renders without crashing', () => {
    renderToolbar();
    // These buttons should be present in the toolbar
    expect(screen.getByTitle('Bold')).toBeInTheDocument();
    expect(screen.getByTitle('Italic')).toBeInTheDocument();
    expect(screen.getByTitle('Underline')).toBeInTheDocument();
    expect(screen.getByTitle('Strikethrough')).toBeInTheDocument();
  });

  it('renders heading buttons', () => {
    renderToolbar();
    expect(screen.getByTitle('Heading 1')).toBeInTheDocument();
    expect(screen.getByTitle('Heading 2')).toBeInTheDocument();
    expect(screen.getByTitle('Heading 3')).toBeInTheDocument();
  });

  it('renders insert buttons', () => {
    renderToolbar();
    expect(screen.getByTitle('Insert Link')).toBeInTheDocument();
    expect(screen.getByTitle('Insert Image')).toBeInTheDocument();
  });

  it('opens link dialog when Insert Link button is clicked', () => {
    renderToolbar();
    const insertLinkButton = screen.getByTitle('Insert Link');
    
    fireEvent.click(insertLinkButton);
    
    expect(screen.getByText('Insert Link')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument();
  });

  it('opens image dialog when Insert Image button is clicked', () => {
    renderToolbar();
    const insertImageButton = screen.getByTitle('Insert Image');
    
    fireEvent.click(insertImageButton);
    
    expect(screen.getByText('Insert Image')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('https://example.com/image.jpg')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Alt text')).toBeInTheDocument();
  });
});
