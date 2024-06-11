import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserCreate() {
    const [forms, setForms] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });

    const [error, setError] = useState(null); // Mengubah initial state error menjadi null
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const instance = axios.create({
        baseURL: 'http://localhost:5173', // Sesuaikan baseURL dengan URL server Anda
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setForms(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateUser = (event) => {
        event.preventDefault();

        instance.post('users/create', forms)
            .then(res => {
                setError(null); // Menghapus pesan error ketika sukses
                setSuccess(true);
                setTimeout(() => {
                    navigate('/user');
                }, 2000);
            })
            .catch(err => {
                console.log("Error response:", err.response);
                setError('Terjadi kesalahan saat membuat user. Silakan coba lagi.'); // Mengubah pesan error menjadi string
            });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-800">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-8">
                <div className="mb-6 text-center">
                    <h5 className="text-3xl font-medium text-gray-900 dark:text-white">Create User</h5>
                </div>
                {success && (
                    <div role="alert" className="mb-4">
                        <div className="bg-green-500 text-white font-bold rounded-t px-4 py-2">
                            Berhasil!
                        </div>
                        <div className="border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700">
                            User berhasil dibuat.
                        </div>
                    </div>
                )}
                {error && ( // Mengubah kondisi error menjadi null atau tidak null
                    <div role="alert" className="mb-4">
                        <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                            Gagal!
                        </div>
                        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                            <ul>
                                <li>{error}</li> {/* Menggunakan pesan error langsung */}
                            </ul>
                        </div>
                    </div>
                )}
                <form onSubmit={handleCreateUser}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                            <input type="text" id="username" name="username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ketik Username" required onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                            <input type="email" id="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ketik Email" required onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" id="password" name="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ketik Password" required onChange={handleInputChange} />
                        </div>
                        <div>
                            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                            <input type="text" id="role" name="role" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ketik Role" required onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
