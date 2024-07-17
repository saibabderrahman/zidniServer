import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcaOrder, RegistrationState } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { axiosInstance } from './configuration';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { StepDto, PhoneNumberStepDto, EmailStepDto, GenderStepDto, DateOfBirthStepDto } from './dto/step.dto';
import * as FormData from 'form-data'; // Use form-data package
import * as fs from 'fs'; // For file handling if needed

import axios from 'axios';
import { EducationalCycleService } from 'src/educational_cycle/educational_cycle.service';
import { AcaOrderService } from 'src/aca-order/aca-order.service';
import { LoggerService } from 'src/logger.service';
import { handleError } from 'src/utility/helpers.utils';




@Injectable()
export class TelegramService {
  private axiosInstance = axiosInstance;

  constructor(
    @InjectRepository(AcaOrder) private readonly orderRepository: Repository<AcaOrder>,
    @InjectRepository(RegistrationState) private readonly registrationStateRepository: Repository<RegistrationState>,
    private readonly educationService:EducationalCycleService,
    private readonly AcaOrderService:AcaOrderService,
    private readonly logger:LoggerService

  ) {}

  private apiToken = "7426367377:AAHB9xMIbmPFQrlVG5Hgtr2rTnTwaP_Ji6Y";
   private BASE_URL = `https://api.telegram.org/bot${this.apiToken}`;


