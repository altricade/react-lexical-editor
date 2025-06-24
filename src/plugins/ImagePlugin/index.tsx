import * as React from 'react';
import { useEffect } from 'react';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  LexicalEditor,
  ElementNode,
  DOMExportOutput,
  NodeKey,
  SerializedElementNode,
  $createNodeSelection,
  $setSelection,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// Create the image command
export const INSERT_IMAGE_COMMAND: LexicalCommand<{ src: string; altText: string }> =
  createCommand();

import './ImagePlugin.css';

// Define interface for the Image node
interface SerializedImageNode extends SerializedElementNode {
  type: 'image';
  version: 1;
  src: string;
  altText: string;
  width?: string;
  height?: string;
}

// Simple props for ImagePlugin
export interface ImagePluginProps {
  captionsEnabled?: boolean;
}

// Create a custom Image node class
export class ImageNode extends ElementNode {
  __src: string;
  __altText: string;
  __width?: string;
  __height?: string;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__key
    );
  }

  constructor(
    src: string,
    altText: string,
    width?: string,
    height?: string,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  createDOM(): HTMLElement {
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__altText;
    img.style.maxWidth = '100%';
    img.style.display = 'block';
    img.style.margin = '0 auto';
    img.className = 'editor-image';
    
    if (this.__width) img.style.width = this.__width;
    if (this.__height) img.style.height = this.__height;
    
    return img;
  }

  updateDOM(): false {
    return false; // Always replace the DOM element when updating
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
    };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(
      serializedNode.src,
      serializedNode.altText,
      serializedNode.width,
      serializedNode.height
    );
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__altText || '');
    if (this.__width) element.setAttribute('width', this.__width);
    if (this.__height) element.setAttribute('height', this.__height);
    element.className = 'editor-image';
    return { element };
  }
}

// Simplified ImagePlugin that registers a command to insert an image and registers the ImageNode
export function ImagePlugin(_props: ImagePluginProps): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Make sure ImageNode is registered
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImageNode is not registered in the editor. Register it in LexicalEditor.tsx');
    }
    
    // Register command listener for image insertion
    const unregister = editor.registerCommand<{ src: string; altText: string }>(
      INSERT_IMAGE_COMMAND,
      ({ src, altText }) => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const imageNode = new ImageNode(src, altText);
          selection.insertNodes([imageNode]);
          
          // Select the image node after insertion
          const nodeSelection = $createNodeSelection();
          nodeSelection.add(imageNode.getKey());
          $setSelection(nodeSelection);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_EDITOR
    );

    return () => {
      unregister();
    };
  }, [editor]);

  return null;
}

/**
 * Helper function for UI to insert an image
 */
export function insertImage(
  editor: LexicalEditor,
  url: string,
  altText: string = ''
): void {
  editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: url, altText });
}
