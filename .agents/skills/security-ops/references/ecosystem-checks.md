# Ecosystem Checks

## Contents

- Preflight
- Workflow
- Install and build hooks
- Risky call sites
- Injection classes beyond SQL
- Framework settings
- Outside the application

A lookup table for audits of a repository or a diff, organized by language toolchain. Method and
attack classes live in the vendored [audit workflow](security-audit/audit-workflow.md); this file
answers two practical questions underneath it: which files execute code before the test suite ever
starts, and which calls deserve a trace from input to effect.

## Preflight
```bash
# which sections apply: only open the ones whose manifest exists
ls package.json pyproject.toml setup.py setup.cfg Cargo.toml go.mod Gemfile *.gemspec composer.json \
   mix.exs rebar.config *.csproj *.sln build.gradle.kts build.gradle pom.xml \
   Makefile Dockerfile .github/workflows 2>/dev/null
git ls-files | rg -n '(^|/)(build\.rs|Directory\.Build\.(props|targets)|\.npmrc|\.yarnrc\.yml|pip\.conf|nuget\.config)$'
```

## Workflow
1. Find which toolchains the repository uses; ignore rows whose manifest is absent.
2. Per toolchain, read the **Install and build hooks** row before installing or building anything:
   that is where a hostile change gets to execute on the auditor's machine.
3. Search the risky call sites. A match only marks code to read; it becomes a finding once data
   from a less trusted source is shown to reach it.
4. Once step 2 is clean, run the checks the project already has, in isolation. Record any check
   whose tool is missing as not run; it never counts as passed.
5. Use a framework row only for frameworks the project really depends on.

## Install and build hooks

These run during install, build, or code generation, before any test. Read them first.

| Ecosystem | Open | Why |
|---|---|---|
| Rust | `build.rs`, proc-macro crates, `.cargo/config.toml` (aliases, `rustflags`, runners), `[patch]` and git/path dependencies | build scripts and proc macros run arbitrary code during `cargo build` and `cargo check` |
| JavaScript / TypeScript | `scripts.preinstall`, `install`, `postinstall`, `prepare` in every `package.json`; `overrides`/`resolutions`; `.npmrc` registry lines; `git+`/`file:` specs | lifecycle scripts run on `npm install` unless `--ignore-scripts` is set |
| Python | `setup.py`, build backend in `pyproject.toml`, `[tool.*]` plugin hooks, VCS/path requirements, extra `--index-url` | building an sdist executes the build backend and any `setup.py` |
| Go | `replace` directives, `//go:generate` lines, cgo files, `//go:linkname` | `go generate` runs arbitrary commands; never run it on untrusted input |
| Ruby | `Gemfile` sources, `git:`/`path:` gems, `extconf.rb`, Rake tasks, Rails initializers | native extensions compile and run on `bundle install`; initializers run on boot |
| JVM | Maven/Gradle plugins, extra repositories, `settings.gradle(.kts)`, init scripts, the wrapper JAR and its checksum, annotation processors | Gradle build scripts are programs; a swapped `gradle-wrapper.jar` runs on first build |
| .NET | `Directory.Build.props/targets`, custom MSBuild targets and tasks, `PreBuildEvent`/`PostBuildEvent`, source generators, `nuget.config` feeds | MSBuild imports `Directory.Build.*` from parent directories implicitly |
| PHP | `scripts` and `plugins` in `composer.json`, `repositories` of type `vcs`/`path`, `autoload.files` | Composer scripts and plugins run during install and update |
| Elixir / Erlang | Mix aliases, custom compilers, NIFs and ports, `git:`/`path:` deps | compilation executes project and dependency Elixir code |

## Risky call sites

Starting points per language. Several patterns fit in one search, for example
`rg -n -e "subprocess" -e "shell=True" -e "pickle.load"`, then trace each match back to its input
before reporting it.

| Ecosystem | Process and eval | Unsafe data handling | Queries and templates |
|---|---|---|---|
| Rust | `Command::new`, `unsafe {`, FFI `extern` | `bincode::deserialize` on untrusted lengths | `format!` building SQL |
| JS / TS | `child_process`, `exec(`, `new Function`, `eval(` | `__proto__`, deep `merge(` of request bodies (prototype pollution) | `innerHTML`, `dangerouslySetInnerHTML`, template literals building SQL |
| Python | `subprocess`, `os.system`, `shell=True`, `eval(`, `exec(` | `pickle.load`, `yaml.load(` without `SafeLoader`, `yaml.unsafe_load`, `marshal.loads` | `.raw(`, `execute(f"`, `mark_safe`, the `safe` template filter |
| Go | `exec.Command`, `"unsafe"` import | `gob.NewDecoder` on network input | `fmt.Sprintf` building SQL, `template.HTML(` |
| Ruby | `system(`, backtick literals, `Open3`, `.send(`, `constantize`, `instance_eval` | `Marshal.load`, `YAML.unsafe_load` (and `YAML.load` before Psych 4) | `where("...#{`, `find_by_sql`, `html_safe`, `raw(` |
| JVM | `Runtime.getRuntime`, `ProcessBuilder`, `ScriptEngine` | `ObjectInputStream`, `XMLDecoder`, Jackson `enableDefaultTyping` | string-concatenated `createQuery`, JNDI `lookup(` |
| .NET | `Process.Start`, `Assembly.Load`, `CSharpScript` | `BinaryFormatter`, Newtonsoft `TypeNameHandling.All` or `.Auto` | `FromSqlRaw`, `ExecuteSqlRaw`, `Html.Raw` |
| PHP | `exec(`, `shell_exec(`, `system(`, `passthru(`, `proc_open(`, backtick literals | `unserialize(` | `$_GET`/`$_POST` reaching a query, `include`, or `require` |
| Elixir | `System.cmd`, `:os.cmd`, `Code.eval_string` | `:erlang.binary_to_term` without `[:safe]`, `String.to_atom` | `fragment(` with interpolation, `raw(` |

