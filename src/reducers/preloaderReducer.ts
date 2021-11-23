import { AnyAction } from "redux";

import { SHOW_PRELOADER } from "@/actions/preloaderActions";

export interface IPreloaderState {
  queue: number;
  preloader?: boolean;
}

const initialState: IPreloaderState = {
  queue: 0,
  preloader: false,
};

const prealoderReducer = (state = initialState, action: AnyAction): IPreloaderState => {
  switch (action.type) {
    case SHOW_PRELOADER: {
      const queue = Math.max(action.show ? state.queue + 1 : state.queue - 1, 0);
      return {
        ...state,
        queue,
        preloader: !!queue,
      };
    }
  }
  return state;
};

export default prealoderReducer;
