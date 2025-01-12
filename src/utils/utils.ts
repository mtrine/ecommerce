export class UtilsService {
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
}
