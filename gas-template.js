/**
 * Google Apps Script テンプレート
 * 
 * 1. スプレッドシートを作成し、メニューの「拡張機能」>「Apps Script」を開く
 * 2. このコードをエディタに貼り付ける
 * 3. 画面右上の「デプロイ」>「新しいデプロイ」をクリック
 * 4. 種類を「ウェブアプリ」にし、アクセスできるユーザーを「全員」にしてデプロイ
 * 5. 発行されたURLをアプリに入力する
 */

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  // シートが空の場合、ヘッダーを作成
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Latitude",
      "Longitude",
      "Speed (km/h)",
      "Acc X",
      "Acc Y",
      "Acc Z",
      "Bad Ride Event"
    ]);
  }

  // データの追加
  const isArray = Array.isArray(data);
  const rows = isArray ? data : [data];

  const values = rows.map(row => [
    row.timestamp,
    row.lat,
    row.lon,
    row.speed,
    row.accX,
    row.accY,
    row.accZ,
    row.badRide ? "YES" : ""
  ]);

  if (values.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
  }

  return ContentService.createTextOutput("Success");
}
