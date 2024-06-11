<?php

namespace App\Http\Controllers;
use App\Models\InboundStuff;
use App\Models\Stuff;
use App\Helpers\ApiFormatter;
use App\Models\StuffStock;
use Illuminate\Http\Request;
use Illuminate\Support\str;



class InboundStuffController extends Controller
{
    public function __construct()
    {
        
        $this->middleware('auth:api');
    }
   public function store(Request $request)
   {
    try {
        $this->validate($request, [
            'stuff_id' => 'required',
            'total' => 'required',
            'date' => 'required',
            // proof_file : type file image (jpg, jpeg, svg, png, webp)
            "proof_file" => 'required|image' 
        ]);
        // $request->file() : ambil data yang tipe nya file
        // getClientOriginalName() : ambil nama asli dari file yang di upload
        // str::random(jumlah_karakter) : generate random karakter sebanyak jumlah
        $nameImage = str::random(5) . "_" . $request->file('proof_file')->getClientOriginalName();
        // move() : memindahkan file yang di upload ke folder public dan nama filenya mau apa
        $request->file('proof_file')->move('upload-images', $nameImage);
        // ambil url untuk menampilakn gambarnya 
        $pathImage = url('upload-images/' , $nameImage);
         
        $inboundData = InboundStuff::create([
            'stuff_id' => $request->stuff_id,
            'total' => $request->total,
            'date' => $request->date,
            // yang dimasukkan 
            'proof_file' => $pathImage,
         ]);

         if($inboundData) {
            $stockData = StuffStock::where('stuff_id', $request->stuff_id)->first();
            if ($stockData) {
              $total_available = (int)$stockData['total_available'] + (int)$request->total; // (int) : memastikan kalau dia integer, kalu bukan integer diubah jadi integer
            //   $total_available = intval($stockData['total_available']) + intval($request->total);
              $stockData->update([ 'total_available' => $total_available]); 
            } else {// kalau stock nya belum ada, dibuat
                StuffStock::create([
                    'stuff_id' => $request->stuff_id,
                    'total_available' => $request->total, // total_available nya dari inputan total inbound
                    'total_defec' => 0
                ]);

            }
            //ambil data mulai dari stuff, inboundStuffs, dan stuffStock dari stuff_id terkait 
            $stuffwithinboundAndstock = Stuff::where('id',$request->stuff_id)->with('InboundStuff', 'StuffStock')->first();
            return Apiformatter::sendResponse(200, 'success', $stuffwithinboundAndstock);

         }

    } catch (\Exception $err) {
        return Apiformatter::sendResponse(400, 'bad request', $err->getmessage());

    }
   }

// public function store(Request $request)
// {
//     try {
//         $this->validate($request, [
//             'stuff_id' => 'required',
//             'total' => 'required',
//             'date' => 'required',
//             'proof_file' => 'required|image' 
//         ]);

//         $nameImage = Str::random(5) . "_" . $request->file('proof_file')->getClientOriginalName();
//         $request->file('proof_file')->move('upload-images', $nameImage);
//         $pathImage = url('upload-images/' , $nameImage);
         
//         $inboundData = InboundStuff::create([
//             'stuff_id' => $request->stuff_id,
//             'total' => $request->total,
//             'date' => $request->date,
//             'proof_file' => $pathImage,
//          ]);

//          if ($inboundData) {
//             $stockData = StuffStock::where('stuff_id', $request->stuff_id)->first();
//             if ($stockData) {
//                 $total_available = (int)$stockData->total_available + (int)$request->total;
//                 $stockData->update(['total_available' => $total_available]); 
//             } else {
//                 StuffStock::create([
//                     'stuff_id' => $request->stuff_id,
//                     'total_available' => $request->total,
//                     'total_defec' => 0
//                 ]);
//             }

//             $stuffWithinboundAndStock = Stuff::where('id', $request->stuff_id)->with('InboundStuff', 'StuffStock')->first();
//             return ApiFormatter::sendResponse(200, 'success', $stuffWithinboundAndStock);
//          } else {
//             return ApiFormatter::sendResponse(400, 'bad request', 'Failed to create inbound stuff data.');
//          }

//     } catch (\Exception $err) {
//         return ApiFormatter::sendResponse(400, 'bad request', $err->getMessage());
//     }
// }


//    public function destroy($id)
//    {
//     try {
//        $inboundData = InboundStuff::where('id', $id)->first();
//        //simpan data dari inbound yang diperlukan / akan digunakan nanti setelah delete
//        $stuffId = $inboundData['stuff_id'];
//        $totalInbound = $inboundData['total'];
//        $inboundData->delete();
        

//         $dataStock = StuffStock::where('stuff_id', $inboundData['stuff_id'])->first();
//         $total_available = (int)$dataStock['total_available'] - (int)$totalInbound;

//         $minusTotalStock = $dataStock->update(['total_available' => $total_available]);
       
//        if ($minusTotalStock) {
//       $updatedStuffWithInboundAndStock = Stuff::where('id', $stuffId)->with('InboundStuff', 'StuffStock')->first();
//       //delete inbound terakhir agar data stuff_id di inbound bisa digunakan untuk mengambil data terbaru
      
//       return ApiFormatter::sendresponse(200, 'success', $updatedStuffWithInboundAndStock);
//        }
//     } catch (\Exception $err) {
//         return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage()); 
//     }
//    }

public function destroy($id)
{
    try {
        $inboundData = InboundStuff::where('id', $id)->first();
        
        // Simpan data dari inbound yang diperlukan / akan digunakan nanti setelah delete
        $stuffId = $inboundData['stuff_id'];
        $totalInbound = $inboundData['total'];
        
        // Get StuffStock data
        $dataStock = StuffStock::where('stuff_id', $inboundData['stuff_id'])->first();
        $totalAvailable = (int)$dataStock['total_available'];
        
        // Check if total_available is greater than or equal to total_inbound
        if ($totalAvailable >= $totalInbound) {
            // Delete InboundStuff
            $inboundData->delete();
            
            // Update total_available in StuffStock
            $totalAvailable -= (int)$totalInbound;
            $dataStock->update(['total_available' => $totalAvailable]);
            
            // Fetch updated data for response
            $updatedStuffWithInboundAndStock = Stuff::where('id', $stuffId)->with('InboundStuff', 'StuffStock')->first();
            
            // Return success response
            return ApiFormatter::sendresponse(200, 'success', $updatedStuffWithInboundAndStock);
        } else {
            // Return error response if total_available is less than total_inbound
            return ApiFormatter::sendresponse(400, 'bad request', 'jumlah total inbound yang akan dihapus lebih besar dari total available stuff saat ini .');
        }
    } catch (\Exception $err) {
        // Return error response for any exceptions
        return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage()); 
    }
}

   
   public function trash()
   {
       try {
           // onlyTrashed() : memanggil data sampah/ yang sudah dihapus / deleted_at nya terisi
           $trashData = InboundStuff::onlyTrashed()->get();
   
           return ApiFormatter::sendresponse(200, 'success', $trashData);
       } catch (\Exception $err) {
           return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
       }
   }

   
   public function restore($id)
   {
       try {
           // Temukan data yang akan direstorasi dari trash
           $restoredData = InboundStuff::onlyTrashed()->findOrFail($id);
   
           // Simpan data yang diperlukan
           $stuffId = $restoredData->stuff_id;
           $totalInbound = $restoredData->total;
   
           // Lakukan restore pada model InboundStuff
           $restoredData->restore();
   
           // Perbarui total_available di tabel stuff_stocks
           $stuffStock = StuffStock::where('stuff_id', $stuffId)->firstOrFail();
           $stuffStock->total_available += $totalInbound;
           $stuffStock->save();
   
           // Ambil data terbaru dari Stuff dengan InboundStuff dan StuffStock terkait
           $updatedStuffWithInboundAndStock = Stuff::where('id', $stuffId)
               ->with('InboundStuff', 'StuffStock')
               ->first();
   
           return ApiFormatter::sendresponse(200, 'success', $updatedStuffWithInboundAndStock);
       } catch (\Exception $err) {
           return ApiFormatter::sendresponse(400, 'bad request', $err->getMessage());
       }
   }
   
   public function deletePermanent(InboundStuff $inboundStuff, Request $request, $id)
   {
       try {
           $getInbound = InboundStuff::onlyTrashed()->where('id', $id)->first();
   
           // Menghapus file terkait
           $this->deleteAssociatedFile($getInbound);
   
           // Menghapus data dari database
           $checkProses = InboundStuff::where('id', $id)->forceDelete();
   
           // Memberikan respons sukses
           return ApiFormatter::sendResponse(200, 'success', 'Data inbound-stuff berhasil dihapus permanen');
       } catch(\Exception $err) {
           // Memberikan respons error jika terjadi kesalahan
           return ApiFormatter::sendResponse(400, 'bad request', $err->getMessage());
       }
   }
   
// public function deletePermanent(InboundStuff $inboundStuff, Request $request, $id)
// {
//     try {
//         $getInbound = InboundStuff::onlyTrashed()->where('id', $id)->first();

//         // Menghapus file terkait
//         $this->deleteAssociatedFile($getInbound);

//         // Menghapus data dari database
//         $checkProses = InboundStuff::where('id', $id)->forceDelete();

//         // Memberikan respons sukses
//         return ApiFormatter::sendResponse(200, 'success', 'Data inbound-stuff berhasil dihapus permanen');
//     } catch(\Exception $err) {
//         // Memberikan respons error jika terjadi kesalahan
//         return ApiFormatter::sendResponse(400, 'bad request', $err->getMessage());
//     }
// }

   private function deleteAssociatedFile(InboundStuff $inboundStuff)
   {
       // Mendapatkan jalur lengkap ke direktori public
       $publicPath = $_SERVER['DOCUMENT_ROOT'] . '/public/upload-images';

   
       // Menggabungkan jalur file dengan jalur direktori public
        $filePath = public_path('upload-images/'.$inboundStuff->proof_file);
   
       // Periksa apakah file ada
       if (file_exists($filePath)) {
           // Hapus file jika ada
           unlink(base_path($filePath));
       }
   }
   
}


