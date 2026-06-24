import { CategoryType } from "../enums/category.type";
import { OptionHelper } from "../../helpers/option.helper";
import { StringType } from "../../../core/domains/enums/data.type";
import { LookupData } from "../../../core/domains/data/lookup.data";
import { BaseEntity } from "../../../core/domains/entities/base.entity";
import { TableDecorator } from "../../../core/decorators/table.decorator";
import { StringDecorator } from "../../../core/decorators/string.decorator";
import { DropDownDecorator } from "../../../core/decorators/dropdown.decorator";

@TableDecorator({ title: 'Category' })
export class CategoryEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên danh mục', type: StringType.Text })
    Name: string;            // Tên danh mục

    @StringDecorator({ label: 'Màu sắc', type: StringType.Color })
    Color: string;           // Màu sắc (nếu có)

    @StringDecorator({ label: 'Mô tả', type: StringType.MultiText })
    Description: string;     // Mô tả (nếu có)

    @DropDownDecorator({ label: 'Loại danh mục', lookup: LookupData.ReferenceItems(OptionHelper.CategoryTypes)})
    Type: CategoryType;      // Loại danh mục
}