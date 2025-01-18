import { HttpStatus } from '@nestjs/common';

export class ErrorCode {
    static readonly NOT_FOUND = new ErrorCode(1404, 'Not found', HttpStatus.NOT_FOUND);
    static readonly EMAIL_ALREADY_EXISTS = new ErrorCode(1401, 'Email already exists', HttpStatus.BAD_REQUEST);
    static readonly CLOTHING_CREATE_FAILED = new ErrorCode(1402, 'Clothing create failed', HttpStatus.BAD_REQUEST);
    static readonly ELECTRONIC_CREATE_FAILED = new ErrorCode(1402, 'Electronic create failed', HttpStatus.BAD_REQUEST);
    static readonly CREATE_PRODUCT_FAILED = new ErrorCode(1403, 'Create product failed', HttpStatus.BAD_REQUEST);
    static readonly UPDATE_PRODUCT_FAILED = new ErrorCode(1404, 'Update product failed', HttpStatus.BAD_REQUEST);
    static readonly DELETE_PRODUCT_FAILED = new ErrorCode(1405, 'Delete product failed', HttpStatus.BAD_REQUEST);
    static readonly DATE_INVALID = new ErrorCode(1406, 'Date is invalid', HttpStatus.BAD_REQUEST);
    static readonly START_DATE_GREATER_THAN_END_DATE = new ErrorCode(1407, 'Start date is greater than end date', HttpStatus.BAD_REQUEST);
    static readonly DISCOUNT_CODE_ALREADY_EXISTS = new ErrorCode(1408, 'Discount code already exists', HttpStatus.BAD_REQUEST);
    static readonly DISCOUNT_EXPIRED = new ErrorCode(1409, 'Discount expired', HttpStatus.BAD_REQUEST);
    static readonly DISCOUNT_ARE_OUT = new ErrorCode(1410, 'Discount are out', HttpStatus.BAD_REQUEST);
    static readonly MIN_ORDER_VALUE_NOT_REACHED = new ErrorCode(1411, 'Discount requires a minium order value ', HttpStatus.BAD_REQUEST);
    static readonly PRODUCT_DO_NOT_BELONG_TO_SHOP = new ErrorCode(1412, 'Product do not belong to shop', HttpStatus.BAD_REQUEST);
    private constructor(public readonly code: number, public readonly message: string, public readonly status: HttpStatus) { }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
            status: this.status,
        };
    }
}
