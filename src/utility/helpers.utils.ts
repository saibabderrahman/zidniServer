

import {
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  NotAcceptableException,
  RequestTimeoutException,
  ConflictException,
  GoneException,
  HttpVersionNotSupportedException,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
  InternalServerErrorException,
  NotImplementedException,
  ImATeapotException,
  MethodNotAllowedException,
  BadGatewayException,
  ServiceUnavailableException,
  GatewayTimeoutException,
  PreconditionFailedException,
} from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { LoggerService } from 'src/logger.service';
import * as FormData from 'form-data';
import * as fs from 'fs'; 



export const messages = {
  "startRegistration": "لبدء عملية التسجيل، أدخل \"حسنا\".\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about لمعرفة تفاصيل الدورة\n- /time لمعرفة مدة الدراسة",
  "emptyTextError": "النص المدخل فارغ، يُرجى المحاولة مرة أخرى.",
  "phoneNumberStepMessage": "ممتاز، {firstName}! حاليًا، هل يمكنك أن تخبرني بجنسك؟ مثلاً: ذكر أو أنثى",
  "genderStepMessage": "جيد، {firstName}! الآن، يُرجى إدخال الولاية التي تسكن بها:",
  "wilayaStepMessage": "ممتاز، {firstName}! الآن، يُرجى إدخال البلدية التي تسكن بها:",
  "communeStepMessage": "رائع، {firstName}! الآن، يُرجى إدخال مستوى تعليمك (إبتدائي، متوسط، جامعي ...):",
  "educationLevelStepMessage": "حسنًا، {firstName}! الآن، يُرجى إدخال مقدار حفظك للقرآن الكريم:",
  "memorizationValueStepMessage": "ممتاز، {firstName}! الآن، يُرجى إدخال الرواية التي تقرأ بها (مثلاً: حفص عن عاصم، ورش عن نافع، وغيرها من الروايات العشر):",
  "registrationSuccess": "تم التسجيل بنجاح، {firstName}! نشكرك على تعاونك.",
  "friendlyMessage": "عمل رائع، {studentName}!\n\nلقد تم تسجيلك في دورة {educationName}.\n\nلإكمال عملية التسجيل، يُرجى دفع {paymentAmount} دج إلى الحساب التالي:\n\nحساب البريد (CCP): {adminAccount}\n\nبعد إتمام الدفع، يُرجى إرسال صورة لإيصال الدفع هنا.\n\nإذا كانت لديك أي استفسارات أو تحتاج إلى مساعدة، يُرجى التواصل مع الأدمن على تلغرام: {adminTelegramAccount} أو عبر الواتساب: {whatsappSupport}\n\nنحن هنا لمساعدتك في أي استفسار أو مساعدة تحتاجها. شكراً لاختياركم لنا!",
  "imageReceived": "شكرًا لك، {firstName}!\nتم استلام صورة إيصال الدفع.\nسيتم مراجعة طلبك وسيتم إشعارك بالخطوات التالية قريبًا.",
  "noImageError": "لم يتم استلام أي صورة. يُرجى إرسال صورة لإيصال الدفع.",
  "defaultResponse": "تم تسجيلك بنجاح \"حسنا\".\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about لمعرفة تفاصيل الدورة\n- /time لمعرفة مدة الدراسة"
}
export function filterNullEmptyPropertiesInArray(arr: any[]): any[] {
    return arr.map((obj) => filterNullEmptyProperties(obj));
  }
  
  export function filterNullEmptyProperties(obj: any): any {
    const filteredObj: any = {};
  
    for (const key in obj) {
      const value = obj[key];
  
      if (value !== null && !isEmpty(value)) {
        filteredObj[key] = value;
      }
    }
  
    return filteredObj;
  }
  
  function isEmpty(value: any): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
  
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length === 0;
    }
  
    return false;
  }

  export  interface Options  {
    page?: number;
    limit?: number;
  }


  export const  steps = {
    fullName: {
      message: 'نود التعرف عليك أكثر. يُرجى إدخال اسمك الكامل:',
      reminder: 'يبدو أنك نسيت إدخال اسمك الكامل. يُرجى كتابته لاستكمال التسجيل:',
      nextStep: 'phoneNumber',
    },
    phoneNumber: {
      message: '، يُرجى إدخال رقم هاتفك:',
      reminder: 'يبدو أنك نسيت إدخال رقم هاتفك، . يُرجى كتابته لاستكمال التسجيل:',
      nextStep: 'email',
      process: (text: string) => `+213${text.replace(/^0/, '')}`, // Add +213 and remove leading 0
    },
    email: {
      message: '، يُرجى إدخال بريدك الإلكتروني:',
      reminder: 'يبدو أنك نسيت إدخال بريدك الإلكتروني، . يُرجى كتابته لاستكمال التسجيل:',
      nextStep: 'gender',
    },
    gender: {
      message: '، يُرجى إدخال جنسك:',
      reminder: 'يبدو أنك نسيت إدخال جنسك، . يُرجى كتابته لاستكمال التسجيل:',
      nextStep: 'Wilaya',
    },
    Wilaya: {
      message: '، يُرجى إدخال الولاية التي تسكن بها:',
      reminder: 'يبدو أنك نسيت إدخال الولاية التي تسكن بها، . يُرجى كتابتها لاستكمال التسجيل:',
      nextStep: 'commune',
    },
    commune: {
      message: '، يُرجى إدخال البلدية التي تسكن بها:',
      reminder: 'يبدو أنك نسيت إدخال البلدية التي تسكن بها، . يُرجى كتابتها لاستكمال التسجيل:',
      nextStep: 'educationLevel',
    },
    educationLevel: {
      message: '، يُرجى إدخال مستوى تعليمك (إبتدائي، متوسط، جامعي ...):',
      reminder: 'يبدو أنك نسيت إدخال مستوى تعليمك، . يُرجى كتابته لاستكمال التسجيل:',
      nextStep: 'memorizationValue',
    },
    memorizationValue: {
      message: '، يُرجى إدخال مقدار حفظك للقرآن الكريم:',
      reminder: 'يبدو أنك نسيت إدخال مقدار حفظك للقرآن الكريم، . يُرجى كتابته لاستكمال التسجيل:',
      nextStep: 'cart',
    },
    cart: {
      message: '، يُرجى إدخال الرواية التي تقرأ بها (مثلاً: حفص عن عاصم، ورش عن نافع، وغيرها من الروايات العشر):',
      reminder: 'يبدو أنك نسيت إدخال الرواية التي تقرأ بها، . يُرجى كتابتها لاستكمال التسجيل:',
      nextStep: 'dateOfBirth',
    },
    age: {
      message: '، يُرجى إدخال تاريخ ميلادك:',
      reminder: 'يبدو أنك نسيت إدخال تاريخ ميلادك، . يُرجى كتابته لاستكمال التسجيل:',
      nextStep: 'complete',
    },
     image: {
      message: 'تذكير بأرسال وصل الدفع لأإكمال عملية التسجيل:',
      reminder: 'يبدو أنك نسيت إرسال وصل الدفع. يُرجى إرساله لاستكمال التسجيل:',
      nextStep: 'complete',
    },
  };

  export async function sendMessage(chatId: string, text: string, apiToken: string): Promise<void> {
    
    const axiosInstance: AxiosInstance = axios.create({
      baseURL: `https://api.telegram.org/bot${apiToken}/`,
    });

    try {
      await axiosInstance.get('sendMessage', {
        params: {
          chat_id: chatId,
          text: text,
        },
      });

    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
 export async function sendMedia(
    chatId: string,
    filePath: string,
    mediaType: 'video' | 'audio',
    apiToken: string
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append(mediaType, fs.createReadStream(filePath));

      await axios.post(`https://api.telegram.org/bot${apiToken}/send${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)}`, formData, {
        headers: { ...formData.getHeaders() },
      });
    } catch (error) {
      console.error(`Error sending ${mediaType}:`, error.response ? error.response.data : error.message);
      await this.sendMessage(chatId, 'Error occurred while sending media.', apiToken);
    }
  }

  


 export async function queryAndPaginate(queryBuilder, offset, limit) {
   const totalCount = await queryBuilder.getCount();
   const hasMore = totalCount > offset + limit;
   queryBuilder.skip(offset).take(limit);
   const data = await queryBuilder.getMany();
   return { totalCount, hasMore, data };
 }
export function validateOrderState(orderState: string, validStates: string[]): void {
  if (!validStates.includes(orderState)) {
    throw new ForbiddenException(`Sorry, you can't update the order in its current state. It must be one of: ${validStates.join(', ')}`);
  }
}

export function handleError(message: string, error: any ,logger:LoggerService ,service:string): void {
  logger.error(message, error, service);
  if (error instanceof BadRequestException) {
    throw new BadRequestException(error.message || 'Bad Request');
  } else if (error instanceof UnauthorizedException) {
    throw new UnauthorizedException(error.message || 'Unauthorized');
  } else if (error instanceof NotFoundException) {
    throw new NotFoundException(error.message || 'Not Found');
  } else if (error instanceof ForbiddenException) {
    throw new ForbiddenException(error.message || 'Forbidden');
  } else if (error instanceof NotAcceptableException) {
    throw new NotAcceptableException(error.message || 'Not Acceptable');
  } else if (error instanceof RequestTimeoutException) {
    throw new RequestTimeoutException(error.message || 'Request Timeout');
  } else if (error instanceof ConflictException) {
    throw new ConflictException(error.message || 'Conflict');
  } else if (error instanceof GoneException) {
    throw new GoneException(error.message || 'Gone');
  } else if (error instanceof HttpVersionNotSupportedException) {
    throw new HttpVersionNotSupportedException(error.message || 'HTTP Version Not Supported');
  } else if (error instanceof PayloadTooLargeException) {
    throw new PayloadTooLargeException(error.message || 'Payload Too Large');
  } else if (error instanceof UnsupportedMediaTypeException) {
    throw new UnsupportedMediaTypeException(error.message || 'Unsupported Media Type');
  } else if (error instanceof UnprocessableEntityException) {
    throw new UnprocessableEntityException(error.message || 'Unprocessable Entity');
  } else if (error instanceof InternalServerErrorException) {
    throw new InternalServerErrorException(error.message || 'Internal Server Error');
  } else if (error instanceof NotImplementedException) {
    throw new NotImplementedException(error.message || 'Not Implemented');
  } else if (error instanceof ImATeapotException) {
    throw new ImATeapotException(error.message || 'I\'m a teapot');
  } else if (error instanceof MethodNotAllowedException) {
    throw new MethodNotAllowedException(error.message || 'Method Not Allowed');
  } else if (error instanceof BadGatewayException) {
    throw new BadGatewayException(error.message || 'Bad Gateway');
  } else if (error instanceof ServiceUnavailableException) {
    throw new ServiceUnavailableException(error.message || 'Service Unavailable');
  } else if (error instanceof GatewayTimeoutException) {
    throw new GatewayTimeoutException(error.message || 'Gateway Timeout');
  } else if (error instanceof PreconditionFailedException) {
    throw new PreconditionFailedException(error.message || 'Precondition Failed');
  } else {
    throw new BadRequestException(error.message || 'Bad Request');
  }
}













  