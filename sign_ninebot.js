import axios from "axios";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

class NineBot {
  msg = [];
  constructor(deviceId, authorization) {
    if (!deviceId || !authorization) {
      throw new Error("缺少必要的参数:deviceId 或 authorization");
    }

    this.name = "九号出行";
    this.signUrl =
      "https://cn-cbu-gateway.ninebot.com/portal/api/user-sign/v2/sign";
    this.validUrl =
      "https://cn-cbu-gateway.ninebot.com/portal/api/user-sign/v2/status";
    this.headers = {
      Accept: "application/json, text/plain, */*",
      Authorization: authorization,
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "zh-CN,zh-Hans;q=0.9",
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Host: "cn-cbu-gateway.ninebot.com",
      Origin: "https://h5-bj.ninebot.com",
      from_platform_1: "1",
      language: "zh",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Segway v6 C 609033420",
      Referer: "https://h5-bj.ninebot.com/",
    };
    this.deviceId = deviceId;
  }

  async sign() {
    try {
      const response = await axios.post(
        this.signUrl,
        {
          deviceId: this.deviceId,
        },
        {
          headers: this.headers,
          timeout: 10000,
        }
      );

      if (response.status === 200) {
        const responseData = response.data;
        if (responseData.code === 0) {
          this.msg.push({ name: "签到成功", value: "" });
        } else {
          this.msg.push({
            name: "签到失败",
            value: responseData.msg || "未知错误",
          });
        }
      } else {
        this.msg.push({
          name: "签到失败",
          value: `HTTP状态码: ${response.status}`,
        });
      }
    } catch (e) {
      const errorMessage = e.response
        ? `状态码: ${e.response.status}, 信息: ${
            e.response.data?.msg || e.message
          }`
        : e.message;
      this.msg.push(
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
        timeout: 10000,
      });

      if (response.status === 200) {
        const jsonData = response.data;
        if (jsonData.code === 0) {
          return [jsonData.data, ""];
        } else {
          return [false, jsonData.msg || "验证失败"];
        }
      }
      return [false, `登录信息异常: HTTP ${response.status}`];
    } catch (e) {
      const errorMessage = e.response
        ? `状态码: ${e.response.status}, 信息: ${
            e.response.data?.msg || e.message
          }`
        : e.message;
      return [false, `登录验证异常: ${errorMessage}`];
    }
  }
  get logs() {
    return this.msg.map((one) => `${one.name}: ${one.value}`).join("\n");
  }

  async run() {
    try {
      const [validData, errInfo] = await this.valid();

      if (validData) {
        const completed = validData.currentSignStatus === 1;
        this.msg.push({
          name: "连续签到天数",
          value: `${validData.consecutiveDays || 0}天`,
        });
        this.msg.push({
          name: "今日签到状态",
          value: completed ? "已签到" : "未签到",
        });

        if (!completed) {
          await this.sign();
        }
      } else {
        this.msg.push({ name: "验证信息", value: errInfo });
      }
    } catch (e) {
      this.msg.push({ name: "执行异常", value: e.message });
    }
  }
}


const deviceId = process.env.NINEBOT_DEVICE_ID || "";
const authorization = process.env.NINEBOT_AUTHORIZATION || "";
const nineBot = new NineBot(deviceId, authorization);
await nineBot.run();
console.log(nineBot.logs);
