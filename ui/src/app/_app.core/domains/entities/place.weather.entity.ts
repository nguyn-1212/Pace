import { BaseEntity } from '../../../core/domains/entities/base.entity';
import { PlaceEntity } from './place.entity';
import { LookupData } from '../../../core/domains/data/lookup.data';
import { StringType, DateTimeType } from '../../../core/domains/enums/data.type';
import { TableDecorator } from '../../../core/decorators/table.decorator';
import { StringDecorator } from '../../../core/decorators/string.decorator';
import { NumberDecorator } from '../../../core/decorators/number.decorator';
import { DateTimeDecorator } from '../../../core/decorators/datetime.decorator';
import { DropDownDecorator } from '../../../core/decorators/dropdown.decorator';

@TableDecorator({ name: 'placeweather', title: 'Thời tiết địa điểm' })
export class PlaceWeatherEntity extends BaseEntity {
    @DropDownDecorator({ label: 'Địa điểm', required: true, allowSearch: true, lookup: LookupData.Reference(PlaceEntity, ['Name']) })
    PlaceId: number;

    @DateTimeDecorator({ label: 'Ngày', required: true, type: DateTimeType.Date })
    Date: Date;

    @NumberDecorator({ label: 'Nhiệt độ cao (°C)' })
    TempHigh: number;

    @NumberDecorator({ label: 'Nhiệt độ thấp (°C)' })
    TempLow: number;

    @DropDownDecorator({ label: 'Thời tiết', lookup: LookupData.ReferenceItems([
        { label: '☀️ Nắng', value: 'sunny' },
        { label: '⛅ Nhiều mây', value: 'cloudy' },
        { label: '🌧️ Mưa', value: 'rain' },
        { label: '⛈️ Bão', value: 'storm' },
    ]) })
    Condition: string;

    @NumberDecorator({ label: 'Độ ẩm (%)' })
    Humidity: number;

    @NumberDecorator({ label: 'Tốc độ gió (km/h)' })
    WindSpeed: number;

    @StringDecorator({ label: 'Nhãn mùa', max: 100 })
    SeasonLabel: string;
}

