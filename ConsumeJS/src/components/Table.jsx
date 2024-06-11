import React, { useState } from "react";
import ModalDelete from "./ModalDelete";
import ModalEdit from "./ModalEdit";
import ModalAdd from "./ModalAdd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Table({ dataTh, dataTd, coloumDB, buttonData, endpoints, coloumnDetail, judulModalEdit, inputData }) {
    const [endpointsReplaced, setEndpointsrReplaced] = useState({});
    const [isOpenModalDelete, setisOpenModalDelete] = useState(false);
    const [isOpenModalEdit, setisOpenModalEdit] = useState(false);
    const [isOpenModalAdd, setisOpenModalAdd] = useState(false);


    function handleModalEdit(id) {

        const endpointsDetail = endpoints['detail'];
        const endpointsUpdate = endpoints['update'];
        //replace/ganti {id} dari endpoint dgn id yg di klik
        const detailReplaced = endpointsDetail.replace('{id}', id);
        const updateReplaced = endpointsUpdate.replace('{id}', id);
        //simpan di object baru
        const replaced = {
            "detail": detailReplaced,
            "update": updateReplaced
        }
        //kirim ke state
        setEndpointsrReplaced(replaced);
        // ubah state agar modal tampil
        setisOpenModalEdit(true);

    }

    const navigate = useNavigate();


    function handleModalDelete(id) {

        const endpointsDetail = endpoints['detail'];
        const endpointsDelete = endpoints['delete'];
        //replace/ganti {id} dari endpoint dgn id yg di klik
        const detailReplaced = endpointsDetail.replace('{id}', id);
        const deleteReplaced = endpointsDelete.replace('{id}', id);
        //simpan di object baru
        const replaced = {
            "detail": detailReplaced,
            "delete": deleteReplaced
        }
        //kirim ke state
        setEndpointsrReplaced(replaced);
        // ubah state agar modal tampil
        setisOpenModalDelete(true);

    }

    function handleModalAdd() {
        const replaced = {
            "create" : endpoints['create']
        }
        setEndpointsrReplaced(replaced)
        setisOpenModalAdd(true)
    }

    function handleRestore(id) {
        let endpointRestore = endpoints['restore'].replace("{id}", id);
        axios.get(endpointRestore, {
            headers: {
                'Authorization': 'bearer ' + localStorage.getItem('access_token')
            }
        })
            .then(res => {
                navigate('/stuff')
            })
            .catch(err => {
                console.log(err);
            })
    }

    function handlePermanetDelete(id) {
        let endpointPermanentDelete = endpoints['permanent-delete'].replace("{id}", id);
        axios.get(endpointPermanentDelete, {
            headers: {
                'Authorization': 'bearer ' + localStorage.getItem('access_token')
            }
        })
            .then(res => {
                navigate('/stuff')
            })
            .catch(err => {
                console.log(err);
            })
    }



    return (
        <>
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg px-20 py-10">

              <div className="flex justify-center mb-5 space-x-2" text="center">
    {
        buttonData.includes("create") ? (
            <button onClick={handleModalAdd} type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-green-200 hover:text-green-200 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-green-600 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-green-500 dark:hover:text-white dark:focus:ring-gray-700">Create</button>
        ) : ''
    }
    {
        buttonData.includes("trash") ? (
            <Link to={"/stuff/trash"} className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-yellow-200 hover:text-yellow-800 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:bg-yellow-600 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-yellow-500 dark:hover:text-white dark:focus:ring-gray-700">Trash</Link>
        ) : ''
    }
</div>

                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {
                               dataTh.map((data, Index) =>
                                    <th scope="col" class="px-6 py-3" key={Index}>{data}</th>
                                )
                            }

                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.entries(dataTd).map(([index, value]) => (
                                <tr
                                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">

                                    <td class="px-6 py-4 text-right">{parseInt(index) + 1}.</td>
                                    {
                                        Object.entries(coloumDB).map(([i, v]) => (
                                            <td class="px-6 py-4">
                                                {
                                                    !v ? value[i] : value[i.replace(/[!@#$%^&]/, '')] ? value[i.replace(/[!@#$%^&]/, '')][v] : '0'
                                                }
                                            </td>
                                        ))
                                    }
                                    
                                    <td class="px-6 py-4 text-right">
                                        {
                                            buttonData.includes("edit") ? (
                                                <a onClick={() => handleModalEdit(value.id)} href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">edit</a>

                                            ) : ''

                                        }

                                        {
                                            buttonData.includes("delete") ? (
                                                <a onClick={() => handleModalDelete(value.id)} href="#" class="font-medium text-red-600 dark:text-red-500 hover:underline ml-3">delete</a>
                                            ) : ''

                                        }
                                    </td>


                                    <td class="px-6 py-4">
                                        {
                                            buttonData.includes("restore") ? (
                                                <a href="#" lick={() => handleRestore(value.id)} class="font-medium text-green-600 dark:text-green-500 hover:underline">Restore</a>

                                            ) : ''

                                        }

                                        {
                                            buttonData.includes("permanent-delete") ? (
                                                <a onClick={() => handlePermanetDelete(value.id)} href="#" class="font-medium text-red-600 dark:text-red-500 hover:underline ml-3">Premanen Dtelete</a>
                                            ) : ''

                                        }
                                    </td>
                                </tr>
                            ))
                        }


                    </tbody>
                </table>



            </div>
            <ModalDelete isOpen={isOpenModalDelete} closeModal={() => setisOpenModalDelete(false)} endpoints={endpointsReplaced} coloumnDetail={coloumnDetail} ></ModalDelete>
            <ModalEdit isOpen={isOpenModalEdit} closeModal={() => setisOpenModalEdit(false)} judulModal={judulModalEdit} inputData={inputData} endpoints={endpointsReplaced}></ModalEdit>
            <ModalAdd isOpen={isOpenModalAdd} closeModal={() => setisOpenModalAdd(false)} judulModal={judulModalEdit} inputData={inputData} endpoints={endpoints}></ModalAdd>
        </>
    )
}