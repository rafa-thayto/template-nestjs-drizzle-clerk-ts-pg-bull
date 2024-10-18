export interface SendReceivableEmailEvent {
  receivableId: string;
  emailParams: {
    to: string;
    subject: string;
    html: string;
  };
}
