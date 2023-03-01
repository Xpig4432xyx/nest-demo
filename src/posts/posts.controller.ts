import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/post.dto';
@ApiTags('文章')
@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * 创建文章
   * @param post
   */
  @ApiOperation({ summary: '创建文章' })
  @Post()
  async create(@Body() post: CreatePostDto) {
    return await this.postsService.create(post);
  }

  /**
   * 获取所有文章
   * @param query
   */
  @Get()
  async findAll(@Query() query: any) {
    return await this.postsService.findAll(query);
  }

  /**
   * 获取指定文章
   * @param id
   */
  @Get(':id')
  async findById(@Param('id') id: any) {
    console.log(id, '<<<<id');
    return await this.postsService.findById(id);
  }

  /**
   * 更新指定文章
   * @param id
   * @param post
   */
  @Put(':id')
  async update(@Param('id') id: any, @Body() post: any) {
    return await this.postsService.updateById(id, post);
  }

  /**
   * 删除指定文章
   * @param id
   */
  @Delete(':id')
  async delete(@Param('id') id: any) {
    return await this.postsService.deleteById(id);
  }
}
