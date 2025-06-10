import { useCallback, useEffect, useState } from 'react';
import api from './api';

export const useGetStory = (url: string) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(url);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export const useLikeStory = (url: string) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false); // Start as false since no initial request
  const [error, setError] = useState<string | null>(null);

  const likeStory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(url);
      setData(response.data);
      return response.data; // Return the data for immediate use if needed
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw errorMessage; // Re-throw to allow error handling in components
    } finally {
      setLoading(false);
    }
  }, [url]); // Dependency array ensures memoization

  return { data, loading, error, likeStory };
};
export const useNewComment = (url: string) => {
  const [data, setData] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(false); // Start as false since no initial request
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (postData: any) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.post(url, postData);
        setData(response.data);
        return response.data; // Return the data for immediate use if needed
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
        throw errorMessage; // Re-throw to allow error handling in components
      } finally {
        setLoading(false);
      }
    },
    [url],
  ); // Dependency array ensures memoization

  return { data, loading, error, create };
};

export const useDeleteComment = () => {
  const [data, setData] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(false); // Start as false since no initial request
  const [error, setError] = useState<string | null>(null);

  const deleteComment = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.delete(url);
      setData(response.data);
      return response.data; // Return the data for immediate use if needed
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      throw errorMessage; // Re-throw to allow error handling in components
    } finally {
      setLoading(false);
    }
  }, []); // Dependency array ensures memoization

  return { data, loading, error, deleteComment };
};