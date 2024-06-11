<?php

namespace App\Http\Controllers;

use App\Helpers\ApiFormatter;
use App\Models\InboundStuff;
use App\Models\Lending;
use App\Models\Stuff;
use App\Models\StuffStock;
use Illuminate\Http\Request;

class StuffController extends Controller
{
    public function __construct()
    {
        
        $this->middleware('auth:api');
    }
    // memunculkan semua data
    public function index()
    {
    try {
           // ambil data yang mau ditampilkan
           $data = Stuff::with('stuffStock')->get();

           return ApiFormatter::sendresponse(200, 'success', $data);

    } catch (\Exception $err) {
        return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    }
 }

 // untuk menambah data 
 public function store(Request $request)
 {
    try {
       // validasi
       $this->validate($request, [
        'name' => 'required',
        'category' => 'required'
    ]);
 // proses tambah data 
 // namamodel::create(['column' => $request->name_or_key,])
     $prosesData = Stuff::create([
        'name' => $request->name,
        'category' => $request->category
     ]);

     return ApiFormatter::sendresponse(200, 'success', $prosesData);

    } catch (\Exception $err) {
        return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    }
 }

// $id : dari route yang ada {}
// untuk melihat data yg ada sesuai id
public function show($id)
{
   try {
    $data = Stuff::where('id', $id)->first();
    //first() : kalau tidak ada data, tetap success tapi data nya kosong
    // firstOrFail() : kalau tidak ada data, muncul error
    // find() : mencari berdasarkan primary key
    // where() : mencari column spesifik tertentu
    // $data = Stuff::find($id)
    return ApiFormatter::sendresponse(200, 'success', $data);
   } catch (\Exception $err) {
     return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
   }
}

// request : data yang dikirim
// $id : data yg akan diupdate, dari route{}
public function update(Request $request, $id)
{
    try {
        $this->validate($request, [
         'name' => 'required',
        'category' => 'required'
        ]);
    

        $checkProses = Stuff::where('id', $id)->update([
        'name' => $request->name,
        'category' => $request->category,
        ]);

     if ($checkProses) {
        // ::create([]) : menghasilkan data yang ditambah
        // ::update([]) : menghasilkan boolean, jadi buat diambil data terbaru dicari lagi
         $data = Stuff::where('id', $id)->first();
         return ApiFormatter::sendresponse(200, 'success', $data);
     }
    // else {
    //     return  ApiFormatter::sendresponse(400, 'bad request', 'gagal mengubah data', );
    //  }
    

    } catch (\exception $err) {
        return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    }
}


public function destroy($id)
{
    // try {
    //     $checkProses = Stuff::where('id', $id)->delete();

    //     if ($checkProses){


    //         return ApiFormatter::sendresponse(200, 'success', 'berhasil menghapus data stuff');
    //     }
    // } catch (\Exception $err) {
    //     return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    // }
   
    try {
        $stuff = Stuff::where('id', $id)->with('inboundStuff')->first();

        if (count($stuff['inboundStuff']) > 0) {
            return ApiFormatter::sendResponse(400, 'bad request', 'Tidak dapat menghapus data stuff yang memiliki relasi dengan data inbound stuff!');
        }
        $checkProsess = $stuff->delete();

        if ($checkProsess) {
            return ApiFormatter::sendResponse(200, 'success', 'Berhasil hapus data stuff!');
        }
    } catch (\Exception $err) {
        return ApiFormatter::sendResponse(400, 'bad request', $err->getMessage());
    }}


    

public function trash()
{
    try {
        // onlyTrashed() : memanggil data sampah/ yang sudah dihapus / deleted_at nya terisi
        $data = Stuff::onlyTrashed()->get();

        return ApiFormatter::sendresponse(200, 'success', $data);
    } catch (\Exception $err) {
        return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    }
}

public function restore($id)
{
    try {
        // restore : mengembilikan data yang dihapus/ menghapus deleted_at nya
        $checkRestore = Stuff::onlyTrashed()->where('id', $id)->restore();

        if($checkRestore) {
            $data = Stuff::where('id', $id)->first();
            return ApiFormatter::sendresponse(200, 'success', $data);
        }
    } catch (\Exception $err) {
         return  ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    }
}

public function permanentDelete($id)
{
    // forceDelete() : menghapus permanen (hilang juga data di databasenya)
    try {
      $checkPermanentDelete = Stuff::onlyTrashed()->where('id', $id)->forceDelete();
      if ($checkPermanentDelete) {
        return ApiFormatter::sendresponse(200, 'success', 'berhasil menghapus permanen data stuff');
      }
    } catch (\Exception $err) {
        return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    }
}
}