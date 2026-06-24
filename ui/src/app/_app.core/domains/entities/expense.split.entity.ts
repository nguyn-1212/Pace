import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { ExpenseEntity } from './expense.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { NumberType, DateTimeType } from '../../../core/domains/enums/data.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { BooleanDecorator } from '../../../core/decorators/boolean.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'expensesplit', title: 'Chi tiết chia tiền' })
export class ExpenseSplitEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chi phí', required: true, allowSearch: true, lookup: LookupData.Reference(ExpenseEntity, ['Title']) })
    ExpenseId: number;

    @DropDownDecorator({ label: 'Người dùng', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @NumberDecorator({ label: 'Số tiền', required: true, type: NumberType.Numberic })
    Amount: number;

    @NumberDecorator({ label: 'Phần trăm', type: NumberType.Numberic })
    Percent: number;

    @BooleanDecorator({ label: 'Đã thanh toán' })
    IsPaid: boolean;

    @DateTimeDecorator({ label: 'Ngày thanh toán', type: DateTimeType.DateTime })
    PaidDate: Date;
}