`String.to_atom` on input is a denial-of-service sink in Elixir: atoms are never garbage-collected.
`binary_to_term` without `[:safe]` can create atoms and decode function references from input.

## Injection classes beyond SQL

The per-language sinks above cover command injection and deserialization. These four recur across languages and are easy to miss because the sink looks like ordinary code, not a query.

| Class | CWE | Detection heuristic | Concrete example |
|---|---|---|---|
| SSRF | [CWE-918](https://cwe.mitre.org/data/definitions/918.html) | An outbound HTTP client (`fetch(`, `axios.get(`, `requests.get(`, `HttpClient`, `curl_exec`) whose URL, host, or scheme comes from request input, a webhook config, or a stored callback URL | A "fetch preview image from this URL" or "test this webhook" feature reaching `http://169.254.169.254/latest/meta-data/` or an internal service |
| Template injection (SSTI) | [CWE-1336](https://cwe.mitre.org/data/definitions/1336.html) | User input concatenated into a template **string** before it is compiled (`render_template_string(`, `Template(user_input)`, Jinja2/Twig/Freemarker/Velocity/Handlebars given raw user text as the template source, not a substituted variable) | A "customize your email subject" field passed as the template source itself |
| Path traversal | [CWE-22](https://cwe.mitre.org/data/definitions/22.html) | A filename or archive entry from input reaches `open`/`readFile`/`Path.join`/`os.path.join` without resolving to an absolute path and checking it stays under the intended root; `../` string filtering alone is bypassed by encoding, absolute paths, or symlinks | A download endpoint taking `?file=report.pdf` and joining it onto a base directory with no containment check |
| XXE | [CWE-611](https://cwe.mitre.org/data/definitions/611.html) | An XML parser with external entity resolution left on (`DocumentBuilderFactory` without secure processing, `libxml2`/`lxml` without disabling entity resolution and network access, `.NET XmlDocument` with a live `XmlResolver`) processing input that is not fully trusted, including SOAP, SVG upload, and Office/OOXML parsing | An "import from XML" or SVG-upload feature parsing attacker-supplied XML with entity expansion enabled |

Trace every hit from source to sink before reporting it — a match marks code to read, not a confirmed finding. That input-to-sink tracing discipline is the review methodology in *The Art of Software Security Assessment* (Dowd, McDonald, Schuh). The [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) has a dedicated sheet with the safe API for each of these four classes.

## Framework settings

Skip rows for frameworks the project does not use.

| Framework | Check |
|---|---|
| Rails | `protect_from_forgery`, strong parameters, `secret_key_base` source, `config.hosts`, Active Storage access, signed/global IDs |
| Django | `DEBUG` off in production, `SECRET_KEY` from the environment, `ALLOWED_HOSTS`, CSRF middleware, object-level permissions |
| Flask / FastAPI | debug mode off, secret key from the environment, CORS origin list, per-object authorization in each handler, upload size limits |
| Express / Nest / Next | `trust proxy` setting, body-size limits, CORS origin list, cookie `secure`/`httpOnly`/`sameSite`, open redirects, SSRF on user-supplied URLs |
| Spring | security filter chain coverage, method security, actuator exposure, SpEL on input |
| ASP.NET Core | middleware order (`UseAuthentication` before `UseAuthorization`), antiforgery, forwarded headers, Data Protection key storage |
| Phoenix | plug pipeline per scope, `protect_from_forgery`, channel and LiveView `mount` authorization |
| Electron / Tauri | the preload script and IPC handlers are where authorization happens: check the sender and origin, and keep the exposed surface small and typed (Electron layout lives in `software-architecture`) |

## Outside the application

These apply to every repository, whatever the language:

- Shell and Make: unquoted expansions, `eval`, `curl | sh`, unguarded `rm -rf` paths —
  [strict-shell.md](../../cloud-devops/references/strict-shell.md).
- Containers: base image pinned by digest, non-root user, no Docker socket mount, secrets out of
  build args — [dockerfile-standards.md](../../cloud-devops/references/dockerfile-standards.md).
- CI: permissions, `pull_request_target`, event data in `run:` —
  [untrusted-contribution.md](../../code-review/references/untrusted-contribution.md).
- Infrastructure as code: RBAC, privileged pods, public exposure, secrets in state —
  [iac-principles.md](../../cloud-devops/references/iac-principles.md).
- Supply chain and SBOM for everything above: [supply-chain.md](supply-chain.md).
