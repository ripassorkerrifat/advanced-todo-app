## Advanced Offline Todo App

An offline‑first, single‑device task manager built with **Expo + React Native + TypeScript**.  
All data (tasks, profile, preferences) lives in **AsyncStorage** – no backend, no analytics, no hidden sync.

The app is designed to feel like a real, hand‑crafted product: opinionated, fast, and focused on daily use.

---

## Core features

-    **Tasks**

     -    Title, description, optional notes (markdown‑friendly text area)
     -    Category: Work, Personal, Study
     -    Priority: Low, Medium, High
     -    Optional due date
     -    Completed / pending state with timestamps

-    **Task list**

     -    Fast `FlatList` with swipe gestures:
          -    Swipe right → complete
          -    Swipe left → delete with undo snackbar
     -    Long‑press context menu (edit / complete / delete)
     -    Batch mode: select multiple tasks, bulk complete or delete
     -    Compact stats row (Pending / Done / Overdue)

-    **Search & filters**

     -    Live search across title, description and notes
     -    Highlighted matches in the list
     -    Category / priority search filters
     -    Filter bar (All, Pending, Completed, Overdue)
     -    Sort by created date, priority or due date
     -    Dedicated **Filter & Sort** bottom sheet, triggered from the search bar

-    **Notes**

     -    Rich notes field in the task form
     -    Monospace input with character count
     -    “Has notes” indicator in the list item

-    **Profile**

     -    On first run, onboarding flow asks for:
          -    Name
          -    Email
          -    Phone
     -    Data is stored locally and can be updated in Profile screen

-    **Settings**

     -    Theme: Light / Dark / System
     -    Task statistics (total, completed, pending)
     -    “Clear All Tasks” button
     -    “Reset App Data (testing)” button:
          -    Clears tasks, profile, onboarding flag and theme preference
          -    App behaves like a fresh install

-    **Security & onboarding**
     -    **Biometric gate** using `expo-local-authentication`
          -    Fingerprint / Face ID / device passcode
          -    If biometrics aren’t available or enrolled, the app just opens
     -    **Onboarding screens**
          -    Hero image with curved bottom edge
          -    Step 1: collect name, email, phone (required for brand‑new users)
          -    Step 2–3: explain features and gestures

---

## Tech stack

-    **App shell**: Expo, React Native, TypeScript
-    **Navigation**: Expo Router (file‑based routing under `app/`)
-    **State management**:
     -    `TaskContext` – tasks, filters, search, batch actions
     -    `ThemeContext` – theme mode + current theme
     -    `ProfileContext` – user profile
-    **Storage**:
     -    `services/storage.ts` – tasks in AsyncStorage
     -    `services/profileStorage.ts` – profile in AsyncStorage
-    **UI utilities**:
     -    `ThemedText`, `ThemedView` – theme‑aware typography and containers
     -    `IconSymbol` – SF Symbols‑style names mapped to MaterialIcons
     -    `EmptyState`, `UndoSnackbar`, `TaskContextMenu`, `TaskItem`, `TaskForm`

---

## Project structure (simplified)

-    `app/`

     -    `_layout.tsx` – root navigation, providers, biometric + onboarding gates
     -    `(tabs)/`
          -    `index.tsx` – Home (task list, stats, search, filter sheet)
          -    `profile.tsx` – profile display/update
          -    `settings.tsx` – theme, stats, data management
     -    `add-task.tsx` – add task screen
     -    `edit-task.tsx` – edit task screen

-    `components/`

     -    `onboarding/OnboardingGate.tsx`
     -    `security/BiometricGate.tsx`
     -    `tasks/TaskItem.tsx`, `TaskForm.tsx`, `EmptyState.tsx`, `UndoSnackbar.tsx`, etc.
     -    `ui/icon-symbol.tsx`, `themed-text.tsx`, `themed-view.tsx`

-    `store/`

     -    `TaskContext.tsx`
     -    `ThemeContext.tsx`
     -    `ProfileContext.tsx`

-    `services/`

     -    `storage.ts`
     -    `profileStorage.ts`

-    `types/`
     -    `task.ts`
     -    `profile.ts`

---

## Running the app

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npx expo start
```

You can then open the app in:

-    iOS Simulator
-    Android Emulator
-    A physical device using Expo Go

---

## Deploying to a real Android device (EAS Build)

This project is configured to use **EAS Build** for Android. Below is the basic flow.

### First‑time setup & first build

1. Install the EAS CLI:

     ```bash
     npm install -g eas-cli
     ```

2. Log in to your Expo account:

     ```bash
     eas login
     ```

3. Configure EAS for this project (one‑time):

     ```bash
     eas build:configure
     ```

     When prompted for platforms, you can start with **Android**.

4. Create your first Android build:

     ```bash
     eas build --platform android --profile preview
     ```

     - Choose an Android application id (e.g. `com.yourname.advancedtodoapp`).
     - EAS will generate and manage the keystore for you.
     - When the build finishes, Expo will give you a link and QR code you can use to install the app on a real device.

### After you change code – how to update the installed app

The APK/AAB produced by EAS is a snapshot of your code at build time.  
If you change anything and want those changes on your device:

1. Make and save your changes locally.
2. (Optional) Test locally:

     ```bash
     npx expo start
     ```

3. Trigger a new build:

     ```bash
     eas build --platform android --profile preview
     ```

4. Wait for the build to complete, then install the **new** build link on your device.

Each time you want the installed app to reflect new code, you create a new EAS build.

> You can later introduce **EAS Update** for over‑the‑air JS updates, but this project currently keeps it simple: code changes are shipped via new builds.

---

## Notes

-    The app is intentionally **offline‑only**. If you need sync or collaboration later, you can layer a backend on top of the existing contexts and storage services.
-    The UI is tuned for both light and dark themes with a purple primary palette and dark blue‑black background on dark mode.
