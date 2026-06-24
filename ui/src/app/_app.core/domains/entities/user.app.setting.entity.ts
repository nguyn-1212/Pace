import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { AppTheme } from '../enums/app.setting.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'userappsetting', title: 'Cài đặt ứng dụng' })
export class UserAppSettingEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Người dùng', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @DropDownDecorator({ label: 'Giao diện', required: true, lookup: LookupData.ReferenceEnum(AppTheme) })
    Theme: AppTheme;

    @DropDownDecorator({ label: 'Ngôn ngữ', lookup: LookupData.ReferenceItems([
        { label: '🇻🇳 Tiếng Việt', value: 'vi' },
        { label: '🇺🇸 English', value: 'en' },
        { label: '🇯🇵 日本語', value: 'ja' },
        { label: '🇰🇷 한국어', value: 'ko' },
    ]) })
    Language: string;

    @StringDecorator({ label: 'Tiền tệ', max: 10 })
    Currency: string;
}

