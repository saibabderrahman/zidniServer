import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AcaOrder, RegistrationState } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { axiosInstance } from './configuration';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { PhoneNumberStepDto,} from './dto/step.dto';

import axios from 'axios';
import { EducationalCycleService } from 'src/educational_cycle/educational_cycle.service';
import { AcaOrderService } from 'src/aca-order/aca-order.service';
import { LoggerService } from 'src/logger.service';
import { handleError, sendMedia, sendMessage, steps } from 'src/utility/helpers.utils';
import { ConfigService } from '@nestjs/config';
import { createWriteStream } from 'fs';
import { Cron } from '@nestjs/schedule';






@Injectable()
export class TelegramService {
  private axiosInstance = axiosInstance;

  constructor(
    @InjectRepository(AcaOrder) private readonly orderRepository: Repository<AcaOrder>,
    @InjectRepository(RegistrationState) private readonly registrationStateRepository: Repository<RegistrationState>,
    private readonly educationService:EducationalCycleService,
    private readonly AcaOrderService:AcaOrderService,
    private readonly logger:LoggerService,
    private readonly configService:ConfigService
  ) {}


  async downloadImage(fileId: string ,education): Promise<string> {
    
    const Education = await this.educationService.findOne(education)
    const token = Education.token_bot_telegram;
    const getFileUrl = `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`;

    try {
      const fileResponse = await axios.get(getFileUrl);
      const filePath = fileResponse.data.result.file_path;
      const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
      const localFilePath = `./src/upload/${fileId}.jpg`;

      const writer = createWriteStream(localFilePath);
      const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream',
      });

