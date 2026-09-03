# MediSked

MediSked is a medication management and adherence support system for patients, caregivers, and administrators. It will support medication records, schedules, dose tracking, refill monitoring, caregiver sharing, reports, and assistive prescription-label extraction.

## Architecture

The project uses one shared Expo/React Native frontend for Android and Expo Web. Both clients communicate with a PHP REST API, which owns authentication, authorization, validation, business logic, notifications, audit logging, and future AI integration. The API is the only application layer allowed to access MySQL/MariaDB.

```text
Expo Android / Expo Web
		|
		v
	PHP REST API
		|
		v
	 MySQL/MariaDB
```

AI will be called by the backend only. Extracted medication information must be reviewed by the user before it becomes an active record.

## Repository Organization

The `frontend/`, `backend/`, `database/`, `docs/`, and `postman/` directories are the new migration foundation. The current ReceiptIQ application remains at the repository root while functionality is extracted incrementally.

- `frontend/` will contain shared screens, components, services, theme, and types.
- `backend/` will contain versioned API routes, middleware, configuration, and private uploads.
- `database/schema.sql` is the standalone MediSked target schema.
- `database/receipt_iq_db (3).sql` remains the untouched ReceiptIQ reference schema.
- `docs/` and `postman/` are reserved for API, architecture, security, and testing artifacts.

## Current Migration Status

Phase 1 is complete: target directories, a secrets-free environment template, the MediSked target schema, and this foundation documentation have been added. No ReceiptIQ application code, API endpoint, existing database, or dependency has been changed. Medication workflows, authentication migration, AI integration, and frontend extraction are intentionally deferred.

## Development Setup

The existing ReceiptIQ reference app can still be run with:

```powershell
npm install
npm start
```

For the current reference API, use the existing XAMPP/Apache and MySQL setup described below. Do not import `database/schema.sql` into the ReceiptIQ database; it targets the separate `medisked_db` database and is not connected to the current app yet.

Future MediSked development should copy `.env.example` to a local environment file, use a non-privileged database account, and serve the API over HTTPS outside local development. Never commit real passwords, API keys, session secrets, or uploaded files.

## Legacy ReceiptIQ Reference

## API connection

The app uses the PHP REST API in `api/` for registration, login, and expense records.

Copy this project into XAMPP's `htdocs` directory as `receipt-iq`, start Apache and
MySQL, then import `database/receipt_iq_db (2).sql` into MySQL. The default API URL is
`http://localhost/receipt-iq/api` on web and iOS, and
`http://10.0.2.2/receipt-iq/api` on the Android emulator.

If the database was imported before the `role` column was added, run this once:

```sql
ALTER TABLE user ADD COLUMN role varchar(20) NOT NULL DEFAULT 'user';
UPDATE user SET role = 'admin' WHERE email = 'admin@gmail.com';
```

For a physical phone, the start script automatically detects the computer's LAN
address and selects an available Expo port starting at 8082:

```powershell
npm start
```

Keep the phone and computer on the same network, and allow Apache through Windows
Firewall when testing on a physical phone.

Open the `App.js` file to start writing some code. You can preview the changes directly on your phone or tablet by scanning the **QR code** or use the iOS or Android emulators. When you're done, click **Save** and share the link!

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo cli](https://docs.expo.dev/get-started/installation/#expo-cli)).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.dev/c/expo-dev-tools/61) or [Discord](https://chat.expo.dev/).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).
