# Animations

Flutter and iOS animation patterns plus Material Design 3 motion guidelines covering implicit/explicit animations, Hero transitions, page transitions, CALayer/UIView animation, and motion specs.

## Flutter

### Implicit Animations

Use implicit animations for simple property changes:

```dart
class ImplicitAnimationExample extends StatefulWidget {
  const ImplicitAnimationExample({super.key});

  @override
  State<ImplicitAnimationExample> createState() => _ImplicitAnimationExampleState();
}

class _ImplicitAnimationExampleState extends State<ImplicitAnimationExample> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => setState(() => _expanded = !_expanded),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        width: _expanded ? 200 : 100,
        height: _expanded ? 200 : 100,
        decoration: BoxDecoration(
          color: _expanded ? Colors.blue : Colors.red,
          borderRadius: BorderRadius.circular(_expanded ? 16 : 8),
        ),
        child: const Center(child: Text('Tap me')),
      ),
    );
  }
}
```

#### Common Implicit Widgets

| Widget | Animates |
|--------|----------|
| `AnimatedContainer` | Size, color, padding, decoration |
| `AnimatedOpacity` | Opacity |
| `AnimatedPadding` | Padding |
| `AnimatedPositioned` | Position in Stack |
| `AnimatedAlign` | Alignment |
| `AnimatedCrossFade` | Cross-fade between two widgets |
| `AnimatedSwitcher` | Transition between child widgets |
| `AnimatedDefaultTextStyle` | Text style |
| `AnimatedScale` | Scale transform |
| `AnimatedRotation` | Rotation transform |
| `AnimatedSlide` | Slide offset |

#### AnimatedSwitcher

```dart
AnimatedSwitcher(
  duration: const Duration(milliseconds: 300),
  transitionBuilder: (child, animation) {
    return FadeTransition(
      opacity: animation,
      child: SlideTransition(
        position: Tween<Offset>(
          begin: const Offset(0, 0.1),
          end: Offset.zero,
        ).animate(animation),
        child: child,
      ),
    );
  },
  child: _showFirst
      ? const Icon(Icons.check, key: ValueKey('check'))
      : const Icon(Icons.close, key: ValueKey('close')),
)
```

### Explicit Animations

Use explicit animations for complex, custom, or controlled animations:

```dart
class ExplicitAnimationExample extends StatefulWidget {
  const ExplicitAnimationExample({super.key});

  @override
  State<ExplicitAnimationExample> createState() => _ExplicitAnimationExampleState();
}

class _ExplicitAnimationExampleState extends State<ExplicitAnimationExample>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;
  late final Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 500),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );

    _rotationAnimation = Tween<double>(begin: 0, end: 0.1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.elasticOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) => _controller.reverse(),
      onTapCancel: () => _controller.reverse(),
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Transform.rotate(
              angle: _rotationAnimation.value,
              child: child,
            ),
          );
        },
        child: const Card(child: Padding(padding: EdgeInsets.all(24), child: Text('Press me'))),
      ),
    );
  }
}
```

#### Animation with Hooks

```dart
import 'package:flutter_hooks/flutter_hooks.dart';

class AnimatedButtonHook extends HookWidget {
  const AnimatedButtonHook({super.key});

  @override
  Widget build(BuildContext context) {
    final controller = useAnimationController(
      duration: const Duration(milliseconds: 300),
    );
    final scale = useAnimation(
      Tween<double>(begin: 1.0, end: 0.95).animate(
        CurvedAnimation(parent: controller, curve: Curves.easeInOut),
      ),
    );

    return GestureDetector(
      onTapDown: (_) => controller.forward(),
      onTapUp: (_) => controller.reverse(),
      onTapCancel: () => controller.reverse(),
      child: Transform.scale(
        scale: scale,
        child: const Card(child: Text('Animated Button')),
      ),
    );
  }
}
```

#### Staggered Animations

