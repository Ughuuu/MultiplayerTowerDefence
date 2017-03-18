export class AppConstants {
    static root = process.cwd();
    static mode: boolean = (process.env.NODE_ENV === 'production') ? true : false;
    static clientFiles = '/client/';
    static port: any = process.env.PORT || 3333;
}