# SNACK CRM Cloud Deployment Notes

This document explains the current cloud app, release checks, and rollback steps.

## Live URLs

- Frontend website: `https://snack-crm.web.app`
- Backend service: `https://snack-crm-api-1013266498299.us-central1.run.app`
- Google Cloud project: `snack-crm`
- Cloud Run service: `snack-crm-api`
- Firestore database: `(default)`

## What Is Running

The app has four pieces:

1. **Firebase Hosting**
   - Hosts the browser website.
   - Public URL: `https://snack-crm.web.app`
   - Forwards `/api/**` and `/health` requests to Cloud Run.

2. **Firebase Authentication**
   - Lets users sign in with Google.
   - Google sign-in is enabled in Firebase Console.
   - The browser gets a Firebase login token after sign-in.

3. **Cloud Run**
   - Runs the backend API.
   - Verifies the Firebase login token before returning API data.
   - Only allows verified emails ending in `@snackprogram.org`.

4. **Firestore**
   - Stores app data.
   - Stores clients, referrals, appointments, tasks, program records, and settings.

## Request Flow

When someone opens the app:

1. The browser loads the website from Firebase Hosting.
2. The user signs in with Google.
3. Firebase Authentication gives the browser a login token.
4. The browser calls `/api/message` and sends that token.
5. Firebase Hosting forwards the request to Cloud Run.
6. Cloud Run verifies the token.
7. Cloud Run reads the message from Firestore.
8. The browser displays the database message.

## Local Development

Use three Terminal windows.

### Terminal 1: Firestore and Hosting Emulators

```bash
cd "/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud"
firebase emulators:start --only firestore,hosting --project demo-snack-crm
```

Local frontend URL:

```text
http://localhost:5002
```

### Terminal 2: Backend

```bash
cd "/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud/backend"
npm run dev
```

Local backend URL:

```text
http://localhost:8080
```

### Terminal 3: Optional Checks

Health check:

```bash
curl http://localhost:8080/health
```

Protected API check without login:

```bash
curl http://localhost:8080/api/message
```

That should return:

```json
{"error":"Sign in is required."}
```

## Deploy Backend

Run this after changing backend code:

```bash
cd "/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud/backend"
gcloud run deploy snack-crm-api \
  --source . \
  --region us-central1 \
  --project snack-crm \
  --update-env-vars FIREBASE_AUTH_PROJECT_ID=snack-crm,ALLOWED_EMAIL_DOMAIN=snackprogram.org,ALLOW_ADMIN_BULK_DELETE=false,PUBLIC_BOOKING_CONFIRMATION_MODE=disabled,PUBLIC_BOOKING_PAGE_URL=https://snack-crm.web.app/book.html
```

Keep `ALLOW_ADMIN_BULK_DELETE=false` for production. Only set it to `true` temporarily in a test environment when intentionally clearing imported test data.

Keep `PUBLIC_BOOKING_CONFIRMATION_MODE=disabled` until an email or text provider has been selected and separately tested. Clients will still see the private cancel/reschedule link on the booking confirmation screen.

## Deploy Frontend

Run this after changing files in `frontend/public` or `firebase.json`:

```bash
cd "/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud"
firebase deploy --only hosting --project snack-crm
```

## Before Every Release

Run the full automated checks:

```bash
cd "/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud/backend"
npm test

cd "/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud"
npm run lint
```

Before deploying, record the current Firebase Hosting release and Cloud Run revision so there is an exact version to return to if needed.

- Firebase Console: **Hosting > Release history**
- Google Cloud Console: **Cloud Run > snack-crm-api > Revisions**

## Verify Production

Open:

```text
https://snack-crm.web.app
```

Expected result:

1. The staff sign-in page loads.
2. A `snackprogram.org` Google account can open the clean staff interface.
3. `https://snack-crm.web.app/booking.html` opens the public program and booking page.
4. Selecting an appointment type opens the public scheduler.

Run the automated read-only production check:

```bash
cd "/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud"
npm run qa:production:readonly
```

This command uses only `GET` requests. It verifies the health route, public booking pages and assets, booking settings, availability, and anonymous staff-data protection. It does not create, edit, cancel, or reschedule any appointment.

Check the public health route:

```bash
curl https://snack-crm.web.app/health
```

Check that the API blocks anonymous staff-data requests:

```bash
curl https://snack-crm.web.app/api/clients
```

Expected result:

```json
{"error":"Sign in is required."}
```

## Roll Back a Release

If the website layout or browser behavior is broken but the API is healthy:

1. Open **Firebase Console > Hosting > Release history**.
2. Find the release that was live immediately before the failed release.
3. Choose **Roll back** for that release.
4. Run `npm run qa:production:readonly` again.

If the API is broken:

1. Open **Google Cloud Console > Cloud Run > snack-crm-api > Revisions**.
2. Select **Manage traffic**.
3. Send 100% of traffic to the revision recorded before the release.
4. Confirm `https://snack-crm.web.app/health` returns `{"ok":true,"service":"snack-crm-api"}`.
5. Run `npm run qa:production:readonly` again.

If both are broken, roll back the Cloud Run revision first, then the Firebase Hosting release. A rollback changes the running version only; it does not delete Firestore records.

## Security Notes

- The backend currently allows any verified `@snackprogram.org` Google account.
- A future version should add roles such as `admin`, `staff`, or `viewer`.
- The Cloud Run Invoker IAM check is disabled so Firebase Hosting can forward browser requests to Cloud Run. The app-level Firebase token check is what protects the API.
- Admin bulk delete is disabled by default with `ALLOW_ADMIN_BULK_DELETE=false`; leave it off for production.

Public booking cancel and reschedule actions are protected by private management tokens. Public routes remain rate-limited. Confirmation delivery remains disabled until a provider is selected and tested.
