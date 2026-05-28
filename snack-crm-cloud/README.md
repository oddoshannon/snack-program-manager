# SNACK CRM Cloud Hello World

This folder is a tiny full-stack starting point for a future SNACK Program CRM on Google Cloud.

It intentionally does almost nothing:

- The frontend says `SNACK CRM`.
- The frontend asks the user to sign in with Google.
- The backend has a `/health` endpoint.
- The backend verifies the Firebase sign-in token before returning API data.
- The backend reads one message from a Firestore database collection named `messages`.
- The frontend calls the backend and displays that database message.
- Signed-in users can create, list, filter, edit, update status for, and delete simple test referrals.

The existing Google Apps Script CRM files in the parent folder are not part of this app.

## Recommended First Stack

For this first proof-of-architecture, use:

- **Frontend:** Firebase Hosting. Think of this as a simple public website host for the browser files.
- **Backend/API:** Cloud Run. Think of this as the place where Google runs the small server that answers API requests.
- **Database:** Firestore. Think of this as a simple cloud database where data is stored in collections and documents.

Firestore is the easiest first database because this hello-world app does not need database passwords, network rules, or a database server. Cloud SQL PostgreSQL is still a good later option if the CRM becomes reporting-heavy or needs strict relational data rules.

## Project Layout

```text
snack-crm-cloud/
  frontend/public/       Browser files for Firebase Hosting
  backend/               Node.js API for Cloud Run
  firebase.json          Firebase Hosting and emulator settings
```

## Local Development

### One-time tools to install

You only need to do these once on your computer.

1. Install Node.js from `https://nodejs.org/`.
2. Install the Firebase command-line tool:

   ```bash
   npm install -g firebase-tools
   ```

3. Install the Google Cloud command-line tool from `https://cloud.google.com/sdk/docs/install`.

### Run the app locally

Open a terminal in this folder:

```bash
cd "snack-crm-cloud"
```

Install the backend packages:

```bash
cd backend
npm install
cd ..
```

Start the local Firestore database emulator:

```bash
firebase emulators:start --only firestore
```

The Firestore emulator runs at `127.0.0.1:8085`. That is the local fake database used for practice.

Open a second terminal in this folder and start the backend:

```bash
cd "snack-crm-cloud/backend"
cp .env.example .env
npm run dev
```

The backend reads `.env` during local development. That file tells the backend to use the local Firestore emulator instead of the real cloud database. It also tells the backend to accept Firebase sign-in tokens from the `snack-crm` Firebase project and only allow `snackprogram.org` email addresses.

Open a third terminal in this folder and start the frontend:

```bash
cd "snack-crm-cloud"
firebase emulators:start --only hosting
```

Then open:

```text
http://localhost:5002
```

You should see `SNACK CRM`. After you sign in with a SNACK Google account, you should see the message `Hello from the SNACK CRM database.`
You should also see a small `Referrals` section where you can create and list test referrals.

You can also test the backend directly:

```text
http://localhost:8080/health
```

## Google Cloud and Firebase Setup

These steps create the cloud places where the hello-world app will live.

### 1. Create a Google Cloud project

A Google Cloud project is like a container for billing, settings, databases, and deployed apps.

1. Go to `https://console.cloud.google.com/`.
2. Click the project dropdown at the top.
3. Click **New Project**.
4. Name it something like `snack-crm-hello-world`.
5. Save the generated **Project ID**. It will look like `snack-crm-hello-world-123456`.

### 2. Turn on billing

Google requires billing to deploy Cloud Run services, even when usage is tiny.

1. In Google Cloud Console, search for **Billing**.
2. Link the new project to a billing account.
3. Keep budgets and alerts on if you want spending warnings.

### 3. Enable required services

APIs are Google services that must be switched on before the app can use them.

Run these commands after replacing `YOUR_PROJECT_ID` with your real project ID:

```bash
gcloud config set project YOUR_PROJECT_ID
gcloud services enable run.googleapis.com firestore.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

### 4. Create the Firestore database

Firestore is the database.

1. Go to `https://console.cloud.google.com/firestore`.
2. Choose **Create database**.
3. Choose **Native mode**.
4. Choose a region close to your users, such as `us-central1`.
5. Start in production mode.

You do not need to manually create the `messages` collection. The backend creates the first `messages/hello` document the first time it runs.

### 5. Connect Firebase to the same project

Firebase Hosting will serve the frontend.

1. Go to `https://console.firebase.google.com/`.
2. Click **Add project**.
3. Choose the same Google Cloud project you created above.
4. Continue through the setup prompts.
5. In the Firebase project, go to **Build > Hosting** and click **Get started**.

### 6. Enable Google sign-in

Firebase Authentication is the login system.

1. Go to `https://console.firebase.google.com/project/snack-crm/authentication`.
2. Click **Get started** if Authentication has not been set up yet.
3. Go to the **Sign-in method** tab.
4. Choose **Google**.
5. Enable it.
6. Pick the support email shown by Firebase.
7. Save.

### 7. Login locally

These commands let your computer deploy to your Google accounts:

```bash
gcloud auth login
firebase login
```

## Deploy the Backend to Cloud Run

From the `snack-crm-cloud/backend` folder:

```bash
gcloud run deploy snack-crm-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

When it finishes, Google prints a **Service URL**. It looks like:

```text
https://snack-crm-api-abc123-uc.a.run.app
```

Test it in your browser by adding `/health`:

```text
https://YOUR_CLOUD_RUN_URL/health
```

## Deploy the Frontend to Firebase Hosting

The deployed frontend calls `/api/message` on the same Firebase Hosting website. Firebase Hosting forwards that request to Cloud Run using the rewrite rules in `firebase.json`.

Create a real Firebase project config file:

```bash
cp .firebaserc.example .firebaserc
```

Open `.firebaserc` and replace `your-gcp-project-id` with your real project ID.

Then deploy from the `snack-crm-cloud` folder:

```bash
firebase deploy --only hosting
```

Firebase prints a Hosting URL. Open it, sign in with a SNACK Google account, and confirm the page says `SNACK CRM` and shows the database message.

## Later, Not Now

This first version is only the plumbing test. Later versions can add:

- Clients
- Referrals
- Appointments
- Tasks
- Native forms
- Google Calendar sync
- Reporting dashboards
- SMS and phone integrations
