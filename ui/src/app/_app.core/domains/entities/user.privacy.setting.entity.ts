import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { LocationShareType } from '../enums/app.setting.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { BooleanDecorator } from '../../../core/decorators/boolean.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'userprivacysetting', title: 'Cài đặt riêng tư' })
export class UserPrivacySettingEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Người dùng', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @DropDownDecorator({ label: 'Chia sẻ vị trí', lookup: LookupData.ReferenceEnum(LocationShareType) })
    ShareLocation: LocationShareType;

    @BooleanDecorator({ label: 'Hiển thị trạng thái online' })
    ShowOnlineStatus: boolean;

    @DropDownDecorator({ label: 'Ai có thể tìm thấy bạn', lookup: LookupData.ReferenceItems([
        { label: 'Tất cả', value: 0 },
        { label: 'Bạn bè của bạn bè', value: 1 },
        { label: 'Chỉ bạn bè', value: 2 },
    ]) })
    WhoCanFind: number;

    @DropDownDecorator({ label: 'Xem lịch sử chuyến đi', lookup: LookupData.ReferenceItems([
        { label: 'Tất cả', value: 0 },
        { label: 'Chỉ bạn bè', value: 1 },
        { label: 'Chỉ mình tôi', value: 2 },
    ]) })
    ShowTripHistory: number;
}

