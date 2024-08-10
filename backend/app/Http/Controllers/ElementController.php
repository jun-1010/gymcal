<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Element;

class ElementController extends Controller
{
    public function index()
    {
        // データベースから全ての要素を取得
        $elements = Element::all();

        // JSONでレスポンスを返す
        return response()->json([
            "elements" => $elements
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }
}