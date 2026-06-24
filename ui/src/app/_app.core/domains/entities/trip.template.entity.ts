import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType, NumberType } from '../../../core/domains/enums/data.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { BooleanDecorator } from '../../../core/decorators/boolean.decorator';

@TableDecorator({ name: 'triptemplate', title: 'Mẫu chuyến đi' })
export class TripTemplateEntity extends BaseEntity {
    @StringDecorator({ label: 'Tên mẫu', required: true, allowSearch: true, max: 200 })
    Name: string;

    @StringDecorator({ label: 'Mô tả', type: StringType.MultiText })
    Description: string;

    @StringDecorator({ label: 'Điểm đến', allowSearch: true, max: 200 })
    Destination: string;

    @NumberDecorator({ label: 'Số ngày', required: true })
    Duration: number;

    @NumberDecorator({ label: 'Chi phí ước tính/người', type: NumberType.Numberic })
    EstCostPerPerson: number;

    @StringDecorator({ label: 'Tiền tệ', max: 10 })
    Currency: string;

    @StringDecorator({ label: 'Tags', max: 500 })
    Tags: string;

    @StringDecorator({ label: 'Emoji', max: 10 })
    CoverEmoji: string;

    @NumberDecorator({ label: 'Số lần dùng' })
    UsedCount: number;

    @BooleanDecorator({ label: 'Mẫu chính thức' })
    IsOfficial: boolean;
}


