import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { DateTimeType, StringType } from '../../../core/domains/enums/data.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'tripday', title: 'Ngày trong hành trình' })
export class TripDayEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @NumberDecorator({ label: 'Ngày thứ', required: true })
    DayNumber: number;

    @DateTimeDecorator({ label: 'Ngày', required: true, type: DateTimeType.Date })
    Date: Date;

    @StringDecorator({ label: 'Tiêu đề', max: 200 })
    Title: string;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText })
    Note: string;
}


