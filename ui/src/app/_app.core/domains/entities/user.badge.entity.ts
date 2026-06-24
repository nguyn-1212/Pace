import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { DateTimeType } from '../../../core/domains/enums/data.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';

@TableDecorator({ name: 'userbadge', title: 'Huy hiệu' })
export class UserBadgeEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Người dùng', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @DropDownDecorator({ label: 'Loại huy hiệu', required: true, lookup: LookupData.ReferenceItems([
        { label: '✈️ Chuyến đi đầu tiên', value: 'first_trip' },
        { label: '🗺️ Khám phá 10 tỉnh', value: 'explorer_10' },
        { label: '📸 Photo master', value: 'photo_master' },
        { label: '💸 Debt free', value: 'debt_free' },
        { label: '👑 Trưởng nhóm', value: 'group_leader' },
        { label: '🛣️ Road trip', value: 'road_trip' },
        { label: '🌏 Quốc tế', value: 'international' },
    ]) })
    BadgeType: string;

    @DateTimeDecorator({ label: 'Ngày đạt được', type: DateTimeType.DateTime })
    EarnedDate: Date;
}

