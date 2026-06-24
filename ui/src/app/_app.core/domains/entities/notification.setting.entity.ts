import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { BooleanDecorator } from '../../../core/decorators/boolean.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'notificationsetting', title: 'Cài đặt thông báo' })
export class NotificationSettingEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Người dùng', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @DropDownDecorator({ label: 'Loại thông báo', required: true, lookup: LookupData.ReferenceItems([
        { label: '0 - Hệ thống', value: 0 },
        { label: '1 - Mời chuyến đi', value: 1 },
        { label: '2 - Đã tham gia', value: 2 },
        { label: '3 - Chuyến đi bắt đầu', value: 3 },
        { label: '4 - Chuyến đi kết thúc', value: 4 },
        { label: '5 - Chi phí mới', value: 5 },
        { label: '6 - Yêu cầu thanh toán', value: 6 },
        { label: '7 - Đã thanh toán', value: 7 },
        { label: '8 - Vote mới', value: 8 },
        { label: '9 - Vote kết thúc', value: 9 },
        { label: '10 - Thông báo nhóm', value: 10 },
        { label: '11 - Check-in mới', value: 11 },
        { label: '12 - Ảnh mới', value: 12 },
        { label: '13 - Yêu cầu kết bạn', value: 13 },
        { label: '14 - Chấp nhận kết bạn', value: 14 },
        { label: '15 - Tin nhắn mới', value: 15 },
    ]) })
    NotifyType: number;

    @BooleanDecorator({ label: 'Bật thông báo' })
    IsEnabled: boolean;

    @DropDownDecorator({ label: 'Kênh nhận', lookup: LookupData.ReferenceItems([
        { label: '📱 Push', value: 0 },
        { label: '📧 Email', value: 1 },
        { label: '📱+📧 Cả hai', value: 2 },
    ]) })
    Channel: number;
}

