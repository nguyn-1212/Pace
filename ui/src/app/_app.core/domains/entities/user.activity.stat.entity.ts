import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'useractivitystat', title: 'Thống kê người dùng' })
export class UserActivityStatEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Người dùng', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @NumberDecorator({ label: 'Tổng chuyến đi' })
    TotalTrips: number;

    @NumberDecorator({ label: 'Tổng bạn bè' })
    TotalFriends: number;

    @NumberDecorator({ label: 'Tổng check-in' })
    TotalCheckins: number;

    @NumberDecorator({ label: 'Tổng ảnh' })
    TotalPhotos: number;

    @NumberDecorator({ label: 'Tổng km' })
    TotalKm: number;

    @NumberDecorator({ label: 'Số quốc gia' })
    TotalCountries: number;

    @NumberDecorator({ label: 'Số tỉnh thành' })
    TotalProvinces: number;
}

