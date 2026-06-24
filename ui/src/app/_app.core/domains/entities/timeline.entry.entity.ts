import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DateTimeType } from '../../../core/domains/enums/data.type';

@TableDecorator({ name: 'timelineentry', title: 'Timeline' })
export class TimelineEntryEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @DropDownDecorator({ label: 'Loại', lookup: LookupData.ReferenceItems([
        { label: '📍 Check-in', value: 0 },
        { label: '📸 Ảnh', value: 1 },
        { label: '💸 Chi phí', value: 2 },
        { label: '🗳️ Vote', value: 3 },
        { label: '📢 Thông báo', value: 4 },
        { label: '👤 Thành viên mới', value: 5 },
    ]) })
    EntryType: number;

    @NumberDecorator({ label: 'ID tham chiếu' })
    RefId: number;

    @DropDownDecorator({ label: 'Người tạo', allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;
}

