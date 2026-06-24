import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { TripEntity } from './trip.entity';
import { UserEntity } from '../../../core/domains/entities/user.entity';
import { PhotoAlbumEntity } from './photo.album.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType, NumberType, DateTimeType } from '../../../core/domains/enums/data.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';
import { ImageDecorator } from '../../../core/decorators/image.decorator';

@TableDecorator({ name: 'tripphoto', title: 'Ảnh chuyến đi' })
export class TripPhotoEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Chuyến đi', required: true, allowSearch: true, lookup: LookupData.Reference(TripEntity, ['Code', 'Name']) })
    TripId: number;

    @DropDownDecorator({ label: 'Album', allowSearch: true, lookup: LookupData.Reference(PhotoAlbumEntity, ['Name']) })
    AlbumId: number;

    @DropDownDecorator({ label: 'Người đăng', required: true, allowSearch: true, lookup: LookupData.Reference(UserEntity, ['FullName', 'Email']) })
    UploadedBy: number;

    @ImageDecorator({ label: 'Ảnh', url: 'photo', required: true })
    FileUrl: string;

    @StringDecorator({ label: 'Caption', type: StringType.MultiText })
    Caption: string;

    @DateTimeDecorator({ label: 'Thời gian chụp', type: DateTimeType.DateTime })
    TakenAt: Date;

    @NumberDecorator({ label: 'Số lượt thích' })
    LikeCount: number;
}


