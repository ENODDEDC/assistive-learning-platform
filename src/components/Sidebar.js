'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen p-4 text-white bg-gray-800">
      <h2 className="mb-6 text-2xl font-bold">Admin Menu</h2>
      <nav>
        <ul>
          <li>
            <Link
              href="/admin"
              className={`block p-2 rounded ${
                pathname === '/admin' ? 'bg-gray-700' : ''
              }`}
            >
              Dashboard
            </Link>
          </li>
          {/* Add more admin links here as needed */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;