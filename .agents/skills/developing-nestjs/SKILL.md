---
name: developing-nestjs
description: Projetar, implementar e manter aplicações backend NestJS prontas para produção com arquitetura modular, validação, autenticação e testes abrangentes.
metadata:
    works_on: [copilot, antigravity]
argument-hint: "[file/module] [options]"
---

# NestJS Development

Esta skill padroniza o desenvolvimento de aplicações backend robustas com NestJS, focando em arquitetura modular, validação rigorosa, autenticação segura, testes e conformidade com TypeScript strict.

## Recommended Baseline

- Use NestJS com TypeScript em modo `strict: true`.
- Organize por módulos de negócio (feature-based), não por tipo técnico.
- Use class-validator para validação de DTOs.
- Implemente testes end-to-end (e2e) e unitários com Jest.
- Siga o padrão de Pipes, Guards e Interceptors para cross-cutting concerns.
- Use decoradores customizados para reduzir boilerplate e melhorar legibilidade.

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

    *   **Reasoning:** Organizar por feature reduz cognitive load, facilita encapsulamento e permite deletar features sem afetar outras partes.
    *   **Verification:** Cada módulo é standalone e pode ser importado sem dependências circulares.

2.  **Validation (DTOs + Pipes):**
    *   **Install:** `pnpm add class-validator class-transformer`
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

    *   **Global Pipe:** Em `main.ts`, use `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))`.
    *   **Reasoning:** Validação centralizada reduz duplicação, captura erros cedo e protege o banco de dados.
    *   **Verification:** Requests inválidas retornam 400 com mensagens de erro detalhadas.

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

    *   **Use in Controller:** `@UseGuards(JwtGuard)` ou `@UseGuards(JwtGuard, RolesGuard)`.
    *   **Reasoning:** Guards centralizam lógica de autenticação e autorização, facilitando auditoria de segurança.
    *   **Verification:** Endpoints protegidos retornam 401 se não autenticados, 403 se sem permissão.

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

    *   **Global Registration:** `app.useGlobalFilters(new AllExceptionsFilter())` em `main.ts`.
    *   **Reasoning:** Filters padronizam o tratamento de erros, melhoram logging e garantem respostas consistentes.
    *   **Verification:** Erros não capturados retornam 500 com envelope JSON estruturado.

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

    *   **Reasoning:** Padrão de injeção de dependência e repositório reduz acoplamento e facilita testes.
    *   **Verification:** Queries funcionam e são testáveis.

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

    *   **Coverage Target:** >= 80% para lógica crítica. Use `jest --coverage`.
    *   **Reasoning:** Testes garantem que refatorações não quebrem funcionalidade e que edge cases sejam cobertos.
    *   **Verification:** `npm run test:e2e` e `npm run test` passam, coverage >= 80%.

7.  **Logging & Observability:**
    *   **Use NestJS Logger:** `private readonly logger = new Logger(ClassName)`.
    *   **Log Levels:** error, warn, log, debug, verbose.
    *   **Structured Logging:** Use Winston ou Pino para suportar contexto estruturado (traceId, userId, etc).
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

    *   **Reasoning:** Logging centralizado facilita debugging em produção e conformidade com compliance.
    *   **Verification:** Logs aparecem no console durante desenvolvimento e são capturados por ferramentas de observabilidade em produção.

8.  **Configuration Management:**
    *   **Use ConfigModule:** `@nestjs/config`.
    *   **Example `.env`:**
    ```
    DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
    JWT_SECRET=super-secret-key
    NODE_ENV=development
    ```

    *   **Usage in Module:**
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

    *   **Reasoning:** Configuração centralizada reduz erros e facilita deploys em diferentes ambientes.
    *   **Verification:** App inicia sem erros de configuração.

## Best Practices

- **Dependency Injection:** NestJS DI é poderoso; use `@Injectable()` e injeção via `constructor`.
- **Module Boundaries:** Cada módulo deve ser coesivo e ter responsabilidade única.
- **Service Logic:** Regra de negócio fica no `service`, não no `controller`.
- **DTOs First:** Use DTOs para validação e transformação de entrada.
- **Error Handling:** Sempre lance exceções conhecidas (HttpException, BadRequestException) em controllers.
- **Database Transactions:** Use `QueryRunner` para operações que precisam de transação.
- **Pipes for Validation:** Use Pipes globais para validação automática de DTOs.
- **Auth Patterns:** Use Guards para verificar autenticação, acessar `request.user` no controller.
- **Logging Context:** Use Logger com nomes de classe para rastreabilidade.
- **Repository Pattern:** Encapsule queries em métodos do `service` ou use custom repositories.

## Common Tasks

### Create a New Feature Module
```bash
nest generate module modules/products
nest generate controller modules/products
nest generate service modules/products
```

### Run Linting & Type Checking
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

- **Circular Dependencies:** Se módulos se importam mutuamente, use lazy-loading ou refatore para extrair dependência comum.
- **Pipes Not Validating:** Certifique-se de que `ValidationPipe` foi registrado globalmente em `main.ts`.
- **JWT Guard Errors:** Verifique se `JWT_SECRET` está correto no `.env` e que o token está sendo passado no header `Authorization: Bearer <token>`.
- **Database Connection Issues:** Teste a URL de conexão separadamente; use `TypeOrmModule.forRootAsync` com logs para diagnosticar.
- **Tests Timing Out:** Aumentar timeout em `package.json` test script ou revisar dependências assíncronas.

## Related Skills

- `validating-typescript` — Type checking e validação de algoritmo para TypeScript.
- `developing-node` — Package management e scripts para Node.js/TypeScript.
- `managing-quality` — Estratégias de teste, cobertura e integração CI/CD.
- `integrating-apis` — Padrões de integração com APIs externas.
