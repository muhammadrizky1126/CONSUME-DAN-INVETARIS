import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";

export default function User() {
    const [user, setUser] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const instance = axios.create({
        baseURL: 'http://localhost:8000/',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });

    useEffect(() => {
        instance.get('users')
            .then(res => {
                setUser(res.data.data);
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    navigate('/login?message=' + encodeURIComponent('Anda Belum Login!'));
                } else {
                    setError('Terjadi kesalahan saat memuat daftar user.');
                }
            });
    }, [navigate]);

    const deleteUser = (id) => {
        instance.delete(`users/destroy/${id}`)
            .then(() => {
                setUser(user.filter(user => user.id !== id));
                setSuccess('User berhasil dihapus.');
                setTimeout(() => {
                    setSuccess('');
                }, 2000);
            })
            .catch(() => {
                setError('Gagal menghapus user.');
            });
    };

    return (

        <>
             <Navbar/>

        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-5">
            <div className="m-5 pb-10 pt-10">
                <div className="flex flex-col items-center">
                    <h5 className="mb-4 text-3xl font-medium">User</h5>
                    <div className="flex justify-center mb-5 space-x-2">
                        <Link to="/user/create">
                            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-green-100 hover:text-green-100 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-green-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-green-700 dark:hover:text-white dark:focus:ring-gray-700">
                                <small className="text-white">Create</small>
                                <FontAwesomeIcon icon={faPlus} className="pl-1 w-4 h-4 text-inherit" />
                            </button>
                        </Link>
                        <Link to="/user/trash">
                            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-yellow-100 hover:text-yellow-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-red-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-red-700 dark:hover:text-white dark:focus:ring-gray-700">
                                <small className="text-white">Trash</small>
                                <FontAwesomeIcon icon={faTrash} className="pl-1 w-4 h-4 text-inherit" />
                            </button>
                        </Link>
                    </div>
                </div>

                {success && (
                    <div role="alert">
                        <div className="bg-green-500 text-white font-bold rounded-t px-4 py-2">
                            Berhasil!
                        </div>
                        <div className="border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700">
                            {success}
                        </div>
                    </div>
                )}

                <div className="flex mt-4 md:mt-6">
                    <table className="min-w-full text-left text-sm font-light">
                        <thead className="border-b font-medium text-xs text-white uppercase bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-4">No</th>
                                <th scope="col" className="px-6 py-4">Username</th>
                                <th scope="col" className="px-6 py-4">Email</th>
                                <th scope="col" className="px-6 py-4">Role</th>
                                <th scope="col" className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {user.map((user, index) => (
                                <tr key={user.id} className="border-b border-neutral-500">
                                    <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{user.username}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{user.role}</td>
                                    <td className="whitespace-nowrap px-6 py-4 flex space-x-2">
                                        <Link to={`/user/edit/${user.id}`}>
                                            <button className="px-4 py-2 bg-orange-500 rounded-lg font-bold text-white">Edit</button>
                                        </Link>
                                        <button onClick={() => deleteUser(user.id)} type="button" className="px-4 py-2 bg-red-500 rounded-lg font-bold text-white">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {error && (
                    <div role="alert" className="mt-4">
                        <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                            Gagal!
                        </div>
                        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                            {error}
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}
