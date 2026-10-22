eServiceBD24 Admin CMS Update

Included: Code.gs, admin.html, admin/index.html, index.html, header.html, footer.html, common.js, common.css, about.html, contact.html, all-services.html.

Important setup:
1. Backup the current Apps Script Code.gs and Google Sheet.
2. Replace Code.gs with this package Code.gs and Save.
3. Apps Script > Deploy > Manage deployments > Edit > New version > Deploy.
4. Replace GitHub repository admin.html, admin/index.html, index.html and shared assets as appropriate. Ensure the repository path for the Admin URL /admin/ contains admin/index.html.
5. Script Properties must include GITHUB_TOKEN, GITHUB_OWNER=eservicebd24, GITHUB_REPO=eservicebd24.github.io, GITHUB_BRANCH=main, and existing SPREADSHEET_ID. Never put the token in HTML.
6. Test login, save page, HTML Edit, View and Delete using a test page before production.

Features in this update: removed default credentials hint, password show/hide, visible login progress, persistent browser login token (localStorage), sidebar logout, page details edit, HTML source edit, view and delete confirmation, shared settings anchors. HTML source edit requires the new Code.gs to be deployed.

Security note: localStorage keeps the admin token in this browser until logout or token expiry; use only on a trusted device. For shared devices, log out.

Not live-tested against the user's GitHub/Apps Script account.
