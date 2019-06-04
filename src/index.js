// 有效可用
const validAndCanUseIps = [
    // A类: 1.0.0.0 -126.255.255.254
    [ { start: 1, end: 126 }, { start: 0, end: 255 }, { start: 0, end: 255 }, { start: 0, end: 254 } ],

    // B类: 128.0.0.0 - 191.255.255.254
    [ { start: 128, end: 191 }, { start: 0, end: 255 }, { start: 0, end: 255 }, { start: 0, end: 254 } ],

    // C类: 192.0.0.0 - 223.255.255.254
    [ { start: 192, end: 223 }, { start: 0, end: 255 }, { start: 0, end: 255 }, { start: 0, end: 254 } ],
];

// 有效可用，但是不能访问外网
const validAndCanNotUseExtraNext = [
    // A类私有: 10.0.0.0 -10.255.255.254
    [ { start: 10, end: 10 }, { start: 0, end: 255 }, { start: 0, end: 255 }, { start: 0, end: 254 } ],

    // B类私有: 172.16.0.0 -172.31.255.254
    [ { start: 172, end: 172 }, { start: 16, end: 31 }, { start: 0, end: 255 }, { start: 0, end: 254 } ],

    // C类私有: 192.168.0.0-192.168.255.254
    [ { start: 192, end: 192 }, { start: 168, end: 168 }, { start: 0, end: 255 }, { start: 0, end: 254 } ],

    // windows自动分配: 169.254.0.0-169.254.255.254
    [ { start: 169, end: 169 }, { start: 254, end: 254 }, { start: 0, end: 255 }, { start: 0, end: 254 } ],
];

// 有效不可用
const validAndCanNotUseIps = [
    // D类: 224.0.0.0 -239.255.255.254
    [ { start: 224, end: 239 }, { start: 0, end: 225 }, { start: 0, end: 255 }, { start: 0, end: 254 } ],

    // E类: 240.0.0.0 -255.255.255.254
    [ { start: 240, end: 255 }, { start: 0, end: 225 }, { start: 0, end: 255 }, { start: 0, end: 254 } ],

    // 回环: 127.0.0.0 - 127.255.255.254
    [ { start: 127, end: 127 }, { start: 0, end: 225 }, { start: 0, end: 255 }, { start: 0, end: 254 } ],

    // 全网: 0.x.x.x, x.x.x.0
    [ { start: 0, regexp: true } ],
    [ { end: 0, regexp: true } ],

    // 广播: x.x.x.255
    [ { end: 255, regexp: true } ],

];

const isValidIp = (ip) => {

    // 无效ip
    const IS_INVALID = { isValid: false, canUseExtraNext: false, isUsable: false };

    // 有效可用ip
    const IS_VALID_USE = { isValid: true, canUseExtraNext: true, isUsable: true };

    // 有效可用ip，但是无法访问外网
    const IS_VALID_USE_SPECIAL = { isValid: true, canUseExtraNext: false, isUsable: true };

    // 有效不可用ip
    const IS_VALID_NOT_USE = { isValid: true, canUseExtraNext: false, isUsable: false };

    const ipFragArray = ip.split('.').map(i => Number(i));
    const isNumberOfIpFrag = ipFragArray.every(i => i === i && i >= 0 && i <= 255);

    // 无效IP
    if (ipFragArray.length !== 4 || !isNumberOfIpFrag) {
        return IS_INVALID;
    }

    // 有效可用IP
    const isValidAndCanUseIps = validAndCanUseIps.some((ipFragConfig, index, array)  => {
        return ipFragConfig.every((frag, index, array) => {
            return ipFragArray[index] >= frag.start && ipFragArray[index] <= frag.end;
        });
    });

    // 有效可用但是不能访问外网IP
    const isValidAndCanNotUseExtraNext = isValidAndCanUseIps && validAndCanNotUseExtraNext.some((ipFragConfig, index, array)  => {
        return ipFragConfig.every((frag, index, array) => {
            return ipFragArray[index] >= frag.start && ipFragArray[index] <= frag.end;
        });
    });

    // 有效但是不可用IP
    const isValidAndCanNotUseIps = validAndCanNotUseIps.some((ipFragConfig, index, array) => {
        return ipFragConfig.every((frag, index, array) => {
            // 全网与广播
            if (frag.regexp) {
                let isBelong;
                if (frag.hasOwnProperty('start')) {
                    isBelong = (ipFragArray[0] == frag.start);
                }
                if (frag.hasOwnProperty('end')) {
                    isBelong = (ipFragArray[3] == frag.end);
                }
                return isBelong;
            }
            return ipFragArray[index] >= frag.start && ipFragArray[index] <= frag.end;
        });
    });

    if (isValidAndCanUseIps) {
        // 有效可使用ip里面包含了一些“有效不可使用外网”和“有效不可使用”ip
        if (isValidAndCanNotUseExtraNext) {
            return IS_VALID_USE_SPECIAL;
        }
        if (isValidAndCanNotUseIps) {
            return IS_VALID_NOT_USE;
        }
        return IS_VALID_USE;
    }


    if (isValidAndCanNotUseIps) {
        return IS_VALID_NOT_USE;
    }
};

module.exports = {
    isValidIp,
};
