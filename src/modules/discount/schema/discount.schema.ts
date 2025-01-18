import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DiscountAppliesTo } from "src/enums/discount-applies-to.enum";

@Schema({ timestamps: true })
export class Discount {
    @Prop(
        {
            required: true,
        }
    )
    name: string

    @Prop(
        {
            required: true
        }
    )
    description: string

    @Prop(
        {
            required: true,
            default: "fixed-amount"
        }
    )
    type: string

    @Prop(
        {
            required: true,
        }
    )
    value: number

    @Prop(
        {
            required: true,
        }
    )
    code: string

    @Prop(
        {
            required: true,
        }
    )
    startDate: Date

    @Prop(
        {
            required: true,
        }
    )
    endDate: Date

    @Prop(
        {
            required: true,
        }
    )
    maxUses: number

    @Prop(
        {
            default: 0
        }
    )
    usesCount: number

    @Prop(
        {
            default: []
        }
    )
    userUsed: Array<string>

    @Prop(
        {
            required: true,
        }
    )
    maxUsesPerUser: number

    @Prop(
        {
            required: true,
        }
    )
    minOrderValue: number

    @Prop(
        {
            required: true,
            ref: "Shop"
        }
    )
    shopId: string

    @Prop(
        {
            default: true
        }
    )
    isActive: boolean

    @Prop(
        {
            enum: DiscountAppliesTo,
            required: true
        }
    )
    appliesTo: string

    @Prop(
        {
            default: []
        }
    )
    products: Array<string>
}

 export const DiscountSchema = SchemaFactory.createForClass(Discount);
