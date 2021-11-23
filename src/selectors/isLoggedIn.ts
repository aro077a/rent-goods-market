import { IApplicationStore } from "@/store/rootReducer";

export const isLoggedIn = (state: IApplicationStore) => state.sessionReducer.logged;
