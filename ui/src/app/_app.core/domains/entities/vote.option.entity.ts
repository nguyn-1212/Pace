import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { VoteEntity } from './vote.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'voteoption', title: 'Lựa chọn bình chọn' })
export class VoteOptionEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Bình chọn', required: true, allowSearch: true, lookup: LookupData.Reference(VoteEntity, ['Title']) })
    VoteId: number;

    @StringDecorator({ label: 'Nhãn', required: true, max: 200 })
    Label: string;

    @StringDecorator({ label: 'Emoji', max: 10 })
    Emoji: string;

    @DropDownDecorator({ label: 'Đề xuất bởi', allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    SuggestedBy: number;

    @NumberDecorator({ label: 'Thứ tự' })
    OrderIndex: number;
}

