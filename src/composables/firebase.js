import { ref, watch, reactive } from "vue";
import {
    getDatabase,
    ref as dbRef,
    set as dbSet,
    child,
    push,
    onValue,
    update,
} from "firebase/database";
import {
    doc,
    getDoc,
    getFirestore,
    collection,
    addDoc,
} from "firebase/firestore";
import {
    stopWatchingLocation,
    startWatchingLocation,
    location,
    getQuickLocation,
} from "src/composables/geo";
import {
    saveTrackerToHistory,
    user,
    loadHistoryData,
} from "src/composables/user";
import { dbBasePath, fbLog } from "src/boot/firebase";
import { Share } from "@capacitor/share";

const trackingLinkSent = ref(false);
const recipientOpened = ref(false);
const trackingInProgress = ref(false);
const trackerKey = ref();
const smsBody = ref(null);
const smsTo = ref(null);
const rtdb = getDatabase();
const db = getFirestore();
const shareResult = reactive({ data: {} });
const shareLoading = ref(false);

watch(location, () => {
    appendCoords(location.locData);
});

function getTextBody(input, url) {
    if (input.sendFrom == "phone") {
        return `Hello! This is ${input.name}. I'm on the way. You can track my location by visiting this link.`;
    }
    return `Hello!
${input.name} wants you to know they're on the way. You can track their location by visiting this link.
Msg sent to ${input.to}. Reply STOP to opt out of future messages.

${url}`;
}

function prepareSms(input, key) {
    return new Promise(async (resolve, reject) => {
        if (input.to.length === 14) {
            smsTo.value = `+${input.to.replace(/\D/g, "")}`;
        } else if (input.to.length === 12) {
            smsTo.value = `+1${input.to.replace(/\D/g, "")}`;
        } else if (input.sendFrom != "phone") {
            console.error("User phone input length not correct");
        }

        input.to = smsTo.value; //for text body

        const docRef = await doc(db, "globalSettings", "sms");
        const sms = await getDoc(docRef);
        const from = sms.data().from;
        smsBody.value = getTextBody(input, `https://onmyway.pro/${key}`);

        resolve({
            to: smsTo.value,
            from: from,
            body: smsBody.value,
        });
    });
}

function errCallback(errorString) {
    trackingInProgress.value = false;
    const updates = {};

    updates["status"] = "error";
    updates["errorTime"] = new Date().getTime();
    updates["msg"] = errorString;

    update(dbRef(rtdb, dbBasePath + "/" + trackerKey.value), updates);
}

function shareText(options) {
    return new Promise(async (resolve, reject) => {
        await Share.share(options)
            .then((res) => {
                shareResult.data = res;
                fbLog(`share_success`);
                shareLoading.value = false;
                trackingLinkSent.value = true;
                resolve();
            })
            .catch((err) => {
                endWatch();
                fbLog(`share_error_${err}`);
                shareResult.data = err;
                trackingLinkSent.value = false;
                shareLoading.value = false;
                reject(err);
                return;
            });
    });
}

function createAndSendNewTracker(input) {
    return new Promise(async (resolve, reject) => {
        // get quick and dirty location to verify we have permissoins quickly
        try {
            await getQuickLocation();
        } catch (error) {
            reject(error);
            return;
        }

        // get real location watcher
        try {
            startWatchingLocation(errCallback);
        } catch (error) {
            reject(error);
            return;
        }
        const trackerMetaData = {
            driverData: { name: input.name, uid: user.data?.uid },
            status: "inProgress",
            startTime: new Date().getTime(),
            recipientOpened: false,
            trackingLinkSent: false,
            coords: [],
        };

        trackerKey.value = await push(child(dbRef(rtdb), dbBasePath)).key;
        const textData = await prepareSms(input, trackerKey.value);

        if (input.sendFrom == "phone") {
            shareLoading.value = true;
            try {
                await shareText({
                    text:
                        textData.body +
                        "\n" +
                        `https://onmyway.pro/${trackerKey.value}`,
                });
            } catch (error) {
                console.log("error sharing text: ", error);
                reject(error);
            }
        } else {
            // precesne of field 'textData' triggers google function to send text from Twilio
            trackerMetaData.textData = textData;
        }
        if (shareResult.data.errorMessage) {
            console.log(
                "shareResult.data.errorMessage: ",
                shareResult.data.errorMessage
            );
            shareLoading.value = false;
            return;
        }

        // listeners for UI updates
        onValue(
            dbRef(
                rtdb,
                dbBasePath + "/" + trackerKey.value + "/recipientOpened"
            ),
            (snapshot) => {
                const data = snapshot.val();
                if (recipientOpened.value == false && data == true) {
                    recipientOpened.value = true;
                    trackingLinkSent.value = true;
                }
            }
        );

        onValue(
            dbRef(
                rtdb,
                dbBasePath + "/" + trackerKey.value + "/trackingLinkSent"
            ),
            (snapshot) => {
                const data = snapshot.val();
                if (trackingLinkSent.value == false && data == true) {
                    trackingLinkSent.value = true;
                }
            }
        );
        dbSet(dbRef(rtdb, dbBasePath + "/" + trackerKey.value), trackerMetaData)
            .then(() => {
                saveTrackerToHistory(trackerKey.value);
                resolve();
            })
            .catch((err) => console.error("error setting DB: ", err));
    });
}

async function appendCoords(coordsValue) {
    trackingInProgress.value = true;
    const newCoord = push(
        dbRef(rtdb, dbBasePath + "/" + trackerKey.value + "/coords")
    );
    dbSet(newCoord, coordsValue);
}

function endWatch() {
    fbLog("endWatch");
    stopWatchingLocation(trackingInProgress);
    const trackerRef = dbRef(rtdb, dbBasePath + "/" + trackerKey.value);
    onValue(trackerRef, (snapshot) => {
        if (snapshot.val()) {
            const updates = {};
            updates["status"] = "ended";
            updates["endTime"] = new Date().getTime();

            update(trackerRef, updates).then(() => {
                loadHistoryData();
            });
        }
    });
}

async function submitContactUsForm(options) {
    return new Promise(async (resolve, reject) => {
        await addDoc(collection(db, "contactUsSubmissions"), options);
        resolve();
    });
}

export {
    createAndSendNewTracker,
    trackingLinkSent,
    recipientOpened,
    trackerKey,
    endWatch,
    submitContactUsForm,
    trackingInProgress,
    smsBody,
    smsTo,
    shareResult,
    shareLoading,
};
