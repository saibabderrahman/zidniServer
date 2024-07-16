import { IsNotEmpty, IsPhoneNumber, IsEmail, IsIn, IsDate, Matches } from 'class-validator';

export class StepDto {
  @IsNotEmpty({ message: 'الرجاء إدخال اسمك الكامل' })
  fullName: string;
}

export class PhoneNumberStepDto extends StepDto {
  @IsNotEmpty({ message: 'الرجاء إدخال رقم هاتفك' })
  @IsPhoneNumber(undefined, { message: 'الرجاء إدخال رقم هاتف صحيح' })
  phoneNumber: string;
}

export class EmailStepDto extends PhoneNumberStepDto {
  @IsNotEmpty({ message: 'الرجاء إدخال بريدك الإلكتروني' })
  @IsEmail({}, { message: 'الرجاء إدخال بريد إلكتروني صحيح' })
  email: string;
}

export class GenderStepDto extends EmailStepDto {
  @IsNotEmpty({ message: 'الرجاء اختيار الجنس' })
  @IsIn(['ذكر', 'أنثى'], { message: 'الرجاء اختيار جنس صحيح (ذكر أو أنثى)' })
  gender: string;
}

export class DateOfBirthStepDto extends GenderStepDto {
    @IsNotEmpty({ message: 'الرجاء إدخال تاريخ ميلادك' })
    @Matches(
      /^(0?[1-9]|[12][0-9]|3[01])[\s/](0?[1-9]|1[0-2]|يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)[\s/]\d{4}$/u,
      { message: 'الرجاء إدخال تاريخ ميلاد صحيح (يوم/شهر/سنة)' }
    )
    dateOfBirth: string;
  }
