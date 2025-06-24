import { render, screen } from '@testing-library/react';
import LexicalEditor from '../LexicalEditor';

describe('LexicalEditor', () => {
  it('renders editor with default placeholder', () => {
    render(<LexicalEditor />);
    
    // Check that the editor container is in the document
    const editorElement = screen.getByTestId('lexical-editor');
    expect(editorElement).toBeInTheDocument();
    
    // Check that the default placeholder is rendered
    const placeholderElement = screen.getByText('Enter some text...');
    expect(placeholderElement).toBeInTheDocument();
  });
  
  it('renders editor with custom placeholder', () => {
    const customPlaceholder = 'Type something amazing...';
    render(<LexicalEditor placeholder={customPlaceholder} />);
    
    // Check that the custom placeholder is rendered
    const placeholderElement = screen.getByText(customPlaceholder);
    expect(placeholderElement).toBeInTheDocument();
  });
  
  it('applies custom class names', () => {
    const customClassName = 'custom-editor-container';
    const customContentClassName = 'custom-editor-content';
    
    render(
      <LexicalEditor 
        className={customClassName} 
        contentEditableClassName={customContentClassName} 
      />
    );
    
    // Check for the custom container class
    const container = document.querySelector('.react-lexical-editor-container');
    expect(container).toHaveClass(customClassName);
    
    // Check for the custom content editable class
    const editorInput = document.querySelector('.editor-input');
    expect(editorInput).toHaveClass(customContentClassName);
  });
});
