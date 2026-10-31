# Recipe Book — React Recipe App

A simple recipe app built with React (Vite) for the *Developing a Recipe App Using Gen AI-Assisted Code Generation* course project.

## Features

- **Recipe list** — every recipe shown as a card with category, total time, servings and cuisine.
- **Recipe detail** — a detail card for each recipe with prep/cook/total time, servings, difficulty, ingredients, step-by-step instructions and tags.
- **Search** — searches name, description, cuisine, category, tags and ingredients. Multi-word queries match recipes that contain every word. You can also filter by category. The search is stored in the URL, so it survives going back from a detail page, and clicking a tag runs a search for it.
- **Add recipes** — a validated form for adding new recipes. They are saved in `localStorage`, so they persist between visits.
- **Sample data** — 12 recipes from Italian, Indian, Thai, Mexican, Japanese, Greek, Chinese and American cuisine.
- Responsive layout for desktop and mobile.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run lint     # lint with oxlint
```

## Project structure

```
src/
├── App.jsx                     # Routes + recipe state (sample + user-added)
├── App.css                     # App styles
├── index.css                   # Global styles / theme variables
├── data/
│   └── recipes.js              # Sample recipe data
└── components/
    ├── Header.jsx              # Top navigation
    ├── RecipeList.jsx          # List page with search + filtering
    ├── SearchBar.jsx           # Search input + category select
    ├── RecipeCard.jsx          # Card shown in the grid
    ├── RecipeDetail.jsx        # Recipe detail component
    ├── AddRecipeForm.jsx       # Form to add more recipes
    └── NotFound.jsx            # 404 / missing recipe
```

## Routes

| Path           | Page                 |
| -------------- | -------------------- |
| `/`            | All recipes + search |
| `/recipes/:id` | Recipe detail        |
| `/add`         | Add a new recipe     |

## Tech stack

React 19 · React Router 7 · Vite · oxlint. Project scaffolded with `npx create-vite@latest recipe-app --template react`.
