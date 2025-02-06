export type PythonProjectV3 = {
  files: { [key: string]: string };
  projectName?: string;
};

export type PythonProjectV2 = string;

export type PythonProject = PythonProjectV2 | PythonProjectV3;
