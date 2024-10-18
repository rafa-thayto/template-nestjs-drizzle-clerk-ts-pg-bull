export class Response<T> {
  status: number;
  data: T;
  message?: string;

  constructor(data: T, status: number = 200, message: string = 'Success') {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}
