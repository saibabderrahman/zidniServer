import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { MessengerRegistrationState } from 'src/typeorm/entities';
import { Repository } from 'typeorm';

@Injectable()
export class MessengerService {
  private commandDB: { [key: string]: string } = {
    '1': `✅ إليك تفاصيل يسيرة عن الدورة : 
 
-  يهدف برنامج رحلة الستون حزبا إلى حفظ القرآن الكريم كاملا عن ظهر قلب بأحكامه و تدبره 
عن طريق تقوية و دعم القدرات العقلية و اللغوية و المعرفية للمشتركين و المشتركات ، حيث تشمل الحفظ والتركيز ورفع مستوى كفاءة عمل ذاكرتهم .  
 
✅ مهارات الحفظ البصري 
✅ مهارات الحفظ السمعي 
✅ مهارات الحفظ الرقمي 
✅ مهارات البناء الصوري 
✅ مهارات القراءة التدبرية  
✅ مهارات العمل القرآني  
 
✅✨ التمكن من حفظ الصفحات القرآنية بسرعة و متعة و بإتقان تام  
✅✨ رفع مستويات الذاكرة السمعية و البصرية تدريجيا عن طريق تدريبات ذهنية يومية لمدة 8 أشهر  
✅✨ تمكين الطالب من الفهم السريع للآيات من الصفحة و ربطها بأساليت ممتعة  
 
✅✨ حل مشاكل النسيان و التكرار قطعيا علميا و عمليا 
 
✅✨  حل مشاكل الشرود الذهني والسرحان طبيا و علميا 

✅✨  21 محاضرة بنائية علمية و عملية ، تعمل على حل جميع المشاكل التي تواجه المتدربين و المتدربات أثناء رحلة حفظ القرآن الكريم كاملا  
 
✅✨ التخلص من مشاكل ضعف القراءة و رفع مستوى أحكام التجويد و التلاوة عن طريق 20 درس مفصل في الطلاقة القرآنية 

✅✨ بثوث مباشرة لتصحيح أحكام التلاوة
1. ✅✨ العرض اليومي للمحفوظ : 
_ يكون بعد إكتساب المهارات السمعية و البصرية كلها ، أي بعد إتمام الختمة الأولى للقرآن الكريم و التخرج في مادة أحكام التجويد.  
عبر التطبيق الخاص بأكاديمية زدني علما للتدريب و التكوين أو بطريقة فردية في حصص خصوصية يختارها الطالب .
  
_ لا ينتقل الطالب من مهارة إلى أخرى أعلى منها ، أو من مستوى إلى مستوى أعلى منه ، إلا إذا كان إنجازه على الأقل نصف المطلوب و بإتقان قدره على الأقل 90 % .
2. ✅✨ حالة خاصة : 
__ في حالة أن المتدرب لم يتمكن من البرنامج المهاري الخاص بحفظ القرآن الكريم كاملا ، يوضع له برنامج خاص حسب إستطاعته و الوقت الثابت  الذي خصصه لحفظ القرآن الكريم و تعلم أحكام التجويد 

✅✨ في الحالات الخاصة : توضع برامج خاصة يكون المطلوب الأدنى فيها : حفظ آيتين يوميا .`,
    '2': `
    ⏱ مدة الدورة : 8_أشهر ، مقسمة كالتالي : 
🔴 21_يوم : تحضير مذكرة رحلة الستون حزبا تقنيات + محاضرات عقلية بنائية 
🔴 6_أشهر : تشمل : 
💥 الختمة الأولى للقرآن الكريم مع إكتساب 12 مهارة سمعية و 12 مهارة بصرية في الحفظ السريع . 
💥 دراسة أحكام التجويد ، على أربع مستويات . 
🔴 من شهران إلى 4 أشهر : ختمة عرض المحفوظ و ثبيته مع تصحيح التلاوة ، إختبارات أسبوعية و شهرية حسب برنامج الطالب .
1. توقيت الدراسة يكون : يوميا 
💥 بعد صلاة الفجر 
💥 بعد صلاة العشاء`,
    '3': 'سعر الدورة 5000 دج تدفع مرة واحدة',
    '4': `للتسجيل قم بنسخ الرسالة التالية و ملأ معلوماتك عليها : 
الإسم : 
اللقب : 
العمر : 
المستوى الدراسي : 
مستوى أحكام التجويد : 
مقدار محفوظك : 
الرواية التي تقرأ بها : 
العنوان : 
 ✅ ضروري كتابة العنوان لإرسال الشهادات و التكريمات `,
    '5': 'فريق الدعم على التيليجرام: @Baraahind  @ostadameriem',
  };