```dart
class StaggeredAnimation extends StatefulWidget {
  const StaggeredAnimation({super.key});

  @override
  State<StaggeredAnimation> createState() => _StaggeredAnimationState();
}

class _StaggeredAnimationState extends State<StaggeredAnimation>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final List<Animation<double>> _itemAnimations;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _itemAnimations = List.generate(5, (index) {
      final start = index * 0.1;
      final end = start + 0.4;
      return Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(
          parent: _controller,
          curve: Interval(start, end.clamp(0, 1), curve: Curves.easeOut),
        ),
      );
    });

    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(5, (index) {
        return AnimatedBuilder(
          animation: _itemAnimations[index],
          builder: (context, child) {
            return Opacity(
              opacity: _itemAnimations[index].value,
              child: Transform.translate(
                offset: Offset(0, 20 * (1 - _itemAnimations[index].value)),
                child: child,
              ),
            );
          },
          child: ListTile(title: Text('Item $index')),
        );
      }),
    );
  }
}
```

### Hero Animations

```dart
class HeroSourcePage extends StatelessWidget {
  const HeroSourcePage({super.key});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
      ),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return GestureDetector(
          onTap: () => context.push('/detail/${item.id}'),
          child: Hero(
            tag: 'hero-${item.id}',
            child: Image.network(item.imageUrl, fit: BoxFit.cover),
          ),
        );
      },
    );
  }
}

class HeroDetailPage extends StatelessWidget {
  final String itemId;

  const HeroDetailPage({super.key, required this.itemId});

  @override
  Widget build(BuildContext context) {
    final item = getItem(itemId);
    return Scaffold(
      body: Column(
        children: [
          Hero(
            tag: 'hero-${item.id}',
            child: Image.network(item.imageUrl, fit: BoxFit.cover),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(item.title, style: Theme.of(context).textTheme.headlineMedium),
          ),
        ],
      ),
    );
  }
}
```

#### Hero with Custom Flight

```dart
Hero(
  tag: 'avatar-$userId',
  flightShuttleBuilder: (
    flightContext,
    animation,
    flightDirection,
    fromHeroContext,
    toHeroContext,
  ) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        return Material(
          color: Colors.transparent,
          child: CircleAvatar(
            radius: lerpDouble(24, 48, animation.value),
            backgroundImage: NetworkImage(avatarUrl),
          ),
        );
      },
    );
  },
  child: CircleAvatar(radius: 24, backgroundImage: NetworkImage(avatarUrl)),
)
```

### Page Transitions

#### GoRouter Custom Transitions

```dart
GoRoute(
  path: '/detail/:id',
  pageBuilder: (context, state) {
    return CustomTransitionPage(
      key: state.pageKey,
      child: DetailPage(id: state.pathParameters['id']!),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return FadeTransition(
          opacity: animation,
          child: SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0, 0.05),
              end: Offset.zero,
            ).animate(CurvedAnimation(
              parent: animation,
              curve: Curves.easeOut,
            )),
            child: child,
          ),
        );
      },
    );
  },
)
```

#### Common Transition Patterns

```dart
extension PageTransitions on CustomTransitionPage {
  static CustomTransitionPage<T> fade<T>({
    required LocalKey key,
    required Widget child,
  }) {
    return CustomTransitionPage<T>(
      key: key,
      child: child,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return FadeTransition(opacity: animation, child: child);
      },
    );
  }

  static CustomTransitionPage<T> slideUp<T>({
    required LocalKey key,
    required Widget child,
  }) {
    return CustomTransitionPage<T>(
      key: key,
      child: child,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0, 1),
            end: Offset.zero,
          ).animate(CurvedAnimation(
            parent: animation,
            curve: Curves.easeOutCubic,
          )),
          child: child,
        );
      },
    );
  }

  static CustomTransitionPage<T> scale<T>({
    required LocalKey key,
    required Widget child,
  }) {
    return CustomTransitionPage<T>(
      key: key,
      child: child,
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return ScaleTransition(
          scale: Tween<double>(begin: 0.9, end: 1).animate(
            CurvedAnimation(parent: animation, curve: Curves.easeOut),
          ),
          child: FadeTransition(opacity: animation, child: child),
        );
      },
    );
  }
}
```

#### Shared Axis Transition

```dart
import 'package:animations/animations.dart';

GoRoute(
  path: '/settings',
  pageBuilder: (context, state) {
    return CustomTransitionPage(
      key: state.pageKey,
      child: const SettingsPage(),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return SharedAxisTransition(
          animation: animation,
          secondaryAnimation: secondaryAnimation,
          transitionType: SharedAxisTransitionType.horizontal,
          child: child,
        );
      },
    );
  },
)
```

