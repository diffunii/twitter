import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const config = {
  apiKey: "AIzaSyBeM_8ldWDc8TKjDNdkQx4tFfJYCxmEk8I",
  authDomain: "twitter-2b855.firebaseapp.com",
  projectId: "twitter-2b855",
  storageBucket: "twitter-2b855.appspot.com",
  messagingSenderId: "761759590132",
  appId: "1:761759590132:web:36e1aa2e227c49330ce0a1",
};
const app = initializeApp(config);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
