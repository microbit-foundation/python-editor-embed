---
title: VanillaJS Usage
---

# VanillaJS Usage

<a href="https://microbit-foundation.github.io/python-editor-embed/" class="typedoc-ignore">This documentation is best viewed on the documentation site rather than GitHub or NPM package site.</a>

## Embed Python Editor

Use {@link vanilla.PythonEditorFrameDriver | PythonEditorFrameDriver} class to create a driverRef for an iframe element. The iframe element src URL can be generated using {@link vanilla.createPythonEditorURL | createPythonEditorURL}.

```js
import {
  PythonEditorFrameDriver,
  PythonProject,
  createPythonEditorURL,
} from '@microbit/python-editor-embed/vanilla';

// Create an iframe element.
const iframe = document.createElement('iframe');
iframe.title = 'PythonEditor';
iframe.allow = 'usb; autoplay; camera; microphone;';
const url = createPythonEditorURL(
  '3', // Version.
  undefined, // Language.
  1, // Controller, where 1 means iframe controller mode.
  undefined // Query params.
);
iframe.src = url;
iframe.width = '100%';
iframe.height = '100%';

document.querySelector<HTMLDivElement>("#app")!.appendChild(iframe);

// Create and initialise an instance of PythonEditorFrameDriver.
const driverRef = new PythonEditorFrameDriver(
  {
    controllerId: 'YOUR APP NAME HERE',
    initialProjects: async () => [pythonProject],
    onWorkspaceLoaded: (e) => console.log('Workspace loaded'),
    onWorkspaceSync: (e) => console.log('Workspace ready to sync'),
    onWorkspaceSave: (e) => console.log('Workspace save'),
  },
  () => iframe
);
driverRef.initialize();
```

For more examples, take a look at the [Python editor frame demo source code](../src/stories/vanilla/python-editor-frame-driver.stories.tsx).
