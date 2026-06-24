import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { DateTimeType } from '../../../core/domains/enums/data.type';
import { VoteType, VoteStatus } from '../enums/vote.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { BooleanDecorator } from '../../../core/decorators/boolean.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'vote', title: 'Bình chọn' })
export class VoteEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @StringDecorator({ label: 'Câu hỏi', required: true, allowSearch: true, max: 500 })
    Title: string;

    @StringDecorator({ label: 'Mô tả' })
    Description: string;

    @DropDownDecorator({ label: 'Loại vote', required: true, lookup: LookupData.ReferenceEnum(VoteType) })
    Type: VoteType;

    @DropDownDecorator({ label: 'Trạng thái', required: true, lookup: LookupData.ReferenceEnum(VoteStatus) })
    VoteStatus: VoteStatus;

    @BooleanDecorator({ label: 'Ẩn danh' })
    IsAnonymous: boolean;

    @BooleanDecorator({ label: 'Cho phép thêm đề xuất' })
    AllowSuggest: boolean;

    @DateTimeDecorator({ label: 'Hạn bình chọn', type: DateTimeType.DateTime })
    DeadLine: Date;
}

