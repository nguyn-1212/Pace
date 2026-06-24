import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { NumberType, DateTimeType } from '../../../core/domains/enums/data.type';
import { SettlementStatus } from '../enums/settlement.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'tripsettlement', title: 'Chốt sổ chuyến đi' })
export class TripSettlementEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @DropDownDecorator({ label: 'Trạng thái', required: true, lookup: LookupData.ReferenceEnum(SettlementStatus) })
    Status: SettlementStatus;

    @DropDownDecorator({ label: 'Người chốt', allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    LockedBy: number;

    @DateTimeDecorator({ label: 'Ngày chốt', type: DateTimeType.DateTime })
    LockedDate: Date;

    @NumberDecorator({ label: 'Tổng chi phí', type: NumberType.Numberic })
    TotalAmount: number;
}


