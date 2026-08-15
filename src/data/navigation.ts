export interface NavItem {
  key: string;     // i18n key like 'nav.home'
  path: string;    // url path like '/'
  children?: NavItem[];
}

export const mainNavigation: NavItem[] = [
  { key: 'home', path: '/' },
  { key: 'programs', path: '/programs/' },
  { key: 'services', path: '/services/' },
  { key: 'about', path: '/about/' },
  { key: 'contact', path: '/contact/' },
];
