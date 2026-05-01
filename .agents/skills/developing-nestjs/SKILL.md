---
name: developing-nestjs
description: "Feature modules, class-validator, JWT guards. Triggers: class-validator, prisma."
argument-hint: "[file/module] [options]"
---

# NestJS Development

**Stack:** NestJS + strict TypeScript, PostgreSQL + Prisma, Jest + Supertest.

## Module Structure (Feature-Based)

```
src/
├── common/           # decorators, guards, filters, interceptors, pipes
├── modules/
│   ├── auth/         # controller, service, module, dto/
│   ├── users/        # controller, service, module, dto/
│   └── products/     # controller, service, module, dto/
├── app.module.ts
└── main.ts
```

## Validation (DTOs + Pipes)

```typescript
// DTO
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// main.ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
```

## Auth (JWT Guard)

```typescript
@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const token = context.switchToHttp().getRequest().headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException();
    try {
      request.user = this.jwtService.verify(token);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}

// Usage
@UseGuards(JwtGuard)
```

## Error Handling (Exception Filter)

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    response.status(status).json({
      statusCode: status,
      message: exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error',
    });
  }
}
```

## Testing

```typescript
// Unit
describe('UsersService', () => {
  it('should find user by email', async () => {
    mockRepo.findOne.mockResolvedValue(user);
    expect(await service.findByEmail('test@example.com')).toEqual(user);
  });
});

// E2E
describe('Users (e2e)', () => {
  it('POST /users should create user', () => {
    return request(app.getHttpServer()).post('/users').send({ email, password }).expect(201);
  });
});
```

## Checklist

- [ ] Feature-based module structure
- [ ] Global ValidationPipe ({ whitelist: true, forbidNonWhitelisted: true })
- [ ] JWT Guard on protected endpoints
- [ ] Global exception filter
- [ ] Tests: unit + e2e, coverage ≥80%
- [ ] `app.enableShutdownHooks()` in main.ts