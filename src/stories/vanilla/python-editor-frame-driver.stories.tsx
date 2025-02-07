import { Meta, StoryObj } from '@storybook/react';
import { useRef } from 'react';
import {
  PythonEditorFrameDriver,
  PythonProject,
  createPythonEditorURL,
} from '../../vanilla/index.js';
import { controllerId } from '../config.js';
import { defaultPythonProject, multiFilePythonProject } from '../fixtures.js';
import PythonEditorToolbar from '../PythonEditorToolbar.js';
import StoryWrapper from '../StoryWrapper.js';

interface StoryArgs {
  version?: string;
  lang?: string;
  controller?: 1 | 2;
  queryParams?: Record<string, string>;
  project?: PythonProject;
}

const meta: Meta<StoryArgs> = {
  title: 'stories/VanillaJS/makeCodeFrameDriver',
  argTypes: {
    version: {
      options: ['2.0.0', '2.2.2', '3', 'beta'],
      defaultValue: '2.0.0',
      name: 'version',
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<StoryArgs>;

const renderEditor = (args: StoryArgs) => {
  const savedProjects = useRef<Map<string, PythonProject>>(new Map());
  const ref = useRef<PythonEditorFrameDriver | null>(null);
  const cbRef = (div: HTMLElement | null) => {
    if (!div) {
      return;
    }
    // Create an iframe element.
    const iframe = document.createElement('iframe');
    iframe.title = 'PythonEditor';
    iframe.allow = 'usb; autoplay; camera; microphone;';
    const url = createPythonEditorURL(
      args.version ?? '3',
      args.lang,
      args.controller ?? 1,
      args.queryParams
    );
    iframe.src = url;
    iframe.width = '100%';
    iframe.height = '100%';
    div.replaceChildren(iframe);

    // Create and initialise an instance of PythonEditorFrameDriver.
    ref.current = new PythonEditorFrameDriver(
      {
        initialProjects: async () =>
          args.project ? [args.project] : [defaultPythonProject],
        onWorkspaceLoaded: (e) => console.log('workspaceLoaded', e),
        onWorkspaceSync: (e) => console.log('workspaceSync', e),
        onWorkspaceSave: (e) => {
          savedProjects.current.set(controllerId, e.project);
          console.log(savedProjects);
        },
      },
      () => iframe
    );
    ref.current.initialize();
  };

  return (
    <StoryWrapper>
      <PythonEditorToolbar driver={ref} />
      <div ref={cbRef} style={{ flexGrow: 1 }} />
    </StoryWrapper>
  );
};

export const PythonEditorStory: Story = {
  name: 'Python Editor versions',
  render: renderEditor,
  args: {
    version: '3',
    project: defaultPythonProject,
  },
};

// Broken out separately from the above to test the multiFilePythonProject.
// This should also work with the defaultPythonProject.
export const MultiFileProject: Story = {
  name: 'Python Editor multi-file project',
  render: renderEditor,
  args: {
    version: '3',
    project: multiFilePythonProject,
  },
};

export const V3French: Story = {
  name: 'Python Editor V3 lang via query string',
  render: renderEditor,
  args: {
    version: '3',
    lang: 'fr',
  },
};

export const V3NoLangFlag: Story = {
  name: 'Python Editor V3 noLang flag',
  render: renderEditor,
  args: {
    version: '3',
    queryParams: { flag: 'noLang' },
  },
};
