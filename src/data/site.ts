export const GITHUB_USERNAME = "orbitalsite";
export const REPO_NAME = "orbital-apps";

export const siteConfig = {
  name: 'ORBITAL',
  url: `https://${GITHUB_USERNAME}.github.io/${REPO_NAME}`,
  base: `/${REPO_NAME}`,
  defaultLang: 'ar' as const,
  social: {
    github: 'https://github.com/orbital',
    twitter: 'https://x.com/orbital',
    linkedin: 'https://linkedin.com/company/orbital',
    email: 'contact@orbital.dev'
  }
};
