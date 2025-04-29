import { useState, useEffect } from 'react';
import { Loading } from '../components/Loading';
import { useRouter } from 'expo-router';


export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push('/login');
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  return isLoading ? <Loading /> : navigate('/home');
}
