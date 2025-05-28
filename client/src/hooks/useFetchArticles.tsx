import { useCallback, useEffect, useState } from 'react';
import api from './api';
import { Story } from '../types/story.type';

// Example POST request
const createPost = async (postData: any) => {
  try {
    const response = await api.post('/posts', postData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

// Example PUT request
const updateUser = async (userId: any, userData: any) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

// Example DELETE request
const deleteItem = async (itemId: any) => {
  try {
    await api.delete(`/items/${itemId}`);
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

type DataType = { stories: Story; storiesCount: number };
export const useGetStory = (url: string) => {
  const [data, setData] = useState<DataType | null>(null);
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
  const [data, setData] = useState<DataType | null>(null);
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
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(false); // Start as false since no initial request
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (postData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post(url, postData);
      console.log('COMMENT -> ', response);
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

  return { data, loading, error, create };
};
