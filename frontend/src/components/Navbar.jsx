import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-white shadow px-4 py-2 flex justify-between items-center">
            <Link to="/dashboard" className="text-xl font-bold text-blue-600">Resume Platform</Link>
            <div>
                <Link to="/dashboard" className="mx-2 text-gray-700 hover:text-blue-600">Dashboard</Link>
                <Link to="/resume/new" className="mx-2 text-gray-700 hover:text-blue-600">New Resume</Link>
                <Link to="/" className="mx-2 text-gray-700 hover:text-blue-600">Logout</Link>
            </div>
        </nav>
    );
}
