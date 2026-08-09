# Navigation Reference

Expo Router file-based navigation (React Native), GoRouter navigation (Flutter), and UIKit navigation patterns (iOS).

## Expo Router (React Native)

### File Conventions

```
app/
  _layout.tsx              Root layout (providers, NativeTabs)
  index.tsx                → /
  about.tsx                → /about
  user/
    [id].tsx               → /user/:id
    [id]/
      posts.tsx            → /user/:id/posts
  (tabs)/
    _layout.tsx            Tab navigator (group, not in URL)
    home.tsx               → /home
    profile.tsx            → /profile
  (index,search)/
    _layout.tsx            Shared Stack for both tabs
    index.tsx              → /
    search.tsx             → /search
    i/[id].tsx             → /i/:id (shared detail screen)
  api/
    users+api.ts           → /api/users (server route)
```

**Rules**:
- Routes live only in `app/` — never co-locate components, types, or utils there
- Always have a route matching `/` (may be inside a group)
- Remove old route files when restructuring navigation
- Use kebab-case filenames

### Root Layout (Stack)

```tsx
// app/_layout.tsx — root is always a Stack
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerLargeTitle: true,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="user/[id]" options={{ headerLargeTitle: false }} />
    </Stack>
  );
}
```

**Always set page title via `Stack.Screen options.title`**, never use a custom Text element as a title.

### Tabs — Which to Use

| Scenario | Use |
|----------|-----|
| Custom design system, cross-platform | **JS Tabs** (stable, fully customizable) |
| iOS-native look, Liquid Glass (iOS 26+) | **NativeTabs** (alpha, limited customization) |

### JS Tabs

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
```

### NativeTabs (alpha, iOS 18+)

> Alpha API — all tabs render at once, limited customization, max 5 tabs on Android. Use when you want native iOS look (Liquid Glass, native blur/transitions) without rebuilding it yourself.

```tsx
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function Layout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(index)">
        <NativeTabs.Trigger.Icon sf="house" />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)">
        <NativeTabs.Trigger.Icon sf="person" />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
```

### Shared Stack for Multiple Tabs

```tsx
// app/(index,search)/_layout.tsx — shared Stack for both index and search tabs
import { Stack } from "expo-router/stack";

const tabLabels: Record<string, string> = { index: "Home", search: "Explore" };

export default function Layout({ segment }: { segment: string }) {
  const activeTab = segment.replace(/[()]/g, "");

  return (
    <Stack screenOptions={{ headerLargeTitle: true, headerBackButtonDisplayMode: "minimal" }}>
      <Stack.Screen name={activeTab} options={{ title: tabLabels[activeTab] }} />
      <Stack.Screen name="i/[id]" options={{ headerLargeTitle: false }} />
    </Stack>
  );
}
```

### Link Component

```tsx
import { Link } from "expo-router";

// Basic navigation
<Link href="/about">About</Link>

// Dynamic routes
<Link href={`/user/${userId}`}>Profile</Link>

// Wrapping custom component
<Link href="/settings" asChild>
  <Pressable><Text>Settings</Text></Pressable>
</Link>
```

### Programmatic Navigation

```tsx
import { useRouter, useLocalSearchParams } from "expo-router";

const router = useRouter();
router.push("/settings");
router.replace("/login");   // No back button
router.back();

// Access route params
const { id } = useLocalSearchParams<{ id: string }>();
```

### Modals & Sheets

```tsx
// Modal presentation
<Stack.Screen options={{ presentation: "modal" }} />

// Form sheet with detents
<Stack.Screen
  options={{
    presentation: "formSheet",
    sheetGrabberVisible: true,
    sheetAllowedDetents: [0.5, 1.0],
    contentStyle: { backgroundColor: "transparent" }, // Liquid glass on iOS 26+
  }}
