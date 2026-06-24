import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType, NumberType, DateTimeType } from '../../../core/domains/enums/data.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'userlocationhistory', title: 'Lịch sử vị trí' })
export class UserLocationHistoryEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @DropDownDecorator({ label: 'Người dùng', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @NumberDecorator({ label: 'Vĩ độ', type: NumberType.Numberic })
    Latitude: number;

    @NumberDecorator({ label: 'Kinh độ', type: NumberType.Numberic })
    Longitude: number;

    @StringDecorator({ label: 'Tên địa điểm', max: 200 })
    PlaceName: string;

    @DateTimeDecorator({ label: 'Thời gian ghi', type: DateTimeType.DateTime })
    RecordedAt: Date;
}


