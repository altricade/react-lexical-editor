import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  LexicalEditor,
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import './LinkPlugin.css';

/**
 * Props for the floating link editor component
 */
interface FloatingLinkEditorProps {
  editor: LexicalEditor;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  anchorElem: HTMLElement;
  initialUrl: string;
  isEditMode: boolean;
}

/**
 * Floating editor for editing links
 */
function FloatingLinkEditor({
  editor,
  isOpen,
  setIsOpen,
  anchorElem,
  initialUrl,
  isEditMode,
}: FloatingLinkEditorProps): React.ReactElement {
  const editorRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState(initialUrl);
  
  // Position the editor when it opens
  useEffect(() => {
    if (isOpen && editorRef.current && anchorElem) {
      const editorElem = editorRef.current;
      const anchorRect = anchorElem.getBoundingClientRect();
      
      // Position below the selection
      const top = anchorRect.bottom + window.scrollY + 10;
      const left = Math.max(
        5,
        Math.min(
          anchorRect.left + window.scrollX,
          window.innerWidth - (editorElem.offsetWidth || 200) - 5
        )
      );
      
      editorElem.style.top = `${top}px`;
      editorElem.style.left = `${left}px`;
    }
  }, [isOpen, anchorElem]);

  // Reset state when editor opens
  useEffect(() => {
    if (isOpen) {
      setLinkUrl(initialUrl);
      
      // Focus input after slight delay to ensure DOM is ready
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    }
  }, [isOpen, initialUrl]);

  // Handle keyboard interactions
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLinkSubmission();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  }, []);

  // Apply or remove link
  const handleLinkSubmission = useCallback(() => {
    // Refocus the editor
    editor.focus();
    
    // Process URL - clean and format it
    const url = sanitizeUrl(linkUrl);
    
    if (url) {
      // Apply the link
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    } else if (linkUrl.trim() === '') {
      // If empty, remove the link
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
    
    // Close the editor
    setIsOpen(false);
  }, [editor, linkUrl]);

  // Simple URL sanitizer
  const sanitizeUrl = (url: string): string => {
    if (!url.trim()) return '';
    
    try {
      // Basic cleanup
      const trimmedUrl = url.trim();
      
      // Add protocol if missing
      if (!/^https?:\/\//i.test(trimmedUrl)) {
        return `https://${trimmedUrl}`;
      }
      
      return trimmedUrl;
    } catch (e) {
      console.error('Error sanitizing URL', e);
      return '';
    }
  };

  return (
    <div 
      className="floating-link-editor" 
      ref={editorRef} 
      role="dialog"
      aria-label="Edit link"
    >
      <div className="link-input">
        <input
          ref={inputRef}
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter link URL"
          aria-label="Link URL"
          className="link-input-field"
        />
        <div className="link-edit-buttons">
          <button
            className="link-button save-button"
            onClick={handleLinkSubmission}
            aria-label="Save link"
          >
            Save
          </button>
          <button
            className="link-button cancel-button"
            onClick={() => setIsOpen(false)}
            aria-label="Cancel"
          >
            Cancel
          </button>
          {isEditMode && (
            <button
              className="link-button remove-button"
              onClick={() => {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
                setIsOpen(false);
              }}
              aria-label="Remove link"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Main Link Plugin component
 */
export function LinkPlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();
  const [isLinkEditOpen, setIsLinkEditOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [anchorElem, setAnchorElem] = useState<HTMLElement | null>(null);
  
  // Track user interactions
  const userTriggeredRef = useRef(false);
  
  // Helper to get link information from current selection
  const getLinkInfo = useCallback(() => {
    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      
      if (!$isRangeSelection(selection)) return null;
      
      const nodes = selection.getNodes();
      let linkNode = null;
      let url = '';
      
      // Check for link node in selection
      for (const node of nodes) {
        if ($isLinkNode(node)) {
          linkNode = node;
          url = node.getURL();
          break;
        }
        
        // Check parent for link
        const parent = node.getParent();
        if (parent && $isLinkNode(parent)) {
          linkNode = parent;
          url = parent.getURL();
          break;
        }
      }
      
      return linkNode ? { url, isEdit: true } : { url: '', isEdit: false };
    });
  }, [editor]);

  // Handle toolbar button click
  const handleLinkButtonClick = useCallback(() => {
    userTriggeredRef.current = true;
    
    editor.update(() => {
      const selection = $getSelection();
      
      if ($isRangeSelection(selection)) {
        const rootElement = editor.getRootElement();
        
        if (rootElement) {
          const linkInfo = getLinkInfo();
          setLinkUrl(linkInfo?.url || '');
          setIsEditMode(!!linkInfo?.isEdit);
          setAnchorElem(rootElement);
          setIsLinkEditOpen(true);
        }
      }
    });
    
    // Reset user trigger flag after a delay
    setTimeout(() => {
      userTriggeredRef.current = false;
    }, 100);
  }, [editor, getLinkInfo]);

  // Handle selection changes for link detection
  const handleSelectionChange = useCallback(() => {
    // Skip if user just clicked the link button
    if (userTriggeredRef.current) return false;
    
    editor.update(() => {
      const selection = $getSelection();
      
      if ($isRangeSelection(selection)) {
        // Only show popup when clicking directly on a link node with collapsed selection
        if (selection.isCollapsed()) {
          const linkInfo = getLinkInfo();
          
          if (linkInfo?.isEdit) {
            const rootElement = editor.getRootElement();
            
            if (rootElement) {
              setLinkUrl(linkInfo.url);
              setIsEditMode(true);
              setAnchorElem(rootElement);
              setIsLinkEditOpen(true);
            }
          } else {
            // Hide popup for non-link selections
            setIsLinkEditOpen(false);
          }
        } else {
          // Non-collapsed selection
          setIsLinkEditOpen(false);
        }
      } else {
        // Non-range selection
        setIsLinkEditOpen(false);
      }
    });
    
    return false;
  }, [editor, getLinkInfo]);

  // Register command handlers
  useEffect(() => {
    return mergeRegister(
      // Register link button click handler
      editor.registerCommand(
        TOGGLE_LINK_COMMAND,
        (url) => {
          // If URL is null or empty and no url provided, show the editor
          if (url === undefined) {
            handleLinkButtonClick();
            return true;
          }
          
          // Let default link handling happen for TOGGLE_LINK_COMMAND with URL
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      
      // Register selection change handler
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          // Debounce selection changes to prevent multiple rapid checks
          setTimeout(() => {
            handleSelectionChange();
          }, 100);
          
          return false;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor, handleLinkButtonClick, handleSelectionChange]);

  // Click outside to close the link editor
  useEffect(() => {
    if (!isLinkEditOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isLinkEditOpen && 
        e.target instanceof Node &&
        !e.defaultPrevented
      ) {
        const editorElem = document.querySelector('.floating-link-editor');
        
        if (editorElem && !editorElem.contains(e.target)) {
          setIsLinkEditOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLinkEditOpen]);

  return isLinkEditOpen && anchorElem ? (
    <FloatingLinkEditor
      editor={editor}
      isOpen={isLinkEditOpen}
      setIsOpen={setIsLinkEditOpen}
      anchorElem={anchorElem}
      initialUrl={linkUrl}
      isEditMode={isEditMode}
    />
  ) : null;
}

/**
 * Helper function to easily insert a link
 */
export function insertLink(
  editor: LexicalEditor,
  url: string
): void {
  if (!url) return;
  
  // Ensure we're updating within a proper editor context
  editor.update(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  });
}
