import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { AuthGuard } from '@/user/guard/auth.guard';
import { Roles } from '@/user/decorator/roles.decorator';
import { UserRole } from '@/user/enums/user-role.enum';

@ApiTags('admin-campaigns')
@Controller('admin/campaigns')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @Roles([UserRole.ADMIN, UserRole.MARKETING])
  create(@Body() body: { name: string; subject: string; templateId: string }) {
    return this.campaignService.create(body);
  }

  @Get()
  @Roles([UserRole.ADMIN, UserRole.MARKETING])
  findAll() {
    return this.campaignService.findAll();
  }

  @Get(':id')
  @Roles([UserRole.ADMIN, UserRole.MARKETING])
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }

  @Patch(':id')
  @Roles([UserRole.ADMIN, UserRole.MARKETING])
  update(@Param('id') id: string, @Body() body: { name?: string; subject?: string; templateId?: string }) {
    return this.campaignService.update(id, body);
  }

  @Delete(':id')
  @Roles([UserRole.ADMIN, UserRole.MARKETING])
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }

  @Post(':id/send')
  @Roles([UserRole.ADMIN, UserRole.MARKETING])
  send(@Param('id') id: string) {
    return this.campaignService.send(id);
  }

  @Get(':id/stats')
  @Roles([UserRole.ADMIN, UserRole.MARKETING])
  stats(@Param('id') id: string) {
    return this.campaignService.getStats(id);
  }
}
