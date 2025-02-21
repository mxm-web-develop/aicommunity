export enum Modules {
  Home,
  Chat,
  Flow,
  Setting,
}

export enum States {
  Loading,
  Waiting,
  Processing,
  Error,
}
export interface AppState {
  current_module: Modules;
  //module_Ready: boolean;
  app_ready: boolean;
  app_state: States;
  is_moblie: boolean;
  orientation: "landscape" | "portrait" | undefined;
}
