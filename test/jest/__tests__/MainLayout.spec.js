import { describe, expect, it } from "@jest/globals";
import { installQuasarPlugin } from "@quasar/quasar-app-extension-testing-unit-jest";
import { mount } from "@vue/test-utils";
import routes from "src/router/routes";
import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "src/layouts/MainLayout.vue";
import WelcomePage from "src/pages/WelcomePage.vue";
import IndexPage from "src/pages/IndexPage.vue";

installQuasarPlugin();

const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});

class ResizeObserver {
    observe() {}
    unobserve() {}
}

describe("MainLayout", () => {
    window.ResizeObserver = ResizeObserver;
    const wrapper = mount(MainLayout, {
        global: {
            plugins: [router],
            stubs: {
                AsyncComponentWrapper: true,
            },
        },
    });

    it("Renders the router view", async () => {
        expect(wrapper.html()).toContain(
            '<div class="flex flex-center"></div>'
        );
    });

    it("loads the WelcomePage and clicks button", async () => {
        await router.push({ name: "welcome" });
        const welcomePage = wrapper.findComponent(WelcomePage);

        const btn = welcomePage.find("#start-now");
        await btn.trigger("click");
        expect(welcomePage.vm.clicked).toBe(1);
        expect(wrapper.emitted().click).toBeTruthy();
    });

    it("loads the IndexPage", async () => {
        await router.push({ name: "main" });
        const indexPage = wrapper.findComponent(IndexPage);
        expect(indexPage.exists()).toBe(true);

        const bottomLogo = indexPage.find({ ref: "bottomLogo" });
        expect(bottomLogo.exists()).toBe(true);
    });

    it("Clicks the 'send' button properly", async () => {
        const indexPage = wrapper.findComponent(IndexPage);
        expect(indexPage.exists()).toBe(true);

        const initSendBtn = indexPage.find("#init-send");
        await initSendBtn.trigger("click");

        expect(indexPage.vm.loadTrackingAnimation).toBe(true);
    });
});
