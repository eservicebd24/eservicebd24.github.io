eServiceBD24 — Homepage Featured Services Manager

What's included:
- Admin Panel section: Homepage Featured Services.
- Select up to 20 active service pages and arrange their order with up/down controls.
- Save the selected IDs/order in the existing Google Sheets Settings sheet under featuredServiceIds.
- Homepage initially displays only those selected services (5 columns x 4 rows on wide desktop layouts).
- The homepage button opens the complete active services list with pagination (20 per page); the same button can return to the featured 20.
- If no saved selection exists yet, homepage falls back to the first 20 active services.

Install:
1. Back up the existing repository files.
2. Replace index.html and admin.html (also replace admin/index.html) in GitHub Pages.
3. Code.gs does not require changes for this feature because saveSettings already accepts arbitrary settings keys and stores them in the Settings sheet.
4. Open Admin Panel, select exactly 20 active services in Homepage Featured Services, and click Save Homepage Selection.
5. Refresh the homepage after GitHub Pages updates.

Important:
- Selection saves to Google Sheets through the existing Apps Script API. Apps Script must already be deployed and the Admin Panel session valid.
- The package has not been tested against the live GitHub repository or live Apps Script deployment.
