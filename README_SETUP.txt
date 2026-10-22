eServiceBD24 — GitHub Pages Upload + Centered Notifications + Duplicate Fix

Included: Code.gs, index.html, admin.html, common.js, common.css.

What changed
- HTML content is committed directly to GitHub through the GitHub Contents API. New uploads are NOT written to Google Drive or embedded in a Google Sheet.
- Google Sheets still stores only the service metadata (title, subtitle, filename, GitHub URL/status) and Website Settings. That metadata is required by the current Admin Panel and Homepage to populate the service list.
- Admin save/settings/delete/status operations show a centered, styled notification. During save/upload, a centered progress overlay shows the ongoing process instead of a browser alert.
- Duplicate records that refer to the same HTML filename are collapsed in the public API output. When a page is saved, old duplicate rows are cleaned up, keeping the saved/latest record.
- GitHub Page URL construction is corrected for the user-site repository: https://eservicebd24.github.io/<filename>.html

Important: This package has not been deployed into your GitHub or Apps Script account from this workspace. Follow the steps below.

1) Apps Script: open the eServiceBD24 project and replace all of Code.gs with this package's Code.gs, then Save.
2) Project Settings → Script Properties: make sure these exist:
   GITHUB_TOKEN = your GitHub Personal Access Token (do not put it in HTML/JavaScript)
   GITHUB_OWNER = eservicebd24
   GITHUB_REPO = eservicebd24.github.io
   GITHUB_BRANCH = main (or the repository's actual default branch)
3) setupProject() already having been run is okay; there is no need to create a Drive folder. Run setupProject() only if Pages/Settings sheets have not yet been created. It now creates/updates only Google Sheets tabs; it does not create a Drive folder.
4) Deploy → Manage deployments → Edit → New version → Deploy. Web App access must allow the public JSONP reads used by the Homepage and the admin POST bridge.
5) In your GitHub repository root, upload/overwrite these files and commit them: index.html, admin.html, common.js, common.css. Also upload the included admin/ folder (containing admin/index.html) so the admin route works at https://eservicebd24.github.io/admin/. Updating admin.html on GitHub is important; otherwise the old browser-alert UI stays live. Do not try to upload admin.html through the Admin Panel's service upload form; replace it directly in the repository.
6) Open https://eservicebd24.github.io/admin/ (preferred) or https://eservicebd24.github.io/admin.html and refresh it hard (Ctrl+Shift+R). Log in. Upload a non-critical test HTML file once.
7) Confirm the generated direct URL: https://eservicebd24.github.io/<filename>.html. The upload modal should display a centered progress overlay and then a centered success notification.

Default login, only if not changed before: shagorch / 336699. Change it to a strong password.

Other notes
- Fine-grained GitHub token access should be limited to repository eservicebd24.github.io with Repository permissions → Contents: Read and write. Metadata can stay Read-only.
- common.js/common.css must be in the repository root so uploaded service pages can load the shared Header/Footer.
- Inactive hides the service card from the homepage but does not disable its public GitHub URL.
- Existing Drive-stored legacy pages can remain in Drive; this update will not create new Drive files for HTML uploads.
- The source code was syntax-checked locally, but a live GitHub upload and the user's Apps Script deployment were not testable from this workspace. Use a non-critical test page first.


FULL INDEX EDITOR + GLOBAL HEADER/FOOTER
- Deploy the updated Code.gs as a new Web App version.
- Replace admin.html, index.html, common.js and common.css in the GitHub repository root.
- In Admin Panel, use “Full Index Editor”: Load Current, edit the complete HTML source, then Save Full Index to GitHub.
- Website Settings lets you edit the shared header brand, header/footer background colors, footer text and privacy URL. These settings are stored in Google Sheets; HTML file contents remain in GitHub.
- Uploaded service pages automatically load common.js/common.css. common.js reads the current shared header/footer settings from Apps Script so one settings change applies across service pages.
- Full index editor writes directly to the GitHub index.html. Keep a backup before editing; invalid HTML/JS can break the homepage.


ADMIN ROUTE / NO CUSTOMER LOGIN
- The homepage index.html has no Admin/Login link in its public navigation. Admin panel is opened directly at https://eservicebd24.github.io/admin/ (the included admin/index.html) or the compatibility URL /admin.html.
- The admin panel itself still requires its admin login. Keep the login credentials strong and do not expose the GitHub token in client-side files.
- GitHub Pages uses the admin/ folder index.html to resolve the /admin/ path; a bare /admin URL may redirect to /admin/.
