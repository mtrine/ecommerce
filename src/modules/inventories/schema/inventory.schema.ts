import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema(
    {
        timestamps: true
    }
)
export class Inventory {
    @Prop(
        {
            type: Types.ObjectId,
            ref: "Product",
        }
    )
    productId: Types.ObjectId;

    @Prop(
        {
            type: String,
            default: "unknow"
        }
    )
    location: string

    @Prop(
        {
            type: Number,
            required: true
        }
    )
    stock: number

    @Prop(
        {
            type: Types.ObjectId,
            ref: "Shop",
        }
    )
    shopId: Types.ObjectId

    @Prop(
        {
            type: Array,
            default: []
        }
    )
    reservations: Array<any>
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
