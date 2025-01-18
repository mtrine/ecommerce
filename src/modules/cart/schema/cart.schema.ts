import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CartState } from "src/enums/cart-state.enum";

@Schema({ timestamps: true })
export class Cart {

    @Prop(
        {
            required: true,
            enum:CartState,
            default: CartState.ACTIVE
        }
    )
    state: string

    @Prop(
        {
            required: true,
            type:Array,
            default: []
        }
    )
    products: any[]

    @Prop(
        {
            required: true,
            default: 0
        }
    )
    countProduct: number

    @Prop({
        type: String,
        required: true
    })
    userId: string
}

export const CartSchema = SchemaFactory.createForClass(Cart);
