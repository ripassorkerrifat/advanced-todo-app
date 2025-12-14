# Advanced Todo App - Architecture Documentation

## 📁 Folder Structure

The app follows an **industry-standard, feature-based architecture** with clear separation of concerns:

```
advanced-todo-app/
├── app/                    # Expo Router screens (file-based routing)
│   ├── (tabs)/            # Tab navigation group
│   │   ├── index.tsx      # Main task list screen
│   │   └── settings.tsx   # Settings screen
│   ├── add-task.tsx       # Add task modal screen
│   ├── edit-task.tsx      # Edit task modal screen
│   └── _layout.tsx        # Root layout with TaskProvider
│
├── components/            # Reusable UI components
│   └── tasks/            # Task-specific components
│       ├── TaskItem.tsx          # Task list item with swipe-to-delete
│       ├── TaskForm.tsx          # Reusable form for add/edit
│       ├── PriorityBadge.tsx     # Priority indicator badge
│       ├── CategoryIndicator.tsx # Category color bar
│       ├── EmptyState.tsx        # Empty state component
│       └── UndoSnackbar.tsx       # Undo notification snackbar
│
├── types/                # TypeScript type definitions
│   └── task.ts           # Task models, enums (Category, Priority, Filter, Sort)
│
├── services/             # Service layer (data persistence)
│   └── storage.ts        # AsyncStorage CRUD operations
│
├── store/                # State management
│   └── TaskContext.tsx   # Context API store for global task state
│
├── utils/                # Utility functions
│   ├── date.ts          # Date formatting and overdue detection
│   └── task.ts           # Task filtering, sorting, color utilities
│
└── hooks/               # Custom React hooks (existing)
```

## 🏗️ Architectural Decisions

### 1. **State Management: Context API**

-    **Why**: No external dependencies, built into React
-    **Implementation**: Centralized `TaskContext` provides all task operations
-    **Benefits**: Avoids prop drilling, single source of truth, easy to test

### 2. **Data Persistence: AsyncStorage Service Layer**

-    **Why**: Abstraction allows easy migration to backend later
-    **Implementation**: `services/storage.ts` handles all CRUD operations
-    **Benefits**: Clean separation, testable, swappable implementation

### 3. **Type Safety: TypeScript Enums & Interfaces**

-    **Why**: Compile-time safety, better IDE support, self-documenting
-    **Implementation**: Strict enums for Category, Priority, Filter, Sort
-    **Benefits**: Prevents invalid values, autocomplete, refactoring safety

### 4. **Component Architecture: Composition & Reusability**

-    **Why**: DRY principle, maintainability, testability
-    **Implementation**:
     -    `TaskForm` used by both Add and Edit screens
     -    Small, focused components (PriorityBadge, CategoryIndicator)
-    **Benefits**: Single responsibility, easy to modify, reusable

### 5. **Swipe-to-Delete with Undo**

-    **Why**: Industry-standard mobile UX pattern
-    **Implementation**:
     -    React Native Gesture Handler + Reanimated for smooth gestures
     -    Optimistic UI update (removes from list immediately)
     -    Undo snackbar with 5-second timeout
     -    Final deletion only after timeout or explicit dismiss
-    **Benefits**: Better UX, prevents accidental deletions

### 6. **Offline-First Architecture**

-    **Why**: Works without network, instant load, better performance
-    **Implementation**: All data in AsyncStorage, loaded on app start
-    **Benefits**: Fast, reliable, works anywhere

## 🔄 Data Flow

```
User Action
    ↓
Screen Component
    ↓
TaskContext Hook (useTasks)
    ↓
Storage Service (AsyncStorage)
    ↓
Context State Update
    ↓
UI Re-render (React)
```

## 🎨 UI/UX Features

1. **Visual Indicators**:

     - Category color bars (left edge)
     - Priority badges (color-coded)
     - Overdue tasks (red date text)

2. **Filtering & Sorting**:

     - Filter: All / Completed / Pending
     - Sort: Due Date / Priority / Created Date

3. **Empty States**:

     - Contextual messages based on filter
     - Icon-based visual feedback

4. **Theme Support**:
     - Light & Dark mode (system-aware)
     - Uses existing theme infrastructure

## 🚀 Key Features Implemented

✅ **Task Management**

-    Create, Read, Update, Delete
-    Toggle completion status
-    Automatic `completedAt` timestamp

✅ **Task Properties**

-    Title (required)
-    Description (optional)
-    Category (Work/Personal/Study)
-    Priority (Low/Medium/High)
-    Due Date (optional, date picker)
-    Auto-generated timestamps

✅ **Persistence**

-    AsyncStorage for offline storage
-    Auto-load on app start
-    Immediate persistence on changes

✅ **Task Status**

-    Overdue detection (compares due date to today)
-    Visual highlighting (red text for overdue)
-    Automatic status calculation

✅ **Organization**

-    Filter by status (All/Completed/Pending)
-    Sort by Due Date/Priority/Created Date
-    Real-time updates

✅ **Swipe Actions**

-    Swipe left to reveal delete button
-    Smooth gesture animations
-    Undo snackbar (5-second window)
-    Optimistic UI updates

✅ **Navigation**

-    Tab navigation (Home, Settings)
-    Modal screens (Add/Edit)
-    Deep linking ready (Expo Router)

✅ **Theme**

-    Light/Dark mode support
-    System theme detection
-    Consistent color scheme

## 📦 Dependencies

-    `@react-native-async-storage/async-storage` - Local persistence
-    `@react-native-community/datetimepicker` - Date picker
-    `react-native-gesture-handler` - Swipe gestures
-    `react-native-reanimated` - Smooth animations
-    `expo-router` - File-based routing

## 🔮 Future Enhancements (Easy to Add)

The architecture supports easy addition of:

-    Backend API integration (swap storage service)
-    Real-time sync (add sync layer)
-    Categories management (extend types)
-    Task templates (reuse TaskForm)
-    Search functionality (add to utils)
-    Notifications (add service layer)
-    Export/Import (add to services)

## 🧪 Testing Strategy

The architecture supports:

-    **Unit Tests**: Utils, services (pure functions)
-    **Integration Tests**: Context store, storage service
-    **Component Tests**: Individual components
-    **E2E Tests**: Full user flows

## 📝 Code Quality

-    ✅ TypeScript strict mode
-    ✅ ESLint configured
-    ✅ Consistent naming conventions
-    ✅ Single responsibility principle
-    ✅ DRY (Don't Repeat Yourself)
-    ✅ Separation of concerns
-    ✅ No prop drilling
-    ✅ Reusable components

---

**Built with**: React Native (Expo) + TypeScript  
**Architecture Pattern**: Feature-based with service layer  
**State Management**: Context API  
**Persistence**: AsyncStorage (offline-first)
