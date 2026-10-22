const CONFIG = {
  SPREADSHEET_NAME: 'eServiceBD24 Pages',
  SHEET_NAME: 'Pages',
  DRIVE_FOLDER_NAME: 'eServiceBD24_HTML_Pages',
  ADMIN_USER: 'shagorch',
  ADMIN_PASSWORD: '336699'
};

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.page) return servePage_(String(p.page));
  const view = p.view === 'admin' ? 'admin' : 'index';
  const t = HtmlService.createTemplateFromFile(view);
  t.appUrl = ScriptApp.getService().getUrl() || '';
  return t.evaluate()
    .setTitle(view === 'admin' ? 'Admin Panel — eServiceBD24' : 'eServiceBD24 — Online Tools')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function setupProject() {
  const props = PropertiesService.getScriptProperties();
  let ssId = props.getProperty('SPREADSHEET_ID');
  let ss;
  if (ssId) {
    try { ss = SpreadsheetApp.openById(ssId); } catch (err) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create(CONFIG.SPREADSHEET_NAME);
    props.setProperty('SPREADSHEET_ID', ss.getId());
  }
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['id','title','subtitle','icon','filename','driveFileId','active','createdAt','updatedAt']);
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,9).setFontWeight('bold').setBackground('#dbeafe');
  }
  let folderId = props.getProperty('DRIVE_FOLDER_ID');
  let folder;
  if (folderId) { try { folder = DriveApp.getFolderById(folderId); } catch (err) { folder = null; } }
  if (!folder) {
    const it = DriveApp.getFoldersByName(CONFIG.DRIVE_FOLDER_NAME);
    folder = it.hasNext() ? it.next() : DriveApp.createFolder(CONFIG.DRIVE_FOLDER_NAME);
    props.setProperty('DRIVE_FOLDER_ID', folder.getId());
  }
  return {
    ok: true,
    message: 'Setup complete',
    spreadsheetUrl: ss.getUrl(),
    driveFolderUrl: folder.getUrl(),
    webAppUrl: ScriptApp.getService().getUrl() || 'Deploy as Web App to get URL'
  };
}

function getPages() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  return values.slice(1).filter(r => r[0]).map(r => ({
    id: String(r[0]), title: String(r[1] || ''), subtitle: String(r[2] || ''),
    icon: String(r[3] || '✦'), filename: String(r[4] || ''),
    driveFileId: String(r[5] || ''), active: String(r[6]).toLowerCase() !== 'false',
    createdAt: String(r[7] || ''), updatedAt: String(r[8] || '')
  }));
}

function adminLogin(username, password) {
  const user = PropertiesService.getScriptProperties().getProperty('ADMIN_USER') || CONFIG.ADMIN_USER;
  const pass = PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD') || CONFIG.ADMIN_PASSWORD;
  if (String(username) !== user || String(password) !== pass) {
    return { ok: false, message: 'ইউজারনেম অথবা পাসওয়ার্ড সঠিক নয়।' };
  }
  const token = Utilities.getUuid() + Utilities.getUuid();
  CacheService.getScriptCache().put('admin_' + token, 'ok', 21600);
  return { ok: true, token: token };
}

function changeAdminPassword(oldPassword, newUsername, newPassword, token) {
  requireAdmin_(token);
  const props = PropertiesService.getScriptProperties();
  const current = props.getProperty('ADMIN_PASSWORD') || CONFIG.ADMIN_PASSWORD;
  if (String(oldPassword) !== current) throw new Error('বর্তমান পাসওয়ার্ড সঠিক নয়।');
  if (!newUsername || String(newPassword).length < 8) throw new Error('নতুন ইউজারনেম দিন এবং কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন।');
  props.setProperty('ADMIN_USER', String(newUsername));
  props.setProperty('ADMIN_PASSWORD', String(newPassword));
  return { ok: true };
}

