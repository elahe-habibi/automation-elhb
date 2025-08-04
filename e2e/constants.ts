import { ENV_CONFIG, getRepositoryUrl } from '../env.config';

export const URLs = {
  // Base URLs
  BASE_URL: ENV_CONFIG.BASE_URL,
  SSO_URL: ENV_CONFIG.SSO_URL,

  // Auth URLs
  LOGIN: ENV_CONFIG.LOGIN,
  SIGNIN: ENV_CONFIG.SIGNIN,
  DASHBOARD: ENV_CONFIG.DASHBOARD,

  // Repository URLs
  REPOSITORY_MANAGEMENT: ENV_CONFIG.REPOSITORY_MANAGEMENT,
  MY_REPOSITORIES: ENV_CONFIG.MY_REPOSITORIES,
  CREATE_REPOSITORY: ENV_CONFIG.CREATE_REPOSITORY,
  EDIT_REPOSITORY: getRepositoryUrl.edit,
  VIEW_REPOSITORY: getRepositoryUrl.view,

  // SSO Parameters
  SSO_PARAMS: ENV_CONFIG.SSO_PARAMS,
} as const;

import { getFullUrl, getFullUrlWithParams, getSSOUrl } from '../env.config';

// Re-export helper functions for backward compatibility
export { getFullUrl, getFullUrlWithParams, getSSOUrl };
