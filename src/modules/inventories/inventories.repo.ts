import { InjectModel } from "@nestjs/mongoose";
import { Inventory } from "./schema/inventory.schema";
import { Model } from "mongoose";
import { CreateInventoryDto } from "./dto/create-inventory.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InventoriesRepository {
    constructor(
        @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    ) { }

    async insertInventory(createInventoryDto: CreateInventoryDto) {
        const newInventory = await this.inventoryModel.create(createInventoryDto);
        return newInventory;
    }

    async reservationInventory(productId: string, quantity: number, cartId: string) {
        const query = {
            productId,
            stock: { $gte: quantity },
        }, updateSet = {
            $inc: {
                stock: -quantity
            },
            $push: {
                reservations: {
                    cartId,
                    quantity
                }
            }
        },options = { new: true, upsert: true };

        return await this.inventoryModel.findOneAndUpdate(query, updateSet, options).lean();

    }
}