### Common Curves

| Curve | Usage |
|-------|-------|
| `Curves.easeInOut` | General purpose (default) |
| `Curves.easeOut` | Deceleration (entering) |
| `Curves.easeIn` | Acceleration (exiting) |
| `Curves.elasticOut` | Bouncy effect |
| `Curves.bounceOut` | Bounce at end |
| `Curves.fastOutSlowIn` | Material standard |
| `Curves.easeOutCubic` | Smooth deceleration |

### Animation Performance

```dart
class PerformantAnimation extends StatelessWidget {
  const PerformantAnimation({super.key});

  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      child: AnimatedBuilder(
        animation: animation,
        builder: (context, child) {
          return Transform.translate(
            offset: Offset(animation.value * 100, 0),
            child: child,
          );
        },
        child: const ExpensiveWidget(),
      ),
    );
  }
}
```

#### Performance Tips

| Tip | Implementation |
|-----|----------------|
| Use `child` parameter | Pass static content to `child` in `AnimatedBuilder` |
| `RepaintBoundary` | Isolate animated widgets |
| Avoid `Opacity` widget | Use `FadeTransition` instead |
| Prefer transforms | `Transform` is cheaper than layout changes |
| Pre-compute values | Calculate in `initState`, not `build` |

### Animation Checklist

| Item | Implementation |
|------|----------------|
| Simple animations | Use implicit widgets |
| Complex sequences | Use `AnimationController` |
| Widget transitions | `AnimatedSwitcher` with key |
| Cross-page elements | `Hero` with unique tags |
| Page transitions | `CustomTransitionPage` |
| Performance | `RepaintBoundary` + `child` parameter |

## iOS (UIKit)

### CAShapeLayer

For custom shapes, paths, and animations:

```swift
class CircularProgressView: UIView {
    private let trackLayer = CAShapeLayer()
    private let progressLayer = CAShapeLayer()
    
    var progress: CGFloat = 0 {
        didSet { updateProgress() }
    }
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupLayers()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupLayers()
    }
    
    private func setupLayers() {
        let center = CGPoint(x: bounds.midX, y: bounds.midY)
        let radius = min(bounds.width, bounds.height) / 2 - 10
        let startAngle = -CGFloat.pi / 2
        let endAngle = startAngle + 2 * CGFloat.pi
        
        let circularPath = UIBezierPath(
            arcCenter: center,
            radius: radius,
            startAngle: startAngle,
            endAngle: endAngle,
            clockwise: true
        )
        
        trackLayer.path = circularPath.cgPath
        trackLayer.strokeColor = UIColor.systemGray5.cgColor
        trackLayer.fillColor = UIColor.clear.cgColor
        trackLayer.lineWidth = 10
        trackLayer.lineCap = .round
        layer.addSublayer(trackLayer)
        
        progressLayer.path = circularPath.cgPath
        progressLayer.strokeColor = UIColor.systemBlue.cgColor
        progressLayer.fillColor = UIColor.clear.cgColor
        progressLayer.lineWidth = 10
        progressLayer.lineCap = .round
        progressLayer.strokeEnd = 0
        layer.addSublayer(progressLayer)
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        setupLayers()
    }
    
    private func updateProgress() {
        progressLayer.strokeEnd = progress
    }
    
    func animateProgress(to value: CGFloat, duration: TimeInterval = 0.5) {
        let animation = CABasicAnimation(keyPath: "strokeEnd")
        animation.fromValue = progressLayer.strokeEnd
        animation.toValue = value
        animation.duration = duration
        animation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
        progressLayer.strokeEnd = value
        progressLayer.add(animation, forKey: "progressAnimation")
    }
}
```

### UIBezierPath

#### Common Shapes

