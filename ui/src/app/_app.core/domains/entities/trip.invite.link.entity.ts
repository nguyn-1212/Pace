import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType, NumberType, DateTimeType } from '../../../core/domains/enums/data.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { BooleanDecorator } from '../../../core/decorators/boolean.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'tripinvitelink', title: 'Link mời chuyến đi' })
export class TripInviteLinkEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @StringDecorator({ label: 'Mã mời', required: true, type: StringType.Code, max: 20 })
    Code: string;

    @DateTimeDecorator({ label: 'Hết hạn', type: DateTimeType.DateTime })
    ExpiresAt: Date;

    @NumberDecorator({ label: 'Giới hạn lượt dùng' })
    MaxUses: number;

    @NumberDecorator({ label: 'Đã dùng' })
    UsedCount: number;

    @BooleanDecorator({ label: 'Đã thu hồi' })
    IsRevoked: boolean;
}

