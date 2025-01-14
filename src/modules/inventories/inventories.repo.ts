import { InjectModel } from "@nestjs/mongoose";
import { Inventory } from "./schema/inventory.schema";
import { Model } from "mongoose";
import { CreateInventoryDto } from "./dto/create-inventory.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InventoriesRepository{
    constructor(
        @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    ){}
    async insertInventory(createInventoryDto: CreateInventoryDto){
        const newInventory = await this.inventoryModel.create(createInventoryDto);
        return newInventory;
    }
}