/>
```

### Context Menus on Links

```tsx
<Link href="/settings" asChild>
  <Link.Trigger>
    <Pressable><Card /></Pressable>
  </Link.Trigger>
  <Link.Menu>
    <Link.MenuAction
      title="Share"
      icon="square.and.arrow.up"
      onPress={handleShare}
    />
    <Link.MenuAction
      title="Delete"
      icon="trash"
      destructive
      onPress={handleDelete}
    />
    <Link.Menu title="More" icon="ellipsis">
      <Link.MenuAction title="Copy" icon="doc.on.doc" onPress={() => {}} />
    </Link.Menu>
  </Link.Menu>
</Link>
```

### Link Previews (iOS only, requires Expo SDK 54+)

```tsx
<Link href="/detail">
  <Link.Trigger>
    <Pressable><Card /></Pressable>
  </Link.Trigger>
  <Link.Preview />  {/* Shows peek preview on 3D touch / long press */}
</Link>
```

### Header Search Bar

```tsx
// In Stack.Screen — preferred over building custom search UI
<Stack.Screen
  options={{
    headerSearchBarOptions: {
      placeholder: "Search...",
      onChangeText: (e) => setQuery(e.nativeEvent.text),
      onCancelButtonPress: () => setQuery(""),
    },
  }}
