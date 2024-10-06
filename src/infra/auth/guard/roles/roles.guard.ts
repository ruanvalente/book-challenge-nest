import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { UserRole } from 'src/entities/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) {
      return false;
    }

    try {
      const user = this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch {
      return false;
    }
  }

  hasRole(role: UserRole) {
    return (request: any): boolean => {
      return request.user && request.user.role === role;
    };
  }
}
