# Shayan Umar 3D Portfolio

A 3D developer portfolio built with React, Vite, Tailwind CSS, React Three Fiber, and Three.js. The site presents Shayan Umar's AI engineering profile, skills, work experience, selected projects, and a contact form.

## Features

- Interactive 3D landing page with animated models
- About section with AI, ML, and LLM-focused skill icons
- Work experience timeline for IR Solutions
- Project showcase for healthcare AI, RAG, and LLM work
- Contact form powered by EmailJS
- Responsive layout for desktop and mobile

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Three.js
- React Three Fiber
- React Three Drei
- React Vertical Timeline Component
- EmailJS

## Project Structure

```text
src/
  assets/
    3d/
    icons/
    images/
  components/
  hooks/
  models/
  pages/
  constants/
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Contact Form Setup

The contact page uses EmailJS. Create a `.env` file in the project root and add:

```env
VITE_APP_EMAILJS_SERVICE_ID=your_service_id
VITE_APP_EMAILJS_TEMPLATE_ID=your_template_id
VITE_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

The current contact form sends these template variables:

- `from_name`
- `from_email`
- `to_name`
- `to_email`
- `message`

## Current Portfolio Content

### Skills highlighted

- Python
- JavaScript
- PyTorch
- TensorFlow
- FastAPI
- LangChain
- LlamaIndex
- RAG
- Docker
- AWS
- PostgreSQL
- Hugging Face

## Notes

- Some skills use custom local SVG assets generated for lightweight bundle size.
- The project may still show Vite chunk-size warnings during production builds because of the 3D assets and scene dependencies.

## Author

Shayan Umar

- GitHub: https://github.com/umargithub555
- LinkedIn: https://www.linkedin.com/in/shayan-umar
