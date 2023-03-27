import { disableAnaytics, enableAnaytics } from "src/boot/firebase";
import { history, user, loadHistoryData } from "src/boot/user";
import { Preferences } from "@capacitor/preferences";

async function saveUserName(name) {
    if (typeof name != "string") {
        console.error(
            `invalid parameter type, name must be a string, received typeof ${typeof name}`
        );
        return false;
    }
    Preferences.set({
        key: "userName",
        value: name,
    });
}

async function saveTrackerToHistory(trackerId) {
    history[trackerId] = {};
    Preferences.set({
        key: "trackingHistory",
        value: JSON.stringify(history),
    });
    loadHistoryData();
}

function updatePrivacySettings(bool) {
    bool ? enableAnaytics() : disableAnaytics();
    Preferences.set({
        key: "analyticsEnabled",
        value: String(bool),
    });
}

export {
    saveUserName,
    history,
    user,
    saveTrackerToHistory,
    updatePrivacySettings,
    loadHistoryData,
};
