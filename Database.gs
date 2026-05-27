function getSpreadsheet_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getSheet_(sheetName) {
  const spreadsheet = getSpreadsheet_();
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error(`Missing sheet: ${sheetName}. Run setupSnackCrm() first.`);
  }
  return sheet;
}

function setupSnackCrm() {
  const spreadsheet = getSpreadsheet_();

  Object.keys(HEADERS).forEach((sheetName) => {
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }
    ensureHeaderRow_(sheet, HEADERS[sheetName]);
    formatSheet_(sheet, HEADERS[sheetName]);
  });

  seedSettings_();
  SpreadsheetApp.getUi().alert('SNACK CRM setup is complete.');
}

function ensureHeaderRow_(sheet, headers) {
  const existingWidth = Math.max(sheet.getLastColumn(), headers.length);
  const existing = sheet.getRange(1, 1, 1, existingWidth).getValues()[0];
  const hasAnyHeader = existing.some((value) => String(value).trim());

  if (!hasAnyHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return;
  }

  const existingHeaders = new Set(existing.map((value) => String(value).trim()).filter(Boolean));
  const missingHeaders = headers.filter((header) => !existingHeaders.has(header));

  missingHeaders.forEach((header) => {
    sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
  });
}

function formatSheet_(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#eaf2f0')
    .setFontColor('#153b37');
  sheet.autoResizeColumns(1, headers.length);
}

function seedSettings_() {
  const sheet = getSheet_(SNACK.SHEETS.SETTINGS);
  const rows = getRows_(SNACK.SHEETS.SETTINGS);
  const existingKeys = new Set(rows.map((row) => `${row['Setting Type']}::${row.Name}`));
  const now = timestamp_();

  DEFAULT_SETTINGS.forEach(([type, name, value, active, notes]) => {
    const key = `${type}::${name}`;
    if (!existingKeys.has(key)) {
      appendRow_(SNACK.SHEETS.SETTINGS, {
        SettingID: makeId_('SET'),
        'Setting Type': type,
        Name: name,
        Value: value,
        Active: active,
        Notes: notes,
        'Updated At': now
      });
    }
  });
}

function getRows_(sheetName) {
  const sheet = getSheet_(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return [];
  }

  const headers = values[0];
  return values.slice(1)
    .filter((row) => row.some((value) => value !== '' && value !== null))
    .map((row, rowIndex) => {
      const record = { _rowNumber: rowIndex + 2 };
      headers.forEach((header, columnIndex) => {
        record[header] = normalizeValue_(row[columnIndex], header);
      });
      return record;
    });
}

function appendRow_(sheetName, record) {
  const sheet = getSheet_(sheetName);
  const headers = HEADERS[sheetName];
  ensureHeaderRow_(sheet, headers);
  const row = headers.map((header) => record[header] === undefined ? '' : record[header]);
  sheet.appendRow(row);
  return record;
}

function updateRow_(sheetName, rowNumber, updates) {
  const sheet = getSheet_(sheetName);
  const headers = HEADERS[sheetName];
  ensureHeaderRow_(sheet, headers);
  const current = sheet.getRange(rowNumber, 1, 1, headers.length).getValues()[0];
  const next = headers.map((header, index) => {
    return updates[header] === undefined ? current[index] : updates[header];
  });
  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([next]);
}

function findById_(sheetName, idColumn, id) {
  if (!id) {
    return null;
  }
  return getRows_(sheetName).find((row) => String(row[idColumn]) === String(id)) || null;
}

function getSettingsByType_(type) {
  return getRows_(SNACK.SHEETS.SETTINGS)
    .filter((row) => row['Setting Type'] === type && row.Active !== false && row.Active !== 'FALSE');
}

function timestamp_() {
  return Utilities.formatDate(new Date(), SNACK.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
}

function today_() {
  return Utilities.formatDate(new Date(), SNACK.TIMEZONE, 'yyyy-MM-dd');
}

function makeId_(prefix) {
  return `${prefix}-${Utilities.getUuid().slice(0, 8).toUpperCase()}`;
}

function normalizeValue_(value, header) {
  if (value instanceof Date) {
    if (header === 'Time') {
      return Utilities.formatDate(value, SNACK.TIMEZONE, 'HH:mm');
    }
    if (String(header).indexOf(' At') !== -1) {
      return Utilities.formatDate(value, SNACK.TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
    }
    return Utilities.formatDate(value, SNACK.TIMEZONE, 'yyyy-MM-dd');
  }
  return value;
}

function dateDaysFromNow_(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return Utilities.formatDate(date, SNACK.TIMEZONE, 'yyyy-MM-dd');
}
