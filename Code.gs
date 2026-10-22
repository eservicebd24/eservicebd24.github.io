const CONFIG = {
  SPREADSHEET_NAME: 'eServiceBD24 Pages',
  SHEET_NAME: 'Pages',
  SETTINGS_SHEET: 'Settings',
  DRIVE_FOLDER_NAME: 'eServiceBD24_HTML_Pages',
  ADMIN_USER: 'shagorch',
  ADMIN_PASSWORD: '336699'
};

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.api === '1') return apiGet_(p);
  if (p.page) return servePage_(String(p.page));
  const view = p.view === 'admin' ? 'admin' : 'index';
  const t = HtmlService.createTemplateFromFile(view);
  t.appUrl = ScriptApp.getService().getUrl() || '';
  return t.evaluate()
    .setTitle(view === 'admin' ? 'Admin Panel — eServiceBD24' : 'eServiceBD24 — Online Tools')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/** GitHub Pages API bridge: public reads use JSONP; writes use POST + postMessage. */
function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.api !== '1') return apiPostResponse_({ok:false,message:'Invalid API request'}, p.requestId || '');
  let result;
  try {
    const data = p.payload ? JSON.parse(p.payload) : {};
    switch (String(p.action || '')) {
      case 'adminLogin': result = adminLogin(data.username, data.password); break;
      case 'savePage': result = savePage(data.page, data.token); break;
      case 'saveSettings': result = saveSettings(data.settings, data.token); break;
      case 'getIndexHtml': result = getIndexHtml_(data.token); break;
      case 'getPageHtml': result = getPageHtml_(data.id, data.token); break;
      case 'savePageHtml': result = savePageHtml_(data.id, data.html, data.token); break;
      case 'getStaticHtml': result = getStaticHtml_(data.path, data.token); break;
      case 'saveStaticHtml': result = saveStaticHtml_(data.path, data.html, data.token); break;
      case 'saveIndexHtml': result = saveIndexHtml_(data.html, data.token); break;
      case 'deletePage': result = deletePage(data.id, data.token); break;
      case 'togglePage': result = togglePage(data.id, data.active, data.token); break;
      case 'changeAdminPassword': result = changeAdminPassword(data.oldPassword, data.newUsername, data.newPassword, data.token); break;
      default: throw new Error('Unknown API action');
    }
  } catch (err) { result = {ok:false, message:String(err && err.message || err)}; }
  return apiPostResponse_(result, String(p.requestId || ''));
}
function apiGet_(p) {
  const action = String(p.action || 'getPages');
  let result;
  try {
    if (action === 'getPages') result = {ok:true, pages:getPages().map(function(x){ return {id:x.id,title:x.title,subtitle:x.subtitle,icon:x.icon,filename:x.filename,driveFileId:x.driveFileId,githubUrl:x.githubUrl,category:x.category,active:x.active,createdAt:x.createdAt,updatedAt:x.updatedAt}; })};
    else if (action === 'getSettings') result = {ok:true, settings:getSettings_()};
    else throw new Error('Unknown API action');
  } catch (err) { result = {ok:false,message:String(err && err.message || err)}; }
  const callback = String(p.callback || '');
  const json = JSON.stringify(result).replace(/</g,'\\u003c');
  if (!/^[A-Za-z_$][0-9A-Za-z_$\.\[\]]*$/.test(callback)) return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
  return ContentService.createTextOutput(callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}
function apiPostResponse_(result, requestId) {
  const payload = JSON.stringify({type:'esbd-api-response', requestId:requestId, result:result}).replace(/</g,'\\u003c');
  return HtmlService.createHtmlOutput('<!doctype html><meta charset="utf-8"><script>top.postMessage(' + payload + ', "*");</script>')
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
    sheet.appendRow(['id','title','subtitle','icon','filename','driveFileId','active','createdAt','updatedAt','githubUrl','category']);
    sheet.setFrozenRows(1);
    sheet.getRange(1,1,1,10).setFontWeight('bold').setBackground('#dbeafe');
  } else {
    if (sheet.getLastColumn() < 10) sheet.getRange(1,10).setValue('githubUrl');
    if (sheet.getLastColumn() < 11) sheet.getRange(1,11).setValue('category');
  }
  let settingsSheet = ss.getSheetByName(CONFIG.SETTINGS_SHEET);
  if (!settingsSheet) { settingsSheet = ss.insertSheet(CONFIG.SETTINGS_SHEET); settingsSheet.appendRow(['key','value']); settingsSheet.setFrozenRows(1); settingsSheet.getRange(1,1,1,2).setFontWeight('bold').setBackground('#dbeafe'); }
  if (settingsSheet.getLastRow() < 2) { [['siteTitle','eServiceBD24'],['tagline','All Online Tools in One Place'],['heroEyebrow','✦ SMART • SIMPLE • FREE'],['heroTitle','All Online Tools in One Place'],['heroSubtitle','আপনার প্রয়োজনীয় সব অনলাইন সার্ভিস এক জায়গায়'],['popular','M3U Editor, M3U Maker, Age Calculator, Image Tools'],['footerText','© 2026 eServiceBD24. All Rights Reserved.'],['privacyUrl','https://eservicebd24.github.io/privacy.html'],['headerBrand','eServiceBD24'],['headerColor','#061b3d'],['footerColor','#061b3d'],['aboutTitle','আমাদের সম্পর্কে'],['aboutText','eServiceBD24 — আপনার প্রয়োজনীয় অনলাইন টুলস এক জায়গায়।'],['contactTitle','যোগাযোগ'],['contactText','যোগাযোগের জন্য আমাদের ইমেইল করুন।'],['contactEmail','support@eservicebd24.com'],['headerMenu','Home,All Tools,About,Contact'],['footerMenu','Privacy Policy']].forEach(r=>settingsSheet.appendRow(r)); }
  // Add newly introduced settings without overwriting values already managed by the admin.
  const defaultSettings = [['aboutTitle','আমাদের সম্পর্কে'],['aboutText','eServiceBD24 — আপনার প্রয়োজনীয় অনলাইন টুলস এক জায়গায়।'],['contactTitle','যোগাযোগ'],['contactText','যোগাযোগের জন্য আমাদের ইমেইল করুন।'],['contactEmail','support@eservicebd24.com'],['headerMenu','Home,All Tools,About,Contact'],['footerMenu','Privacy Policy,Home']];
  const existingKeys = new Set(settingsSheet.getDataRange().getValues().slice(1).map(r=>String(r[0]||'')));
  defaultSettings.forEach(r=>{if(!existingKeys.has(r[0]))settingsSheet.appendRow(r)});
  // No HTML file is saved to Drive. The Pages and Settings sheets store metadata only;
  // uploaded HTML content is committed directly to GitHub by savePage().
  return {
    ok: true,
    message: 'Setup complete — page metadata/settings use Google Sheets; HTML files publish to GitHub Pages.',
    spreadsheetUrl: ss.getUrl(),
    webAppUrl: ScriptApp.getService().getUrl() || 'Deploy as Web App to get URL'
  };
}

