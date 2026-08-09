# Performance Optimization

Flutter performance guide covering profiling, const optimization, and DevTools analysis, plus Android performance and stability requirements: Vitals thresholds, startup, rendering, ANR, battery, and memory best practices.

## Profiling Commands

```bash
# Run in profile mode (required for accurate measurements)
flutter run --profile

# Analyze code issues
flutter analyze

# Launch DevTools
flutter pub global activate devtools
flutter pub global run devtools

# Build release for testing
flutter build apk --release
flutter build ios --release
```

## Const Widget Optimization

The most important optimization for preventing unnecessary rebuilds:

```dart
// BAD - Creates new objects every build
Widget build(BuildContext context) {
  return Container(
    padding: EdgeInsets.all(16),  // New object each time
    child: Text('Hello'),          // New widget each time
  );
}

// GOOD - Const prevents rebuilds
Widget build(BuildContext context) {
  return Container(
    padding: const EdgeInsets.all(16),
    child: const Text('Hello'),
  );
}
```

### Extracting Const Widgets

```dart
// BAD - Inline static content
class MyScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(Icons.star, size: 48),
        Text('Welcome'),
        Text('Description text here'),
      ],
    );
  }
}

// GOOD - Extract to const classes
class MyScreen extends StatelessWidget {
  const MyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        _Header(),
        _Description(),
      ],
    );
  }
}

class _Header extends StatelessWidget {
  const _Header();

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        Icon(Icons.star, size: 48),
        Text('Welcome'),
      ],
    );
  }
}
```

## Selective Provider Watching

```dart
// BAD - Rebuilds on any user change
class UserAvatar extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(userProvider);
    return CircleAvatar(
      backgroundImage: NetworkImage(user.avatarUrl),
    );
  }
}

// GOOD - Only rebuilds when avatarUrl changes
class UserAvatar extends ConsumerWidget {
  const UserAvatar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final avatarUrl = ref.watch(userProvider.select((u) => u.avatarUrl));
    return CircleAvatar(
      backgroundImage: NetworkImage(avatarUrl),
    );
  }
}
```

## RepaintBoundary

Isolate expensive widgets to prevent unnecessary repaints:

```dart
// Isolate complex animated widgets
RepaintBoundary(
  child: ComplexAnimatedWidget(),
)

// Isolate frequently updating widgets
RepaintBoundary(
  child: StreamBuilder<int>(
    stream: counterStream,
    builder: (context, snapshot) => Text('${snapshot.data}'),
  ),
)
```

## List Optimization

```dart
// BAD - Builds all items upfront
ListView(
  children: items.map((item) => ItemWidget(item: item)).toList(),
)

// GOOD - Lazy loading with builder
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return ItemWidget(
      key: ValueKey(items[index].id),
      item: items[index],
    );
  },
)

// For heterogeneous content
ListView.separated(
  itemCount: items.length,
  separatorBuilder: (_, __) => const Divider(),
  itemBuilder: (context, index) => ItemWidget(item: items[index]),
)
```

## Image Optimization

```dart
// Use cached_network_image for network images
CachedNetworkImage(
  imageUrl: url,
  placeholder: (_, __) => const ShimmerPlaceholder(),
  errorWidget: (_, __, ___) => const Icon(Icons.error),
  memCacheWidth: 200,
  memCacheHeight: 200,
)

// Resize images in memory
Image.network(
  url,
  cacheWidth: 200,   // Decode at smaller size
  cacheHeight: 200,  // Saves memory
)

// Precache images
precacheImage(NetworkImage(url), context);
```

## Heavy Computation

```dart
// BAD - Blocks UI thread
void processData() {
  final result = heavyComputation(data);  // UI freezes
  updateUI(result);
}

// GOOD - Run in isolate
Future<void> processData() async {
  final result = await compute(heavyComputation, data);
  updateUI(result);
}

// For multiple operations
Future<void> processMultiple() async {
  final results = await Future.wait([
    compute(process1, data1),
    compute(process2, data2),
    compute(process3, data3),
  ]);
}
```

## Animation Performance

