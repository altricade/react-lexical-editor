**React Lexical Editor v0.1.2**

***

# React Lexical Editor

A rich text editor library for React built on top of [Lexical](https://lexical.dev/), Meta's extensible text editor framework.

[![NPM Version](https://img.shields.io/npm/v/react-lexical-editor)](https://www.npmjs.com/package/react-lexical-editor)
[![CI](https://github.com/altricade/react-lexical-editor/actions/workflows/ci.yml/badge.svg)](https://github.com/altricade/react-lexical-editor/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- 📝 Rich text editing (bold, italic, underline, headings, etc.)
- 🖼️ Image support with captions
- 🔗 Links with custom editing UI
- 🧰 Customizable toolbar
- 📱 Responsive design
- 🔄 History (undo/redo)
- 🔌 Extensible plugin architecture
- 📦 Lightweight and optimized bundle

## Installation

```bash
# npm
npm install react-lexical-editor

# yarn
yarn add react-lexical-editor

# pnpm
pnpm add react-lexical-editor
```

## Quick Start

```jsx
import React from 'react';
import { LexicalEditor } from 'react-lexical-editor';

function MyEditor() {
  return (
    <LexicalEditor
      placeholder="Start typing..."
      onChange={(editorState, editor) => {
        console.log(JSON.stringify(editorState.toJSON()));
      }}
    />
  );
}
```

## Documentation

### LexicalEditor Props

| Prop                       | Type                                                            | Default                | Description                              |
| -------------------------- | --------------------------------------------------------------- | ---------------------- | ---------------------------------------- |
| `initialState`             | `string`                                                        | `undefined`            | Initial editor state as JSON string      |
| `placeholder`              | `string`                                                        | `'Enter some text...'` | Placeholder text when editor is empty    |
| `theme`                    | `Record<string, any>`                                           | `{}`                   | Override theme styles                    |
| `onChange`                 | `(editorState: EditorState, editor: LexicalEditorType) => void` | `undefined`            | Callback when content changes            |
| `editorConfig`             | `Partial<InitialConfigType>`                                    | `{}`                   | Additional Lexical editor configuration  |
| `contentEditableClassName` | `string`                                                        | `''`                   | Class name for ContentEditable component |
| `children`                 | `ReactNode`                                                     | `undefined`            | Additional plugins or editor components  |
| `className`                | `string`                                                        | `''`                   | Class name for editor container          |
| `readOnly`                 | `boolean`                                                       | `false`                | Set editor to read-only mode             |
| `showToolbar`              | `boolean`                                                       | `true`                 | Show/hide the toolbar                    |
| `enableImages`             | `boolean`                                                       | `true`                 | Enable image insertion and handling      |
| `enableLinks`              | `boolean`                                                       | `true`                 | Enable link creation and editing         |

### Available Plugins

#### ImagePlugin

The ImagePlugin allows inserting and managing images in the editor.

```jsx
import { ImagePlugin } from 'react-lexical-editor';

// Used internally when enableImages={true}
<ImagePlugin captionsEnabled={true} />;
```

**Props**:

- `captionsEnabled`: Boolean to enable/disable image captions (default: true)

#### LinkPlugin

Enhanced link editing capabilities beyond the standard Lexical LinkPlugin.

```jsx
import { LinkPlugin } from 'react-lexical-editor';

// Used internally when enableLinks={true}
<LinkPlugin />;
```

#### ToolbarPlugin

Provides a rich formatting toolbar for the editor.

```jsx
import { ToolbarPlugin } from 'react-lexical-editor';

// Used internally when showToolbar={true} and !readOnly
<ToolbarPlugin />;
```

### Working with Editor State

You can save and restore editor state using the `onChange` prop and `initialState`:

```jsx
const [editorState, setEditorState] = useState('');

// Save state when content changes
const handleEditorChange = state => {
  setEditorState(JSON.stringify(state.toJSON()));
};

// Later, restore the state
<LexicalEditor initialState={editorState} onChange={handleEditorChange} />;
```

## Advanced Usage

### Custom Plugins

You can add custom plugins by including them as children:

```jsx
import { LexicalEditor } from 'react-lexical-editor';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';

function MyEditorWithAutoLink() {
  const MATCHERS = [
    {
      trigger: 'https://',
      url: 'https://{text}',
    },
  ];

  return (
    <LexicalEditor>
      <AutoLinkPlugin matchers={MATCHERS} />
    </LexicalEditor>
  );
}
```

### Custom Theming

```jsx
import { LexicalEditor } from 'react-lexical-editor';

const customTheme = {
  paragraph: 'my-paragraph-class',
  heading: {
    h1: 'my-h1-class',
    h2: 'my-h2-class',
  },
  text: {
    bold: 'my-bold-class',
    italic: 'my-italic-class',
  },
};

<LexicalEditor theme={customTheme} />;
```

## Examples

### Read-Only Editor

```jsx
<LexicalEditor initialState={savedContent} readOnly={true} showToolbar={false} />
```

### Editor with Custom Configuration

```jsx
<LexicalEditor
  placeholder="Write your story..."
  editorConfig={{
    namespace: 'my-custom-editor',
    onError: error => {
      console.error('Custom error handler:', error);
    },
  }}
  contentEditableClassName="my-editor-styles"
/>
```

## Development

```bash
# Install dependencies
npm install

# Start development playground
npm run playground

# Run tests
npm test

# Build for production
npm run build
```

## Contributing

Contributions are welcome! Please check out our [contributing guidelines](_media/CONTRIBUTING.md).

## License

MIT © [Zaid Omar](https://github.com/altricade)
