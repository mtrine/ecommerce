export class CreateInventoryDto {
    productId: string;
    location: string = "unknown";
    stock: number;
    shopId: string;
}