```dart
// Use AnimatedBuilder for custom animations
AnimatedBuilder(
  animation: controller,
  builder: (context, child) {
    return Transform.rotate(
      angle: controller.value * 2 * pi,
      child: child,  // Child not rebuilt
    );
  },
  child: const ExpensiveWidget(),
)

// Prefer implicit animations for simple cases
AnimatedContainer(
  duration: const Duration(milliseconds: 300),
  width: expanded ? 200 : 100,
  child: const Content(),
)
```

## DevTools Analysis

### Key Metrics

| Metric | Target | Action if Exceeded |
|--------|--------|-------------------|
| Frame time | < 16ms (60fps) | Profile build/paint |
| Build time | < 8ms | Add const, extract widgets |
| Paint time | < 8ms | Add RepaintBoundary |
| Memory | Stable | Check for leaks |

### Common Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| Expensive builds | High build time | Extract const widgets |
| Excessive repaints | High paint time | Add RepaintBoundary |
| Memory leaks | Growing memory | Dispose controllers |
| Jank | Dropped frames | Use compute() |

## Performance Checklist

| Check | Solution |
|-------|----------|
| Unnecessary rebuilds | Add `const`, use `select()` |
| Large lists | Use `ListView.builder` |
| Image loading | Use `cached_network_image` |
| Heavy computation | Use `compute()` |
| Jank in animations | Use `RepaintBoundary` |
| Memory leaks | Dispose controllers, cancel subscriptions |
| Network calls | Cache responses, debounce requests |
| Startup time | Defer initialization, lazy loading |

## Dispose Pattern

```dart
class MyWidget extends StatefulWidget {
  const MyWidget({super.key});

  @override
  State<MyWidget> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late final TextEditingController _controller;
  late final StreamSubscription _subscription;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
    _subscription = stream.listen(handleData);
  }

  @override
  void dispose() {
    _controller.dispose();
    _subscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Container();
}
```

---

## Android Vitals Thresholds

### Core Metrics (Google Play)

Exceeding these thresholds affects app visibility on Google Play:

| Metric | Overall Threshold | Per Phone Model | Per Watch Model |
|--------|-------------------|-----------------|-----------------|
| User-perceived crash rate | **1.09%** | 8% | 4% |
| User-perceived ANR rate | **0.47%** | 8% | 5% |
| Excessive battery usage | 1% | - | 1% |
| Excessive wake locks | 5% | - | - |

### Consequences of Exceeding Thresholds

- Reduced app visibility in Google Play
- Warning label on store listing
- Lower ranking in search results
- Negative impact on user trust

## Startup Performance

### Requirements

| Metric | Target | Maximum |
|--------|--------|---------|
| Cold start | < 1 second | 2 seconds |
| Warm start | < 500ms | 1 second |
| Hot start | < 100ms | 500ms |

### If Startup Exceeds 2 Seconds

Must provide visual feedback:
- Progress indicator
- Splash screen with animation
- Loading skeleton

### Optimization Techniques

| Technique | Impact |
|-----------|--------|
| Lazy initialization | Defer non-critical work |
| Async loading | Move I/O off main thread |
| View hierarchy optimization | Reduce layout depth |
| App Startup library | Initialize components efficiently |
| Baseline Profiles | Pre-compile hot paths |

## Rendering Performance

### Frame Rate Requirements

| Target | Frame Time | Notes |
|--------|------------|-------|
| 60 FPS | ≤ 16.67ms | Standard requirement |
| 90 FPS | ≤ 11.11ms | High refresh rate displays |
| 120 FPS | ≤ 8.33ms | Premium devices |

### Jank Detection

| Metric | Threshold | Severity |
|--------|-----------|----------|
| Slow frames | > 16ms | Warning |
| Frozen frames | > 700ms | Critical |
| Jank rate | > 1% of frames | Poor experience |

### Common Rendering Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Overdraw | Multiple layers drawn | Reduce background stacking |
| Deep hierarchy | Complex view nesting | Use ConstraintLayout, Compose |
| Main thread work | Blocking operations | Move to background thread |
| Large bitmaps | Unoptimized images | Downsample, use vector |

## ANR Prevention

### ANR Triggers

