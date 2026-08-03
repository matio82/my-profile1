import { useEffect } from 'react';

// تزریق یا آپدیت یک بلوک JSON-LD با id مشخص توی <head>
export const useJsonLd = (id, data) => {
  useEffect(() => {
    if (!data) return undefined;

    let script = document.getElementById(id);
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);

    return () => {
      script?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, JSON.stringify(data)]);
};
