import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType, NumberType, DateTimeType } from '../../../core/domains/enums/data.type';
import { TripStatus } from '../enums/trip.status.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { BooleanDecorator } from '../../../core/decorators/boolean.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'trip', title: 'Chuyến đi' })
export class TripEntity extends BaseEntity {
    @StringDecorator({ label: 'Mã mời', allowSearch: true, type: StringType.Code, max: 20 })
    Code: string;

    @StringDecorator({ label: 'Tên chuyến đi', required: true, allowSearch: true, max: 200 })
    Name: string;

    @StringDecorator({ label: 'Mô tả', type: StringType.MultiText })
    Description: string;

    @StringDecorator({ label: 'Emoji', max: 10 })
    CoverEmoji: string;

    @DateTimeDecorator({ label: 'Ngày bắt đầu', required: true, type: DateTimeType.Date })
    StartDate: Date;

    @DateTimeDecorator({ label: 'Ngày kết thúc', required: true, type: DateTimeType.Date })
    EndDate: Date;

    @DropDownDecorator({ label: 'Trạng thái', required: true, allowSearch: true, lookup: LookupData.ReferenceEnum(TripStatus) })
    Status: TripStatus;

    @DropDownDecorator({ label: 'Chủ sở hữu', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    OwnerId: number;

    @NumberDecorator({ label: 'Ngân sách', type: NumberType.Numberic })
    TotalBudget: number;

    @StringDecorator({ label: 'Tiền tệ', max: 10 })
    Currency: string;

    @BooleanDecorator({ label: 'Công khai' })
    IsPublic: boolean;
}


