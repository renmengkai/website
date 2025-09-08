# Dinosaur Encyclopedia – Fresh Demo

This project demonstrates how to run a [Fresh](https://fresh.deno.dev/)
application with [Deno](https://deno.com). It's a complete tutorial example
showing how to set up, develop, and deploy a Fresh app in the Deno runtime
environment.

## Make it your own!

You can deploy your own version of this Fresh app to Deno Deploy immediately.
Just click the button to clone and deploy.

[![Deploy on Deno](https://deno.com/button)](https://app.deno.com/new?clone=https://github.com/denoland/tutorial-with-fresh)

## Features

This is a simple dinosaur encyclopedia built with
[Fresh](https://fresh.deno.dev/), demoing modern Fresh features:

- **Detail pages** for each dinosaur
- **Reusable components** for styled links and buttons
- **Interactive "Favorite" button** using Fresh islands
- **List of dinosaurs** from a JSON file (could be from an API or database)

## Getting Started

To run this project locally, run the following command:

```bash
deno task dev
```

This will start a local server, and watch the project directory and restart as
necessary.

Visit [http://localhost:5173](http://localhost:5173) to view the app.

## Project Structure

- `routes/` – Pages and API routes
- `components/` – Reusable UI components (e.g., `LinkButton`)
- `islands/` – Interactive islands (e.g., `FavoriteButton`)
- `static/` – Static assets and styles

## Learn More

- Fresh documentation: https://fresh.deno.dev/docs/getting-started

---

Made with [Fresh](https://fresh.deno.dev/) and Deno 🦕
