---
name: developing-nestjs
description: Design, implement, and maintain production-ready NestJS backend applications with modular architecture, validation, authentication, and comprehensive testing.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[file/module] [options]"
---

# Development with NestJS

This skill standardizes the development of robust backend applications with NestJS, focusing on modular architecture, rigorous validation, secure authentication, testing, and compliance with strict TypeScript.

## 🧱 Recommended Stack 2026
- **Runtime:** Node.js 24 LTS
- **Framework:** NestJS + strict TypeScript
- **Data:** PostgreSQL + Prisma (or TypeORM when already adopted)
- **Messaging:** Kafka or RabbitMQ
- **Quality:** Jest + Supertest + ESLint + OpenTelemetry

## Recommended Baseline

- Use NestJS with TypeScript in `strict: true` mode.
- Organize by business modules (feature-based), not by technical type.
- Use class-validator for DTO validation.
- Implement end-to-end (e2e) and unit tests with Jest.
- Follow the Pipes, Guards, and Interceptors pattern for cross-cutting concerns.
- Use custom decorators to reduce boilerplate and improve readability.

## Instructions

1.  **Module Structure (Feature-Based):**
    ```text
    src/
      common/
        decorators/
        filters/
        guards/
        interceptors/
        pipes/
      modules/
        auth/
          auth.controller.ts
          auth.service.ts
          auth.module.ts
          dto/
        users/
          users.controller.ts
          users.service.ts
          users.module.ts
          entities/
          dto/
        products/
          products.controller.ts
          products.service.ts
          products.module.ts
          entities/
          dto/
      app.module.ts
      main.ts
    ```

    *   **Rationale:** Organizing by feature reduces cognitive load, facilitates encapsulation, and allows features to be removed without affecting other parts.
    *   **Validation:** Each module is autonomous and can be imported without circular dependencies.

2.  **Validation (DTOs + Pipes):**
  *   **Installation:** `pnpm add class-validator class-transformer`
    *   **DTO Example:**
    ```typescript
    import { IsEmail, IsString, MinLength } from 'class-validator';

    export class CreateUserDto {
      @IsEmail()
      email: string;

      @IsString()
      @MinLength(8)
      password: string;
    }
    ```

    *   **Global Pipe:** In `main.ts`, use `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))`.
    *   **Rationale:** Centralized validation reduces duplication, catches errors early, and protects the database.
    *   **Validation:** Invalid requests return 400 with detailed error messages.

3.  **Authentication & Authorization (Guards):**
    *   **JWT Guard Example:**
    ```typescript
    @Injectable()
    export class JwtGuard implements CanActivate {
      constructor(private jwtService: JwtService) {}

      canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.replace('Bearer ', '');

        if (!token) throw new UnauthorizedException();
        try {
          request.user = this.jwtService.verify(token);
          return true;
        } catch {
          throw new UnauthorizedException();
        }
      }
    }
    ```

    *   **Controller Usage:** `@UseGuards(JwtGuard)` or `@UseGuards(JwtGuard, RolesGuard)`.
    *   **Rationale:** Guards centralize authentication and authorization logic, facilitating security auditing.
    *   **Validation:** Protected endpoints return 401 if not authenticated, 403 if without permission.

4.  **Error Handling (Exception Filters):**
    *   **Custom Filter Example:**
    ```typescript
    @Catch()
    export class AllExceptionsFilter implements ExceptionFilter {
      catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception instanceof HttpException
          ? exception.getStatus()
          : 500;

        response.status(status).json({
          statusCode: status,
          message: exception instanceof HttpException
            ? exception.getResponse()
            : 'Internal Server Error',
          timestamp: new Date().toISOString(),
        });
      }
    }
    ```

    *   **Global Registration:** `app.useGlobalFilters(new AllExceptionsFilter())` in `main.ts`.
    *   **Rationale:** Filters standardize error handling, improve logging, and ensure consistent responses.
    *   **Validation:** Uncaught errors return 500 with a structured JSON envelope.

5.  **Database Integration (TypeORM or Prisma):**
    *   **TypeORM Example:**
    ```typescript
    @Entity()
    export class User {
      @PrimaryGeneratedColumn()
      id: number;

      @Column({ unique: true })
      email: string;

      @Column()
      password: string;
    }
    ```

    *   **Service:**
    ```typescript
    @Injectable()
    export class UsersService {
      constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
      ) {}

      async findByEmail(email: string) {
        return this.usersRepo.findOne({ where: { email } });
      }
    }
    ```

    *   **Module:**
    ```typescript
    @Module({
      imports: [TypeOrmModule.forFeature([User])],
      controllers: [UsersController],
      providers: [UsersService],
    })
    export class UsersModule {}
    ```

    *   **Rationale:** The dependency injection and repository pattern reduce coupling and facilitate testing.
    *   **Validation:** Queries work and are testable.

