/**
 * @author 冷 (https://github.com/LengYXin)
 * @email lengyingxin8966@gmail.com
 * @create date 2018-09-12 18:52:54
 * @modify date 2018-09-12 18:52:54
 * @desc [description]
*/
import Request from 'utils/Request';
import lodash from 'lodash';
import { action, observable, runInAction } from "mobx";
// const Http = new Request('/user/');
class Store {
    constructor() {
        this.CheckLogin()
    }
    @observable loding = true;
    @observable isLogin = false;
    // 用户信息
    @observable User: any = {
        role: "administrator",//administrator ordinary
        subMenu: [
            "/"
        ]
    };

    @action.bound
    async CheckLogin() {
        try {
            const userid = lodash.get(JSON.parse(window.sessionStorage.getItem('User')), 'Id');
            if (userid) {
                const res = await Request.ajax("/api/_login/CheckLogin/" + userid).toPromise();
                runInAction(() => {
                    this.User = {
                        ...this.User,
                        ...res
                    };
                    this.isLogin = true;
                });
            }
        } catch (error) {
            window.sessionStorage.clear()
        } finally {
            runInAction(() => this.loding = false)
        }
    }
    @action.bound
    async Login(params) {
        try {
            const res = await Request.ajax({
                method: "post",
                url: "/api/_login/login",
                body: params,
                headers: { 'Content-Type': null }
            }).toPromise();
            runInAction(() => {
                this.User = {
                    ...this.User,
                    ...res
                };
                window.sessionStorage.setItem("User", JSON.stringify(res));
                this.isLogin = true;
            });
        } catch (error) {
            throw error
        }
        finally {
            runInAction(() => this.loding = false)
        }
    }
    @action.bound
    async outLogin() {
        this.isLogin = false;
        const userid = lodash.get(JSON.parse(window.sessionStorage.getItem('User')), 'Id');
        if (userid) {
            Request.ajax("/api/_login/Logout/" + userid).toPromise();
        }
        window.sessionStorage.clear();
    }

}
export default new Store();