```swift
let roundedRect = UIBezierPath(
    roundedRect: bounds,
    cornerRadius: 12
)

let customCorners = UIBezierPath(
    roundedRect: bounds,
    byRoundingCorners: [.topLeft, .topRight],
    cornerRadii: CGSize(width: 16, height: 16)
)

let triangle = UIBezierPath()
triangle.move(to: CGPoint(x: bounds.midX, y: 0))
triangle.addLine(to: CGPoint(x: bounds.maxX, y: bounds.maxY))
triangle.addLine(to: CGPoint(x: 0, y: bounds.maxY))
triangle.close()

let circle = UIBezierPath(
    arcCenter: CGPoint(x: bounds.midX, y: bounds.midY),
    radius: bounds.width / 2,
    startAngle: 0,
    endAngle: .pi * 2,
    clockwise: true
)
```

#### Custom Paths

```swift
let customPath = UIBezierPath()
customPath.move(to: CGPoint(x: 0, y: bounds.height))
customPath.addCurve(
    to: CGPoint(x: bounds.width, y: 0),
    controlPoint1: CGPoint(x: bounds.width * 0.3, y: bounds.height),
    controlPoint2: CGPoint(x: bounds.width * 0.7, y: 0)
)
```

### CAGradientLayer

#### Linear Gradient Button

```swift
class GradientButton: UIButton {
    private let gradientLayer = CAGradientLayer()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupGradient()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupGradient()
    }
    
    private func setupGradient() {
        gradientLayer.colors = [
            UIColor.systemBlue.cgColor,
            UIColor.systemPurple.cgColor
        ]
        gradientLayer.startPoint = CGPoint(x: 0, y: 0.5)
        gradientLayer.endPoint = CGPoint(x: 1, y: 0.5)
        gradientLayer.cornerRadius = 12
        layer.insertSublayer(gradientLayer, at: 0)
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        gradientLayer.frame = bounds
    }
}
```

#### Gradient Background View

```swift
class GradientBackgroundView: UIView {
    private let gradientLayer = CAGradientLayer()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupGradient()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupGradient()
    }
    
    private func setupGradient() {
        gradientLayer.colors = [
            UIColor.systemBackground.cgColor,
            UIColor.secondarySystemBackground.cgColor
        ]
        gradientLayer.locations = [0.0, 1.0]
        gradientLayer.startPoint = CGPoint(x: 0.5, y: 0)
        gradientLayer.endPoint = CGPoint(x: 0.5, y: 1)
        layer.insertSublayer(gradientLayer, at: 0)
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        gradientLayer.frame = bounds
    }
    
    override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
        super.traitCollectionDidChange(previousTraitCollection)
        gradientLayer.colors = [
            UIColor.systemBackground.cgColor,
            UIColor.secondarySystemBackground.cgColor
        ]
    }
}
```

#### Gradient Types

| Type | Configuration |
|------|---------------|
| Linear (horizontal) | `startPoint: (0, 0.5)`, `endPoint: (1, 0.5)` |
| Linear (vertical) | `startPoint: (0.5, 0)`, `endPoint: (0.5, 1)` |
| Diagonal | `startPoint: (0, 0)`, `endPoint: (1, 1)` |
| Radial | Use `CAGradientLayer.type = .radial` |

### Core Animation

#### Basic Animation

```swift
func animateScale() {
    let animation = CABasicAnimation(keyPath: "transform.scale")
    animation.fromValue = 1.0
    animation.toValue = 1.2
    animation.duration = 0.3
    animation.autoreverses = true
    animation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
    layer.add(animation, forKey: "scaleAnimation")
}

func animatePosition() {
    let animation = CABasicAnimation(keyPath: "position")
    animation.fromValue = layer.position
    animation.toValue = CGPoint(x: 200, y: 200)
    animation.duration = 0.5
    layer.add(animation, forKey: "positionAnimation")
}
```

#### Keyframe Animation

```swift
func animateAlongPath() {
    let path = UIBezierPath()
    path.move(to: CGPoint(x: 50, y: 50))
    path.addCurve(
        to: CGPoint(x: 250, y: 250),
        controlPoint1: CGPoint(x: 150, y: 50),
        controlPoint2: CGPoint(x: 50, y: 250)
    )
    
    let animation = CAKeyframeAnimation(keyPath: "position")
    animation.path = path.cgPath
    animation.duration = 2.0
    animation.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
    layer.add(animation, forKey: "pathAnimation")
}
```

