<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    protected $guarded = [];

    public function table()
    {
        return $this->belongsTo(GuestTable::class, 'table_id');
    }
}
