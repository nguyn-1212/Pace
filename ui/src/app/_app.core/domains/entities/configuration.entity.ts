import { StringType } from "../../../core/domains/enums/data.type";
import { BaseEntity } from "../../../core/domains/entities/base.entity";
import { ImageDecorator } from "../../../core/decorators/image.decorator";
import { TableDecorator } from "../../../core/decorators/table.decorator";
import { StringDecorator } from "../../../core/decorators/string.decorator";
import { BooleanDecorator } from "../../../core/decorators/boolean.decorator";
import { NumberDecorator } from "../../../core/decorators/number.decorator";

@TableDecorator({ title: 'Configuration' })
export class ConfigurationEntity extends BaseEntity {
    // Cash
    @BooleanDecorator()
    AllowCash: boolean;

    // Stripe
    @BooleanDecorator()
    AllowStripe: boolean;

    @StringDecorator({ type: StringType.Text, max: 250 })
    StripeSecretKey: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    StripePublishableKey: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    StripeWebhookSecret: string;

    // Paypal
    @BooleanDecorator()
    AllowPaypal: boolean;

    @StringDecorator({ type: StringType.Link })
    PaypalBaseUrl: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    PaypalClientId: string;

    @StringDecorator({ type: StringType.Text, max: 250 })
    PaypalClientSecret: string;

    // Meta
    @StringDecorator({ type: StringType.Text })
    Name: string;

    @ImageDecorator()
    Logo: string;

    @StringDecorator({ type: StringType.Text })
    Title: string;

    @StringDecorator({ type: StringType.MultiText })
    Description: string;

    // Contact
    @StringDecorator({ label: 'TimeOpening', type: StringType.Text, max: 50 })
    Time: string;

    @StringDecorator({ type: StringType.Text, max: 20 })
    Phone: string;

    @StringDecorator({ type: StringType.Email })
    Email: string;

    @StringDecorator({ type: StringType.MultiText })
    Address: string;

    @StringDecorator({ type: StringType.Text, max: 20 })
    Hotline: string;

    // Social
    @StringDecorator({ type: StringType.Text })
    Tiktok: string;

    @StringDecorator({ type: StringType.Text })
    Youtube: string;

    @StringDecorator({ type: StringType.Text })
    Facebook: string;

    @NumberDecorator({ decimals: 2, step: 0.01 })
    DiscountValue: number;

    @NumberDecorator({ decimals: 2, step: 0.01, max: 100, subfix: '(%)' })
    DiscountPercent: number;

    @NumberDecorator({ decimals: 2, step: 0.01 })
    TotalPriceFreeOff: number;

    @NumberDecorator({ decimals: 2, step: 0.01 })
    TotalPriceFreeShip: number;

    @StringDecorator({ type: StringType.Email, max: 250 })
    NotifyEmail: string;
}