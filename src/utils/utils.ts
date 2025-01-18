export class UtilsService {
    static getSelectData(select: Array<string>) {
        return Object.fromEntries(select.map((item) => [item, 1]));
    }

    static unGetSelectData(select: Array<string>) {
        return Object.fromEntries(select.map((item) => [item, 0]));
    }
    static removeUndefinedAndNull(obj: Record<string, any>) {
        // Duyệt qua tất cả các khóa của đối tượng
        Object.keys(obj).forEach(key => {
            // Nếu giá trị là null, undefined hoặc chuỗi rỗng, xóa thuộc tính đó
            if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
                delete obj[key];
            }
            // Nếu giá trị là đối tượng, gọi đệ quy để xử lý
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                this.removeUndefinedAndNull(obj[key]);
            }
        });
        return obj;
    }

    static updateNestedObject(obj: Record<string, any>) {
        const finalObj = {};
        Object.keys(obj).forEach(key => {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                const response = this.updateNestedObject(obj[key]);
                Object.keys(response).forEach(k => {
                    finalObj[`${key}.${k}`] = response[k];
                })
            }
            else {
                finalObj[key] = obj[key];
            }
        })
        return finalObj;
    }
}
