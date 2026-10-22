eServiceBD24 Admin CMS — HTML Editor Update

Files in this package are intended for the root of https://github.com/eservicebd24/eservicebd24.github.io (or the repository currently connected to the Apps Script backend).

1. Upload/replace admin.html and admin/index.html.
2. Upload/replace Code.gs in Google Apps Script, save, then Deploy > Manage deployments > Edit > New version > Deploy.
3. Upload/replace common.js and common.css, index.html, header.html, footer.html, about.html, contact.html, all-services.html. Add privacy.html if it is not already present.
4. Keep the GitHub token only in Apps Script Script Properties. Never put it in the HTML.
5. Open https://eservicebd24.github.io/admin/ and log in.

The sidebar Header, Footer, About, Contact, Privacy and All Services Page options open the corresponding HTML source from GitHub in the editor. Save commits the file to GitHub. Header/footer are loaded by common.js across customer pages; common.css keeps the footer at the bottom on short pages. Header navigation text is All Services.

Important: Deploy the Apps Script update as a new version; otherwise new getStaticHtml/saveStaticHtml actions will not be available. This package has not been tested against your live repository or Apps Script deployment. Verify the repo owner/name and API URL in admin.html/common.js before publishing.
