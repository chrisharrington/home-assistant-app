import { create } from 'zustand';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store'
import { Person } from '@lib/entities';
import { register } from '@lib/data/homeAssistant';

const SESSION_STORE_KEY = 'session';

export type Session = Person & {
    webhook_id: string;
}

type SessionStore = {
    session: Session | null;
    setUser: (user: Person | null) => Promise<void>;
}

export const useSession = create<SessionStore>((set, get) => ({
    session: null,
    setUser: async (user: Person | null) => {
        if (user) {
            const webhookId = await register(user),
                session = { ...user, webhook_id: webhookId };

            setItemAsync(SESSION_STORE_KEY, JSON.stringify(session));
            set({ session });
        } else {
            deleteItemAsync(SESSION_STORE_KEY);
            set({ session: null });
        }
    }
}));

getItemAsync(SESSION_STORE_KEY).then(userString => {
    if (userString)
        useSession.setState({ session: JSON.parse(userString) });
});