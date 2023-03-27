const routes = [
    {
        path: "/",
        component: () => import("layouts/MainLayout.vue"),
        children: [
            {
                path: "",
                component: () => import("pages/InitialLoading.vue"),
                name: "InitialLoading",
            },
            {
                path: "main",
                component: () => import("pages/IndexPage.vue"),
                name: "main",
            },
            {
                path: "welcome",
                component: () => import("src/pages/WelcomePage.vue"),
                name: "welcome",
            },
        ],
    },

    // // Always leave this as last one,
    // // but you can also remove it
    {
        path: "/:catchAll(.*)*",
        beforeEnter: (x, y, z) => {
            console.log("catchAll");
        },
        component: () => import("pages/ErrorNotFound.vue"),
        name: "404",
    },
];

export default routes;
