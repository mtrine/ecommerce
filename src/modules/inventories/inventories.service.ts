import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Inventory } from './schema/inventory.schema';
import { Model } from 'mongoose';
import { ProductRepository } from '../product/product.repo';
import { CustomException } from 'src/exception-handler/custom-exception';
import { ErrorCode } from 'src/enums/error-code.enum';

@Injectable()
export class InventoriesService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    private productRepository: ProductRepository
  ) { }

  async addStockToInventory(createInventoryDto: CreateInventoryDto) {
    const product = await this.productRepository.getProductsById(createInventoryDto.productId);

    if (!product) {
      throw new CustomException(ErrorCode.NOT_FOUND);
    }

    const query = {
      shopId: createInventoryDto.shopId,
      productId: createInventoryDto.productId
    }, updateSet = {
      $inc: {
        stock: createInventoryDto.stock
      },
      $set:{
        location:createInventoryDto.location
      }
    },options={new:true,upsert:true};

    return await this.inventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}
