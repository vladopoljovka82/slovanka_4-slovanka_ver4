import { useState, useEffect } from 'react';
import { SiteContent } from '../types';
import { getSiteContent } from './siteContentStorage';

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(() => getSiteContent());

  useEffect(() => {
    const handleUpdate = () => {
      setContent(getSiteContent());
    };
    window.addEventListener('slovanka_content_updated', handleUpdate);
    return () => {
      window.removeEventListener('slovanka_content_updated', handleUpdate);
    };
  }, []);

  return content;
}
