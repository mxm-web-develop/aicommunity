export interface RenameDialogueRequest {
    pageNo?: string;
    pageSize?: string;
}
export interface RenameDialogueResponse {
    name: string;
}
export declare const renameDialogueConfig: {
    url: string;
    method: string;
    headers: {};
    mockData: {};
    description: string;
    request_type: RenameDialogueRequest;
    response_type: RenameDialogueResponse;
};
