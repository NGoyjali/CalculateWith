import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/paper',
        name: 'Paper',
        component: () => import('../pages/PaperPage.vue')
    },
    {
        path: '/paper-history',
        name: 'PaperHistory',
        component: () => import('../pages/PaperHistoryPage.vue')
    },
    {
        path: '/polymer',
        name: 'Polymer',
        component: () => import('../pages/PolymerPage.vue')
    },
    {
        path: '/polymer-history',
        name: 'PolymerHistory',
        component: () => import('../pages/PolymerHistoryPage.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
