import { useState, useEffect } from 'react';
import { Loading } from '../components/Loading';
import { Main } from '../components/Main';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  return isLoading ? <Loading /> : <Main />;
}
