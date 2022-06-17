import { Body, Injectable } from '@nestjs/common';
import genShortSlug from './lib/gen-short-slug';
import { PrismaClient, tb_link } from '@prisma/client';

@Injectable()
export class AppService {
  prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  welcome() {
    return;
  }

  async shortUrl(url: string): Promise<any> {
    const slugLength = 7;
    const existLink = await this.prisma.tb_link.findFirst({
      where: {
        url: {
          equals: url,
        },
      },
    });

    if (existLink) {
      return { status: true, code: 'SHORT_URL_SUCCESS', link: existLink };
    }

    let isDuplicateSlug = true;
    let newSlug = genShortSlug(slugLength);
    do {
      const existSlug = await this.prisma.tb_link.findFirst({
        where: {
          slug: {
            equals: newSlug,
          },
        },
      });

      if (existSlug) {
        newSlug = genShortSlug(slugLength);
        continue;
      }

      isDuplicateSlug = false;
    } while (isDuplicateSlug);

    const newLink = await this.prisma.tb_link.create({
      data: {
        slug: newSlug,
        url: url,
        counter: 0,
        status: 'ACTIVE',
        create_at: new Date(),
        update_at: new Date(),
      },
    });

    return { status: true, code: 'SHORT_URL_SUCCESS', link: newLink };
  }

  async getLinkBySlug(slug: string) {
    return await this.prisma.tb_link.findFirst({
      where: {
        slug: {
          equals: slug,
        },
      },
    });
  }

  async addAccessLog(link: tb_link, ip: string, userAgent: string) {
    await this.prisma.tb_access_log.create({
      data: {
        agent: userAgent,
        ip: ip,
        link_id: link.id,
        create_at: new Date(),
      },
    });
    return;
  }

  async getAccessLogData(argPage: number) {
    const page = argPage || 1;
    const take = 25;
    const skip = (page - 1) * take;

    const accessLogList = await this.prisma.tb_access_log.findMany({
      orderBy: {
        create_at: 'desc',
      },
      skip: skip,
      take: take,
    });

    const totalRow = await this.prisma.tb_access_log.count();
    const hasMore = totalRow > skip + accessLogList.length;
    const lastPage = Math.ceil(totalRow / take);

    // console.log(accessLogList);

    return {
      page: page,
      hasMore: hasMore,
      accessLogList: accessLogList,
      lastPage: lastPage,
    };
  }
}
