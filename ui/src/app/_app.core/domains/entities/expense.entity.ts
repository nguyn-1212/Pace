import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType, NumberType, DateTimeType } from '../../../core/domains/enums/data.type';
import { ExpenseCategory, SplitType } from '../enums/expense.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';
import { ImageDecorator } from '../../../core/decorators/image.decorator';

@TableDecorator({ name: 'expense', title: 'Chi phí' })
export class ExpenseEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @StringDecorator({ label: 'Tiêu đề', required: true, allowSearch: true, max: 200 })
    Title: string;

    @StringDecorator({ label: 'Mô tả', type: StringType.MultiText })
    Description: string;

    @NumberDecorator({ label: 'Số tiền', required: true, type: NumberType.Numberic })
    Amount: number;

    @StringDecorator({ label: 'Tiền tệ', max: 10 })
    Currency: string;

    @DropDownDecorator({ label: 'Danh mục', required: true, lookup: LookupData.ReferenceEnum(ExpenseCategory) })
    Category: ExpenseCategory;

    @DropDownDecorator({ label: 'Người trả', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    PaidBy: number;

    @DropDownDecorator({ label: 'Cách chia', required: true, lookup: LookupData.ReferenceEnum(SplitType) })
    SplitType: SplitType;

    @ImageDecorator({ label: 'Hoá đơn', url: 'expense' })
    ReceiptUrl: string;

    @DateTimeDecorator({ label: 'Ngày', required: true, type: DateTimeType.Date })
    Date: Date;
}


