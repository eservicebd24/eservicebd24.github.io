eServiceBD24 CMS - corrected build

Files included:
- Code.gs (Google Apps Script backend; updated static header/footer snippet validation)
- admin.html and admin/index.html (Admin Panel with Visual Editors + optional Advanced HTML Editor)
- index.html, all-services.html, about.html, contact.html, privacy.html
- header.html, footer.html, common.css, common.js

INSTALL:
1. Back up the current GitHub repository and Apps Script project.
2. Replace Code.gs in Apps Script with this package's Code.gs, save, then Deploy > Manage deployments > Edit > New version > Deploy.
3. Upload/replace the website files at the repository root. Keep admin/index.html synced with admin.html.
4. Open https://eservicebd24.github.io/admin/ and sign in.
5. Use Header Editor / Footer Editor / About / Contact / Privacy for visual settings. Advanced HTML Editor is optional.

Important:
- Apps Script must already have the correct GitHub token and spreadsheet ID in Script Properties.
- The package has not been tested against the user's live Apps Script, Sheet, or GitHub repository. Test after deployment.
- Service-page paths continue to use the existing category-slug behavior in Code.gs.
