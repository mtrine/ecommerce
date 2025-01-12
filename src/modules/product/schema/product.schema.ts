import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { ProductType } from "src/enums/product-type.enum";
import slugify from "slugify";
import { Shop } from "src/modules/shop/schema/shop.schema";

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

    @Prop({
        unique: true,
    })
    slug: string;

    @Prop(
        {
            required: true,
            default: ""
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
        ref: Shop.name
    })
    shop: Types.ObjectId;

    @Prop({
        type: Object,
        required: true,
    })
    attributes: Record<string, any>

    @Prop({
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must not be more than 5"],
        default: 4.5,
        set: (value: number) => Math.round(value * 10) / 10,
    })
    ratingAverage: number;

    @Prop({
        type: Array,
        default: []
    })
    variations: Record<string, any>[];

    @Prop({
        default: true,
        index: true,
        select: false
    })
    isDraft: boolean;

    @Prop({
        default: false,
        index: true,
        select: false
    })
    isPublic: boolean;
}

const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.pre<Product>("save", function (next) {
    if (!this.slug && this.name) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

ProductSchema.index({name:'text',description:'text'});
export { ProductSchema };