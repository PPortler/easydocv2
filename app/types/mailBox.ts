export interface MailBox {
    email: string;
    idSent: string;
    header: string;
    status: boolean;
    type: string;
    fromSent: [{
        email: string,
        time: string,
        date: string,
        files: [{ fileName: string, fileType: string, fileURL: string }],
        detail: string;
    }];
}