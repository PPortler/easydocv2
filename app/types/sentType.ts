export interface Sents {
    files: [{ fileName: string, fileType: string, fileURL: string }];
    email: string;
    header: string;
    status: string;
    type: string;
    id: string;
    fromSent: [{
        email: string,
        time: string,
        date: string,
        files: [{ fileName: string, fileType: string, fileURL: string }],
        detail: string;
    }];
}