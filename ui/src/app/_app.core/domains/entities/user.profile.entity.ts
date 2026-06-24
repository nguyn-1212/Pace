import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType } from '../../../core/domains/enums/data.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { BooleanDecorator } from '../../../core/decorators/boolean.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';
import { LookupData as LD } from '../../../core/domains/data/lookup.data';

@TableDecorator({ name: 'userprofile', title: 'Hồ sơ người dùng' })
export class UserProfileEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Người dùng', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @StringDecorator({ label: 'Giới thiệu', type: StringType.MultiText, max: 500 })
    Bio: string;

    @DropDownDecorator({ label: 'Phong cách du lịch', lookup: LD.ReferenceItems([
        { label: 'Bụi / Backpacker', value: 'backpacker' },
        { label: 'Sang trọng', value: 'luxury' },
        { label: 'Phiêu lưu', value: 'adventure' },
        { label: 'Gia đình', value: 'family' },
        { label: 'Tiết kiệm', value: 'budget' },
    ]) })
    TravelStyle: string;

    @StringDecorator({ label: 'Thành phố', max: 100 })
    HomeCity: string;

    @NumberDecorator({ label: 'Tổng chuyến đi' })
    TotalTrips: number;

    @NumberDecorator({ label: 'Tổng km' })
    TotalKm: number;

    @BooleanDecorator({ label: 'Hồ sơ công khai' })
    IsPublic: boolean;
}


