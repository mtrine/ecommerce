import { HttpStatus } from '@nestjs/common';

export class ErrorCode {
    static readonly NOT_FOUND = new ErrorCode(1404, 'Not found', HttpStatus.NOT_FOUND);
    static readonly EMAIL_ALREADY_EXISTS = new ErrorCode(1401, 'Email already exists', HttpStatus.BAD_REQUEST);
    static readonly CLOTHING_CREATE_FAILED = new ErrorCode(1402, 'Clothing create failed', HttpStatus.BAD_REQUEST);
    static readonly ELECTRONIC_CREATE_FAILED = new ErrorCode(1402, 'Electronic create failed', HttpStatus.BAD_REQUEST);
    static readonly CREATE_PRODUCT_FAILED = new ErrorCode(1403, 'Create product failed', HttpStatus.BAD_REQUEST);
    static readonly UPDATE_PRODUCT_FAILED = new ErrorCode(1404, 'Update product failed', HttpStatus.BAD_REQUEST);
    private constructor(public readonly code: number, public readonly message: string, public readonly status: HttpStatus) { }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
            status: this.status,
        };
    }
}
