# Event Harmony

"Create a modern event management app with a clean, minimal design. Include features for adding tasks, marking them complete, organizing by categories, and a dark mode toggle. Use a calming purple and white color scheme."Project Overview

Project Name: EventFlow — Event Management App

Purpose:
A modern event management application that helps users plan and manage events by organizing tasks, tracking progress, and grouping work into categories.

Design Direction:

 Clean and minimal interface

 Calming purple + white color palette

 Rounded cards and subtle shadows

 Simple, intuitive navigation

 Responsive desktop and mobile layouts

 Light mode and dark mode

 Focus on task management and event progress

Main Features

FeatureDescriptionDashboardOverview of event progress and upcoming tasksTask ManagementCreate, edit, delete, and complete tasksCategoriesOrganize tasks by event-related categoriesProgress TrackingDisplay completed vs. remaining tasksDark ModeSwitch between light and dark themesEvent ManagementCreate and manage individual eventsResponsive DesignWorks across desktop, tablet, and mobile

Step-by-Step Development

Step 1 — Create the App Structure

Set up the main application with:

 Sidebar/navigation

 Top header

 Main content area

 Dashboard

 Tasks page

 Categories page

 Settings/theme controls

Basic structure:

EventFlow
│
├── Dashboard
├── Tasks
├── Categories
├── Events
└── Settings

Step 2 — Design the Dashboard

Create a clean dashboard showing:

 Welcome message

 Current event

 Total tasks

 Completed tasks

 Overall progress

 Today's tasks

 Upcoming deadlines

 Quick + Add Task button

Example:

Good evening 👋

Wedding Celebration
June 24, 2026

┌─────────────┐  ┌─────────────┐
│ 24 Tasks    │  │ 72% Complete│
└─────────────┘  └─────────────┘

Today's Tasks                         + Add Task

○ Confirm catering          Catering
○ Send invitations          Guests
✓ Book photographer        Marketing
○ Confirm venue             Venue

Step 3 — Build Task Management

Users should be able to:

 Click Add Task

 Enter the task name

 Select a category

 Choose a due date

 Add optional notes

 Save the task

Each task should have:

 Checkbox

 Task name

 Category

 Due date

 Edit button

 Delete button

When completed, the task should become visually muted and crossed out.

Step 4 — Add Categories

Create predefined categories such as:

 🏛 Venue

 🍽 Catering

 👥 Guests

 📣 Marketing

 🚚 Logistics

 💰 Budget

Users can filter tasks by category.

Example:

Categories

Venue          5 tasks
Catering       8 tasks
Guests         6 tasks
Marketing      3 tasks
Logistics      4 tasks

Step 5 — Add Event Management

Allow users to create an event with:

 Event name

 Event date

 Location

 Description

 Event image

 Tasks associated with the event

Example:

Wedding Celebration

📅 June 24, 2026
📍 Johannesburg

Progress
████████████░░░ 72%

24 Tasks
17 Completed
7 Remaining

Step 6 — Add Dark Mode

Place a theme toggle in the header:

☀️ Light / 🌙 Dark

Light mode:

Background: White
Cards: Light lavender
Primary: Purple
Text: Dark charcoal

Dark mode:

Background: #15121A
Cards: #211C29
Primary: Soft purple
Text: White

The transition between themes should feel smooth and consistent across the entire application.

Step 7 — Create the Add Task Modal

When the user clicks + Add Task, display a simple modal:

┌───────────────────────────────┐
│       Add New Task            │
│                               │
│ Task name                     │
│ ┌───────────────────────────┐ │
│ │ Confirm catering          │ │
│ └───────────────────────────┘ │
│                               │
│ Category                      │
│ [ Catering             ▼ ]    │
│                               │
│ Due date                      │
│ [ June 12, 2026        📅 ]  │
│                               │
│ Notes                         │
│ ┌───────────────────────────┐ │
│ │                           │ │
│ └───────────────────────────┘ │
│                               │
│ [ Cancel ]       [ Add Task ] │
└───────────────────────────────┘

Step 8 — Add Progress Tracking

Calculate progress automatically:

Progress = Completed Tasks ÷ Total Tasks × 100

Display it using:

 Progress bars

 Percentage

 Completed/remaining counters

 Category-level progress

Step 9 — Make the Interface Responsive

Desktop:
Sidebar + large dashboard.

Tablet:
Compact sidebar + responsive cards.

Mobile:
Bottom navigation + stacked cards + full-width task lists.

Step 10 — Final UI Polish

Finish the interface with:

 Consistent purple accent color

 Rounded buttons

 Subtle animations

 Hover states

 Empty states

 Loading states

 Confirmation dialogs

 Accessible contrast

 Clear typography

 Responsive spacing

Final User Flow

Open App
   ↓
Dashboard
   ↓
Create Event
   ↓
Add Tasks
   ↓
Assign Categories
   ↓
Set Due Dates
   ↓
Complete Tasks
   ↓
Track Progress
   ↓
Switch Light / Dark Mode
   ↓
Event Successfully Organized

Recommended app name: EventFlow

Tagline: Plan less. Organize better. Celebrate more.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://violet-plans-pro.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/20bc50c0-1046-4505-955e-688731515dd8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
