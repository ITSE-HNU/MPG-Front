const verifyMap = {
    notNull: function (val, msg) {
        if (!val.trim()) {
            return msg;
        }
    },
    isRepeat: function (first, second, msg) {
        if (first === second) {
            return msg;
        }
    }
}

export class Validator {
    constructor() {
        this.caches = []
    }

    push(ruleKey, ...args) {
        const ruleFn = verifyMap[ruleKey];
        this.caches.push(function () {
            return ruleFn(...args);
        })
    }

    run() {
        let errList = [];
        for (const fn of this.caches) {
            const res = fn();
            if (res) {
                errList.push(res);
            }
        }
        if (errList.length) {
            return Promise.reject(errList);
        }
        return Promise.resolve();
    }
}

// 使用样例
const validator = new Validator();

validator.push('notNull', "")

validator.push('isRepeat', "1", "1")

validator.run()
    .then(() => {
            console.log('success');
        }, (err) => {
            console.error(err);
        }
    )