6.  **Testing (Unit & E2E):**
    *   **Unit Test Example (Jest):**
    ```typescript
    describe('UsersService', () => {
      let service: UsersService;
      let mockRepo: jest.Mocked<Repository<User>>;

      beforeEach(async () => {
        mockRepo = {
          findOne: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
          providers: [
            UsersService,
            { provide: getRepositoryToken(User), useValue: mockRepo },
          ],
        }).compile();

        service = module.get<UsersService>(UsersService);
      });

      it('should find user by email', async () => {
        const user = { email: 'test@example.com', id: 1 };
        mockRepo.findOne.mockResolvedValue(user);

        expect(await service.findByEmail('test@example.com')).toEqual(user);
      });
    });
    ```

    *   **E2E Test Example:**
    ```typescript
    describe('Users (e2e)', () => {
      let app: INestApplication;

      beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
      });

      it('POST /users should create user', () => {
        return request(app.getHttpServer())
          .post('/users')
          .send({ email: 'test@example.com', password: 'Pass123!' })
          .expect(201)
          .expect(res => {
            expect(res.body).toHaveProperty('id');
          });
      });
    });
    ```

    *   **Coverage Goal:** >= 80% for critical logic. Use `jest --coverage`.
    *   **Rationale:** Tests ensure that refactoring does not break functionality and that edge cases are covered.
    *   **Validation:** `npm run test:e2e` and `npm run test` pass, coverage >= 80%.

7.  **Logging & Observability:**
    *   **Use NestJS Logger:** `private readonly logger = new Logger(ClassName)`.
    *   **Log Levels:** error, warn, log, debug, verbose.
    *   **Structured Logging:** Use Winston or Pino to support structured context (traceId, userId, etc.).
    *   **Example:**
    ```typescript
    @Injectable()
    export class UsersService {
      private readonly logger = new Logger(UsersService.name);

      async create(createUserDto: CreateUserDto) {
        this.logger.log(`Creating user: ${createUserDto.email}`);
        try {
          const user = await this.usersRepo.save(createUserDto);
          this.logger.debug(`User created with id: ${user.id}`);
          return user;
        } catch (error) {
          this.logger.error(`Failed to create user: ${error.message}`, error.stack);
          throw new BadRequestException('User creation failed');
        }
      }
    }
    ```

    *   **Rationale:** Centralized logging facilitates production debugging and compliance.
    *   **Validation:** Logs appear in the console during development and are captured by observability tools in production.

8.  **Configuration Management:**
    *   **Use ConfigModule:** `@nestjs/config`.
    *   **Example `.env`:**
    ```
    DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
    JWT_SECRET=super-secret-key
    NODE_ENV=development
    ```

    *   **Module Usage:**
    ```typescript
    @Module({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'postgres',
            url: config.get('DATABASE_URL'),
          }),
        }),
      ],
    })
    export class AppModule {}
    ```

    *   **Rationale:** Centralized configuration reduces errors and facilitates deployments in different environments.
    *   **Validation:** App starts without configuration errors.

## Best Practices

- **Dependency Injection:** NestJS DI is powerful; use `@Injectable()` and constructor injection.
- **Module Boundaries:** Each module must be cohesive and have a single responsibility.
- **Service Logic:** Business rules belong in the `service`, not the `controller`.
- **DTOs First:** Use DTOs for input validation and transformation.
- **Error Handling:** Always throw known exceptions (HttpException, BadRequestException) in controllers.
- **Database Transactions:** Use `QueryRunner` for operations requiring transactions.
- **Pipes for Validation:** Use global Pipes for automatic DTO validation.
- **Auth Patterns:** Use Guards to verify authentication and access `request.user` in the controller.
- **Logging Context:** Use Logger with class names for traceability.
- **Repository Pattern:** Encapsulate queries in `service` methods or use custom repositories.

## Common Tasks

### Create a New Feature Module
```bash
nest generate module modules/products
nest generate controller modules/products
nest generate service modules/products
```

### Run Linting and Type Checking
```bash
npm run lint
tsc --noEmit
```

### Run Tests
```bash
npm run test              # Unit tests
npm run test:watch       # Watch mode
npm run test:cov         # With coverage
npm run test:e2e         # E2E tests
```

### Format Code
```bash
npm run format
```

## Troubleshooting

- **Circular Dependencies:** If modules import each other, use lazy-loading or refactor to extract a common dependency.
- **Pipes not Validating:** Ensure `ValidationPipe` was registered globally in `main.ts`.
- **JWT Guard Errors:** Verify if `JWT_SECRET` is correct in `.env` and that the token is passed in the `Authorization: Bearer <token>` header.
- **Database Connection Issues:** Test the connection URL separately; use `TypeOrmModule.forRootAsync` with logs to diagnose.
- **Tests Timing Out:** Increase timeout in the `package.json` test script or review asynchronous dependencies.

## Related Skills

- `validating-typescript` — Type checking and algorithm validation for TypeScript.
- `developing-node` — Package management and scripts for Node.js/TypeScript.
- `managing-quality` — Test strategies, coverage, and CI/CD integration.
- `integrating-apis` — Integration patterns with external APIs.

## Performance and Production Optimizations (NestJS)

- **SWC (Speedy Web Compiler):** To boost build speed and local cold start, use SWC (written in Rust) instead of the default TypeScript compiler.
  - **How to use:** Run the application with `nest start -b swc`. Compilation time drops from ~10s to under 1 second.
- **Graceful Shutdown in Kubernetes:** NestJS does not handle `SIGTERM` by default, which causes 502/504 errors during deployments when K8s kills pods.
  - **How to solve:** Enable `app.enableShutdownHooks()` in `main.ts`. This ensures database connections and ongoing requests are gracefully terminated before the pod dies.

