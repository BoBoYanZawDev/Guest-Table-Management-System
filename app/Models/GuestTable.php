<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuestTable extends Model
{
    protected $guarded = [];

    public function guests()
    {
        return $this->hasMany(Guest::class, 'table_id');
    }
}
