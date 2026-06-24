import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';
import { FriendshipStatus } from '../enums/friendship.status.type';

@TableDecorator({ name: 'friendship', title: 'Kết bạn' })
export class FriendshipEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Người gửi', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    RequesterId: number;

    @DropDownDecorator({ label: 'Người nhận', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    AddresseeId: number;

    @DropDownDecorator({ label: 'Trạng thái', required: true, lookup: LookupData.ReferenceEnum(FriendshipStatus) })
    Status: FriendshipStatus;
}

