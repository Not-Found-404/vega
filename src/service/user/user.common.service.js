import {AbstractService} from "../abstract.service";

export class UserCommonService extends AbstractService {

    /**
     * 当前用户信息
     */
    getUserInfo = (request) => {
        console.log('获取当前登录用户');
        this.get({
            url: '/api/common/user/current/user/info',
            request: request
        });
    };

    /**
     * 检查邮箱是否已被使用
     * @param request
     */
    isExistEmail = (request) => {
        console.log('检查邮箱是否已被使用');
        this.get({
            url: '/api/common/user/exist/email',
            request: request
        });
    };

    /**
     * 判断手机号是否存在
     */
    judgeMobilePhone = (request) => {
        console.log('判断手机号是否存在');
        this.get({
            url: '/api/common/user/exist/mobile',
            request: request
        });
    };

    /**
     * 用户名是否已存在
     * @param request
     */
    isExistUserName = (request) => {
        console.log('用户名是否已存在');
        this.get({
            url: '/api/common/user/exist/nickname',
            request: request
        });
    };

    /**
     * 用户进行登录
     */
    login = (request) => {
        console.log('用户登录' + request.params);
        this.post({
            url: '/api/common/user/login',
            request: request
        });
    };

    /**
     * 注销
     * @param request 参数
     */
    logout = (request) => {
        console.log('注销');
        this.get({
            url: '/api/common/user/logout',
            request: request
        });
    };

    /**
     * 修改信息
     * @param request 参数
     */
    modify = (request) => {
        console.log('修改信息');
        this.post({
            url: '/api/common/user/modify',
            request: request
        });
    };

    /**
     * 注册
     * @param request 参数
     */
    register = (request) => {
        console.log('注册');
        this.post({
            url: '/api/common/user/register',
            request: request
        });
    };


    /**
     * 发送验证码
     */
    sendSms = (request) => {
        console.log('发送验证码');
        this.post({
            url: '/api/common/user/send/register/verification/sms',
            request: request
        });
    };

}

export default UserCommonService;
