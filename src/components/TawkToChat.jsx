// src/components/TawkToChat.jsx
import { useEffect } from 'react';

const TawkToChat = () => {
  useEffect(() => {
    // Only load on client side
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://embed.tawk.to/697887dc47b101197ca6e840/1jfvd5dhq'; // ← REPLACE WITH YOUR ACTUAL CODE
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      
      document.head.appendChild(script);
      
      return () => {
        // Cleanup
        document.head.removeChild(script);
      };
    }
  }, []);

  return null;
};

export default TawkToChat;