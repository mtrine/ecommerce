import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { OrderStatus } from "src/enums/order-status.enum";

@Schema({
    timestamps: true
})
export class Order {
    @Prop(
        {
            required: true,

        }
    )
    userId:string

    @Prop(
        {
            required: true,
            type: Object,
            default: {}
        }
    )
    checkout:Object

    @Prop(
        {
            required: true,
            type: Object,
            default: {}
        }
    )
    orderShipping:Object

    @Prop({
        type: Object,
        required: true,
        default: {}
    })
    paymentMethod:Object


    @Prop({
        type: Array,
        required: true
    })
    products:Array<any>

    @Prop({
        default:""
    })
    trackingNumber:string

    @Prop({
        enum:OrderStatus,
        default:OrderStatus.PENDING
    })
    orderStatus:string
}

export const OrderSchema = SchemaFactory.createForClass(Order);