#### Animation Group

```swift
func animateMultiple() {
    let scaleAnimation = CABasicAnimation(keyPath: "transform.scale")
    scaleAnimation.fromValue = 1.0
    scaleAnimation.toValue = 1.5
    
    let opacityAnimation = CABasicAnimation(keyPath: "opacity")
    opacityAnimation.fromValue = 1.0
    opacityAnimation.toValue = 0.0
    
    let group = CAAnimationGroup()
    group.animations = [scaleAnimation, opacityAnimation]
    group.duration = 0.5
    group.fillMode = .forwards
    group.isRemovedOnCompletion = false
    
    layer.add(group, forKey: "multipleAnimations")
}
```

#### Spring Animation

```swift
func springAnimation() {
    let spring = CASpringAnimation(keyPath: "transform.scale")
    spring.fromValue = 0.8
    spring.toValue = 1.0
    spring.damping = 10
    spring.stiffness = 100
    spring.mass = 1
    spring.initialVelocity = 5
    spring.duration = spring.settlingDuration
    layer.add(spring, forKey: "springAnimation")
}
```

### UIView Animation

#### Basic UIView Animation

```swift
UIView.animate(withDuration: 0.3) {
    self.view.alpha = 1.0
    self.view.transform = .identity
}

UIView.animate(withDuration: 0.3, delay: 0, options: [.curveEaseInOut]) {
    self.cardView.frame.origin.y = 100
} completion: { _ in
    self.didFinishAnimation()
}
```

#### Spring Animation

```swift
UIView.animate(
    withDuration: 0.6,
    delay: 0,
    usingSpringWithDamping: 0.7,
    initialSpringVelocity: 0.5,
    options: []
) {
    self.popupView.transform = .identity
}
```

#### Keyframe Animation

```swift
UIView.animateKeyframes(withDuration: 1.0, delay: 0) {
    UIView.addKeyframe(withRelativeStartTime: 0, relativeDuration: 0.25) {
        self.view.transform = CGAffineTransform(scaleX: 1.2, y: 1.2)
    }
    UIView.addKeyframe(withRelativeStartTime: 0.25, relativeDuration: 0.25) {
        self.view.transform = CGAffineTransform(rotationAngle: .pi / 4)
    }
    UIView.addKeyframe(withRelativeStartTime: 0.5, relativeDuration: 0.5) {
        self.view.transform = .identity
    }
}
```

### Timing Functions

| Name | Description |
|------|-------------|
| `.linear` | Constant speed |
| `.easeIn` | Slow start |
| `.easeOut` | Slow end |
| `.easeInEaseOut` | Slow start and end |
| `.default` | System default |

## Material Design 3 Motion System

Animation and transition specifications for Material Design 3.

### Motion Principles

#### Four Core Characteristics

| Principle | Description |
|-----------|-------------|
| **Responsive** | Quickly responds to user input at the point of interaction |
| **Natural** | Follows real-world physics (gravity, friction, momentum) |
| **Aware** | Elements are aware of surroundings and other elements |
| **Intentional** | Guides focus to the right place at the right time |

### Duration Guidelines

#### By Interaction Type

| Type | Duration | Usage |
|------|----------|-------|
| Micro | 50-100ms | Ripples, state changes, hover |
| Short | 100-200ms | Simple transitions, toggles |
| Medium | 200-300ms | Expanding, collapsing, revealing |
| Long | 300-500ms | Complex choreography, page transitions |

#### By Device Type

| Device | Typical Duration | Adjustment |
|--------|------------------|------------|
| Mobile | 300ms | Baseline |
| Tablet | 390ms | +30% slower |
| Desktop | 150-200ms | Faster, more responsive |
| Wearable | 210ms | -30% faster |

#### Duration Rules

- **Maximum**: Keep under 400ms for most transitions
- **User-initiated**: Faster (closer to instant feedback)
- **System-initiated**: Can be slightly longer
- **Loading states**: Use indeterminate indicators for unknown duration

### Easing Curves

#### Standard Curves

