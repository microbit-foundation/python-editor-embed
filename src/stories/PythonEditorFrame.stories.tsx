import { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useRef } from 'react';
import { PythonProject } from '..';
import PythonEditorFrame, {
  PythonEditorFrameProps,
} from '../PythonEditorFrame';
import { PythonEditorFrameDriver } from '../python-editor-frame-driver';
import StoryWrapper from './StoryWrapper';
import { controllerId } from './config';
import PythonEditorToolbar from './PythonEditorToolbar';
import { defaultPythonProject, multiFilePythonProject } from './fixtures';

const meta: Meta<typeof PythonEditorFrame> = {
  component: PythonEditorFrame,
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
type Story = StoryObj<typeof PythonEditorFrame>;

interface PythonEditorProps
  extends Omit<PythonEditorFrameProps, 'initialProject'> {
  startingProject?: PythonProject;
}

const PythonEditor = ({ startingProject, ...props }: PythonEditorProps) => {
  const ref = useRef<PythonEditorFrameDriver>(null);
  const initialProject = useCallback(async () => {
    return [startingProject ?? defaultPythonProject];
  }, [startingProject]);
  return (
    <>
      <PythonEditorToolbar driver={ref} />
      <PythonEditorFrame ref={ref} initialProject={initialProject} {...props} />
    </>
  );
};

export const PythonEditorStory: Story = {
  name: 'Python Editor versions',
  args: {
    version: '3',
  },
  render: (args) => {
    const { version } = args;
    return (
      <StoryWrapper>
        <PythonEditor
          controllerId={controllerId}
          style={{ flexGrow: 1 }}
          version={version}
          onWorkspaceLoaded={(e) => console.log('workspaceLoaded', e)}
          onWorkspaceSync={(e) => console.log('workspaceSync', e)}
          onWorkspaceSave={(e) => {
            console.log('onWorkspaceSave', e);
          }}
        />
      </StoryWrapper>
    );
  },
};

// Broken out separately from the above to test the multiFilePythonProject.
// This should also work with the defaultPythonProject.
export const MultiFileProject: Story = {
  name: 'Python Editor multi-file project',
  render: () => (
    <StoryWrapper>
      <PythonEditor
        controllerId={controllerId}
        style={{ flexGrow: 1 }}
        startingProject={multiFilePythonProject}
        version="3"
      />
    </StoryWrapper>
  ),
};

export const V3French: Story = {
  name: 'Python Editor V3 lang via query string',
  render: () => (
    <StoryWrapper>
      <PythonEditor
        controllerId={controllerId}
        style={{ flexGrow: 1 }}
        version="3"
        lang="fr"
      />
    </StoryWrapper>
  ),
};

export const V3NoLangFlag: Story = {
  name: 'Python Editor V3 noLang flag',
  render: () => (
    <StoryWrapper>
      <PythonEditor
        controllerId={controllerId}
        style={{ flexGrow: 1 }}
        version="3"
        queryParams={{ flag: 'noLang' }}
      />
    </StoryWrapper>
  ),
};