function getPages() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const byFilename = Object.create(null);
  values.slice(1).forEach(function(r, idx) {
    if (!r[0]) return;
    const p = {
      id: String(r[0]), title: String(r[1] || ''), subtitle: String(r[2] || ''),
      icon: String(r[3] || '✦'), filename: String(r[4] || ''),
      // Kept only for legacy compatibility. New HTML uploads never use Drive.
      driveFileId: String(r[5] || ''), githubUrl: String(r[9] || ''),
      active: String(r[6]).toLowerCase() !== 'false',
      createdAt: String(r[7] || ''), updatedAt: String(r[8] || ''), category: String(r[10] || 'Other')
    };
    const key = p.filename ? p.filename.trim().toLowerCase() : 'id:' + p.id;
    const old = byFilename[key];
    const stamp = Date.parse(p.updatedAt) || 0;
    const oldStamp = old ? (Date.parse(old.updatedAt) || 0) : -1;
    // Prefer the GitHub-backed row if an older duplicate is the only one with a URL;
    // otherwise the most recently updated record wins.
    if (!old || (p.githubUrl && !old.githubUrl) ||
        (!!p.githubUrl === !!old.githubUrl && stamp >= oldStamp)) byFilename[key] = p;
  });
  return Object.keys(byFilename).map(function(k){ return byFilename[k]; });
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
  const requestedId = String(data.id || '').trim();
  let id = requestedId || Utilities.getUuid();
  const title = String(data.title).trim().slice(0,100);
  const subtitle = String(data.subtitle || '').trim().slice(0,250);
  const icon = String(data.icon || '✦').slice(0,12);
  const filename = String(data.filename || makeFilename_(title)).trim();
  const category = String(data.category || 'Other').trim().slice(0,60);
  if (!category) throw new Error('ক্যাটাগরি নির্বাচন করুন।');
  const categorySlug = category.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'other';
  const githubPath = categorySlug + '/' + filename;
  if (!/^[A-Za-z0-9._-]+\.html?$/i.test(filename) || /^(index|admin)\.html$/i.test(filename)) {
    throw new Error('ফাইলের নাম ইংরেজি অক্ষর/সংখ্যা দিয়ে .html হতে হবে; index.html/admin.html ব্যবহার করা যাবে না।');
  }

  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  const filenameKey = filename.toLowerCase();
  let rowNum = -1, oldFileId = '', oldGithubUrl = '', oldFilename = '';
  // Prefer the explicitly edited row. For a new record, upsert by filename so
  // uploading the same HTML name a second time updates one record instead of duplicating it.
  if (requestedId) {
    for (let i=1; i<rows.length; i++) {
      if (String(rows[i][0]) === requestedId) { rowNum = i+1; break; }
    }
  }
  if (rowNum < 0) {
    let bestIndex = -1, bestStamp = -1;
    for (let i=1; i<rows.length; i++) {
      if (String(rows[i][4] || '').trim().toLowerCase() !== filenameKey) continue;
      const stamp = rows[i][8] instanceof Date ? rows[i][8].getTime() : (Date.parse(rows[i][8]) || 0);
      if (stamp >= bestStamp) { bestStamp = stamp; bestIndex = i; }
    }
    if (bestIndex >= 1) { rowNum = bestIndex+1; id = String(rows[bestIndex][0] || id); }
  }
  if (rowNum > 0) {
    const old = rows[rowNum-1];
    oldFileId = String(old[5] || ''); oldGithubUrl = String(old[9] || ''); oldFilename = String(old[4] || '');
  }
  if (rowNum < 0 && !data.htmlBase64) throw new Error('নতুন সার্ভিস যোগ করতে HTML ফাইল নির্বাচন করুন।');
  if (rowNum > 0 && !data.htmlBase64 && oldFilename && oldFilename.toLowerCase() !== filenameKey) {
    throw new Error('ফাইলের নাম পরিবর্তন করলে নতুন HTML ফাইল আবার নির্বাচন করুন।');
  }

  let fileId = oldFileId, githubUrl = oldGithubUrl;
  if (data.htmlBase64) {
    const bytes = Utilities.base64Decode(String(data.htmlBase64));
    if (bytes.length > 2 * 1024 * 1024) throw new Error('HTML ফাইল সর্বোচ্চ 2 MB হতে পারবে।');
    const originalHtml = Utilities.newBlob(bytes).getDataAsString('UTF-8');
    const html = injectSharedShell_(originalHtml);
    githubPutFile_(githubPath, html, 'Add/update service page: ' + githubPath);
    const cfg = githubConfig_();
    const isUserSiteRepo = String(cfg.repo).toLowerCase() === (String(cfg.owner) + '.github.io').toLowerCase();
    const siteRoot = isUserSiteRepo ? ('https://' + cfg.repo) : ('https://' + cfg.owner + '.github.io/' + cfg.repo);
    githubUrl = siteRoot.replace(/\/+$/, '') + '/' + githubPath;
    // New HTML content is committed to GitHub only. This clears any legacy Drive ID
    // from the metadata row without creating a Drive file.
    fileId = '';
    if (oldGithubUrl && oldFilename && oldFilename.toLowerCase() !== filenameKey) {
      try { githubDeleteFile_((String(rows[rowNum-1][10] || 'Other').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'other') + '/' + oldFilename); } catch (err) {
        // Keep the new page saved. An old path can be manually removed if the token
        // lacks permission; never roll back a successful upload.
      }
    }
  }

  const now = new Date();
  const oldCreated = rowNum > 0 ? rows[rowNum-1][7] : now;
  const record = [id,title,subtitle,icon,filename,fileId,data.active === false ? false : true,oldCreated,now,githubUrl,category];
  if (rowNum > 0) sheet.getRange(rowNum,1,1,record.length).setValues([record]);
  else { sheet.appendRow(record); rowNum = sheet.getLastRow(); }
  // Clean existing rows that pointed to the same GitHub path, keeping the row just saved.
  deduplicateAllPageRows_(sheet, id);
  return {
    ok:true,
    page:{id,title,subtitle,icon,filename,active:record[6],githubUrl:githubUrl},
    message: data.htmlBase64
      ? 'HTML GitHub Pages-এ আপলোড হয়েছে। সার্ভিস তালিকা আপডেট হয়েছে।'
      : 'সার্ভিসের তথ্য আপডেট হয়েছে।'
  };
}

