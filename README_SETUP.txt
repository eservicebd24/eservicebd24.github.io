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


LATEST FIX (2026-10-23)
- Homepage no longer loads common.js/common.css to replace the blue index header/footer after first paint. Homepage navigation is built in the index and uses the same blue design before and after settings load.
- Homepage reserves the service-grid area while data loads to reduce layout shift. Hero title keeps the highlighted “One Place” styling after settings are applied.
- Page-list action buttons now use data attributes and delegated click handling; this fixes malformed inline onclick handlers when IDs are strings.
- Website Settings panel is hidden initially and opens only from its sidebar item. Full Homepage Editor remains hidden until its own sidebar item is clicked.
- Page HTML lookup and deletion use the all-services/ folder. Because Code.gs changed, paste it into Apps Script and Deploy a New Version before testing the action buttons.
- After replacing index.html/admin.html/admin/index.html, hard-refresh the site (Ctrl+F5).
