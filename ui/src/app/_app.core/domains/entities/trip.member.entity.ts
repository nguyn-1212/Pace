import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { TripEntity } from './trip.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { DateTimeType } from '../../../core/domains/enums/data.type';
import { TripMemberRole, TripMemberStatus } from '../enums/trip.member.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'tripmember', title: 'Thành viên chuyến đi' })
export class TripMemberEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @DropDownDecorator({ label: 'Thành viên', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UserId: number;

    @DropDownDecorator({ label: 'Vai trò', required: true, lookup: LookupData.ReferenceEnum(TripMemberRole) })
    Role: TripMemberRole;

    @DropDownDecorator({ label: 'Trạng thái', required: true, lookup: LookupData.ReferenceEnum(TripMemberStatus) })
    Status: TripMemberStatus;

    @DateTimeDecorator({ label: 'Ngày tham gia', type: DateTimeType.DateTime })
    JoinedDate: Date;

    @DropDownDecorator({ label: 'Mời bởi', allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    InvitedBy: number;
}

