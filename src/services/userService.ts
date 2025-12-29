import type { User } from '../models/User';

export const userService = {
    async getUsers(): Promise<User[]> {
        // In a real app, this would be an API call
        return [
            { id: 1, username: 'jdoe', email: 'john@example.com', role: 'admin' },
            { id: 2, username: 'asmith', email: 'alice@example.com', role: 'user' },
        ];
    },

    async getUserById(id: number): Promise<User | undefined> {
        const users = await this.getUsers();
        return users.find(u => u.id === id);
    }
};
