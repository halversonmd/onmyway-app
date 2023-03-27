import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, child } from "firebase/database";
import { initializeAuth, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FirebaseAnalytics } from "@capacitor-firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_ID,
    appId: process.env.FB_APP_ID,
    databaseURL: process.env.FB_DB_URL,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

getFirestore(app);
const auth = initializeAuth(app, {
    persistence: browserLocalPersistence,
}); //https://github.com/firebase/firebase-js-sdk/issues/5019
const dbBasePath = "trackers";

function fbLog(event, options) {
    options = options ? { name: event, params: options } : { name: event };
    FirebaseAnalytics.logEvent(options);
}

function analyticsSetUserId(userId) {
    FirebaseAnalytics.setUserId({
        userId: userId,
    });
}

function disableAnaytics() {
    FirebaseAnalytics.setEnabled({
        enabled: false,
    });
}

function enableAnaytics() {
    FirebaseAnalytics.setEnabled({
        enabled: true,
    });
}

enableAnaytics();
export {
    db,
    ref,
    push,
    child,
    dbBasePath,
    fbLog,
    analyticsSetUserId,
    disableAnaytics,
    enableAnaytics,
    auth,
};
