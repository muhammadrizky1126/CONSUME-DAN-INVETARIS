<?php

namespace App\Http\Controllers;
use App\Helpers\ApiFormatter;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Unique;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\bcrypt;




class UserController extends Controller
{

    public function __construct()
    {
        
        $this->middleware('auth:api');
    }
    public function index() 
    {
        try {
            $data = User::all()->toArray();

            return ApiFormatter::sendresponse(200, 'success', $data);
 
        } catch (\Exception $err) {
            return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
        }
    }

    // public function postakun(Request $request)
    // {
    //     try {
    //         // validasi
    //         $this->validate($request, [
    //             'username' => 'required|min:4|unique:users,username',
    //             'email' => 'required|unique:users,email',
    //             'password' => 'required|min:6',
    //             'role' => 'required'
    //         ]);
    
        
    //   // proses tambah 
    //   // namamodel::create(['column' => $request->name_or_key,])
    //       $prosesData = User::create([
    //          'username' => $request->username,
    //          'email' => $request->email,
    //          'password' => $request->password,
    //          'role' => $request->role,
    //       ]);
     
    //       return ApiFormatter::sendresponse(200, 'success', $prosesData);

    //      } catch (\Exception $err) {
    //          return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    //      }
    // }

//     public function postakun(Request $request)
// {
//     try {
//         // Validasi input
//         $this->validate($request, [
//             'username' => 'required|min:4|unique:users,username',
//             'email' => 'required|unique:users,email',
//             'password' => 'required|min:6', 
//             'role' => 'required'
//         ]);
     
//          $hashedPassword = bcrypt($request->password);

//         // Proses tambah pengguna
//         $prosesData = User::create([
//             'username' => $request->username,
//             'email' => $request->email,
//             'password' => $hashedPassword,
//             'role' => $request->role,
//         ]);

//         // $userData = $prosesData->toArray();


//         // Berhasil, kembalikan respons sukses
//         return ApiFormatter::sendresponse(200, 'success', $prosesData);

//     } catch (\Exception $err) {
//         // Tangani kesalahan dan kembalikan respons yang sesuai
//         return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
//     }
// }

public function postakun(Request $request)
{
    try {
        // Validasi input
        $this->validate($request, [
            'username' => 'required|min:4|unique:users,username',
            'email' => 'required|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required'
        ]);

        // Hash password menggunakan bcrypt
        $hashedPassword = hash::make($request->password);

        // Proses tambah pengguna
        $prosesData = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => $hashedPassword, // Simpan password yang sudah di-hash
            'role' => $request->role,
        ]);
       
        $userData = $prosesData->toArray();
        $userData['password'] = $hashedPassword;

        // Berhasil, kembalikan respons sukses
        return ApiFormatter::sendresponse(200, 'success', $userData);

    } catch (\Exception $err) {
        // Tangani kesalahan dan kembalikan respons yang sesuai
        return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    }
}



    
    public function show($id)
    {
   try {
    $data = User::where('id', $id)->first();
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

public function update(Request $request, $id)
{
    try {
        $this->validate($request, [
            'username' => 'required|min:4|unique:users,username',
            'email' => 'required|unique:users,email',
            'password' => 'required|min:6',
            'role' => 'required',
        ]);
    

        $checkProses = User::where('id', $id)->update([
            'username' => $request->username,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
        ]);

     if ($checkProses) {
        // ::create([]) : menghasilkan data yang ditambah
        // ::update([]) : menghasilkan boolean, jadi buat diambil data terbaru dicari lagi
         $data = User::where('id', $id)->first();
         return ApiFormatter::sendresponse(200, 'success', $data);
     }

    } catch (\exception $err) {
        return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    }
}

public function destroy($id)
{
    try {
        $checkProses = User::where('id', $id)->delete();

        if ($checkProses){
            return ApiFormatter::sendresponse(200, 'success', 'berhasil menghapus data stuff');
        }
    } catch (\Exception $err) {
        return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    }
}

public function trash()
{
    try {
        // onlyTrashed() : memanggil data sampah/ yang sudah dihapus / deleted_at nya terisi
        $data = User::onlyTrashed()->get();

        return ApiFormatter::sendresponse(200, 'success', $data);
    } catch (\Exception $err) {
        return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    }
}

public function restore($id)
{
    try {
        // restore : mengembilikan data yang dihapus/ menghapus deleted_at nya
        $checkRestore = User::onlyTrashed()->where('id', $id)->restore();

        if($checkRestore) {
            $data = User::where('id', $id)->first();
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
      $checkPermanentDelete = User::onlyTrashed()->where('id', $id)->forceDelete();
      if ($checkPermanentDelete) {
        return ApiFormatter::sendresponse(200, 'success', 'berhasil menghapus permanen data user');
      }
    } catch (\Exception $err) {
        return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
    }
}

}