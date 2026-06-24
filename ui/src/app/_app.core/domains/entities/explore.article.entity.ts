import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { PlaceEntity } from './place.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType, DateTimeType } from '../../../core/domains/enums/data.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { BooleanDecorator } from '../../../core/decorators/boolean.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'explorearticle', title: 'Bài viết Explore' })
export class ExploreArticleEntity extends BaseEntity {
    @StringDecorator({ label: 'Tiêu đề', required: true, allowSearch: true, max: 300 })
    Title: string;

    @StringDecorator({ label: 'Slug', type: StringType.Code, max: 350 })
    Slug: string;

    @StringDecorator({ label: 'Tóm tắt', type: StringType.MultiText })
    Summary: string;

    @StringDecorator({ label: 'Nội dung', required: true, type: StringType.Html })
    Content: string;

    @StringDecorator({ label: 'Emoji', max: 10 })
    CoverEmoji: string;

    @StringDecorator({ label: 'Danh mục', max: 50 })
    ArticleCategory: string;

    @DropDownDecorator({ label: 'Địa điểm liên quan', allowSearch: true, lookup: LookupData.Reference(PlaceEntity, ['Name']) })
    PlaceId: number;

    @StringDecorator({ label: 'Tác giả', max: 100 })
    Author: string;

    @NumberDecorator({ label: 'Lượt xem' })
    ViewCount: number;

    @BooleanDecorator({ label: 'Đã xuất bản' })
    IsPublished: boolean;

    @DateTimeDecorator({ label: 'Ngày xuất bản', type: DateTimeType.DateTime })
    PublishedDate: Date;
}


