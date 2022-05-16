import ServiceBase from "./service-base";

/**
 * 公共service
 */
export default abstract class CommonService extends ServiceBase {

    /**
     * 登录
     * @param username
     * @param password
     */
    public async login(username: string, password: string): Promise<any> {
        return this._post<any>("/oauth/extras/token", {
            client_id: "unity-client",
            client_secret: "unity",
            grant_type: "password",
            password: password,
            username: username
        });
    }
    // 修改密码
    public async modifyPassword(oldPassword: string, password: string, id: string): Promise<any> {
        return this._post<any>("/unity/user/password?@state=modify", {
            client_id: "unity-client",
            client_secret: "unity",
            grant_type: "password",
            oldPassword,
            password,
            id
        });
    }

    public async getCurrentUser() {
        return this._get<any>("/unity/user/composite");
    }

    public getUserInfo(userName: string) {
        return this._get<any>(`/unity/user/composite/${userName}`);
    }

    public async uploadImage(file: any): Promise<any> {
        return this._post<any>("/free/attachment/images/upload", file);
    }
}
