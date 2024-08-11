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
                'event' => $row[1],
                'element_group' => $row[2],
                'name' => $row[3],
                'alias' => $row[4],
                'difficulty' => $row[5],
                'row_number' => $row[6],
            ]);
        }
    }
}