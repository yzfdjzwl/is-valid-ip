const { isValidIp } = require('../src/');
const assert = require('assert');

const demos = [
    // 无效IP
    { ip: 'jakldfjakllxcncvjsvkdjf', isValid: false, canUseExtraNext: false, isUsable: false },
    { ip: '100.000.000.000.00', isValid: false, canUseExtraNext: false, isUsable: false },
    { ip: '256.256.256.256', isValid: false, canUseExtraNext: false, isUsable: false },

    // 有效可用IP
    { ip: '64.11.22.33', isValid: true, canUseExtraNext: true, isUsable: true },
    { ip: '151.123.234.56', isValid: true, canUseExtraNext: true, isUsable: true },
    { ip: '192.127.35.65', isValid: true, canUseExtraNext: true, isUsable: true },

    // 有效可用IP，但是无法访问外网
    { ip: '10.12.13.14', isValid: true, canUseExtraNext: false, isUsable: true },
    { ip: '192.168.128.128', isValid: true, canUseExtraNext: false, isUsable: true },
    { ip: '169.254.15.200', isValid: true, canUseExtraNext: false, isUsable: true },
    { ip: '172.20.123.56', isValid: true, canUseExtraNext: false, isUsable: true },

    // 有效不可用IP
    { ip: '224.1.2.3', isValid: true, canUseExtraNext: false, isUsable: false },
    { ip: '250.11.22.33', isValid: true, canUseExtraNext: false, isUsable: false },
    { ip: '0.200.3.4', isValid: true, canUseExtraNext: false, isUsable: false },
    { ip: '64.11.22.0', isValid: true, canUseExtraNext: false, isUsable: false },
    { ip: '10.12.13.255', isValid: true, canUseExtraNext: false, isUsable: false },
    { ip: '127.50.60.70', isValid: true, canUseExtraNext: false, isUsable: false },
];

const getResultInfo = (item) => {
    return `${item.ip}是${item.isValid === true ? '有效的' : '无效的'}ip,
            它${item.isUsable === true ? '可以' : '不可以'}使用
            它${item.canUseExtraNext === true ? '可以' : '不可以'}访问外网`;
};

describe('ip是否有效的校验', function() {
    demos.forEach((item, index, array) => {
        it(getResultInfo(item), function() {
            assert.equal(isValidIp(item.ip).isValid, item.isValid);
            assert.equal(isValidIp(item.ip).canUseExtraNext, item.canUseExtraNext);
            assert.equal(isValidIp(item.ip).isUsable, item.isUsable);
        });
    });
});
