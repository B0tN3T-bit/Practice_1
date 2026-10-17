import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    findAll(): Promise<import("./item.entity").Item[]>;
    findOne(id: number): Promise<import("./item.entity").Item>;
    create(dto: CreateItemDto): Promise<import("./item.entity").Item>;
    update(id: number, dto: UpdateItemDto): Promise<import("./item.entity").Item>;
    remove(id: number): Promise<void>;
}
