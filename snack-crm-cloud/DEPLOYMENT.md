# SNACK CRM Cloud Deployment Notes

This document explains the tiny cloud foundation that is currently deployed.

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
   - Current test collection: `messages`
   - Current test document: `messages/hello`
   - First CRM collection: `referrals`

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

## Verify Production

Open:

```text
https://snack-crm.web.app
```

Expected result:

1. Page says `SNACK CRM`.
2. User can sign in with a `snackprogram.org` Google account.
3. Page displays `Hello from the SNACK CRM database.`

Check the public health route:

```bash
curl https://snack-crm.web.app/health
```

Check that the API blocks anonymous requests:

```bash
curl https://snack-crm.web.app/api/message
```

Expected result:

```json
{"error":"Sign in is required."}
```

## Security Notes

- Do not put real client data into this app until role-based access and data rules are designed.
- The backend currently allows any verified `@snackprogram.org` Google account.
- A future version should add roles such as `admin`, `staff`, or `viewer`.
- The Cloud Run Invoker IAM check is disabled so Firebase Hosting can forward browser requests to Cloud Run. The app-level Firebase token check is what protects the API.
- Admin bulk delete is disabled by default with `ALLOW_ADMIN_BULK_DELETE=false`; leave it off for production.

## First Real Feature

The first protected CRM feature is:

```text
referrals
```

Reason: referrals are likely the first intake point before clients, appointments, tasks, or reports.

Current fields:

```text
referrals/{referralId}
  firstName
  lastName
  phone
  email
  referralSource
  status
  notes
  createdAt
  updatedAt
  createdBy
  updatedBy
```

The current app can create referrals, list and filter the 25 most recent referrals, view status counts, see created dates, edit referral details, update referral status, and delete test referrals. Keep this small until roles and stricter deletion rules are designed.
