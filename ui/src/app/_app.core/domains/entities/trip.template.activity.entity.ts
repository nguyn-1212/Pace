import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripTemplateEntity } from './trip.template.entity';
import { PlaceEntity } from './place.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { NumberType } from '../../../core/domains/enums/data.type';
import { TripActivityType } from '../enums/trip.activity.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'triptemplateactivity', title: 'Hoạt động mẫu' })
export class TripTemplateActivityEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Mẫu chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripTemplateEntity, ['Name']) })
    TemplateId: number;

    @NumberDecorator({ label: 'Ngày thứ', required: true })
    DayNumber: number;

    @StringDecorator({ label: 'Giờ bắt đầu', max: 10 })
    StartTime: string;

    @StringDecorator({ label: 'Tên hoạt động', required: true, max: 200 })
    Title: string;

    @DropDownDecorator({ label: 'Địa điểm', allowSearch: true, lookup: LookupData.Reference(PlaceEntity, ['Name']) })
    PlaceId: number;

    @DropDownDecorator({ label: 'Loại', lookup: LookupData.ReferenceEnum(TripActivityType) })
    Type: TripActivityType;

    @NumberDecorator({ label: 'Thứ tự' })
    OrderIndex: number;

    @NumberDecorator({ label: 'Chi phí ước tính', type: NumberType.Numberic })
    EstCost: number;
}


