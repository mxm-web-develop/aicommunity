export interface AppItem {
  categories: "system" | "chat" | "flow";
  icon: string;
  name: string;
  path: string;
  _id: string;
  app_type?: "difychat" | "aieditor" | "difyflow";
}
