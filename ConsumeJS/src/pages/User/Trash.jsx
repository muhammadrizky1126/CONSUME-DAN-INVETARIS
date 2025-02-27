import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashRestore, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

export default function UserTrash() {
    const [trashedUsers, setTrashedUsers] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const instance = axios.create({
        baseURL: 'http://localhost:5555/',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });

    useEffect(() => {
        instance.get('user/trash')
            .then(res => {
                setTrashedUsers(res.data.data);
            })
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    navigate('/login?message=' + encodeURIComponent('Anda Belum Login!'));
                } else {
                    setError('Terjadi kesalahan saat memuat daftar user.');
                }
            });
    }, [navigate]);

    const restoreUser = (id) => {
        instance.put(`user/restore/${id}`)
            .then(() => {
                setTrashedUsers(trashedUsers.filter(user => user.id !== id));
                setSuccess('User berhasil dipulihkan.');
                setTimeout(() => {
                    setSuccess('');
                }, 2000);
            })
            .catch(() => {
                setError('Gagal memulihkan user.');
            });
    };

    const deleteUserPermanently = (id) => {
        instance.delete(`user/permanent/${id}`)
            .then(() => {
                setTrashedUsers(trashedUsers.filter(user => user.id !== id));
                setSuccess('User berhasil dihapus permanen.');
                setTimeout(() => {
                    setSuccess('');
                }, 2000);
            })
            .catch(() => {
                setError('Gagal menghapus user secara permanen.');
            });
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-5">
            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-6">
                <div className="mb-6">
                    <h5 className="text-3xl font-medium text-gray-900 dark:text-white">Trash User</h5>
                </div>

                {success && (
                    <div role="alert" className="mb-4">
                        <div className="bg-green-500 text-white font-bold rounded-t px-4 py-2">
                            Berhasil!
                        </div>
                        <div className="border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700">
                            {success}
                        </div>
                    </div>
                )}

                {error && (
                    <div role="alert" className="mb-4">
                        <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                            Gagal!
                        </div>
                        <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                            {error}
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm font-light">
                        <thead className="border-b font-medium dark:border-neutral-500 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-4">No</th>
                                <th scope="col" className="px-6 py-4">Username</th>
                                <th scope="col" className="px-6 py-4">Email</th>
                                <th scope="col" className="px-6 py-4">Role</th>
                                <th scope="col" className="px-6 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trashedUsers.map((user, index) => (
                                <tr key={user.id} className="border-b dark:border-neutral-500">
                                    <td className="whitespace-nowrap px-6 py-4">{index + 1}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{user.username}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                                    <td className="whitespace-nowrap px-6 py-4">{user.role}</td>
                                    <td className="whitespace-nowrap px-6 py-4 flex space-x-2">
                                        <button onClick={() => restoreUser(user.id)} type="button" className="px-4 py-2 bg-green-500 rounded-lg font-bold text-white flex items-center">
                                            <FontAwesomeIcon icon={faTrashRestore} className="mr-1" /> Restore
                                        </button>
                                        <button onClick={() => deleteUserPermanently(user.id)} type="button" className="px-4 py-2 bg-red-500 rounded-lg font-bold text-white flex items-center">
                                            <FontAwesomeIcon icon={faTrashAlt} className="mr-1" /> Hapus Permanen
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
