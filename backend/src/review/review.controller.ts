import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthUser } from '@/common/interfaces/auth-user.interface';
import { Roles } from '@/user/decorator/roles.decorator';
import { UserRole } from '@/user/enums/user-role.enum';
import { AuthGuard } from '@/user/guard/auth.guard';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('product/:id')
  findAll(@Param('id') productId: string) {
    return this.reviewService.findAll(productId);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  @Roles([UserRole.ADMIN])
  findOne(@Param('id') userId: string) {
    return this.reviewService.findOne(userId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles([UserRole.USER])
  create(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: { user: AuthUser },
  ) {
    return this.reviewService.create(createReviewDto, req.user._id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles([UserRole.USER, UserRole.ADMIN])
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: { user: AuthUser },
  ) {
    if (req.user.role === UserRole.ADMIN) {
      return this.reviewService.update(id, updateReviewDto);
    }

    return this.reviewService.update(id, updateReviewDto, req.user._id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles([UserRole.USER, UserRole.ADMIN])
  remove(@Param('id') id: string, @Req() req: { user: AuthUser }) {
    if (req.user.role === UserRole.USER) {
      return this.reviewService.remove(id, req.user._id);
    }

    return this.reviewService.remove(id);
  }
}
