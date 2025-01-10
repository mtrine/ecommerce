import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { ProductType } from "src/enums/product-type.enum";

@Schema({
    timestamps: true,
})
export class Product {
    @Prop(
        {
            required: true,
        }
    )
    name: string;

    @Prop(
        {
            required: true,
            default:""
        }
    )
    thumb: string

    @Prop()
    description: string;

    @Prop({
        required: true,
    })
    price: number;

    @Prop({
        required: true,
    })
    quantity: number;

    @Prop({
        required: true,
        type: String,
        enum: Object.values(ProductType)
    })
    type: ProductType;

    @Prop({
        required: true,
        type: Types.ObjectId,
        ref: 'Shop'
    })
    shop: string;

    @Prop({
        type: Object,
        required: true,
    })
    attributes: Record<string, any>
}

export const ProductSchema = SchemaFactory.createForClass(Product);