function deduplicateAllPageRows_(sheet, keepId) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 3) return;
  const keepByKey = Object.create(null);
  // Pick the freshly-saved ID first; for all other repeated filenames, keep the newest row.
  for (let i=1; i<values.length; i++) {
    const r = values[i];
    if (!r[0]) continue;
    const filename = String(r[4] || '').trim().toLowerCase();
    if (!filename) continue;
    const stamp = r[8] instanceof Date ? r[8].getTime() : (Date.parse(r[8]) || 0);
    const candidate = {index:i, id:String(r[0]), stamp:stamp, hasGithub:!!String(r[9] || '')};
    const current = keepByKey[filename];
    if (!current || candidate.id === String(keepId) ||
        (current.id !== String(keepId) && ((candidate.hasGithub && !current.hasGithub) ||
        (candidate.hasGithub === current.hasGithub && candidate.stamp >= current.stamp)))) {
      keepByKey[filename] = candidate;
    }
  }
  // Delete duplicates from bottom to top to avoid shifting rows not yet visited.
  for (let i=values.length-1; i>=1; i--) {
    const filename = String(values[i][4] || '').trim().toLowerCase();
    if (!filename) continue;
    const keep = keepByKey[filename];
    if (keep && keep.index !== i) sheet.deleteRow(i+1);
  }
}