function savePage(data, token) {
  requireAdmin_(token);
  if (!data || !String(data.title || '').trim()) throw new Error('পেজের টাইটেল দিতে হবে।');
  const id = String(data.id || Utilities.getUuid());
  const title = String(data.title).trim().slice(0,100);
  const subtitle = String(data.subtitle || '').trim().slice(0,250);
  const icon = String(data.icon || '✦').slice(0,12);
  let filename = String(data.filename || makeFilename_(title)).trim();
  if (!/^[A-Za-z0-9._-]+\.html?$/i.test(filename) || /^(index|admin)\.html$/i.test(filename)) {
    throw new Error('ফাইলের নাম ইংরেজি অক্ষর/সংখ্যা দিয়ে .html হতে হবে; index.html/admin.html ব্যবহার করা যাবে না।');
  }
  const folder = getFolder_();
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  let rowNum = -1, oldFileId = '';
  for (let i=1; i<rows.length; i++) {
    if (String(rows[i][0]) === id) { rowNum = i+1; oldFileId = String(rows[i][5] || ''); break; }
  }
  let fileId = oldFileId;
  if (data.htmlBase64) {
    const bytes = Utilities.base64Decode(String(data.htmlBase64));
    if (bytes.length > 2 * 1024 * 1024) throw new Error('HTML ফাইল সর্বোচ্চ 2 MB হতে পারবে।');
    const blob = Utilities.newBlob(bytes, 'text/html', filename);
    if (fileId) {
      try {
        const old = DriveApp.getFileById(fileId);
        old.setTrashed(true);
      } catch (err) {}
    }
    const file = folder.createFile(blob);
    file.setDescription('eServiceBD24 service page: ' + title);
    fileId = file.getId();
  }
  const now = new Date();
  const record = [id,title,subtitle,icon,filename,fileId,data.active === false ? false : true,
    rowNum > 0 ? rows[rowNum-1][7] : now,now];
  if (rowNum > 0) sheet.getRange(rowNum,1,1,record.length).setValues([record]);
  else sheet.appendRow(record);
  return { ok:true, page:{id,title,subtitle,icon,filename,active:record[6]}, message:'পেজ সেভ হয়েছে।' };
}

function deletePage(id, token) {
  requireAdmin_(token);
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  for (let i=1; i<values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      const fileId = String(values[i][5] || '');
      if (fileId) { try { DriveApp.getFileById(fileId).setTrashed(true); } catch (err) {} }
      sheet.deleteRow(i+1);
      return {ok:true};
    }
  }
  throw new Error('পেজ পাওয়া যায়নি।');
}

function togglePage(id, active, token) {
  requireAdmin_(token);
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  for (let i=1; i<values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.getRange(i+1,7).setValue(active === true);
      sheet.getRange(i+1,9).setValue(new Date());
      return {ok:true};
    }
  }
  throw new Error('পেজ পাওয়া যায়নি।');
}

function servePage_(id) {
  const pages = getPages();
  const p = pages.find(x => x.id === id && x.active);
  if (!p || !p.driveFileId) return HtmlService.createHtmlOutput('<h2>পেজ পাওয়া যায়নি অথবা Active নয়।</h2>');
  const file = DriveApp.getFileById(p.driveFileId);
  const html = file.getBlob().getDataAsString('UTF-8');
  return HtmlService.createHtmlOutput(html)
    .setTitle(p.title)
    .addMetaTag('viewport','width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getPublicConfig() {
  return { appUrl: ScriptApp.getService().getUrl() || '' };
}

function requireAdmin_(token) {
  if (!token || CacheService.getScriptCache().get('admin_' + String(token)) !== 'ok') {
    throw new Error('সেশন শেষ হয়েছে। আবার লগইন করুন।');
  }
}

function getSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('প্রথমে Apps Script editor থেকে setupProject() একবার Run করুন।');
  const ss = SpreadsheetApp.openById(id);
  let sh = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sh) throw new Error('Pages sheet পাওয়া যায়নি। setupProject() চালান।');
  return sh;
}
function getFolder_() {
  const id = PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID');
  if (!id) throw new Error('প্রথমে setupProject() একবার Run করুন।');
  return DriveApp.getFolderById(id);
}
function makeFilename_(title) {
  let s = String(title).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  if (!s) s = 'service-' + Date.now();
  return s + '.html';
}
