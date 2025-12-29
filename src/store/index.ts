import { defineStore } from 'pinia';

export const useMainStore = defineStore('main', {
    state: () => ({
        user: null as any,
        isLoggedIn: false
    }),
    actions: {
        setUser(user: any) {
            this.user = user;
            this.isLoggedIn = !!user;
        }
    }
});
