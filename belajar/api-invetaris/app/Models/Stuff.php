<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stuff extends Model
{
    use SoftDeletes; //opsional digunakan hanya untuk table yang menggunakan fitur softdeletes
    protected $fillable = ["name", "category"];

    //mendefinisikan relasi
    //table yang berperan menjadi primary key : hasOne / hasMany / ... 
    // table yang berperan sebagai foreign key : belongsTo / belongsTo
    // nama function yang disarankan menggunakan aturan berikut : 
    // 1. one to one : nama model yang terhubung versi tunggal
    // 2. one to many : nama model yang terhubung versi jamak (untuk foreign keynya)
    public function StuffStock()
    {
        return $this->hasOne(StuffStock::class); 
    }

    public function InboundStuff()
    {
        return $this->hasMany(InboundStuff::class);
    }

    public function lendings()
    {
        return $this->hasMany(Lending::class);
    }
}
