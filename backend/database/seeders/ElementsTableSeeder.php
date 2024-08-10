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
                'event' => $row[0],
                'element_group' => $row[1],
                'name' => $row[2],
                'alias' => $row[3],
                'difficulty' => $row[4],
                'row_number' => $row[5],
            ]);
        }
    }
}