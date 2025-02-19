export interface ServerBase<D> {
    data: D;
    config: {
        url: string;
        token?: string;
        enableMock?: boolean;
    };
}
