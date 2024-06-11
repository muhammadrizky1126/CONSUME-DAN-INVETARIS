import React from "react";
import Navbar from "./components/Navbar";


export default function App() {
  return ( 
    <>
     <Navbar/>
     <div className='bg-gray-900 flex flex-col items-center justify-center min-h-screen'>
        <div className="bg-gray-800 border-t border-gray-600 shadow rounded-lg max-w-lg w-full p-6 mb-4">
          <h4 className='text-white text-2xl'>SELAMAT DATANG DI WEBSITE INVETARIS</h4>
          <p className='text-lg text-gray-400 leading-relaxed'>Kelola inventaris Anda dengan mudah dan efisien.</p>
        </div>
        <br />
        <div className="bg-gray-800 border-t border-gray-600 shadow rounded-lg max-w-lg w-full p-6">
        <h4 className='text-white text-2xl'>Tentang Sistem Inventaris Kami</h4>
            <p className='text-lg text-gray-400 leading-relaxed'>Sistem kami membantu Anda melacak tingkat stok dan lain lain</p>
        </div>
        <br />
        <div className="bg-gray-800 border-t border-gray-600 shadow rounded-lg max-w-lg w-full p-6">
        <h4 className='text-white text-2xl'>Layanan Inventaris Kami</h4>
            <p className='text-lg text-gray-400 leading-relaxed'>-Pantau tingkat stok Anda secara real-time.</p>
            <p className='text-lg text-gray-400 leading-relaxed'>-Lacak pesanan Anda dari penempatan hingga pengiriman.</p>
        </div>
        <br />
        <div className="bg-gray-800 border-t border-gray-600 shadow rounded-lg max-w-lg w-full p-6">
        <h4 className='text-white text-2xl'>HUBUNGI KAMI</h4>
        <p className='text-lg text-gray-400 leading-relaxed'>muhammadrizky@smkwikrama.sch.id.</p>
        </div>
      </div>
    </>
  )

}
