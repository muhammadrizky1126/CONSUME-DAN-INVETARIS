<?php

namespace App\Http\Controllers;

use App\Helpers\ApiFormatter;
use Illuminate\Http\Request;
use App\Models\StuffStock;
use App\Models\Lending;
use App\Models\Restoration;

class RestorationController extends Controller
{
    public function __construct()
    {
        
        $this->middleware('auth:api');


    }

    public function store (Request $request, $lending_id)
    {
        try {
            $this->validate($request, [
                'date_time' => 'required',
                'total_good_stuff' => 'required', 
                'total_defec_stuff' => 'required'
            ]);

            $lending = Lending::where('id', $lending_id)->first();
            //mendata jumlah masukan barang kembali yang bagus dan rusak
            $totalStuffRestoration = (int)$request->total_good_stuff + (int) $request->total_defec_stuff;
            // mengecek apakah jumlah barang dikembalikan > jumlah ketika meminjam
            if((int)$totalStuffRestoration > (int)$lending['total_stuff']) {
                return ApiFormatter::sendresponse(400, 'bad request', 'total barang kembali lebih banyak dari barang dipinjami!');

            }else { 
                // updateOrCreate : kalo udah ada data lending_id nya bakal diupdate datanya, kalo belum ada datanya ya di bikinin
                $restoration = Restoration::updateOrCreate([
                    'lending_id' => $lending_id
                ], [
                    'date_time' => $request->date_time,
                    'total_good_stuff' => $request->total_good_stuff,
                    'total_defec_stuff' => $request->total_defec_stuff,
                    'user_id' => auth()->user()->id,
                ]);

                $stuffStock = StuffStock::where('stuff_id', $lending['stuff_id'])->first();
                // menghitung data baru yang akan dimasukkan 
                $totalAvailableStock = (int)$stuffStock['total_available'] + (int)$request->total_good_stuff;
                // total data stuff 
                $totalDefecStock = (int)$stuffStock['total_defec'] + (int)$request->total_defec_stuff;
                $stuffStock->update([
                    'total_available' => $totalAvailableStock,
                    'total_defect' => $totalDefecStock,
                ]);

                $lendingRestoration = Lending::where('id', $lending_id)->with('user', 'restoration', 'restoration.user', 'stuff', 'stuff.stuffStock')->first();
                return ApiFormatter::sendresponse(200, 'success', $lendingRestoration);
            }
        } catch (\Exception $err) {
            return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
        }
    }
}