| Curve | Usage | Characteristics |
|-------|-------|-----------------|
| **Standard** | Most common transitions | Quick acceleration, slow deceleration |
| **Emphasized** | Important/significant transitions | More dramatic curve |
| **Decelerate** | Elements entering screen | Starts fast, ends slow |
| **Accelerate** | Elements leaving screen permanently | Starts slow, ends fast |
| **Sharp** | Elements temporarily leaving | Quick, snappy motion |

#### Curve Values (Cubic Bezier)

| Curve | Value |
|-------|-------|
| Standard | cubic-bezier(0.2, 0.0, 0.0, 1.0) |
| Emphasized | cubic-bezier(0.2, 0.0, 0.0, 1.0) |
| Decelerate | cubic-bezier(0.0, 0.0, 0.0, 1.0) |
| Accelerate | cubic-bezier(0.3, 0.0, 1.0, 1.0) |

### Movement Patterns

#### Arc Motion

- Use natural, concave arcs for diagonal movement
- Single-axis movement (horizontal/vertical only) stays straight
- Elements entering/exiting screen move on single axis

#### Choreography

- **Stagger**: Offset timing for related elements (20-40ms between)
- **Cascade**: Sequential reveal from a focal point
- **Shared motion**: Elements that move together maintain relationship

### Transition Patterns

#### Container Transform

Best for: Navigation from card/list item to detail screen

- Origin container morphs into destination
- Maintains visual continuity
- Content fades during transformation

#### Shared Axis

Best for: Same-level navigation (tabs, stepper)

| Axis | Direction | Usage |
|------|-----------|-------|
| X-axis | Horizontal | Tabs, horizontal paging |
| Y-axis | Vertical | Vertical lists, feeds |
| Z-axis | Depth | Parent-child relationships |

#### Fade Through

Best for: Unrelated screen transitions

- Outgoing content fades out
- Incoming content fades in
- Brief overlap period
- No shared elements

#### Fade

Best for: Show/hide single elements

- Simple opacity change
- Optionally combine with scale
- Quick duration (100-200ms)

### Component-Specific Motion

#### FAB

| State | Animation |
|-------|-----------|
| Appear | Scale up + fade in |
| Disappear | Scale down + fade out |
| Transform | Morph to extended FAB |
| Press | Elevation change (3dp → 8dp) |

#### Bottom Sheet

| State | Animation |
|-------|-----------|
| Expand | Slide up with decelerate curve |
| Collapse | Slide down with accelerate curve |
| Dismiss | Swipe down with velocity-based duration |

#### Navigation

| Pattern | Animation |
|---------|-----------|
| Push | Incoming slides from right, outgoing shifts left |
| Pop | Incoming slides from left, outgoing shifts right |
| Modal | Slide up from bottom |

#### Cards

| State | Animation |
|-------|-----------|
| Expand | Container transform to detail |
| Press | Subtle elevation increase |
| Reorder | Follow finger with physics |

### Loading & Progress

#### Indeterminate Indicators

- Use for unknown duration
- Continuous, looping animation
- M3 Expressive: Customizable waveform and thickness

#### Determinate Indicators

- Use when progress is measurable
- Smooth, linear progression
- Update frequently for responsiveness

#### Skeleton Screens

- Show layout structure immediately
- Subtle shimmer animation
- Replace with content as it loads

### Accessibility Considerations

#### Reduced Motion

- Respect prefers-reduced-motion setting
- Provide alternatives:
  - Instant transitions (no animation)
  - Simple fade instead of complex motion
  - Static loading indicators

#### Motion Duration

- Keep essential feedback < 100ms
- Avoid motion that could trigger vestibular issues
- Test with motion sensitivity settings enabled

### Implementation Notes

#### Android Animation APIs

| API | Usage |
|-----|-------|
| MotionLayout | Complex, coordinated animations |
| Transition | Activity/Fragment transitions |
| Animator | Property animations |
| AnimatedContent | Compose content transitions |
| animateContentSize | Compose size changes |

#### Performance Tips

- Use hardware layers for complex animations
- Avoid animating layout properties (use transform)
- Profile with GPU rendering tools
- Target 60 FPS (16ms per frame)

---

*Flutter and Material Design are trademarks of Google LLC.*

*UIKit, Core Animation, and Apple are trademarks of Apple Inc.*
