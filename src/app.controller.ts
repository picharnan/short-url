import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ShortUrlDto } from './dto/ShortUrl.dto';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('welcome')
  welcome() {
    const baseUrl: string = process.env.BASE_URL || 'http://localhost:3003';
    return { baseUrl: baseUrl };
  }

  @Post('shorturl')
  async shortUrl(@Body() shortUrlDto: ShortUrlDto) {
    return this.appService.shortUrl(shortUrlDto.url);
  }

  @Get('getaccesslog')
  async getAccessLog(@Query() query) {
    const page = query.page || 1;
    const accessLogData = await this.appService.getAccessLogData(page);
    return {
      status: true,
      code: 'GET_ACCESS_LOG_SUCCESS',
      accessLogData: accessLogData,
    };
  }

  @Get(':slug')
  async getLinkBySlug(
    @Param() params,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.get('User-Agent');
    const link = await this.appService.getLinkBySlug(params.slug);
    if (link) {
      this.appService.addAccessLog(link, ip.toString(), ua);
      return res.redirect(link.url);
    }
    return res.status(404).send('Not found');
  }
}
