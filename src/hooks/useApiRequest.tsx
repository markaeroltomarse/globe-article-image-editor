import { useState,  useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiResponse {
  data: any | null;
  loading: boolean;
  isCalled: boolean;
  error: any;
  run: (url: string, config?: AxiosRequestConfig<any> | undefined) => any
}

const useApiRequest =  (): ApiResponse => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCalled, setIsCalled] = useState<boolean>(false);
  const [error, setError] = useState<any>(null)

  const run = useCallback(async (url: string, config?: AxiosRequestConfig<any> | undefined) => {
    try {
      setIsCalled(true);
      const response: AxiosResponse = await axios({
        url,
        ...config,
        headers: {
          ...config?.headers,
          'Content-Type': 'application/json',
          // You may need to add other headers based on your requirements
        }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error)
    } finally {
      setLoading(false);
    }
    return 
  }, [])

  return { data, loading, isCalled, error, run };
};

export default useApiRequest;
