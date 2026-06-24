import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { StringType, NumberType } from '../../../core/domains/enums/data.type';
import { PlaceType } from '../enums/place.type';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { BooleanDecorator } from '../../../core/decorators/boolean.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'place', title: 'Địa điểm' })
export class PlaceEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên', required: true, allowSearch: true, max: 200 })
    Name: string;

    @StringDecorator({ label: 'Tên tiếng Anh', allowSearch: true, max: 200 })
    NameEn: string;

    @StringDecorator({ label: 'Slug', type: StringType.Code, max: 250 })
    Slug: string;

    @StringDecorator({ label: 'Mô tả', type: StringType.MultiText })
    Description: string;

    @DropDownDecorator({ label: 'Loại', required: true, allowSearch: true, lookup: LookupData.ReferenceEnum(PlaceType) })
    Type: PlaceType;

    @StringDecorator({ label: 'Quốc gia', allowSearch: true, max: 100 })
    Country: string;

    @StringDecorator({ label: 'Tỉnh/Thành phố', allowSearch: true, max: 100 })
    Province: string;

    @StringDecorator({ label: 'Thành phố', max: 100 })
    City: string;

    @StringDecorator({ label: 'Địa chỉ', max: 500 })
    Address: string;

    @NumberDecorator({ label: 'Vĩ độ', type: NumberType.Numberic })
    Latitude: number;

    @NumberDecorator({ label: 'Kinh độ', type: NumberType.Numberic })
    Longitude: number;

    @StringDecorator({ label: 'Emoji', max: 10 })
    CoverEmoji: string;

    @NumberDecorator({ label: 'Điểm đánh giá', type: NumberType.Numberic })
    Rating: number;

    @NumberDecorator({ label: 'Số đánh giá' })
    ReviewCount: number;

    @StringDecorator({ label: 'Website', max: 300 })
    Website: string;

    @StringDecorator({ label: 'Giờ mở cửa', max: 50 })
    OpenTime: string;

    @StringDecorator({ label: 'Giờ đóng cửa', max: 50 })
    CloseTime: string;

    @StringDecorator({ label: 'Mức giá', max: 100 })
    PriceRange: string;

    @BooleanDecorator({ label: 'Đã xác minh' })
    IsVerified: boolean;
}


