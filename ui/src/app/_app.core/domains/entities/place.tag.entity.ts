import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { PlaceEntity } from './place.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'placetag', title: 'Tag địa điểm' })
export class PlaceTagEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Địa điểm', required: true, allowSearch: true, lookup: LookupData.Reference(PlaceEntity, ['Name']) })
    PlaceId: number;

    @StringDecorator({ label: 'Tag', required: true, max: 100 })
    Tag: string;

    @DropDownDecorator({ label: 'Loại tag', lookup: LookupData.ReferenceItems([
        { label: 'Danh mục', value: 0 },
        { label: 'Theo mùa', value: 1 },
        { label: 'Xu hướng', value: 2 },
    ]) })
    TagType: number;

    @NumberDecorator({ label: 'Ưu tiên' })
    Priority: number;
}

