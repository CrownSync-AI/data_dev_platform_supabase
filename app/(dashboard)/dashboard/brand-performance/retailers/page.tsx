'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RetailersRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/brand-performance/retailer-performance');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to retailer performance...</p>
    </div>
  );
}