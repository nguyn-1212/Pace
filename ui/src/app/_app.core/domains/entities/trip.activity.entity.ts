import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { TripDayEntity } from './trip.day.entity';
import { PlaceEntity } from './place.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType, NumberType } from '../../../core/domains/enums/data.type';
import { TripActivityType, TripActivityStatus } from '../enums/trip.activity.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'tripactivity', title: 'Hoạt động lịch trình' })
export class TripActivityEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @DropDownDecorator({ label: 'Ngày', required: true, allowSearch: true, lookup: LookupData.Reference(TripDayEntity, ['DayNumber', 'Title']) })
    TripDayId: number;

    @StringDecorator({ label: 'Tên hoạt động', required: true, allowSearch: true, max: 200 })
    Title: string;

    @StringDecorator({ label: 'Mô tả', type: StringType.MultiText })
    Description: string;

    @StringDecorator({ label: 'Giờ bắt đầu', max: 10 })
    StartTime: string;

    @StringDecorator({ label: 'Giờ kết thúc', max: 10 })
    EndTime: string;

    @DropDownDecorator({ label: 'Địa điểm', allowSearch: true, lookup: LookupData.Reference(PlaceEntity, ['Name']) })
    PlaceId: number;

    @StringDecorator({ label: 'Địa chỉ', max: 500 })
    Address: string;

    @DropDownDecorator({ label: 'Loại', required: true, lookup: LookupData.ReferenceEnum(TripActivityType) })
    Type: TripActivityType;

    @DropDownDecorator({ label: 'Trạng thái', required: true, lookup: LookupData.ReferenceEnum(TripActivityStatus) })
    ActivityStatus: TripActivityStatus;

    @NumberDecorator({ label: 'Thứ tự' })
    OrderIndex: number;

    @NumberDecorator({ label: 'Chi phí ước tính', type: NumberType.Numberic })
    EstCost: number;
}


