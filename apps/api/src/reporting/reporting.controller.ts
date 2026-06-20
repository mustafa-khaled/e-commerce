import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReportingService } from './reporting.service';
import { AuthGuard } from '@/user/guard/auth.guard';
import { Roles } from '@/user/decorator/roles.decorator';
import { UserRole } from '@/user/enums/user-role.enum';

@ApiTags('admin-reports')
@Controller('admin/reports')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('overview')
  @Roles([UserRole.ADMIN, UserRole.SUPPORT, UserRole.MARKETING])
  overview(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportingService.getOverview(from, to);
  }

  @Get('sales')
  @Roles([UserRole.ADMIN, UserRole.SUPPORT])
  sales(@Query('groupBy') groupBy?: 'day' | 'product') {
    return this.reportingService.getSales(groupBy);
  }
}
