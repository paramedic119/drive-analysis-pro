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
      "LatG",
      "LongG",
      "CompositeG",
      "Speed",
      "Marker"
    ]);
  }

  // データの追加
  const isArray = Array.isArray(data);
  const rows = isArray ? data : [data];

  const values = rows.map(row => [
    row.timestamp,
    row.latG,
    row.longG,
    row.compositeG,
    row.speed,
    row.badRide
  ]);

  if (values.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
  }

  return ContentService.createTextOutput("Success");
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    // No data yet
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Get all data except header
  const dataRange = sheet.getRange(2, 1, lastRow - 1, 6);
  const values = dataRange.getValues();

  // Convert to JSON
  const jsonArray = values.map(row => {
    return {
      timestamp: row[0],
      latG: parseFloat(row[1]) || 0,
      longG: parseFloat(row[2]) || 0,
      compositeG: parseFloat(row[3]) || 0,
      speed: parseFloat(row[4]) || 0,
      badRide: row[5] === "YES"
    };
  });

  // Enable CORS by using JSONP if callback is provided
  const callback = e.parameter.callback;
  if (callback) {
    const jsonp = callback + '(' + JSON.stringify(jsonArray) + ');';
    return ContentService.createTextOutput(jsonp)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  } else {
    return ContentService.createTextOutput(JSON.stringify(jsonArray))
      .setMimeType(ContentService.MimeType.JSON);
  }
}