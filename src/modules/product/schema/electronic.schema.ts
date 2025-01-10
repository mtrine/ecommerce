import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
})
export class Electronics{
    @Prop(
        {
            required: true,
        }
    )
    brand: string;

    @Prop(
        {
            required: true,
        }
    )
    size: string;

    @Prop(
        {
            required: true,
        }
    )

    material: string;


    @Prop(
        {
            required: true,
        }
    )
    shop: string;

    
}

export const ElectronicsSchema = SchemaFactory.createForClass(Electronics);