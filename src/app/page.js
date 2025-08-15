"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  const fetchContent = async (search = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) {
        params.set('search', search);
      }
      const res = await fetch(`/api/content?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setContent(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(searchTerm);
  }, [searchTerm]);

  return (
    <div className="min-h-screen py-2 bg-gray-100">
      <main className="container p-4 mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center text-gray-800">
          Discover Learning Materials
        </h1>

        {loading && <p className="text-center text-gray-600">Loading content...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && !error && content.length === 0 && (
          <p className="text-center text-gray-600">No content found. Try adjusting your search.</p>
        )}

        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {content.map((item) => (
            <div key={item._id} className="p-6 transition-shadow duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
              <h2 className="mb-2 text-xl font-semibold text-gray-900">{item.title}</h2>
              <p className="mb-4 text-gray-700">{item.description}</p>
              <div className="text-sm text-gray-600">
                <p><strong>Subject:</strong> {item.subject}</p>
                <p><strong>Grade:</strong> {item.grade}</p>
                <p><strong>Learning Goal:</strong> {item.learningGoal}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}