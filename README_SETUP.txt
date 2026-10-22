eServiceBD24 Complete Website CMS v2
====================================

PACKAGE CONTENTS
- index.html: Public homepage; demo service cards removed. Active services come from Apps Script API.
- admin/index.html: Admin login at https://eservicebd24.github.io/admin/
- admin.html: same admin source for convenience/backup.
- Code.gs: Google Apps Script API, GitHub upload, page metadata and settings.
- common.js / common.css: shared header/footer loader and styles.
- header.html / footer.html: single shared header and footer templates.
- all-services.html: All services listing, category filters and pagination (20 per page).
- about.html / contact.html: content driven by Website Settings.
- README_SETUP.txt: deployment steps.

IMPORTANT ARCHITECTURE
HTML pages are committed to GitHub. Google Sheets stores only service metadata and website settings, not HTML file contents. Apps Script remains the API bridge and uses Script Properties for secrets.

REQUIRED SCRIPT PROPERTIES
GITHUB_TOKEN = your fine-grained GitHub token with repository Contents: Read and write
GITHUB_OWNER = eservicebd24
GITHUB_REPO = eservicebd24.github.io
GITHUB_BRANCH = main
SPREADSHEET_ID = created/set by setupProject()
ADMIN_USER / ADMIN_PASSWORD optional; defaults are legacy values. Change them after setup.

SETUP
1. Extract this ZIP.
2. In Apps Script, replace Code.gs with this package's Code.gs, save, run setupProject() once and approve permissions.
3. In Project Settings > Script Properties, verify the four GitHub properties above. Do not paste the token into HTML or chat.
4. Deploy > Manage deployments > Edit > New version > Deploy. Keep Web App access appropriate for the frontend API (usually Anyone); admin write actions still require a valid login token.
5. In GitHub repository root, commit/replace:
   index.html
   admin/index.html
   common.js
   common.css
   header.html
   footer.html
   all-services.html
   about.html
   contact.html
6. The root admin.html is a convenience copy; /admin/ uses admin/index.html.
7. Hard refresh the homepage and admin page.
8. Test with a small HTML service, category "Text Tools". Confirm it creates a GitHub path like text-tools/example.html and one metadata row in the Pages sheet.
9. Test about/contact by editing Website Settings. Test homepage and All Tools pagination with more than 20 active pages.

CATEGORY UPLOAD
The category text is converted to a folder slug. Example "Text Tools" => text-tools/example.html. GitHub Contents API creates the directory path automatically. The page URL is https://eservicebd24.github.io/text-tools/example.html.

SAFETY / NOTES
- Back up existing files and Google Sheet before replacing.
- Existing older rows may have blank category; they display as "Other". Existing duplicate rows are not automatically bulk-deleted by setupProject.
- Pages already on GitHub at the repository root are not moved automatically into category folders. Re-upload each page under its category to publish the categorized path.
- Changing a category when editing a page may publish a new path; verify the old path and delete stale files if needed.
- Shared header/footer is fetched from header.html/footer.html by common.js. All uploaded service pages need common.js and common.css references; Apps Script injects those references when uploaded.
- About/contact content is controlled by Website Settings keys aboutTitle/aboutText/contactTitle/contactText/contactEmail.
- Admin's initial username/password in old installs may still be configured via Script Properties. Change credentials before production.
- This package was syntax-reviewed locally but not deployed against the live GitHub repository or Apps Script project. Verify using a test service before production use.