  constructor(private configService: ConfigService ,
    @InjectRepository(MessengerRegistrationState) private readonly registrationStateRepository: Repository<MessengerRegistrationState>,

  ) {}

  async handleMessage(senderPsid: string, receivedMessage: any): Promise<void> {
    let response;
    let state = await this.findByCHatIDMessenger(senderPsid)
    if(!state){
      const newstate = this.registrationStateRepository.create({ chatId:senderPsid, step: 'fullName', data:{} });
      await this.registrationStateRepository.save(newstate)}
    if (receivedMessage.text) {
      const text = receivedMessage.text.trim();
      if (this.commandDB[text]) {
        response = { text: this.commandDB[text] };
        await this.callSendAPI(senderPsid, response);
        await this.callSendAPI(senderPsid, {
          text: ` 💥يرجى الرد باستخدام الأرقام 1 2 3 4 5 ...
1. لمعرفة تفاصيل البرنامج
2. مدة البرنامج
3. سعر البرنامج
4. طريقة التسجيل
5. فريق الدعم على التيليجرام`});

      } else {
        if(!state){
          await this.sendAudio(senderPsid,"https://utfs.io/f/9c72c64f-4ea0-45f6-8584-1abfcdd74f16-1jgvrq.mp3")
          await this.sendVideo(senderPsid,"https://utfs.io/f/b30ab2ae-cf5e-4cb4-a2e5-3fbd86357be7-sir090.mp4")
          response = {
            text: `مرحبا بك ❤ ، يسعدنا على تواصلك مع فريق الدعم لأكاديمية زدني علما للتدريب و التكوين ، نقدر اهتمامك بكتاب الله.  
                     💥يرجى الرد باستخدام الأرقام 1_ 2_3...
 1. لمعرفة تفاصيل البرنامج
 2. مدة البرنامج
 3. سعر البرنامج
 4. طريقة التسجيل
 5. فريق الدعم على التيليجرام`,
          };
        }
      }
    } 

  }

  async handlePostback(senderPsid: string, receivedPostback: any): Promise<void> {
    const payload = receivedPostback.payload;
    let response;

    if (payload === 'yes') {
      response = { text: 'Thanks!' };
    } else if (payload === 'no') {
      response = { text: 'Oops, try sending another message.' };
    }

    await this.callSendAPI(senderPsid, response);
  }

  private async callSendAPI(senderPsid: string, response: any): Promise<void> {
    const PAGE_ACCESS_TOKEN = this.configService.get<string>('PAGE_ACCESS_TOKEN');

    const requestBody = {
      recipient: {
        id: senderPsid,
      },
      message: response,
    };

    try {
      await axios.post(
        `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
        requestBody,
      );
    } catch (error) {
      console.error('Unable to send message:', error);
    }
  }

  async findByCHatIDMessenger(chatId:string):Promise<MessengerRegistrationState>{
    try {
      let state = await this.registrationStateRepository.findOne({ where: { chatId  } });
      return state
    } catch (error) {

    }
  }

  private async sendVideo(senderPsid: string, videoUrl: string): Promise<void> {
    const PAGE_ACCESS_TOKEN = this.configService.get<string>('PAGE_ACCESS_TOKEN');

    const requestBody = {
      recipient: {
        id: senderPsid,
      },
      message: {
        attachment: {
          type: 'video',
          payload: {
            url: videoUrl,
            is_reusable: true
          }
        }
      }
    };

    try {
      await axios.post(
        `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
        requestBody,
      );
    } catch (error) {
      console.error('Unable to send audio:', error.response.data);
    }
  }

  private async sendAudio(senderPsid: string, audioUrl: string): Promise<void> {
    const PAGE_ACCESS_TOKEN = this.configService.get<string>('PAGE_ACCESS_TOKEN');

    const requestBody = {
      recipient: {
        id: senderPsid,
      },
      message: {
        attachment: {
          type: 'audio',
          payload: {
            url: audioUrl,
            is_reusable: true
          }
        }
      }
    };

    try {
      await axios.post(
        `https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
        requestBody,
      );
    } catch (error) {
      console.error('Unable to send audio:', error.response.data);
    }
  }

}
