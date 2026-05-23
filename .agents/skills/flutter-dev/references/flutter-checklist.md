# Flutter Implementation Checklist

Standards for verifying widget, state, and navigation implementations.

## Widget Best Practices
- [ ] `const` constructors on all static widgets.
- [ ] Proper `Key` usage on list items.
- [ ] Reusable widgets extracted to separate files.

## State Management
- [ ] Immutable state objects enforced.
- [ ] Granular rebuilds using `select()`.
- [ ] Loading and error states handled in UI.

## Navigation & Networking
- [ ] GoRouter with typed routes and auth guards.
- [ ] Deep linking support configured.
- [ ] Dio/Networking with global error interceptors.

## Testing
- [ ] Unit tests for business logic (Bloc/Notifiers).
- [ ] Widget tests for UI components.
- [ ] Integration tests for critical user flows.
