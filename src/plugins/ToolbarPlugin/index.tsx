import React, { useCallback, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  COMMAND_PRIORITY_NORMAL,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
  TextNode,
} from 'lexical';
import { $isHeadingNode, $createHeadingNode } from '@lexical/rich-text';
import { $wrapNodes } from '@lexical/selection';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { INSERT_IMAGE_COMMAND } from '../ImagePlugin';
import './ToolbarPlugin.css';

export interface ToolbarPluginProps {
  className?: string;
}

export function ToolbarPlugin({ className = '' }: ToolbarPluginProps): React.ReactElement {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [selectedFontSize, setSelectedFontSize] = useState<string>('15px');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));

      // Get selected node and check formatting
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isHeadingNode(element)) {
          const tag = element.getTag();
          setBlockType(tag);
        } else {
          setBlockType('paragraph');
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  // Register selection change listener
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, _newEditor) => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [editor, updateToolbar]);

  // Format methods
  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  const formatStrikethrough = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
  };

  const formatHeading = (headingSize: 'h1' | 'h2' | 'h3') => {
    if (blockType === headingSize) {
      // If already this heading type, convert back to paragraph
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // Wrap selected nodes in paragraph nodes to replace headings
          $wrapNodes(selection, () => $createParagraphNode());
          setBlockType('paragraph');
        }
      });
    } else {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // Wrap selected nodes in heading nodes
          $wrapNodes(selection, () => $createHeadingNode(headingSize));
          setBlockType(headingSize);
        }
      });
    }
  };


  const formatTextColor = (color: string) => {
    setSelectedColor(color);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach(node => {
          if (node.getType() === 'text') {
            // Apply style directly to text nodes
            (node as TextNode).setStyle(`color: ${color}`);
          }
        });
      }
    });
  };

  const formatFontSize = (fontSize: string) => {
    setSelectedFontSize(fontSize);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach(node => {
          if (node.getType() === 'text') {
            // Apply style directly to text nodes
            (node as TextNode).setStyle(`font-size: ${fontSize}`);
          }
        });
      }
    });
  };

  const insertLink = () => {
    if (!linkUrl) return;

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
      url: linkUrl,
      target: '_blank',
    });

    setShowLinkDialog(false);
    setLinkUrl('');
  };

  const insertImage = () => {
    if (!imageUrl) return;

    // Use the simplified image command from our ImagePlugin
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src: imageUrl,
      altText: imageAlt || 'Image',
    });

    setShowImageDialog(false);
    setImageUrl('');
    setImageAlt('');
  };

  // Image insertion is now handled by the ImagePlugin via INSERT_IMAGE_COMMAND

  return (
    <div className={`editor-toolbar ${className}`}>
      <div className="toolbar-section format-section">
        <button
          className={`toolbar-btn ${isBold ? 'active' : ''}`}
          onClick={formatBold}
          title="Bold"
          aria-label="Bold"
        >
          <span className="toolbar-icon">B</span>
        </button>

        <button
          className={`toolbar-btn ${isItalic ? 'active' : ''}`}
          onClick={formatItalic}
          title="Italic"
          aria-label="Italic"
        >
          <span className="toolbar-icon">I</span>
        </button>

        <button
          className={`toolbar-btn ${isUnderline ? 'active' : ''}`}
          onClick={formatUnderline}
          title="Underline"
          aria-label="Underline"
        >
          <span className="toolbar-icon">U</span>
        </button>

        <button
          className={`toolbar-btn ${isStrikethrough ? 'active' : ''}`}
          onClick={formatStrikethrough}
          title="Strikethrough"
          aria-label="Strikethrough"
        >
          <span className="toolbar-icon">S</span>
        </button>
      </div>

      <div className="toolbar-section heading-section">
        <button
          className={`toolbar-btn ${blockType === 'h1' ? 'active' : ''}`}
          onClick={() => formatHeading('h1')}
          title="Heading 1"
          aria-label="Heading 1"
        >
          <span className="toolbar-icon">H1</span>
        </button>

        <button
          className={`toolbar-btn ${blockType === 'h2' ? 'active' : ''}`}
          onClick={() => formatHeading('h2')}
          title="Heading 2"
          aria-label="Heading 2"
        >
          <span className="toolbar-icon">H2</span>
        </button>

        <button
          className={`toolbar-btn ${blockType === 'h3' ? 'active' : ''}`}
          onClick={() => formatHeading('h3')}
          title="Heading 3"
          aria-label="Heading 3"
        >
          <span className="toolbar-icon">H3</span>
        </button>
      </div>

      <div className="toolbar-section color-section">
        <input
          type="color"
          value={selectedColor}
          onChange={e => formatTextColor(e.target.value)}
          className="color-picker"
          title="Text Color"
          aria-label="Text Color"
        />
      </div>

      <div className="toolbar-section font-size-section">
        <select
          value={selectedFontSize}
          onChange={e => formatFontSize(e.target.value)}
          className="font-size-select"
          title="Font Size"
          aria-label="Font Size"
        >
          <option value="12px">12px</option>
          <option value="13px">13px</option>
          <option value="15px">15px</option>
          <option value="17px">17px</option>
          <option value="19px">19px</option>
          <option value="22px">22px</option>
          <option value="24px">24px</option>
          <option value="28px">28px</option>
        </select>
      </div>

      <div className="toolbar-section insert-section">
        <button
          className="toolbar-btn"
          onClick={() => setShowLinkDialog(true)}
          title="Insert Link"
          aria-label="Insert Link"
        >
          <span className="toolbar-icon">🔗</span>
        </button>

        <button
          className="toolbar-btn"
          onClick={() => setShowImageDialog(true)}
          title="Insert Image"
          aria-label="Insert Image"
        >
          <span className="toolbar-icon">🖼️</span>
        </button>
      </div>

      {showLinkDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Insert Link</h3>
            <input
              type="text"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              aria-label="Link URL"
            />
            <div className="dialog-buttons">
              <button onClick={() => setShowLinkDialog(false)}>Cancel</button>
              <button onClick={insertLink}>Insert</button>
            </div>
          </div>
        </div>
      )}

      {showImageDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Insert Image</h3>
            <input
              type="text"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              aria-label="Image URL"
            />
            <input
              type="text"
              value={imageAlt}
              onChange={e => setImageAlt(e.target.value)}
              placeholder="Alt text"
              aria-label="Image Alt Text"
            />
            <div className="dialog-buttons">
              <button onClick={() => setShowImageDialog(false)}>Cancel</button>
              <button onClick={insertImage}>Insert</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
