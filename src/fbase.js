import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBeM_8ldWDc8TKjDNdkQx4tFfJYCxmEk8I",
  authDomain: "twitter-2b855.firebaseapp.com",
  projectId: "twitter-2b855",
  storageBucket: "twitter-2b855.appspot.com",
  messagingSenderId: "761759590132",
  appId: "1:761759590132:web:36e1aa2e227c49330ce0a1",
};

const app = initializeApp(firebaseConfig);

async function requestPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "denied") {
    alert(
      "알림 권한이 허용되지 않았습니다.\n알림을 받으시려면 알림 권한을 허용해 주세요."
    );
    return;
  }

  console.log("알림 권한이 허용됨");

  const swRegistration = await navigator.serviceWorker.register(
    "./firebase-messaging-sw.js"
  );

  const token = await getToken(messaging, {
    vapidKey:
      "BHSrTsbuFPyMNqqrt6r9SMRG3ysncEjssMu3k3LUsP_IcTxpF5Dy3ntvkpkG9DGL6ooh_X8_NfIr23R5gnD3jmg",
    serviceWorkerRegistration: swRegistration,
  });

  if (token) {
    console.log("token: ", token);
  } else {
    console.log("Can not get Token");
  }

  onMessage(messaging, (payload) => {
    console.log("메시지가 도착했습니다.", payload);
    alert(payload);
  });
}

requestPermission();

export const storageService = getStorage(app);
export const dbService = getFirestore(app);
export const firebaseInstance = getAuth(app);
export const authService = getAuth(app);
export const messaging = getMessaging(app);
