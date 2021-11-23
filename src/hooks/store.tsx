import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";

import { IApplicationStore } from "@/store/rootReducer";
import { store } from "@/components/App";

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<IApplicationStore> = useSelector;
