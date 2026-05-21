import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentIntentDto {
    @IsNumber()
    amount: number;

    @IsString()
    currency: string;

    @IsOptional()
    @IsString()
    orderId?: string;
}