/>
```

### Deep Linking

```json
// app.json
{
  "expo": {
    "scheme": "myapp",
    "ios": {
      "associatedDomains": ["applinks:myapp.example.com"]
    },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [{ "scheme": "https", "host": "myapp.example.com" }],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

Expo Router handles deep links automatically — `/user/123` maps to `app/user/[id].tsx`.

### ScrollView in Routes

When a route belongs to a Stack, its first child should almost always be a ScrollView:

```tsx
export default function HomeScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {/* Content */}
    </ScrollView>
  );
}
```

Use `contentInsetAdjustmentBehavior="automatic"` on `ScrollView`, `FlatList`, and `SectionList` — this handles safe areas and header insets automatically. Prefer it over `<SafeAreaView>`.

## GoRouter (Flutter)

### Basic Setup

```dart
import 'package:go_router/go_router.dart';

final goRouter = GoRouter(
  initialLocation: '/',
  debugLogDiagnostics: true,
  redirect: (context, state) {
    final isLoggedIn = /* check auth state */;
    final isAuthRoute = state.matchedLocation.startsWith('/auth');
    
    if (!isLoggedIn && !isAuthRoute) {
      return '/auth/login';
    }
    if (isLoggedIn && isAuthRoute) {
      return '/';
    }
    return null;
  },
  routes: [
    GoRoute(
      path: '/',
      name: 'home',
      builder: (context, state) => const HomeScreen(),
      routes: [
        GoRoute(
          path: 'details/:id',
          name: 'details',
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            final extra = state.extra as Map<String, dynamic>?;
            return DetailsScreen(id: id, title: extra?['title']);
          },
        ),
      ],
    ),
    GoRoute(
      path: '/auth/login',
      name: 'login',
      builder: (context, state) => const LoginScreen(),
    ),
  ],
);
```

### App Integration

```dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: goRouter,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      themeMode: ThemeMode.system,
    );
  }
}
```

### Navigation Methods

```dart
// Navigate and replace entire stack
context.go('/details/123');

// Navigate and add to stack (can go back)
context.push('/details/123');

// Go back
context.pop();

// Go back with result
context.pop(result);

// Replace current route
context.pushReplacement('/home');

// Navigate with extra data
context.push('/details/123', extra: {'title': 'Item Title'});

// Navigate by name
context.goNamed('details', pathParameters: {'id': '123'});
context.pushNamed('details', pathParameters: {'id': '123'}, extra: data);
```

#### Navigation Reference

| Method | Behavior |
|--------|----------|
| `context.go()` | Navigate, replace entire stack |
| `context.push()` | Navigate, add to stack |
| `context.pop()` | Go back one level |
| `context.pushReplacement()` | Replace current route |
| `context.goNamed()` | Navigate by route name |
| `context.canPop()` | Check if can go back |

### Shell Routes (Persistent UI)

```dart
final goRouter = GoRouter(
  routes: [
    ShellRoute(
      builder: (context, state, child) {
        return ScaffoldWithNavBar(child: child);
      },
      routes: [
        GoRoute(
          path: '/home',
          builder: (_, __) => const HomeScreen(),
        ),
        GoRoute(
          path: '/search',
          builder: (_, __) => const SearchScreen(),
        ),
        GoRoute(
          path: '/profile',
          builder: (_, __) => const ProfileScreen(),
        ),
      ],
    ),
  ],
);

class ScaffoldWithNavBar extends StatelessWidget {
  final Widget child;
  
  const ScaffoldWithNavBar({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _calculateSelectedIndex(context),
        onDestinationSelected: (index) => _onItemTapped(index, context),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.search), label: 'Search'),
          NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
  
  int _calculateSelectedIndex(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    if (location.startsWith('/home')) return 0;
    if (location.startsWith('/search')) return 1;
    if (location.startsWith('/profile')) return 2;
    return 0;
  }
  
  void _onItemTapped(int index, BuildContext context) {
    switch (index) {
      case 0: context.go('/home');
      case 1: context.go('/search');
      case 2: context.go('/profile');
    }
  }
}
```

### Query Parameters

```dart
GoRoute(
  path: '/search',
  builder: (context, state) {
    final query = state.uri.queryParameters['q'] ?? '';
    final page = int.tryParse(state.uri.queryParameters['page'] ?? '1') ?? 1;
    return SearchScreen(query: query, page: page);
  },
),

// Navigate with query params
context.go('/search?q=flutter&page=2');
context.goNamed('search', queryParameters: {'q': 'flutter', 'page': '2'});
```

### Riverpod Integration

```dart
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);
  
  return GoRouter(
    refreshListenable: authState,
    redirect: (context, state) {
      final isLoggedIn = authState.isAuthenticated;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');
      
      if (!isLoggedIn && !isAuthRoute) return '/auth/login';
      if (isLoggedIn && isAuthRoute) return '/';
      return null;
    },
    routes: [...],
  );
});

// In app.dart
class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    return MaterialApp.router(routerConfig: router);
  }
}
```

### Error Handling

```dart
final goRouter = GoRouter(
  errorBuilder: (context, state) {
    return ErrorScreen(error: state.error);
  },
  routes: [...],
);
```

### Deep Linking

Deep links work automatically when routes are configured with path parameters:

```dart
// URL: myapp://details/123
// or: https://myapp.com/details/123
GoRoute(
  path: '/details/:id',
  builder: (context, state) => DetailsScreen(id: state.pathParameters['id']!),
),
```

### Best Practices

| Do | Don't |
|----|-------|
| Use named routes for maintainability | Hardcode paths everywhere |
| Use `push()` for detail screens | Use `go()` for all navigation |
| Pass simple data via `extra` | Pass complex objects via URL |
| Use redirect for auth guards | Check auth in every screen |
| Use ShellRoute for persistent UI | Rebuild nav bar in every screen |

## iOS (UIKit)

### Tab-Based Navigation

For apps with 3-5 main sections:

```swift
class AppTabBarController: UITabBarController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let homeNav = UINavigationController(rootViewController: HomeVC())
        homeNav.tabBarItem = UITabBarItem(
            title: "Home",
            image: UIImage(systemName: "house"),
            selectedImage: UIImage(systemName: "house.fill")
        )
        
        let searchNav = UINavigationController(rootViewController: SearchVC())
        searchNav.tabBarItem = UITabBarItem(
            title: "Search",
            image: UIImage(systemName: "magnifyingglass"),
            tag: 1
        )
        
        let profileNav = UINavigationController(rootViewController: ProfileVC())
        profileNav.tabBarItem = UITabBarItem(
            title: "Profile",
            image: UIImage(systemName: "person"),
            selectedImage: UIImage(systemName: "person.fill")
        )
        
        viewControllers = [homeNav, searchNav, profileNav]
    }
}
```

#### Tab Bar Best Practices

| Principle | Description |
|-----------|-------------|
| Limit count | Maximum 5 tabs, use More for additional |
| Always visible | Tab bar stays visible at all navigation levels |
| State preservation | Preserve navigation state when switching tabs |
| Icon choice | Use SF Symbols, provide selected/unselected states |

### Navigation Controller

Use large titles for root views:

```swift
class ListViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Items"
        navigationController?.navigationBar.prefersLargeTitles = true
        navigationItem.largeTitleDisplayMode = .always
    }
    
    func pushDetail(_ item: Item) {
        let detail = DetailViewController(item: item)
        detail.navigationItem.largeTitleDisplayMode = .never
        navigationController?.pushViewController(detail, animated: true)
    }
}
```

#### Navigation Bar Configuration

```swift
class CustomNavigationController: UINavigationController {
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let appearance = UINavigationBarAppearance()
        appearance.configureWithDefaultBackground()
        
        navigationBar.standardAppearance = appearance
        navigationBar.scrollEdgeAppearance = appearance
        navigationBar.compactAppearance = appearance
    }
}
```

#### Navigation Bar Buttons

```swift
override func viewDidLoad() {
    super.viewDidLoad()
    
    navigationItem.rightBarButtonItem = UIBarButtonItem(
        image: UIImage(systemName: "plus"),
        style: .plain,
        target: self,
        action: #selector(addItem)
    )
    
    navigationItem.rightBarButtonItems = [
        UIBarButtonItem(systemItem: .add, primaryAction: UIAction { _ in }),
        UIBarButtonItem(systemItem: .edit, primaryAction: UIAction { _ in })
    ]
}
```

### Modal Presentation

#### Sheet Presentation

```swift
func presentEditor() {
    let editorVC = EditorViewController()
    let nav = UINavigationController(rootViewController: editorVC)
    
    editorVC.navigationItem.leftBarButtonItem = UIBarButtonItem(
        systemItem: .cancel, target: self, action: #selector(dismissEditor)
    )
    editorVC.navigationItem.rightBarButtonItem = UIBarButtonItem(
        systemItem: .done, target: self, action: #selector(saveAndDismiss)
    )
    
    if let sheet = nav.sheetPresentationController {
        sheet.detents = [.medium(), .large()]
        sheet.prefersGrabberVisible = true
        sheet.prefersScrollingExpandsWhenScrolledToEdge = false
    }
    
    present(nav, animated: true)
}
```

#### Custom Detent (iOS 16+)

```swift
if let sheet = nav.sheetPresentationController {
    let customDetent = UISheetPresentationController.Detent.custom { context in
        return context.maximumDetentValue * 0.4
    }
    sheet.detents = [customDetent, .large()]
}
```

#### Full Screen Presentation

```swift
func presentFullScreen() {
    let vc = FullScreenViewController()
    vc.modalPresentationStyle = .fullScreen
    vc.modalTransitionStyle = .coverVertical
    present(vc, animated: true)
}
```

### Presentation Styles

| Style | Usage |
|-------|-------|
| `.automatic` | System default (usually sheet) |
| `.pageSheet` | Card-style, parent view visible |
| `.fullScreen` | Full screen cover |
| `.overFullScreen` | Full screen with transparent background |
| `.popover` | iPad popover |

### Navigation Best Practices

1. **Back gesture** - Ensure edge swipe back always works
2. **State restoration** - Use `UIStateRestoring` to save navigation stack
3. **Depth limit** - Avoid more than 4-5 navigation levels
4. **Cancel button** - Modal views must provide a cancel option
5. **Save confirmation** - Show confirmation dialog for unsaved changes

---

*UIKit, SF Symbols, and Apple are trademarks of Apple Inc.*

*GoRouter is an open-source navigation package for Flutter.*
