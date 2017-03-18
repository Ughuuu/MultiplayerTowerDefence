export class AppConstants {
    static root = process.cwd();
    static mode: boolean = (process.env.NODE_ENV === 'production') ? true : false;
    static clientFiles = '/client/';
    static port: any = process.env.PORT || 3333;
    static keymetrics_private: string = AppConstants.mode ? process.env.KEYMETRICS_PRIVATE : 's20pmskbqcxc6oi';
    static keymetrics_public: string = AppConstants.mode ? process.env.KEYMETRICS_PUBLIC : '7dbbz6e6nxhaevd';
}