---
title: React Usage
---

# React Usage

<a href="https://microbit-foundation.github.io/python-editor-embed/" class="typedoc-ignore">This documentation is best viewed on the documentation site rather than GitHub or NPM package site.</a>

## Embed Python Editor

Use {@link react.PythonEditorFrame | PythonEditorFrame} component to embed Python editor.

```js
import { PythonEditorFrame } from '@microbit/python-editor-embed/react';

<PythonEditorFrame
  ref={ref}
  controller={1}
  controllerId="YOUR APP NAME HERE"
  initialProjects={async () => [pythonProject]}
  onWorkspaceSave={(e) => {
    // Set project as project changes in the editor.
    setSavedProject(e.project);
  }}
/>;
```

For more examples, take a look at the [Python editor frame demo source code](../src/stories/react/PythonEditorFrame.stories.tsx).
