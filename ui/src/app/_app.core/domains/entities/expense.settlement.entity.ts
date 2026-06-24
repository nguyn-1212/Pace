import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType, NumberType, DateTimeType } from '../../../core/domains/enums/data.type';
import { ExpenseSettlementStatus } from '../enums/settlement.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'expensesettlement', title: 'Quyết toán' })
export class ExpenseSettlementEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @DropDownDecorator({ label: 'Người trả', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    FromUserId: number;

    @DropDownDecorator({ label: 'Người nhận', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    ToUserId: number;

    @NumberDecorator({ label: 'Số tiền', required: true, type: NumberType.Numberic })
    Amount: number;

    @DropDownDecorator({ label: 'Trạng thái', required: true, lookup: LookupData.ReferenceEnum(ExpenseSettlementStatus) })
    Status: ExpenseSettlementStatus;

    @DateTimeDecorator({ label: 'Ngày thanh toán', type: DateTimeType.DateTime })
    PaidDate: Date;

    @StringDecorator({ label: 'Ghi chú', type: StringType.MultiText })
    Note: string;
}


