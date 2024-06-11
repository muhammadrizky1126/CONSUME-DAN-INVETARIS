import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../components/Navbar";

export default function Profile() {
    const [profile, setProfile] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5555/profile', {
            headers: {
                'Authorization': 'bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            setProfile(res.data.data);
        })
        .catch(err => {
            console.log(err);
            if (err.response.status === 401) {
                navigate('/login?message=' + encodeURIComponent('Anda belum login'));
            }
        });
    }, [navigate]);

    const handleLogout = (event) => {
        event.preventDefault();
        axios.get('http://localhost:5555/logout', {
            headers: {
                'Authorization': 'bearer ' + localStorage.getItem('access_token'),
            }
        })
        .then(res => {
            localStorage.removeItem('access_token');
            navigate('/login');
        })
        .catch(err => {
            console.log(err);
        });



        

    }


    return (
        <>
        <Navbar/>
        <div className="container mx-auto p-4">

            
            <div className="block m-auto mt-10 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow ">
                <div className="flex flex-col items-center pb-10 pt-10">
                    {/* <FontAwesomeIcon icon="fa-solid fa-user" className="w-20 h-20 mb-3 text-gray-500" /> */}
                    <h5 className="mb-1 text-xl font-medium text-gray-900 ">
                        
                        {profile.username}
                    </h5>
                    <span className="text-sm text-gray-500 ">
                        {profile.email}

                    </span>
                    <div className="flex mt-4 md:mt-6">
                        <Link to="/dashboard" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Dashboard</Link>
                        <a href="#" onClick={handleLogout} className="py-2 px-4 ms-2 text-sm font-medium ">Logout</a>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
