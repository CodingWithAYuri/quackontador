import { useState, useEffect } from "react";

export const useUserEmail = () => {
  const [userData, setUserData] = useState({ email: null, name: null });

  useEffect(() => {
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const parsedData = JSON.parse(userDataStr);
        setUserData({
          email: parsedData?.user?.email || null,
          name: parsedData?.user?.name || null
        });
      } catch (error) {
        console.error("Error parsing userData:", error);
      }
    }
  }, []);

  return userData;
};
