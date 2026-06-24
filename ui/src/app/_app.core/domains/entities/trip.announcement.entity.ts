import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType } from '../../../core/domains/enums/data.type';
import { AnnouncementPriority } from '../enums/vote.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'tripannouncement', title: 'Thông báo nhóm' })
export class TripAnnouncementEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @StringDecorator({ label: 'Tiêu đề', required: true, allowSearch: true, max: 300 })
    Title: string;

    @StringDecorator({ label: 'Nội dung', type: StringType.MultiText })
    Content: string;

    @DropDownDecorator({ label: 'Độ ưu tiên', required: true, lookup: LookupData.ReferenceEnum(AnnouncementPriority) })
    Priority: AnnouncementPriority;
}


