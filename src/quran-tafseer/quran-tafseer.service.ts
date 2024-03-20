import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs/promises';
import { soar } from './sowar';

@Injectable()
export class QuranTafseerService {
  private readonly apiUrl = 'https://archive.org/download/211_20240311';

  constructor() {}

  async getTafseerData(): Promise<any> {
    let requests = [];
    for (let ayah = 201; ayah <= 300; ayah++) {
      const url = `${this.apiUrl}/${ayah}.mp3`;
     // const response = await axios.get(url).then(response => response.data.verses);
      requests.push({
        url:url,
        title: `الصفحة رقم  ${ayah}`,
        artist: "كتاب القرآن تدبر وعمل"
      });
    }
    await this.saveToJsonFile(requests);

    return requests;
  }
//async getTafseerData(): Promise<any> {
//
//  return  soar.map((item)=>{
//    return {    title: item.title,
//      artist: "الخلاصة من تفسير الطبري",
//      url: item.url,
//  }
//
//  });
//}
  private async saveToJsonFile(data: any): Promise<void> {
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      await fs.writeFile('quranTadaborWAmal.json', jsonContent);
    } catch (error) {
      console.error('Error saving JSON file:', error.message);
    }
  }
}
