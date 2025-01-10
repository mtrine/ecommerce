import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true,
})
export class Clothing{
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
    
    static fromAttributes(attributes: Partial<Clothing>): Clothing {
        const clothing = new Clothing();
        clothing.brand = attributes.brand;
        clothing.size = attributes.size;
        clothing.material = attributes.material;
        return clothing;
    }
}


export const ClothingSchema = SchemaFactory.createForClass(Clothing);

