import { useState, useEffect } from "react";

export const useUserEmail = () => {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setEmail(parsedData?.user?.email || null); // Usando optional chaining
      } catch (error) {
        console.error("Error parsing userData:", error);
      }
    }
  }, []);

  return email;
};
