const axios = require('axios');
const moment = require('moment');

class NineBot {
    constructor(deviceId, authorization) {
        if (!deviceId || !authorization) {
            throw new Error('缺少必要的参数：deviceId 或 authorization');
        }
        
        this.name = "九号出行";
        this.signUrl = "https://cn-cbu-gateway.ninebot.com/portal/api/user-sign/v2/sign";
        this.validUrl = "https://cn-cbu-gateway.ninebot.com/portal/api/user-sign/v2/status";
        this.headers = {
            "Accept": "application/json, text/plain, */*",
            "Authorization": authorization,
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Connection": "keep-alive",
            "Content-Type": "application/json",
            "Host": "cn-cbu-gateway.ninebot.com",
            "Origin": "https://h5-bj.ninebot.com",
            "from_platform_1": "1",
            "language": "zh",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Segway v6 C 609033420",
            "Referer": "https://h5-bj.ninebot.com/"
        };
        this.deviceId = deviceId;
    }

    async sign(msg) {
        try {
            const response = await axios.post(this.signUrl, {
                deviceId: this.deviceId
            }, {
                headers: this.headers,
                timeout: 10000
            });

            if (response.status === 200) {
                const responseData = response.data;
                if (responseData.code === 0) {
                    msg.push({ name: "签到成功", value: "" });
                } else {
                    msg.push({ name: "签到失败", value: responseData.msg || '未知错误' });
                }
            } else {
                msg.push({ name: "签到失败", value: `HTTP状态码: ${response.status}` });
            }
        } catch (e) {
            const errorMessage = e.response ? 
                `状态码: ${e.response.status}, 信息: ${e.response.data?.msg || e.message}` : 
                e.message;
            msg.push(
                { name: "签到信息", value: "签到失败" },
                { name: "错误信息", value: errorMessage }
            );
        }
    }

    async valid() {
        try {
            const timestamp = moment().valueOf();
            const response = await axios.get(`${this.validUrl}?t=${timestamp}`, {
                headers: this.headers,
                timeout: 10000
            });

            if (response.status === 200) {
                const jsonData = response.data;
                if (jsonData.code === 0) {
                    return [jsonData.data, ""];
                } else {
                    return [false, jsonData.msg || '验证失败'];
                }
            }
            return [false, `登录信息异常: HTTP ${response.status}`];
        } catch (e) {
            const errorMessage = e.response ? 
                `状态码: ${e.response.status}, 信息: ${e.response.data?.msg || e.message}` : 
                e.message;
            return [false, `登录验证异常: ${errorMessage}`];
        }
    }

    async main() {
        try {
            const [validData, errInfo] = await this.valid();
            let msg = [];

            if (validData) {
                const completed = validData.currentSignStatus === 1;
                msg = [
                    { name: "连续签到天数", value: `${validData.consecutiveDays || 0}天` },
                    { name: "今日签到状态", value: completed ? "已签到" : "未签到" }
                ];

                if (!completed) {
                    await this.sign(msg);
                }
            } else {
                msg = [
                    { name: "验证信息", value: errInfo }
                ];
            }

            return msg.map(one => `${one.name}: ${one.value}`).join('\n');
        } catch (e) {
            return `执行异常: ${e.message}`;
        }
    }
}

async function main(deviceId, authorization) {
    try {
        if (!deviceId || !authorization) {
            throw new Error('缺少必要的参数：deviceId 或 authorization');
        }

        const nineBot = new NineBot(deviceId, authorization);
        const res = await nineBot.main();
        console.log(res);
        return res;
    } catch (e) {
        const errorMessage = `执行失败: ${e.message}`;
        console.error(errorMessage);
        return errorMessage;
    }
}

// 如果直接运行此文件
if (require.main === module) {
    const deviceId = process.env.NINEBOT_DEVICE_ID;
    const authorization = process.env.NINEBOT_AUTHORIZATION;
    
    if (!deviceId || !authorization) {
        console.error('请设置环境变量 NINEBOT_DEVICE_ID 和 NINEBOT_AUTHORIZATION');
        process.exit(1);
    }

    main(deviceId, authorization).catch(error => {
        console.error('程序执行出错:', error);
        process.exit(1);
    });
}

module.exports = { main, NineBot }; 