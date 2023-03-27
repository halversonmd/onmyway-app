import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getDatabase, ref as dbRef, child, get } from "firebase/database";
import {
    dbBasePath,
    auth,
    analyticsSetUserId,
    disableAnaytics,
} from "src/boot/firebase";
import { reactive } from "vue";
import { Preferences } from "@capacitor/preferences";

const user = reactive({
    data: null,
    returningUser: null,
    name: null,
    analyticsEnabled: true,
});
const history = reactive({});

onAuthStateChanged(auth, async (authedUser) => {
    if (authedUser) {
        const { value } = await Preferences.get({ key: "userName" });
        const analytics = await Preferences.get({ key: "analyticsEnabled" });
        if (analytics.value == "true" || !analytics.value) {
            user.analyticsEnabled = true;
        } else if (analytics.value == "false") {
            disableAnaytics(); //default is enabled
            user.analyticsEnabled = false;
        }
        analyticsSetUserId(authedUser.uid);
        user.data = authedUser;
        user.returningUser = true;
        user.name = value;
    } else {
        console.log("user signed out");
    }
});

async function loadHistoryData() {
    const trackerRef = dbRef(getDatabase());
    for (const trackerId of Object.keys(history)) {
        try {
            const snapshot = await get(
                child(trackerRef, `${dbBasePath}/${trackerId}`)
            );
            if (snapshot.exists()) {
                history[trackerId] = snapshot.val();
            }
        } catch (error) {
            console.error(error);
        }
    }
}

function initialAnonSignIn() {
    return new Promise((resolve, reject) => {
        signInAnonymously(auth)
            .then(() => {
                Preferences.set({
                    key: "returningUser",
                    value: "true",
                });
                resolve();
            })
            .catch((error) => {
                console.warn("signInAnonymously ERROR: ", error);
                reject();
            });
    });
}

export default async ({ app, router, store }) => {
    const isReturningUser = await Preferences.get({ key: "returningUser" });
    user.returningUser = Boolean(isReturningUser.value);
    const userName = await Preferences.get({ key: "userName" });

    user.name = userName.value;
    const { value } = await Preferences.get({ key: "trackingHistory" });

    if (value) {
        Object.assign(history, JSON.parse(value));
        loadHistoryData();
    }
    await initialAnonSignIn();
};

export { user, history, loadHistoryData };
