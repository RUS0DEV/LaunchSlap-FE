import { useEffect } from 'react';
import { env } from '@/shared/config/env';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${env.appName}`;
  }, [title]);
}
