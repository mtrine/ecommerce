import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService {

    constructor(private readonly esService: ElasticsearchService) { }

    async search(q: string,index:string) {
        const result = await this.esService.search({
            index: index,
            body: {
                query: {
                    match: {
                        title: q,
                    },
                },
            },
        });

        return result;
    }

    async indexDoc(index: string, body: any) {
        return await this.esService.index({
            index: index,
            body: body,
        });
    }
}
