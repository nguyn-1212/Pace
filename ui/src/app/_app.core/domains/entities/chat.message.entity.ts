import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType } from '../../../core/domains/enums/data.type';
import { ChatMessageType } from '../enums/chat.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { BooleanDecorator } from '../../../core/decorators/boolean.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'chatmessage', title: 'Tin nhắn' })
export class ChatMessageEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @DropDownDecorator({ label: 'Người gửi', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    SenderId: number;

    @StringDecorator({ label: 'Nội dung', type: StringType.MultiText })
    Content: string;

    @DropDownDecorator({ label: 'Loại tin nhắn', required: true, lookup: LookupData.ReferenceEnum(ChatMessageType) })
    Type: ChatMessageType;

    @BooleanDecorator({ label: 'Đã chỉnh sửa' })
    IsEdited: boolean;
}


