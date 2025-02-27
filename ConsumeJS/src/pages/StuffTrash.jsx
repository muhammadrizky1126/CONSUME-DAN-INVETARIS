import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import axios from "axios";

export default function StuffTrash() {

    const dataThParent = [
        "#",
        "Name",
        "Category",
        "Action",
    ]

    const [stuffs, setStuffs] = useState({});


    useEffect(() => {
        axios.get('http://localhost:5555/stuffs/trash', {
            headers: {
                'Authorization': 'bearer ' + localStorage.getItem('access_token'),
            }
        })
            .then(res => {
                setStuffs(res.data.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const coloumDataBase = { // props
        "name": null,
        "category": null,
       
    }

    const button = [
        "restore",
        "permanent-delete"
    ]

    const endpoints = {
       "restore": "http://localhost:5555/stuffs/trash/restore/{id}",
       "permanent-delete": "http://localhost:5555/stuffs/trash/permanent-delete/{id}",  


    }

    const coloumnDetailModalDelete = ''

    const judulModalEdit = ''

    const inputData = {}

    return(
        <>
            <Navbar/>
            <Table dataTh={dataThParent}
                    dataTd={stuffs}
                    coloumDB={coloumDataBase}
                    buttonData={button}
                    endpoints={endpoints}
                    coloumnDetail={coloumnDetailModalDelete}
                    judulModalEdit={judulModalEdit}
                    inputData={inputData}
                ></Table>
                <div className="overflow-x-auto">
                    <table className="w-full- table-auto">
                        <thead>
                            <tr>
                                <th scope="col" className="border px-4 py-2 text-white">category</th>
                            </tr>
                        </thead>
                        
                    </table>
                </div>
        </>
    )
} 