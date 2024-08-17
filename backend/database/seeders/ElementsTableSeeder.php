<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ElementsTableSeeder extends Seeder
{
    public function run(): void
    {
        // CSVファイルを読み込む
        $file = Storage::path('elements.csv');
        $csvData = array_map('str_getcsv', file($file));

        // CSVのヘッダー行を削除
        $header = array_shift($csvData);

        // 各行を処理してデータベースに挿入
        foreach ($csvData as $row) {
            DB::table('elements')->insert([
                'id' => $row[0],  // IDをCSVから取得
                'code' => $row[1],
                'event' => $row[2],
                'element_group' => $row[3],
                'name' => $row[4],
                'alias' => $row[5],
                'difficulty' => $row[6],
                'row_number' => $row[7],
                'column_number' => $row[8],
                'start_direction' => $row[9],
                'end_direction' => $row[10],
                'element_type' => $row[11],
            ]);
        }
    }
}
