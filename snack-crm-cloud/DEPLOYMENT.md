# SNACK CRM Cloud Deployment Notes

This document explains the current cloud app, release checks, and rollback steps.

## Live URLs

- Frontend website and API: `https://hub.snackprogram.org`
- Backend service: `https://snack-crm-api-1013266498299.us-central1.run.app`
- Google Cloud project: `snack-crm`
- Cloud Run service: `snack-crm-api`
- Firestore database: `(default)`

## What Is Running

The app has three active cloud pieces:

1. **Firebase Authentication with Identity Platform**
   - Lets users sign in with Google.
   - Google sign-in is enabled in Firebase Console.
   - The browser gets a Firebase login token after sign-in.

2. **Cloud Run**
   - Serves the browser pages and backend API from `https://hub.snackprogram.org`.
   - Verifies the Firebase login token before returning API data.
   - Only allows verified emails ending in `@snackprogram.org`.

3. **Firestore**
   - Stores app data.
   - Stores clients, referrals, appointments, tasks, program records, and settings.

## Request Flow

When someone opens the app:

1. The browser loads the website from Cloud Run at `hub.snackprogram.org`.
2. The user signs in with Google.
3. Firebase Authentication gives the browser a login token.
4. The browser calls `/api/message` and sends that token.
5. Cloud Run verifies the token.
6. Cloud Run reads the requested data from Firestore.
7. The browser displays the data.

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

## Deploy The Hub

Cloud Run serves both the browser pages and the API. Run this from the project
folder after changing backend or frontend code:

```bash
cd "/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud"
gcloud run deploy snack-crm-api \
  --source . \
  --region us-central1 \
  --project snack-crm \
  --update-env-vars FIREBASE_AUTH_PROJECT_ID=snack-crm,ALLOWED_EMAIL_DOMAIN=snackprogram.org,ALLOW_ADMIN_BULK_DELETE=false,PUBLIC_BOOKING_CONFIRMATION_MODE=disabled,PUBLIC_BOOKING_PAGE_URL=https://hub.snackprogram.org/book.html,STAFF_APP_URL=https://hub.snackprogram.org,FRONTEND_ORIGINS=https://hub.snackprogram.org,SERVE_FRONTEND=true
```

Keep `ALLOW_ADMIN_BULK_DELETE=false` for production. Only set it to `true` temporarily in a test environment when intentionally clearing imported test data.

Keep `PUBLIC_BOOKING_CONFIRMATION_MODE=disabled` until an email or text provider has been selected and separately tested. Clients will still see the private cancel/reschedule link on the booking confirmation screen.

### MailerLite secret

Store the MailerLite API token in Google Secret Manager. Never put the token in
the repository, a normal environment-variable command, or a chat message.

Create the secret from a hidden Terminal prompt:

```zsh
read -s "MAILERLITE_TOKEN?Paste the MailerLite token, then press Return: "
printf '\n'
printf '%s' "$MAILERLITE_TOKEN" | gcloud secrets create mailerlite-api-token \
  --project=snack-crm \
  --replication-policy=automatic \
  --data-file=-
unset MAILERLITE_TOKEN
```

Allow the Cloud Run service account to read only that secret:

```bash
gcloud secrets add-iam-policy-binding mailerlite-api-token \
  --project=snack-crm \
  --member='serviceAccount:1013266498299-compute@developer.gserviceaccount.com' \
  --role='roles/secretmanager.secretAccessor'
```

Attach the secret to Cloud Run without displaying its value:

```bash
gcloud run services update snack-crm-api \
  --region=us-central1 \
  --project=snack-crm \
  --update-secrets=MAILERLITE_API_TOKEN=mailerlite-api-token:latest
```

The current connection check makes one read-only request to MailerLite. It does
not create contacts or send email. Marketing delivery remains disabled.

### Twilio test details

Use only the **Test Account SID** and **Test Auth Token** from Twilio's API keys
and tokens page. Do not use live credentials for this check and never paste
either value into chat.

Create both secrets from hidden Terminal prompts:

```zsh
read -s "TWILIO_TEST_SID?Paste the Twilio Test Account SID, then press Return: "
printf '\n'
printf '%s' "$TWILIO_TEST_SID" | gcloud secrets create twilio-test-account-sid \
  --project=snack-crm --replication-policy=automatic --data-file=-
unset TWILIO_TEST_SID

read -s "TWILIO_TEST_TOKEN?Paste the Twilio Test Auth Token, then press Return: "
printf '\n'
printf '%s' "$TWILIO_TEST_TOKEN" | gcloud secrets create twilio-test-auth-token \
  --project=snack-crm --replication-policy=automatic --data-file=-
unset TWILIO_TEST_TOKEN
```

Give the Cloud Run service account access to those two secrets, then attach them
as `TWILIO_TEST_ACCOUNT_SID` and `TWILIO_TEST_AUTH_TOKEN`. The Admin integration
test always uses Twilio's fake test number and keeps real delivery disabled.

Do not deploy Firebase Hosting. It is intentionally disabled; the active Hub
pages are included in the Cloud Run container.

## Before Every Release

Run the full automated checks:

```bash
cd "/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud/backend"
npm test

cd "/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud"
npm run lint
```

Before deploying, record the current Cloud Run revision so there is an exact version to return to if needed.

- Google Cloud Console: **Cloud Run > snack-crm-api > Revisions**

## Verify Production

Open:

```text
https://hub.snackprogram.org
```

Expected result:

1. The staff sign-in page loads.
2. A `snackprogram.org` Google account can open the clean staff interface.
3. `https://hub.snackprogram.org/booking.html` opens the public program and booking page.
4. Selecting an appointment type opens the public scheduler.

Run the automated read-only production check:

```bash
cd "/Users/shannonoddo/Desktop/CRM App/snack-crm-cloud"
npm run qa:production:readonly
```

This command uses only `GET` requests. It verifies the health route, public booking pages and assets, booking settings, availability, and anonymous staff-data protection. It does not create, edit, cancel, or reschedule any appointment.

Check the public health route:

```bash
curl https://hub.snackprogram.org/health
```

Check that the API blocks anonymous staff-data requests:

```bash
curl https://hub.snackprogram.org/api/clients
```

Expected result:

```json
{"error":"Sign in is required."}
```

## Roll Back a Release

If the website or API is broken:

1. Open **Google Cloud Console > Cloud Run > snack-crm-api > Revisions**.
2. Select **Manage traffic**.
3. Send 100% of traffic to the revision recorded before the release.
4. Confirm `https://hub.snackprogram.org/health` returns `{"ok":true,"service":"snack-crm-api"}`.
5. Run `npm run qa:production:readonly` again.

A Cloud Run rollback changes the running version only; it does not delete Firestore records.

## Security Notes

- A verified `@snackprogram.org` Google account must also have an active Hub
  staff profile and the required module permission.
- The Cloud Run service accepts browser connections, while the app-level Firebase token and staff-account checks protect every private API action.
- Admin bulk delete is disabled by default with `ALLOW_ADMIN_BULK_DELETE=false`; leave it off for production.

Public booking cancel and reschedule actions are protected by private management tokens. Public routes remain rate-limited. Confirmation delivery remains disabled until a provider is selected and tested.
