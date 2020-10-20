import { NgModule } from '@angular/core';
import { AuthGuard, NoAuthGuard } from './auth.guard';

import { AuthService } from './auth.service';

@NgModule({
    providers: [
	AuthGuard,
	NoAuthGuard,
	AuthService
    ]
})
export class AuthModule {}
