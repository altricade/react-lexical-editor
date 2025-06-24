[**React Lexical Editor v0.1.2**](../README.md)

***

[React Lexical Editor](../globals.md) / LexicalEditorProps

# Interface: LexicalEditorProps

Defined in: [src/components/LexicalEditor.tsx:18](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L18)

## Properties

### children?

> `optional` **children**: `ReactNode`

Defined in: [src/components/LexicalEditor.tsx:52](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L52)

Additional plugins to include in the editor

***

### className?

> `optional` **className**: `string`

Defined in: [src/components/LexicalEditor.tsx:57](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L57)

Root editor container className

***

### contentEditableClassName?

> `optional` **contentEditableClassName**: `string`

Defined in: [src/components/LexicalEditor.tsx:47](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L47)

Editor content editable className

***

### editorConfig?

> `optional` **editorConfig**: `Partial`\<`Readonly`\<\{ \}\>\>

Defined in: [src/components/LexicalEditor.tsx:42](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L42)

Custom editor config

***

### enableImages?

> `optional` **enableImages**: `boolean`

Defined in: [src/components/LexicalEditor.tsx:72](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L72)

Enable image uploads

***

### enableLinks?

> `optional` **enableLinks**: `boolean`

Defined in: [src/components/LexicalEditor.tsx:77](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L77)

Enable enhanced link editing

***

### initialState?

> `optional` **initialState**: `string`

Defined in: [src/components/LexicalEditor.tsx:22](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L22)

Initial editor state as JSON string

***

### onChange()?

> `optional` **onChange**: (`editorState`, `editor`) => `void`

Defined in: [src/components/LexicalEditor.tsx:37](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L37)

Callback when editor content changes

#### Parameters

##### editorState

`EditorState`

##### editor

`LexicalEditor`

#### Returns

`void`

***

### placeholder?

> `optional` **placeholder**: `string`

Defined in: [src/components/LexicalEditor.tsx:27](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L27)

Editor placeholder text

***

### readOnly?

> `optional` **readOnly**: `boolean`

Defined in: [src/components/LexicalEditor.tsx:62](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L62)

Whether the editor is read-only

***

### showToolbar?

> `optional` **showToolbar**: `boolean`

Defined in: [src/components/LexicalEditor.tsx:67](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L67)

Show toolbar with formatting controls

***

### theme?

> `optional` **theme**: `Record`\<`string`, `undefined` \| `null` \| `string` \| `number` \| `boolean`\>

Defined in: [src/components/LexicalEditor.tsx:32](https://github.com/altricade/react-lexical-editor/blob/49b7cb8b19fdf18667f67648ce1b3e1aceea9971/src/components/LexicalEditor.tsx#L32)

Editor theme class overrides
