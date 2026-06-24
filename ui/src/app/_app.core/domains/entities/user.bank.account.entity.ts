import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType } from '../../../core/domains/enums/data.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { BooleanDecorator } from '../../../core/decorators/boolean.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'userbankaccount', title: 'Tài khoản ngân hàng' })
export class UserBankAccountEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Người dùng', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @StringDecorator({ label: 'Ngân hàng', required: true, max: 100 })
    BankName: string;

    @StringDecorator({ label: 'Số tài khoản', required: true, type: StringType.Text, max: 50 })
    AccountNumber: string;

    @StringDecorator({ label: 'Chủ tài khoản', required: true, max: 200 })
    AccountName: string;

    @BooleanDecorator({ label: 'Mặc định' })
    IsDefault: boolean;
}

