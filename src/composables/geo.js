import { registerPlugin } from "@capacitor/core";
const BackgroundGeolocation = registerPlugin("BackgroundGeolocation");
import { ref, reactive } from "vue";

const watcherId = ref();
const location = reactive({ locData: null });

async function startWatchingLocation(errCallback) {
    return new Promise(async (resolve, reject) => {
        console.log("getting location");
        watcherId.value = await BackgroundGeolocation.addWatcher(
            {
                // Msg shown on Android only, also needed for background on iOS
                backgroundMessage:
                    "Please allow background updates if you want to use another app while tracking",
                backgroundTitle: "On My Way Location Updates",
                requestPermissions: true,
                stale: false,
                distanceFilter: process.env.NODE_ENV === "production" ? 5 : 0,
            },
            function callback(loc, error) {
                if (error) {
                    errCallback(error.code);

                    if (error.code === "NOT_AUTHORIZED") {
                        if (
                            window.confirm(
                                "This app needs your location, " +
                                    "but does not have permission.\n\n" +
                                    "Open settings now?"
                            )
                        ) {
                            BackgroundGeolocation.openSettings();
                        }
                    }
                    return reject(error);
                }
                location.locData = loc;
                console.log("got location");
                resolve();
                return;
            }
        );
    });
}

async function stopWatchingLocation(trackingInProgress) {
    await BackgroundGeolocation.removeWatcher({
        id: watcherId.value,
    });
    trackingInProgress.value = false;
    watcherId.value = null;
}

function getQuickLocation() {
    return new Promise(async (resolve, reject) => {
        let last_location;
        BackgroundGeolocation.addWatcher(
            {
                requestPermissions: false,
                stale: true,
            },
            function (location, error) {
                if (error) {
                    if (error.code === "NOT_AUTHORIZED") {
                        if (
                            window.confirm(
                                "This app needs your location, " +
                                    "but does not have permission.\n\n" +
                                    "Open settings now?"
                            )
                        ) {
                            BackgroundGeolocation.openSettings();
                        }
                    }
                    return reject(error);
                }
                last_location = location || undefined;
                resolve();
            }
        ).then(function (id) {
            setTimeout(function () {
                BackgroundGeolocation.removeWatcher({ id });
            }, 3000);
        });
    });
}

export {
    stopWatchingLocation,
    startWatchingLocation,
    location,
    getQuickLocation,
};
