import { Global, Module } from '@nestjs/common';
import { DriverScopeService } from './driver-scope.service';
import { OrgScopeService } from './org-scope.service';

@Global()
@Module({
  providers: [OrgScopeService, DriverScopeService],
  exports: [OrgScopeService, DriverScopeService],
})
export class CommonModule {}
