eServiceBD24 — Google Sheets + Google Apps Script package
==========================================================

What this package does
----------------------
- index.html: landing page with service cards and search.
- admin.html: admin login, HTML upload from PC/phone, add/edit/delete, active/inactive.
- Code.gs: Apps Script backend; stores page metadata in Google Sheets and uploaded HTML files in Google Drive.
- appsscript.json: Apps Script project manifest.

Important hosting note
----------------------
This is the Google Apps Script version, not the Cloudflare/GitHub API version.
Deploy the Apps Script project as a Web App. The web app will serve both the public index and admin panel.
Uploaded HTML files are stored in a Drive folder, and their page content is served through the Apps Script web app at ?page=PAGE_ID.
This package does not create/update files inside a GitHub Pages repository. It keeps management inside the Google Apps Script web app, backed by Google Sheets and Drive.

Setup (one time)
----------------
1. Open https://script.google.com and click New project.
2. In the Apps Script editor, create/replace Code.gs with the provided Code.gs.
3. Add two HTML files named exactly index and admin, and paste the matching index.html and admin.html contents into them. Apps Script editor HTML files are named index.html/admin.html in the UI.
4. Project Settings: enable "Show 'appsscript.json' manifest file in editor"; replace manifest with the included appsscript.json if you want explicit scopes.
5. Save the project.
6. In the function dropdown, select setupProject and click Run. Approve the requested Google Sheets and Drive permissions. This creates the Google Sheet and Drive folder automatically.
7. In Project Settings > Script Properties, optionally set:
   ADMIN_USER = shagorch
   ADMIN_PASSWORD = 336699
   For better security, set a strong password (8+ characters) before publishing. The defaults are only initial demo credentials.
8. Click Deploy > New deployment > select type "Web app".
9. Execute as: Me.
10. Who has access: Anyone (needed for public website; admin actions still check login in the server code). If your account does not offer Anyone, use the available access option, but it may restrict visitors.
11. Deploy and copy the Web app URL ending in /exec.
12. Open that URL for the main website. Open URL + ?view=admin for the admin panel, e.g. https://script.google.com/macros/s/DEPLOYMENT_ID/exec?view=admin
13. On mobile, upload a .html file in Add New Page and click Save. It is stored in Drive and the metadata appears in the Pages sheet. The main page reads the same list and shows active service cards.

Default admin login
-------------------
Username: shagorch
Password: 336699

Security
--------
- Change the default password in Script Properties before sharing the admin URL.
- Do not share the admin token; it is kept in sessionStorage in the admin page.
- Apps Script web apps are not a substitute for a hardened production application; use a strong unique password and restrict web app access if possible.
- Uploaded HTML files can contain scripts. Upload only files you trust.
- Google Apps Script execution quotas and HTMLService restrictions apply.
- The system uses a Sheet as the metadata database and Drive for actual HTML file contents.
- The initial eight cards on the landing page are visual starter cards with placeholder links (#). Replace those with your actual service URLs/content as those services are added.
