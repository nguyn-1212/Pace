import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { ImageDecorator } from '../../../core/decorators/image.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'photoalbum', title: 'Album ảnh' })
export class PhotoAlbumEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @StringDecorator({ label: 'Tên album', required: true, max: 200 })
    Name: string;

    @ImageDecorator({ label: 'Ảnh bìa', url: 'album' })
    CoverUrl: string;
}

