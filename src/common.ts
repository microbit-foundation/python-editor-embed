export type PythonProjectV3 = {
  files: { [key: string]: string };
  projectName?: string;
};

export type PythonProjectV2 = string;

export type PythonProject = PythonProjectV2 | PythonProjectV3;

export const transformEditorConfigParamsIntoQueryString = (params: {
  [key: string]: string | boolean | number | undefined;
}): string => {
  const queryParams: string[] = [];
  // tslint:disable-next-line:forin
  for (const key in params) {
    if (typeof params[key] === 'boolean' && params[key]) {
      queryParams.push(`${key}=1`);
    }

    if (
      (typeof params[key] === 'string' || typeof params[key] === 'number') &&
      params[key]
    ) {
      queryParams.push(`${key}=${params[key]}`);
    }
  }
  return queryParams.join('&');
};

export const generateUrlWithQueryParams = (
  baseUrl: string,
  params: {
    [key: string]: string | boolean | number | undefined;
  }
): string => `${baseUrl}?${transformEditorConfigParamsIntoQueryString(params)}`;
