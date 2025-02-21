// import { create } from 'zustand';
// //import { AppState, States, Modules, ChatData, FlowData, HomeData, SettingData, Configs } from './system.type';
// import { produce } from 'immer';


// import { AppState, Modules, States } from './sys.type';


// interface State {
//   app_data: AppState;
//   setAppData: (state: (preState: AppState) => Partial<AppState>) => void;

// }

// // 创建一个 zustand store
// const useAppStore = create<State>((set) => ({
//   app_data: {
//     current_module: Modules.Chat,
//     app_ready: false,
//     app_state: States.Loading,
//     is_moblie: false,
//     orientation: undefined
//   },
//   // config_data: {
//   //   url: '',
//   //   token: '',
//   //   mock: false,
//   // },
//   // chat_data: {
//   //   state: ModuleState.Loading,
//   //   current_conversation_messages: {
//   //     has_more: false,
//   //     limit: 30,
//   //     data: []
//   //   },
//   //   conversations: {
//   //     has_more: false,
//   //     limit: 30,
//   //     data: []
//   //   },
//   //   sortRules: [{ label: '当天', dayPeriod: 1 }, { label: '七天', dayPeriod: 7 }]
//   // },
//   // flow_data: {
//   //   flows: [],
//   // },
//   // home_data: {
//   //   brandings: [],
//   // },
//   // setting_data: {
//   //   userInfo: {},
//   // },
//   // setAppData: (state) => set(produce((draft: State) => {
//   //   Object.assign(draft.app_data, state(draft.app_data));
//   // })),


// }));

// export default useAppStore;