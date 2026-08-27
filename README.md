# Receipt IQ

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
