import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormField from '../components/FormField';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await axios.post('/api/auth/signup', { name, email, password });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <FormField label="Name" name="name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
                <FormField label="Email" name="email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" />
                <FormField label="Password" name="password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-4">Sign Up</button>
                <div className="mt-4 text-center">
                    <a href="/" className="text-blue-600 hover:underline">Already have an account? Login</a>
                </div>
            </form>
        </div>
    );
}
