export interface Service {
  id: string;
  translationKey: string;
  iconPath: string;
}

export const services: Service[] = [
  { 
    id: 'microcontroller', 
    translationKey: 'microcontroller', 
    iconPath: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' 
  },
  { 
    id: 'systems', 
    translationKey: 'systems', 
    iconPath: 'M4 6h16M4 10h16M4 14h16M4 18h16' 
  },
  { 
    id: 'freesoftware', 
    translationKey: 'freesoftware', 
    iconPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' 
  },
  { 
    id: 'analytics', 
    translationKey: 'analytics', 
    iconPath: 'M3 3v18h18M7 16l4-4 4 4 5-8' 
  },
  { 
    id: 'integration', 
    translationKey: 'integration', 
    iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' 
  },
  { 
    id: 'engineering', 
    translationKey: 'engineering', 
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' 
  },
];