function deletePage(id, token) {
  requireAdmin_(token);
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  let target = null;
  for (let i=1; i<values.length; i++) {
    if (String(values[i][0]) === String(id)) { target = values[i]; break; }
  }
  if (!target) throw new Error('পেজ পাওয়া যায়নি।');
  const filename = String(target[4] || '');
  const fileId = String(target[5] || '');
  const githubUrl = String(target[9] || '');
  if (githubUrl && filename) {
    const cat = String(target[10] || 'Other').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'other';
    githubDeleteFile_(cat + '/' + filename);
  }
  // Remove the selected row and any old duplicate metadata rows for this same path.
  const key = filename.trim().toLowerCase();
  const current = sheet.getDataRange().getValues();
  for (let i=current.length-1; i>=1; i--) {
    const sameFilename = key && String(current[i][4] || '').trim().toLowerCase() === key;
    const sameId = String(current[i][0]) === String(id);
    if (sameFilename || sameId) sheet.deleteRow(i+1);
  }
  // Older versions stored HTML in Drive. Best-effort cleanup for a legacy row only.
  if (fileId) { try { DriveApp.getFileById(fileId).setTrashed(true); } catch (err) {} }
  return {ok:true, message:'পেজ ও GitHub HTML ফাইল ডিলিট হয়েছে।'};
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


function githubConfig_() {
  const p = PropertiesService.getScriptProperties();
  const owner = p.getProperty('GITHUB_OWNER') || 'eservicebd24';
  const repo = p.getProperty('GITHUB_REPO') || 'eservicebd24.github.io';
  const branch = p.getProperty('GITHUB_BRANCH') || 'main';
  const token = p.getProperty('GITHUB_TOKEN');
  if (!token) throw new Error('Apps Script → Project Settings → Script Properties-এ GITHUB_TOKEN সেট করুন।');
  return {owner:owner,repo:repo,branch:branch,token:token};
}
function githubRequest_(method, path, body) {
  const c = githubConfig_();
  const url = 'https://api.github.com/repos/' + encodeURIComponent(c.owner) + '/' + encodeURIComponent(c.repo) + '/contents/' + path;
  const opts = {method:method, muteHttpExceptions:true, headers:{Authorization:'Bearer '+c.token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'},contentType:'application/json'};
  if (body) opts.payload = JSON.stringify(body);
  const response = UrlFetchApp.fetch(url, opts), status = response.getResponseCode(), text = response.getContentText();
  let data = {}; try { data = JSON.parse(text); } catch (e) {}
  if (status < 200 || status >= 300) throw new Error((data.message || ('GitHub API HTTP '+status)) + ' (repo/branch/token permission যাচাই করুন)');
  return data;
}
function githubPutFile_(filename, html, message) {
  const c = githubConfig_(), path = String(filename).split('/').map(encodeURIComponent).join('/');
  let sha = '';
  try { sha = githubRequest_('get', path).sha || ''; } catch (e) { if (!/Not Found/i.test(String(e.message))) throw e; }
  const content = Utilities.base64Encode(Utilities.newBlob(html, 'text/html; charset=utf-8').getBytes());
  const body = {message:message,content:content,branch:c.branch}; if (sha) body.sha = sha;
  return githubRequest_('put', path, body);
}
function githubDeleteFile_(filename) {
  const c = githubConfig_(), path = String(filename).split('/').map(encodeURIComponent).join('/');
  const file = githubRequest_('get', path);
  return githubRequest_('delete', path, {message:'Delete service page: '+filename,sha:file.sha,branch:c.branch});
}
function injectSharedShell_(html) {
  let out = String(html || '');
  if (!/<!doctype|<html/i.test(out)) out = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>'+out+'</body></html>';
  if (!/id=["']esbd-shared-assets["']/i.test(out)) {
    const assets = '<link id="esbd-shared-assets" rel="stylesheet" href="https://eservicebd24.github.io/common.css"><script src="https://eservicebd24.github.io/common.js" defer></script>';
    if (/<\/head>/i.test(out)) out = out.replace(/<\/head>/i, assets+'</head>');
    else out = out.replace(/<html[^>]*>/i, '$&<head>'+assets+'</head>');
  }
  return out;
}

function pageGithubPath_(row) {
  const category = String(row[10] || 'Other').trim().toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'other';
  return category + '/' + String(row[4] || '').trim();
}
function getPageHtml_(id, token) {
  requireAdmin_(token);
  const values = getSheet_().getDataRange().getValues();
  const row = values.slice(1).find(r => String(r[0]) === String(id));
  if (!row) throw new Error('পেজ পাওয়া যায়নি।');
  const path = pageGithubPath_(row);
  const file = githubRequest_('get', path);
  const bytes = Utilities.base64Decode(String(file.content || '').replace(/\s/g,''));
  return {ok:true, html:Utilities.newBlob(bytes).getDataAsString('UTF-8'), path:path};
}
function savePageHtml_(id, html, token) {
  requireAdmin_(token);
  html = String(html || '');
  if (path !== 'header.html' && path !== 'footer.html' && (!/<html[\s>]/i.test(html) || !/<body[\s>]/i.test(html))) throw new Error('সম্পূর্ণ HTML document দিন; html ও body tag থাকতে হবে।');
  if ((path === 'header.html' && !/<header[\s>]/i.test(html)) || (path === 'footer.html' && !/<footer[\s>]/i.test(html))) throw new Error('Header ফাইলে <header> এবং Footer ফাইলে <footer> element থাকতে হবে।');
  if (Utilities.newBlob(html).getBytes().length > 2 * 1024 * 1024) throw new Error('HTML ফাইল সর্বোচ্চ 2 MB হতে পারবে।');
  const values = getSheet_().getDataRange().getValues();
  const row = values.slice(1).find(r => String(r[0]) === String(id));
  if (!row) throw new Error('পেজ পাওয়া যায়নি।');
  const path = pageGithubPath_(row);
  githubPutFile_(path, injectSharedShell_(html), 'Edit HTML source: ' + path);
  return {ok:true, path:path, message:'HTML GitHub-এ আপডেট হয়েছে।'};
}

function getIndexHtml_(token) {
  requireAdmin_(token);
  const file = githubRequest_('get', 'index.html');
  const bytes = Utilities.base64Decode(String(file.content || '').replace(/\s/g, ''));
  return {ok:true, html:Utilities.newBlob(bytes).getDataAsString('UTF-8'), sha:file.sha};
}
function saveIndexHtml_(html, token) {
  requireAdmin_(token);
  html = String(html || '');
  if (!/<html[\s>]/i.test(html) || !/<body[\s>]/i.test(html)) throw new Error('সম্পূর্ণ HTML ডকুমেন্ট দিন—html ও body ট্যাগ থাকতে হবে।');
  if (Utilities.newBlob(html).getBytes().length > 2 * 1024 * 1024) throw new Error('index.html সর্বোচ্চ 2 MB হতে পারবে।');
  githubPutFile_('index.html', html, 'Update homepage from eServiceBD24 Admin');
  return {ok:true, url:'https://eservicebd24.github.io/', message:'index.html GitHub-এ Commit হয়েছে।'};
}

function getSettings_() {
  const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
  let sh = ss.getSheetByName(CONFIG.SETTINGS_SHEET);
  if (!sh) { setupProject(); sh = ss.getSheetByName(CONFIG.SETTINGS_SHEET); }
  const values = sh.getDataRange().getValues(), result = {};
  values.slice(1).forEach(r=>{if(r[0]) result[String(r[0])] = String(r[1] == null ? '' : r[1]);});
  return result;
}
function saveSettings(settings, token) {
  requireAdmin_(token);
  if (!settings || typeof settings !== 'object') throw new Error('Settings data missing');
  const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
  let sh = ss.getSheetByName(CONFIG.SETTINGS_SHEET);
  if (!sh) { setupProject(); sh = ss.getSheetByName(CONFIG.SETTINGS_SHEET); }
  const values = sh.getDataRange().getValues(), rows = {};
  for (let i=1;i<values.length;i++) if(values[i][0]) rows[String(values[i][0])] = i+1;
  Object.keys(settings).forEach(k=>{
    if (!/^[A-Za-z][A-Za-z0-9_]{0,50}$/.test(k)) return;
    const v = String(settings[k] == null ? '' : settings[k]).slice(0,2000);
    if (rows[k]) sh.getRange(rows[k],2).setValue(v); else sh.appendRow([k,v]);
  });
  return {ok:true,settings:getSettings_()};
}

function staticHtmlPath_(path) {
  path = String(path || '').trim();
  const allowed = ['header.html','footer.html','about.html','contact.html','privacy.html','all-services.html'];
  if (allowed.indexOf(path) < 0) throw new Error('এই পেজটি এডিট করার অনুমতি নেই।');
  return path;
}
function getStaticHtml_(path, token) {
  requireAdmin_(token); path = staticHtmlPath_(path);
  const file = githubRequest_('get', path);
  const bytes = Utilities.base64Decode(String(file.content || '').replace(/\s/g,''));
  return {ok:true, html:Utilities.newBlob(bytes).getDataAsString('UTF-8'), path:path};
}
function saveStaticHtml_(path, html, token) {
  requireAdmin_(token); path = staticHtmlPath_(path); html = String(html || '');
  if (path !== 'header.html' && path !== 'footer.html' && (!/<html[\s>]/i.test(html) || !/<body[\s>]/i.test(html))) throw new Error('সম্পূর্ণ HTML document দিন; html ও body tag থাকতে হবে।');
  if ((path === 'header.html' && !/<header[\s>]/i.test(html)) || (path === 'footer.html' && !/<footer[\s>]/i.test(html))) throw new Error('Header ফাইলে <header> এবং Footer ফাইলে <footer> element থাকতে হবে।');
  if (Utilities.newBlob(html).getBytes().length > 2 * 1024 * 1024) throw new Error('HTML ফাইল সর্বোচ্চ 2 MB হতে পারবে।');
  githubPutFile_(path, html, 'Edit site page: ' + path);
  return {ok:true, path:path, message:path+' GitHub-এ আপডেট হয়েছে।'};
}
