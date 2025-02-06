import { PythonProjectV2, PythonProjectV3 } from './common';
export type { PythonProject, PythonProjectV2, PythonProjectV3 } from './common';
import { fromByteArray } from 'base64-js';
export { default as PythonEditor } from './PythonEditor';
export type {
  PythonEditorMessageAction,
  ActionListenerSubject,
  ResponseEmitterSubject,
} from './withEditorInterface';

export const defaultPythonProject: PythonProjectV2 =
  "# Add your Python code here. E.g.\nfrom microbit import *\n\n\nwhile True:\n    display.scroll('Hello, World!')\n    display.show(Image.HEART)\n    sleep(2000)\n";

const projectFilesToBase64 = (
  files: Record<string, string>
): Record<string, string> => {
  for (const file in files) {
    if (Object.prototype.hasOwnProperty.call(files, file)) {
      files[file] = fromByteArray(new TextEncoder().encode(files[file]));
    }
  }
  return files;
};

export const multiFilePythonProject: PythonProjectV3 = {
  files: projectFilesToBase64({
    'main.py':
      "# Add your Python code here. E.g.\nfrom microbit import *\nimport foo\n\n\nwhile True:\n    display.scroll('Hello, World!')\n    display.show(Image.HEART)\n    foo.bar()\n    sleep(2000)\n",
    'foo.py': "def bar():\n    print('Hello from foo.py!')\n",
  }),
  projectName: 'Multiple files project',
};
