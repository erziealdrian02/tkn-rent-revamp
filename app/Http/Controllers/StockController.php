<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EquipmentStock;

class StockController extends Controller
{
    public function index()
    {
        $stocks = EquipmentStock::with(['equipment', 'branch'])->get();
        return view('stock.stock-index', compact('stocks'));
    }
}
