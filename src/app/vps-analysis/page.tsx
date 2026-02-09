'use client';

import { useEffect } from 'react';

export default function VPSAnalysisPage() {
  useEffect(() => {
    // Redirect to the static HTML file
    window.location.href = '/vps-analisis-lengkap.html';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading VPS Analysis...</p>
        <p className="text-sm text-gray-500 mt-2">
          Jika tidak redirect otomatis,{' '}
          <a href="/vps-analisis-lengkap.html" className="text-blue-600 hover:underline">
            klik di sini
          </a>
        </p>
      </div>
    </div>
  );
}