| Scenario | Timeout |
|----------|---------|
| Input dispatch | 5 seconds |
| Broadcast receiver | 10 seconds |
| Service start | 20 seconds |

### Prevention Strategies

- Never perform network calls on main thread
- Never perform database operations on main thread
- Never perform file I/O on main thread
- Use coroutines, RxJava, or other async mechanisms
- Reduce synchronized block contention

### Common ANR Causes

| Cause | Solution |
|-------|----------|
| Network on main thread | Use coroutines/RxJava |
| Database on main thread | Use Room with suspend |
| File I/O on main thread | Use Dispatchers.IO |
| Lock contention | Reduce synchronized blocks |
| Dead locks | Careful threading design |

## Battery Optimization

### Wake Lock Guidelines

| Rule | Implementation |
|------|----------------|
| Minimize duration | Release as soon as possible |
| Use appropriate type | PARTIAL_WAKE_LOCK only when needed |
| Always release | Use try-finally or lifecycle |
| Prefer WorkManager | System-managed scheduling |

### Background Restrictions

| Feature | Best Practice |
|---------|---------------|
| Background services | Use WorkManager instead |
| Location | Request only when necessary |
| Network | Batch requests, respect connectivity |
| Alarms | Use inexact alarms when possible |

### Doze and App Standby

| Mode | Behavior | Adaptation |
|------|----------|------------|
| Doze | Limited network, alarms delayed | Use FCM for high-priority |
| App Standby | Background work restricted | Use expedited WorkManager |
| Buckets | Frequency limits by usage | Design for infrequent execution |

## Memory Management

### Memory Best Practices

| Practice | Benefit |
|----------|---------|
| Avoid memory leaks | Prevent OutOfMemoryError |
| Use weak references | Allow garbage collection |
| Recycle bitmaps | Reduce memory pressure |
| Monitor heap | Profile regularly |

### Common Memory Issues

| Issue | Detection | Solution |
|-------|-----------|----------|
| Activity leak | LeakCanary | Fix lifecycle references |
| Bitmap leak | Memory profiler | Recycle, use Glide/Coil |
| Context leak | Static analysis | Use application context |
| Handler leak | Lint warning | Use WeakReference |

## StrictMode

### What StrictMode Detects

| Category | Issues |
|----------|--------|
| Thread | Disk reads/writes, network, slow calls |
| VM | Leaked objects, unsafe intents, content URI exposure |

Enable StrictMode in debug builds to detect violations during development.

## SDK Requirements

### Version Requirements

| Property | Requirement |
|----------|-------------|
| targetSdk | Latest Android SDK (Google Play requirement) |
| compileSdk | Latest Android SDK |
| minSdk | Based on target audience |

### Third-Party SDK Management

| Practice | Reason |
|----------|--------|
| Keep updated | Security fixes, compatibility |
| Audit regularly | Remove unused dependencies |
| Monitor crashes | SDKs can cause issues |
| Check permissions | SDKs may request excessive permissions |

### Non-SDK Interface Restrictions

- Don't use reflection for hidden APIs
- Use Android Studio lint to detect
- APIs may break in future versions

## Monitoring and Profiling

### Tools

| Tool | Purpose |
|------|---------|
| Android Studio Profiler | CPU, memory, network, energy |
| Android Vitals (Play Console) | Production crash/ANR data |
| Firebase Performance | Real-time performance monitoring |
| Perfetto | Advanced system tracing |
| Benchmark library | Reproducible measurements |

### Key Metrics to Track

| Metric | Tool |
|--------|------|
| Startup time | Macrobenchmark |
| Frame timing | JankStats |
| Memory usage | Memory Profiler |
| Network latency | Network Profiler |
| Battery drain | Energy Profiler |

## Android Performance Checklist

- [ ] Cold startup < 2 seconds
- [ ] Rendering at 60 FPS
- [ ] No StrictMode violations
- [ ] Crash rate < 1.09%
- [ ] ANR rate < 0.47%
- [ ] No memory leaks
- [ ] Background work uses WorkManager
- [ ] Wake locks properly released
- [ ] SDKs up to date

---

*Flutter and DevTools are trademarks of Google LLC.*
