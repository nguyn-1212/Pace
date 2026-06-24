import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType } from '../../../core/domains/enums/data.type';
import { TripDocType } from '../enums/app.setting.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { ImageDecorator } from '../../../core/decorators/image.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'tripdoc', title: 'Tài liệu chuyến đi' })
export class TripDocEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @StringDecorator({ label: 'Tiêu đề', required: true, allowSearch: true, max: 300 })
    Title: string;

    @DropDownDecorator({ label: 'Loại tài liệu', required: true, lookup: LookupData.ReferenceEnum(TripDocType) })
    Type: TripDocType;

    @StringDecorator({ label: 'Nội dung', type: StringType.Html })
    Content: string;

    @ImageDecorator({ label: 'File đính kèm', url: 'tripdoc' })
    FileUrl: string;

    @DropDownDecorator({ label: 'Dành riêng cho', allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    ForUserId: number;
}

