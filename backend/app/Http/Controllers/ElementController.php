<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ElementController extends Controller
{
  public function index()
  {
    return response()->json(
      [
        "elements" => [
          [
            "id" => 1,
            "event" => 1,
            "element_group" => 3,
            "name" => "後方抱え込み2回宙返り3回ひねり",
            "alias" => "リジョンソン",
            "difficulty" => 7,
            "row_number" => 1
          ],
          [
            "id" => 2,
            "event" => 1,
            "element_group" => 4,
            "name" => "前方伸身宙返り3回ひねり",
            "alias" => "シライ2",
            "difficulty" => 6,
            "row_number" => 2
          ]
        ]
      ],
      200,
      [],
      JSON_UNESCAPED_UNICODE //文字化け対策
    );
  }
}
