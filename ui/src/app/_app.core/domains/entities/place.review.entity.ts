import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { PlaceEntity } from './place.entity';
import { TripEntity } from './trip.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType } from '../../../core/domains/enums/data.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'placereview', title: 'Đánh giá địa điểm' })
export class PlaceReviewEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Địa điểm', required: true, allowSearch: true, lookup: LookupData.Reference(PlaceEntity, ['Name']) })
    PlaceId: number;

    @DropDownDecorator({ label: 'Người dùng', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @DropDownDecorator({ label: 'Chuyến đi', allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @DropDownDecorator({ label: 'Sao', required: true, lookup: LookupData.ReferenceItems([
        { label: '⭐ 1 sao', value: 1 },
        { label: '⭐⭐ 2 sao', value: 2 },
        { label: '⭐⭐⭐ 3 sao', value: 3 },
        { label: '⭐⭐⭐⭐ 4 sao', value: 4 },
        { label: '⭐⭐⭐⭐⭐ 5 sao', value: 5 },
    ]) })
    Rating: number;

    @StringDecorator({ label: 'Nhận xét', type: StringType.MultiText })
    Comment: string;
}


