import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useApiMonitoring = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const monitorApiCalls = (response: any) => {
      if (response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    };

    const originalFetch = window.fetch;
    window.fetch = async (url, options) => {
      const response = await originalFetch(url, options);
      monitorApiCalls(response);
      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [navigate]);

  return null;
};

export default useApiMonitoring;
