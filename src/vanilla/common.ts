export type PythonProjectV3 = {
  files: { [key: string]: string };
  projectName?: string;
};

export type PythonProjectV2 = string;

export type PythonProject = PythonProjectV2 | PythonProjectV3;

export interface PythonEditorWorkspaceRequest {
  action: 'workspacesync' | 'workspacesave' | 'workspaceloaded';
  project: PythonProject;
  type: 'pyeditor';
}

export interface ImportProjectOptions {
  // project to load
  project: PythonProject;
}

export interface PythonEditorImportProjectMessageRequest
  extends ImportProjectOptions {
  type: 'pyeditor';
  action: 'importproject';
  response?: boolean;
  id?: string;
}

export type PythonEditorMessageRequest =
  PythonEditorImportProjectMessageRequest;
