<?php

namespace App\Helpers;
// namespace : menentukan lokasi folder dari file ini

// nama class == nama file ini

class ApiFormatter {
    // variable struktur data yang akan ditampilkan di response postman
    protected static $response = [
        "status" => NULL,
        "message" => NULL,
        "data" => NULL,
    ];

    public static function sendresponse($status = NULL, $message = NULL, $data = [])
    {
        self::$response['status'] = $status;
        self::$response['message'] = $message;
        self::$response['data'] = $data;
        return response()->json(self::$response, self::$response['status']);
        // status : http status code (200, 400, 500)
        // message : desc http status code ('success', 'bad request', 'server error')
        // data : hasil yang diambil dari database
    }
}
