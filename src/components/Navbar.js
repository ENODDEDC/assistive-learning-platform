"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const handleSearch = () => {
    const currentParams = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      currentParams.set('search', searchTerm);
    } else {
      currentParams.delete('search');
    }
    router.push(`/?${currentParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-600 shadow-md">
      <div className="text-2xl font-bold text-white">Assistive Learning</div>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search content..."
          className="p-2 mr-2 text-gray-800 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Search
        </button>
        <button
          onClick={() => router.push('/admin')}
          className="px-4 py-2 ml-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
        >
          Admin
        </button>
      </div>
    </nav>
  );
};

export default Navbar;