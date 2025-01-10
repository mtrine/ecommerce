import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ShopStatus } from "src/enums/shop-status.enum";

@Schema({ timestamps: true })
export class Shop {
    @Prop(
        {
            required: true,
            trim: true,
            maxlength: 150
        }
    )
    name: string;

    @Prop(
        {
            required: true,
            trim: true,
            unique: true,
        }
    )
    email: string;

    @Prop(
        {
            required: true,
        }
    )
    password: string;

    @Prop({
        required: true,
        trim: true,
        maxlength: 150
    })
    address: string
    @Prop(
        {
            type: String,
            enum: Object.values(ShopStatus),
            default: ShopStatus.INACTIVE
        }
    )
    status: ShopStatus;

    @Prop(
        {
            default: false
        }
    )
    verfify: boolean;

    @Prop(
        {
            type: Array,
            default: []
        }
    )
    role: Array<string>;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);