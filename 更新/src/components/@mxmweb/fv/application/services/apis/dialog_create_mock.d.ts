export interface RenameDialogueRequest {
    label: number | string;
    sessionId: number | string;
}
export interface RenameDialogueResponse {
    name: string;
}
export declare const renameDialogueConfig: {
    url: string;
    method: string;
    headers: {};
    mockData: {
        a: string;
    };
    description: string;
    request_type: RenameDialogueRequest;
    response_type: RenameDialogueResponse;
};
