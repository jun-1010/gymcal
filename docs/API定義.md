# ■ API 定義

## ■ 技データ取得 API

**Elements テーブル** の全データを取得します。

### ■ リクエスト

- メソッド: `GET`
- URI: `http://gymcal.jp/api/elements`
- データ: なし

- サンプルリクエスト

  ```bash
  curl -X GET http://gymcal.jp/api/elements
  ```

### ■ レスポンス

- データ形式: JSON
- サンプルレスポンス

  ```json
  {
    "elements": [
        {
        "id": 1,
        "code": "I1",
        "event": 1,
        "element_group": 1,
        "name": "倒立から下ろして(開脚前挙or脚前挙)支持(2秒)",
        "alias": "",
        "difficulty": 1,
        "row_number": 1,
        "column_number": 1,
        "start_direction": "",
        "end_direction": "",
        "element_type": "3"
        },
        (省略)
        {
        "id": 831,
        "code": "IV64",
        "event": 6,
        "element_group": 4,
        "name": "大伸身とび越し2回ひねり下り",
        "alias": "",
        "difficulty": 4,
        "row_number": 13,
        "column_number": 4,
        "start_direction": "",
        "end_direction": "",
        "element_type": ""
        }
    ]
  }
  ```
