# Receipt IQ

## API connection

The app uses the PHP REST API in `api/` for registration, login, and expense records.

Start Apache and MySQL in XAMPP, then import `database/receipt_iq_db.sql` into MySQL.
The default API URL is `http://localhost/receiptiq/api` on web and iOS, and
`http://10.0.2.2/receiptiq/api` on the Android emulator.

For a physical phone, set the computer's LAN address before starting Expo:

```powershell
$env:EXPO_PUBLIC_API_URL = "http://YOUR_COMPUTER_IP/receiptiq/api"
npm start
```

Open the `App.js` file to start writing some code. You can preview the changes directly on your phone or tablet by scanning the **QR code** or use the iOS or Android emulators. When you're done, click **Save** and share the link!

When you're ready to see everything that Expo provides (or if you want to use your own editor) you can **Download** your project and use it with [expo cli](https://docs.expo.dev/get-started/installation/#expo-cli)).

All projects created in Snack are publicly available, so you can easily share the link to this project via link, or embed it on a web page with the `<>` button.

If you're having problems, you can tweet to us [@expo](https://twitter.com/expo) or ask in our [forums](https://forums.expo.dev/c/expo-dev-tools/61) or [Discord](https://chat.expo.dev/).

Snack is Open Source. You can find the code on the [GitHub repo](https://github.com/expo/snack).