  async sendMessage(chatId: string, text: string): Promise<void> {
    await this.axiosInstance.get('sendMessage', {
      chat_id: chatId,
      text,
    })
  }
  async sendVideo(
    chatId, 
    videoUrl, 
    options = {}
  ) {
    try {
      const trimmedVideoUrl = videoUrl.trim();
      const isUrl = trimmedVideoUrl.startsWith('http://') || trimmedVideoUrl.startsWith('https://');
  
      if (!isUrl) {
        throw new Error('Invalid URL format');
      }
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('video', fs.createReadStream('./src/telegram/annonce.mp4'));
      const response = await axios.post(`${this.BASE_URL}/sendVideo`, formData ,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      } catch (error) {
      console.error('Error sending video:', error.response ? error.response.data : error.message);
      await this.sendMessage(chatId, 'شكرًا! الآن، يرجى إدخال بلديتك:');
    }
  }




async  sendPhoto(chatId: string, photoUrl: string, options?: { caption?: string, message_effect_id?: string, show_caption_above_media?: boolean }): Promise<void> {
    await axiosInstance.post('sendPhoto', {
        chat_id: chatId,
        photo: photoUrl,
        caption: options?.caption,
        message_effect_id: options?.message_effect_id,
        show_caption_above_media: options?.show_caption_above_media,
    });
}

  async handleMessage(messageObj: any ,education:number): Promise<void> {
    const chatId = messageObj.chat.id;
    let state = await this.registrationStateRepository.findOne({ where: { chatId ,education } });
    const text = messageObj.text.trim();

    if (!state) {
      if (text === 'إبدأ') {
        state = this.registrationStateRepository.create({ chatId, step: 'fullName', data: {chatId,educational_cycle:{id:education}}, education });
        await this.registrationStateRepository.save(state);
        await this.sendMessage(chatId, 'مرحبًا! نود التعرف عليك أكثر. يُرجى إدخال اسمك الكامل:');
      } else {
        await this.sendMessage(chatId, `لبدء عملية التسجيل، أدخل "إبدأ".\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about لمعرفة تفاصيل الدورة\n- /time لمعرفة مدة الدراسة`);
      }
      return;
    }
    if (state.step === 'phoneNumber') {
      state.data.phoneNumber = `+213${text.replace(/^0/, '')}`; // Add +213 and remove leading 0
    }

    switch (state.step) {
      case 'fullName':
        state.data.firstName = text.split(' ')[0]; // Assuming first name is the first word
        state.data.lastName = text.split(' ').slice(1).join(' '); // The rest is last name
        state.data.fullName = text;
        await this.sendMessage(chatId, `ممتاز، ${state.data.firstName}! الآن، يُرجى إدخال رقم هاتفك:`);
        state.step = 'phoneNumber';
        break;
      case 'phoneNumber':
        const phoneStepDto = plainToClass(PhoneNumberStepDto, state.data);
        const phoneErrors = await validate(phoneStepDto);
        if (phoneErrors.length > 0) {
          const errorMessage = phoneErrors.map(err => Object.values(err.constraints)).join(', ');
          await this.sendMessage(chatId, `عذرًا، ${state.data.firstName}، هناك خطأ في البيانات: ${errorMessage}`);
          break;
        }
        await this.sendMessage(chatId, `حسنًا، ${state.data.firstName}! الآن، يُرجى إدخال بريدك الإلكتروني:`);
        state.step = 'email';
        break;
      case 'email':
        state.data.email = text;
        const emailStepDto = plainToClass(EmailStepDto, state.data);
        const emailErrors = await validate(emailStepDto);
        if (emailErrors.length > 0) {
          const errorMessage = emailErrors.map(err => Object.values(err.constraints)).join(', ');
          await this.sendMessage(chatId, `عذرًا، ${state.data.firstName}، هناك خطأ في البيانات: ${errorMessage}`);
          break;
        }
        await this.sendMessage(chatId, `رائع، ${state.data.firstName}! الآن، يُرجى إدخال جنسك:`);
        state.step = 'gender';
        break;
      case 'gender':
        state.data.gender = text;
        const genderStepDto = plainToClass(GenderStepDto, state.data);
        const genderErrors = await validate(genderStepDto);
        if (genderErrors.length > 0) {
          const errorMessage = genderErrors.map(err => Object.values(err.constraints)).join(', ');
          await this.sendMessage(chatId, `عذرًا، ${state.data.firstName}، هناك خطأ في البيانات: ${errorMessage}`);
          break;
        }
        await this.sendMessage(chatId, `جيد، ${state.data.firstName}! الآن، يُرجى إدخال الولاية التي تسكن بها:`);
        state.step = 'Wilaya';
        break;
      case 'Wilaya':
        state.data.wilaya = text;
        await this.sendMessage(chatId, `ممتاز، ${state.data.firstName}! الآن، يُرجى إدخال البلدية التي تسكن بها:`);
        state.step = 'commune';
        break;
      case 'commune':
        state.data.commune = text;
        await this.sendMessage(chatId, `رائع، ${state.data.firstName}! الآن، يُرجى إدخال مستوى تعليمك (إبتدائي، متوسط، جامعي ...):`);
        state.step = 'educationLevel';
        break;
      case 'educationLevel':
        state.data.educationLevel = text;
        await this.sendMessage(chatId, `حسنًا، ${state.data.firstName}! الآن، يُرجى إدخال مقدار حفظك للقرآن الكريم:`);
        state.step = 'memorizationValue';
        break;
      case 'memorizationValue':
        state.data.memorizationValue = text;
        await this.sendMessage(chatId, `ممتاز، ${state.data.firstName}! الآن، يُرجى إدخال الرواية التي تقرأ بها (مثلاً: حفص عن عاصم، ورش عن نافع، وغيرها من الروايات العشر):`);
        state.step = 'cart';
        break;
      case 'cart':
        state.data.cart = text;
        await this.sendMessage(chatId, `حسنًا، ${state.data.firstName}! الآن، يُرجى إدخال تاريخ ميلادك:`);
        state.step = 'dateOfBirth';
        break;
      case 'dateOfBirth':
        state.data.dateOfBirth = text;
        const dobStepDto = plainToClass(DateOfBirthStepDto, state.data);
        const dobErrors = await validate(dobStepDto);
        if (dobErrors.length > 0) {
          const errorMessage = dobErrors.map(err => Object.values(err.constraints)).join(', ');
          await this.sendMessage(chatId, `عذرًا، ${state.data.firstName}، هناك خطأ في البيانات: ${errorMessage}`);
          break;
        }
        await this.sendMessage(chatId, `تم التسجيل بنجاح، ${state.data.firstName}! نشكرك على تعاونك.`);
    
        const summaryMessage = `
        المعلومات التي أدخلتها:
        - الاسم الكامل: ${state.data.fullName}
        - رقم الهاتف: ${state.data.phoneNumber}
        - البريد الإلكتروني: ${state.data.email}
        - الجنس: ${state.data.gender}
        - الولاية: ${state.data.wilaya}
        - البلدية: ${state.data.commune}
        - المستوى التعليمي: ${state.data.educationLevel}
        - قيمة الحفظ: ${state.data.memorizationValue}
        - الرواية: ${state.data.cart}
        - تاريخ الميلاد: ${state.data.dateOfBirth}
        `;
    
        await this.sendMessage(chatId, summaryMessage);
        const Education = await this.educationService.findOne(education);

    
        const adminTelegramAccount = Education.admin_telegrams_links;
        const paymentAmount = Education.price || 5000;
        const adminAcount = Education.ccp  || "";
        const whatsappSupport = Education.whatsapp_number || "";
        const EducationName = Education.name || ""
        const StudentName = state.data.fullName
        
        const friendlyMessage = `
        عمل رائع، ${StudentName}!
        
        لقد تم تسجيلك في دورة ${EducationName}.
        
        لإكمال عملية التسجيل، يُرجى دفع ${paymentAmount} دج إلى الحساب التالي:
        
        حساب البريد (CCP): ${adminAcount}
        
        بعد إتمام الدفع، يُرجى إرسال وصل التسليم إلى حساب الأدمن على تلغرام: ${adminTelegramAccount} أو عبر الواتساب: ${whatsappSupport}
        
        نحن هنا لمساعدتك في أي استفسار أو مساعدة تحتاجها. شكراً لاختياركم لنا!
        `;
        await this.sendMessage(chatId, friendlyMessage);
        await this.saveOrder(state.data as Partial<AcaOrder>);
        state.step = 'default';
        break;
      default:
        const message = text.trim().toLowerCase();
        let responseMessage = '';
        switch (message) {
          case 'حقوق الدورة':
            responseMessage = 'حقوق الدورة ...';
            break;
          case 'حساب الأدمن':
            const adminTelegramAccount = "+213 668 76 73 31";
            responseMessage = `للتواصل مع الأدمن عبر تلغرام: <a href="https://t.me/${encodeURIComponent(adminTelegramAccount)}">${adminTelegramAccount}</a>`;
            break;
          case 'تفاصيل الدورة':
            const videoUrl = 'https://utfs.io/f/5c24e2ab-5f1c-47b7-920f-7fc268b435fc-e3elni.mp4';
            await this.sendVideo(chatId, videoUrl, {
              caption: 'تفاصيل الدورة ...',
              supports_streaming: true,
              show_caption_above_media: true,
            });
            responseMessage = "تم إرسال تفاصيل الدورة عبر الفيديو.";
            break;
          case 'مواعيد الدراسة':
            responseMessage = 'مواعيد الدراسة ...';
            break;
          default:
            responseMessage = `لبدء عملية التسجيل، أدخل "إبدأ".\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about لمعرفة تفاصيل الدورة\n- /time لمعرفة مدة الدراسة`
            break;
        }
        await this.sendMessage(chatId, responseMessage);
        break;
    }

    await this.registrationStateRepository.save(state);
  }


  async handleCommand(command: string, messageObj: any, education: number): Promise<void> {
    const chatId = messageObj.chat.id;
    const Education = await this.educationService.findOne(education);
  
    switch (command) {
      case 'start':
        await this.sendMessage(chatId, `لبدء عملية التسجيل، أدخل "إبدأ".\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about لمعرفة تفاصيل الدورة\n- /time لمعرفة مدة الدراسة`);
        break;
  
      case 'price':
        if (Education.price) {
          await this.sendMessage(chatId, `سعر التسجيل هو ${Education.price} دج لمرة واحدة، ويشمل مدة الدورة ${Education.time}.\n\nلبدء عملية التسجيل، أدخل "إبدأ".\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about لمعرفة تفاصيل الدورة\n- /time لمعرفة مدة الدراسة`);
        } else {
          await this.sendMessage(chatId, `عذرًا، لا يوجد معلومات متاحة حاليًا حول السعر.`);
        }
        break;
  
      case 'admin':
        const contactPhone = Education.contact_phone || "لا توجد معلومات متاحة حالياً.";
        const whatsappNumber = Education.whatsapp_number || "لا توجد معلومات متاحة حالياً.";
        const telegramLinks = Education.telegrams_links || "لا توجد معلومات متاحة حالياً.";
        
        const contactMessage = `
  يمكنك التواصل مع الأدمن عبر الطرق التالية:
  📞 هاتف: ${contactPhone}
  📱 واتساب: ${whatsappNumber}
  📱 تيليجرام: ${telegramLinks}
  
  نحن هنا لمساعدتك في أي استفسار أو مساعدة تحتاجها.
        `;
        await this.sendMessage(chatId, contactMessage);
        break;
  
      case 'time':
        await this.sendMessage(chatId, `مدة الدورة هي ${Education.time}.\n\nلبدء عملية التسجيل، أدخل "إبدأ".\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about لمعرفة تفاصيل الدورة\n- /time لمعرفة مدة الدراسة`);
        break;
  
      case 'about':
        if (Education && Education.subDescription) {
          await this.sendMessage(chatId, Education.subDescription);
          await this.sendMessage(chatId, `لبدء عملية التسجيل، أدخل "إبدأ".\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about لمعرفة تفاصيل الدورة\n- /time لمعرفة مدة الدراسة`);
        } else {
          await this.sendMessage(chatId, `عذرًا، لا يوجد معلومات متاحة حاليًا حول الدورة.`);
        }
        const videoUrl = 'https://utfs.io/f/5c24e2ab-5f1c-47b7-920f-7fc268b435fc-e3elni.mp4';
        await this.sendVideo(chatId, videoUrl, {
          caption: 'تفاصيل الدورة ...',
          supports_streaming: true,
          show_caption_above_media: true,
        });
        break;
  
      default:
        await this.sendMessage(chatId, `لبدء عملية التسجيل، أدخل "إبدأ".\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about لمعرفة تفاصيل الدورة\n- /time لمعرفة مدة الدراسة`);
    }
  }
  

  private async saveOrder(orderData: Partial<AcaOrder>): Promise<void> {
    try {
      const order = this.orderRepository.create(orderData);
      await this.orderRepository.save(order);
    } catch (error) {
      console.error('Failed to save order:', error);
      throw new Error('Could not save order. Please try again later.');
    }
  }
  async sendMessageSingleChat(id:number,message:string){
    try {
      const order = await this.AcaOrderService.findAcaOrderById(id)

      if(!order){
        throw new NotFoundException("order not found")
      }
      await this.sendMessage(order.chatId,message)
    } catch (error) {
      handleError('Error in create wilayat function', error,this.logger,"statesDelivery");    
    }
  }



}
