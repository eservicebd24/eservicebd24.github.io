eServiceBD24 Website UI Update

Included files:
- index.html: compact hero and All Services button opens the complete All Services page.
- about.html: redesigned About page.
- contact.html: styled contact form; sends mail to jakareachakladar@gmail.com through Apps Script.
- all-services.html: styled responsive 5-column service grid, 20 items per page and pagination.
- privacy.html: Bengali privacy policy.
- common.js/common.css/header.html/footer.html: shared site shell assets.
- Code.gs: adds sendContactEmail action using MailApp.
- admin.html and admin/index.html: existing admin files retained.

INSTALL
1. Upload/replace the website files in the GitHub Pages repository root. Keep file names exactly as shown.
2. Open the existing Google Apps Script project, replace Code.gs with this package's Code.gs and save.
3. Deploy > Manage deployments > Edit (pencil) > select New version > Deploy. If prompted, authorize MailApp email sending permissions.
4. Test the contact form using a valid email address. A success notification appears only after Apps Script reports success. If Apps Script returns an error, the form displays an error instead.
5. Hard refresh the website (Ctrl+F5).

IMPORTANT
- Email sending requires the Apps Script deployment to run under an account authorized to send email. The script sends messages to jakareachakladar@gmail.com.
- The form is protected by basic validation and length limits; for a public production site, consider adding CAPTCHA/rate limiting to prevent abuse.
- The code has been syntax-checked locally but has not been tested against your live Apps Script deployment or live GitHub repository.
