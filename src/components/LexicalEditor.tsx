import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor as LexicalEditorType, ParagraphNode, TextNode } from 'lexical';
import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import { FC, ReactNode } from 'react';
import defaultTheme from '../themes/defaultTheme';
import { ToolbarPlugin } from '../plugins/ToolbarPlugin';
import { ImagePlugin, ImageNode } from '../plugins/ImagePlugin';
import { LinkPlugin as CustomLinkPlugin } from '../plugins/LinkPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { LinkNode } from '@lexical/link';
import { HeadingNode } from '@lexical/rich-text';

export interface LexicalEditorProps {
  /**
   * Initial editor state as JSON string
   */
  initialState?: string;

  /**
   * Editor placeholder text
   */
  placeholder?: string;

  /**
   * Editor theme class overrides
   */
  theme?: Record<string, string | number | boolean | null | undefined>;

  /**
   * Callback when editor content changes
   */
  onChange?: (editorState: EditorState, editor: LexicalEditorType) => void;

  /**
   * Custom editor config
   */
  editorConfig?: Partial<InitialConfigType>;

  /**
   * Editor content editable className
   */
  contentEditableClassName?: string;

  /**
   * Additional plugins to include in the editor
   */
  children?: ReactNode;

  /**
   * Root editor container className
   */
  className?: string;

  /**
   * Whether the editor is read-only
   */
  readOnly?: boolean;

  /**
   * Show toolbar with formatting controls
   */
  showToolbar?: boolean;

  /**
   * Enable image uploads
   */
  enableImages?: boolean;

  /**
   * Enable enhanced link editing
   */
  enableLinks?: boolean;
}

const LexicalEditor: FC<LexicalEditorProps> = ({
  initialState,
  placeholder = 'Enter some text...',
  theme = {},
  onChange,
  editorConfig = {},
  contentEditableClassName = '',
  children,
  className = '',
  readOnly = false,
  showToolbar = true,
  enableImages = true,
  enableLinks = true,
}) => {
  // Merge custom theme with default theme
  const mergedTheme = { ...defaultTheme, ...theme };

  // Initialize parsed state if available
  let parsedEditorState;
  if (initialState) {
    try {
      parsedEditorState = JSON.parse(initialState);
    } catch (error) {
      console.error('Error parsing initial editor state:', error);
    }
  }

  // Default editor configuration
  const defaultConfig: InitialConfigType = {
    namespace: 'react-lexical-editor',
    theme: mergedTheme,
    onError: (error: Error) => {
      console.error('Lexical Editor error:', error);
    },
    readOnly,
    // Register required nodes
    nodes: [ParagraphNode, TextNode, LinkNode, HeadingNode, ImageNode],
    // If we have parsed state, add it as a function
    ...(parsedEditorState && {
      editorState: () => parsedEditorState,
    }),
  };

  // Merge custom config with default config
  const config: InitialConfigType = { ...defaultConfig, ...editorConfig };

  return (
    <div className={`react-lexical-editor-container ${className}`}>
      <LexicalComposer initialConfig={config}>
        {showToolbar && !readOnly && <ToolbarPlugin />}

        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`editor-input ${contentEditableClassName}`}
                data-testid="lexical-editor"
              />
            }
            placeholder={<div className="editor-placeholder">{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <HistoryPlugin />

        {/* Standard link support */}
        <LinkPlugin />

        {/* Enhanced link editing */}
        {enableLinks && !readOnly && <CustomLinkPlugin />}

        {/* Image support */}
        {enableImages && <ImagePlugin captionsEnabled={true} />}

        {onChange && <OnChangePlugin onChange={onChange} />}

        {children}
      </LexicalComposer>
    </div>
  );
};

export default LexicalEditor;