      response.data.pipe(writer);
      

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(`${fileId}.jpg`));
        writer.on('error', reject);
      });;
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }

  async handleMessage(messageObj: any ,education:number ,image?:boolean): Promise<void> {
    const chatId = messageObj.chat.id;
    let state = await this.registrationStateRepository.findOne({ where: { chatId ,education } });
    const text = messageObj.text?.trim();
    const Education = await this.educationService.findOne(education);
    const photo = messageObj?.photo;

    if (!state) {
      if (text === 'حسنا') {
        state = this.registrationStateRepository.create({ chatId, step: 'fullName',apiToken:Education.token_bot_telegram , data: {chatId,educational_cycle:{id:education}}, education });
        await this.registrationStateRepository.save(state);
        await sendMessage(chatId, 'مرحبًا! نود التعرف عليك أكثر. يُرجى إدخال اسمك الكامل:',Education.token_bot_telegram);
      } else {
        await sendMessage(
          chatId, `لبدء عملية التسجيل، أدخل "حسنا".\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about لمعرفة تفاصيل الدورة\n- /time لمعرفة مدة الدراسة`
          ,Education.token_bot_telegram
        
        );
      }
      return;
    }

    
    if (!text && state.step !== "image") {
      await sendMessage(chatId, 'النص المدخل فارغ، يُرجى المحاولة مرة أخرى.', Education.token_bot_telegram);
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
        await sendMessage(chatId, `مرحبًا، ${state.data.firstName}! يُرجى إخباري بتاريخ ميلادك إذا سمحت 🎂`, Education.token_bot_telegram);
        state.step = 'age';
        break;
       case 'age':
         state.data.age = text;
         await sendMessage(chatId, `ممتاز، ${state.data.firstName}! الآن، يُرجى إدخال رقم هاتفك:` , Education.token_bot_telegram );
         state.step = 'phoneNumber';
         break;
      case 'phoneNumber':
        const phoneStepDto = plainToClass(PhoneNumberStepDto, state.data);
        const phoneErrors = await validate(phoneStepDto);
        if (phoneErrors.length > 0) {
          const errorMessage = phoneErrors.map(err => Object.values(err.constraints)).join(', ');
          await sendMessage(chatId, `عذرًا، ${state.data.firstName}، هناك خطأ في البيانات: ${errorMessage}`          ,Education.token_bot_telegram
          );
          break;
        }
        await sendMessage(chatId, `ممتاز، ${state.data.firstName}! حاليًا، هل يمكنك أن تخبرني بجنسك؟ مثلاً: ذكر أو أنثى`, Education.token_bot_telegram);
        state.step = 'gender';
        break;
      case 'gender':
        state.data.gender = text;
        await sendMessage(chatId, `جيد، ${state.data.firstName}! الآن، يُرجى إدخال الولاية التي تسكن بها:`          ,Education.token_bot_telegram
        );
        state.step = 'Wilaya';
        break;
      case 'Wilaya':
        state.data.wilaya = text;
        await sendMessage(chatId, `ممتاز، ${state.data.firstName}! الآن، يُرجى إدخال البلدية التي تسكن بها:`          ,Education.token_bot_telegram
        );
        state.step = 'commune';
        break;
      case 'commune':
        state.data.commune = text;
        await sendMessage(chatId, `رائع، ${state.data.firstName}! الآن، يُرجى إدخال مستوى تعليمك (إبتدائي، متوسط، جامعي ...):`          ,Education.token_bot_telegram
        );
        state.step = 'educationLevel';
        break;
      case 'educationLevel':
        state.data.educationLevel = text;
        await sendMessage(chatId, `حسنًا، ${state.data.firstName}! الآن، يُرجى إدخال مقدار حفظك للقرآن الكريم:`          ,Education.token_bot_telegram
        );
        state.step = 'memorizationValue';
        break;
      case 'memorizationValue':
        state.data.memorizationValue = text;
        await sendMessage(
          chatId, 
          `جميل، ${state.data.firstName}! نود التعرف على مستواك في أحكام التجويد (مبتدئ، متوسط، جيد):`, 
          Education.token_bot_telegram
        );
        state.step = 'level';
        break;
        case 'level':
          state.data.level = text;
          await sendMessage(chatId, `ممتاز، ${state.data.firstName}! الآن، يُرجى إدخال الرواية التي تقرأ بها (مثلاً: حفص عن عاصم، ورش عن نافع، وغيرها من الروايات العشر):`           ,Education.token_bot_telegram
          );
          state.step = 'cart';
          break;
      case 'cart':
        state.data.cart = text;
        await sendMessage(chatId, `تم التسجيل بنجاح، ${state.data.firstName}! نشكرك على تعاونك.`,Education.token_bot_telegram  );
        const summaryMessage = `
        المعلومات التي أدخلتها:
        - الاسم الكامل: ${state.data.fullName}
        - تاريخ الميلاد: ${state.data.age} 
        - رقم الهاتف: ${state.data.phoneNumber}
        - الجنس: ${state.data.gender}
        - الولاية: ${state.data.wilaya}
        - البلدية: ${state.data.commune}
        - المستوى التعليمي: ${state.data.educationLevel}
        - قيمة الحفظ: ${state.data.memorizationValue}
        - الرواية: ${state.data.cart}
         `
        ;
        await sendMessage(chatId, summaryMessage ,Education.token_bot_telegram);
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

بعد إتمام الدفع، يُرجى إرسال صورة لإيصال الدفع هنا.

إذا كانت لديك أي استفسارات أو تحتاج إلى مساعدة، يُرجى التواصل مع الأدمن على تلغرام: ${adminTelegramAccount} أو عبر الواتساب: ${whatsappSupport}

نحن هنا لمساعدتك في أي استفسار أو مساعدة تحتاجها. شكراً لاختياركم لنا!
`;
        await sendMessage(chatId, friendlyMessage ,Education.token_bot_telegram        );
        const order =  await this.saveOrder(state.data as Partial<AcaOrder>);
        state.step = 'image';
        state.data.id= order.id
        break;
        case 'image':
          if (photo) {
            const fileId = photo[photo.length - 1].file_id;
            const downloadedImage = await this.downloadImage(fileId, education);
            state.data.image = downloadedImage;
            await sendMessage(chatId, `شكرًا لك، ${state.data.firstName}!\nتم استلام صورة إيصال الدفع.\nسيتم مراجعة طلبك وسيتم إشعارك بالخطوات التالية قريبًا.`, Education.token_bot_telegram);
            await this.saveOrder(state.data as Partial<AcaOrder>);
            state.step = 'default';
          } else {
            await sendMessage(chatId, 'لم يتم استلام أي صورة. يُرجى إرسال صورة لإيصال الدفع.', Education.token_bot_telegram);
          }
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
            await sendMedia(chatId, "./src/telegram/description.mp4","video",Education.token_bot_telegram);
            responseMessage = "تم إرسال تفاصيل الدورة عبر الفيديو.";
            break;
          case 'مواعيد الدراسة':
            responseMessage = 'مواعيد الدراسة ...';
            break;
          default:
            const continuationMessage = step => {
              switch (step) {
                  case 'fullName':
                      return `لإكمال عملية التسجيل، يُرجى إدخال اسمك الكامل: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  case 'age':
                      return `لإكمال عملية التسجيل، يُرجى إدخال تاريخ ميلادك إذا سمحت: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  case 'phoneNumber':
                      return `لإكمال عملية التسجيل، يُرجى إدخال رقم هاتفك: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  case 'gender':
                      return `لإكمال عملية التسجيل، يُرجى إدخال جنسيتك: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  case 'Wilaya':
                      return `لإكمال عملية التسجيل، يُرجى إدخال الولاية التي تسكن بها: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  case 'commune':
                      return `لإكمال عملية التسجيل، يُرجى إدخال البلدية التي تسكن بها: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  case 'educationLevel':
                      return `لإكمال عملية التسجيل، يُرجى إدخال مستوى تعليمك: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  case 'memorizationValue':
                      return `لإكمال عملية التسجيل، يُرجى إدخال مقدار حفظك للقرآن الكريم: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  case 'level':
                      return `لإكمال عملية التسجيل، يُرجى إدخال مستواك في أحكام التجويد: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  case 'cart':
                      return `لإكمال عملية التسجيل، يُرجى إدخال الرواية التي تقرأ بها: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  case 'image':
                      return `لإكمال عملية التسجيل، يُرجى إرسال صورة لإيصال الدفع: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  case 'defualt':
                      return `تم تسجيلك بنجاح! لإعادة التسجيل أو تسجيل شخص آخر، يُرجى إدخال /other\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  default:
                    return `تم تسجيلك بنجاح! لإعادة التسجيل أو تسجيل شخص آخر، يُرجى إدخال /other\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
                  }
          };
            responseMessage = continuationMessage(state.step || "default")
           break;
        }
        await sendMessage(chatId, responseMessage           ,Education.token_bot_telegram        );
        break;
    }
    await this.registrationStateRepository.save(state);
  }



  async handleCommand(command: string, messageObj: any, education: number): Promise<void> {
    const chatId = messageObj.chat.id;
    const Education = await this.educationService.findOne(education);
    let state = await this.registrationStateRepository.findOne({ where: { chatId ,education } });


    const howTolearn = Education.howToLean
    const special = Education.special
    const timeDetails  = Education.timeDetails
    const continuationMessage = step => {
      switch (step) {
          case 'fullName':
              return `لإكمال عملية التسجيل، يُرجى إدخال اسمك الكامل: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          case 'age':
              return `لإكمال عملية التسجيل، يُرجى إدخال تاريخ ميلادك إذا سمحت: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          case 'phoneNumber':
              return `لإكمال عملية التسجيل، يُرجى إدخال رقم هاتفك: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          case 'gender':
              return `لإكمال عملية التسجيل، يُرجى إدخال جنسيتك: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          case 'Wilaya':
              return `لإكمال عملية التسجيل، يُرجى إدخال الولاية التي تسكن بها: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          case 'commune':
              return `لإكمال عملية التسجيل، يُرجى إدخال البلدية التي تسكن بها: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          case 'educationLevel':
              return `لإكمال عملية التسجيل، يُرجى إدخال مستوى تعليمك: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          case 'memorizationValue':
              return `لإكمال عملية التسجيل، يُرجى إدخال مقدار حفظك للقرآن الكريم: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          case 'level':
              return `لإكمال عملية التسجيل، يُرجى إدخال مستواك في أحكام التجويد: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          case 'cart':
              return `لإكمال عملية التسجيل، يُرجى إدخال الرواية التي تقرأ بها: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          case 'image':
              return `لإكمال عملية التسجيل، يُرجى إرسال صورة لإيصال الدفع: .\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          case 'defualt':
              return `تم تسجيلك بنجاح! لإعادة التسجيل أو تسجيل شخص آخر، يُرجى إدخال /other\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          default:
            return `تم تسجيلك بنجاح! لإعادة التسجيل أو تسجيل شخص آخر، يُرجى إدخال /other\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;
          }
  };
  
  const baseMessage = `لبدء عملية التسجيل، أدخل "حسنا".\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about تفاصيل برنامج ${Education.name} \n- /time لمعرفة مدة الدراسة\n- /howTolearn لمعرفة كيفية الدراسة\n- /special لمعرفة الحالات الخاصة`;

  
    switch (command) {
      case 'start':
        await sendMedia(chatId, "./src/telegram/audio.mp3","audio",Education.token_bot_telegram);
        await sendMessage(chatId, `مرحبا بك معنا في ${Education.name}`,Education.token_bot_telegram);
        await sendMedia(chatId, "./src/telegram/description.mp4","video",Education.token_bot_telegram);
        await sendMessage(chatId, `${state ? continuationMessage(state.step) : baseMessage}`, Education.token_bot_telegram);

        break;
      case 'price':
        if (Education.price) {
          await sendMessage(chatId, `سعر التسجيل هو ${Education.price} دج لمرة واحدة، ويشمل مدة الدورة ${Education.time}.\n\nلبدء عملية التسجيل، أدخل "حسنا".\n\nيمكنك أيضًا استخدام الأوامر التالية:\n\n- /price لمعرفة السعر\n- /admin للتواصل مع الأدمن\n- /about لمعرفة تفاصيل الدورة\n- /time لمعرفة مدة الدراسة`           ,Education.token_bot_telegram  );
        } else {
          await sendMessage(chatId, `عذرًا، لا يوجد معلومات متاحة حاليًا حول السعر.`           ,Education.token_bot_telegram
          );
        }
        await sendMessage(chatId, `${state ? continuationMessage(state.step) : baseMessage}`, Education.token_bot_telegram);

        break;
  
      case 'admin':
        const contactPhone = Education.contact_phone || "لا توجد معلومات متاحة حالياً.";
        const whatsappNumber = Education.whatsapp_number || "لا توجد معلومات متاحة حالياً.";
        const telegramLinks = Education.admin_telegrams_links || "لا توجد معلومات متاحة حالياً.";
        
        const contactMessage = `
  يمكنك التواصل مع الأدمن عبر الطرق التالية:
  📞 هاتف: ${contactPhone}
  📱 واتساب: ${whatsappNumber}
  📱 تيليجرام: ${telegramLinks}
  
  نحن هنا لمساعدتك في أي استفسار أو مساعدة تحتاجها.
        `;
        await sendMessage(chatId, contactMessage           ,Education.token_bot_telegram );
        await sendMessage(chatId, `${state ? continuationMessage(state.step) : baseMessage}`, Education.token_bot_telegram);

        break;
  
      case 'time':
        await sendMessage(chatId, `مدة الدورة هي ${Education.time}`,Education.token_bot_telegram );
        await sendMessage(chatId, `${timeDetails || ""}`,Education.token_bot_telegram );
        await sendMessage(chatId, `${state ? continuationMessage(state.step) : baseMessage}`, Education.token_bot_telegram);

        break;
  
      case 'about':
        if (Education && Education.subDescription) {
          await sendMessage(chatId, Education.subDescription          ,Education.token_bot_telegram
          );
   
        } else {
          await sendMessage(chatId, `عذرًا، لا يوجد معلومات متاحة حاليًا حول الدورة.`          ,Education.token_bot_telegram
          );
          
        }
        await sendMessage(chatId, `${state ? continuationMessage(state.step) : baseMessage}`, Education.token_bot_telegram);

        break;
        
      case 'other':
        if(state){
          await this.registrationStateRepository.save({...state,step:"fullName",data:{}})
          await sendMessage(chatId, 'يرجي إدخال الإسم كاملا',Education.token_bot_telegram);

        }


        break;
        case 'howTolearn':
          if (howTolearn) {
            await sendMessage(chatId, howTolearn, Education.token_bot_telegram);
          } else {
            await sendMessage(chatId, `عذرًا، لا توجد معلومات متاحة حاليًا حول كيفية الدراسة.`, Education.token_bot_telegram);
          }
          await sendMessage(chatId, `${state ? continuationMessage(state.step) : baseMessage}`, Education.token_bot_telegram);

          break;
        case 'special':
          if (special) {
            await sendMessage(chatId, special, Education.token_bot_telegram);
          } else {
            await sendMessage(chatId, `عذرًا، لا توجد معلومات متاحة حاليًا حول الحالات الخاصة.`, Education.token_bot_telegram);
          }
          await sendMessage(chatId, `${state ? continuationMessage(state.step) : baseMessage}`, Education.token_bot_telegram);

          break;
  
      default:
        await sendMessage(chatId, `${state ? continuationMessage(state.step) : baseMessage}`, Education.token_bot_telegram);
    }
  }
  

  private async saveOrder(orderData: Partial<AcaOrder>) {
    try {
      const order = this.orderRepository.create(orderData);
       return await this.orderRepository.save(order);
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
      await sendMessage(order.chatId,message,order.educational_cycle.token_bot_telegram
      )
    } catch (error) {
      handleError('Error in create wilayat function', error,this.logger,"statesDelivery");    
    }
  }

  @Cron('0 */3 * * *')
  async SendMessagesREminder(){
    try {
      
      const state = await this.registrationStateRepository.createQueryBuilder("registrationState")
      .where("registrationState.step != :step", { step: "default" })
      .getMany();
      for ( const step of state){
        await sendMessage(step.chatId.toString(),steps[step.step].reminder,step.apiToken)
      }
    } catch (error) {
    }
  }


}
