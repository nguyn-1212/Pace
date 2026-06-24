import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'userinterest', title: 'Sở thích' })
export class UserInterestEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Người dùng', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @DropDownDecorator({ label: 'Sở thích', required: true, lookup: LookupData.ReferenceItems([
        { label: '🏖️ Biển', value: 'beach' },
        { label: '⛰️ Núi', value: 'mountain' },
        { label: '🍜 Ẩm thực', value: 'food' },
        { label: '🏛️ Văn hóa', value: 'culture' },
        { label: '🧗 Phiêu lưu', value: 'adventure' },
        { label: '🏙️ Thành phố', value: 'city' },
        { label: '🌿 Thiên nhiên', value: 'nature' },
        { label: '📜 Lịch sử', value: 'history' },
    ]) })
    Interest: string;
}

