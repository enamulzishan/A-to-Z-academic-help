# A to Z Academic Help 🎓

A professional academic consultation and support website built with modern web technologies. This platform offers services for students and researchers (from Level 3 to PhD) such as research proposals, university applications, and direct academic support.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend/Forms**: Google Apps Script (Google Sheets integration)
- **Language**: TypeScript

## ✨ Key Features

- **Modern & Responsive UI**: Built with Tailwind CSS and enhanced with Framer Motion animations.
- **Lead Generation Forms**: Contact pages and checklist downloads that submit data directly to a Google Sheet via a custom Apps Script endpoint.
- **Direct PDF Downloads**: Users can download resources (like the Research Proposal Checklist) instantly upon providing their email.
- **Global Components**: Includes a sticky WhatsApp widget, cookie consent banner, and breadcrumb navigation.
- **MDX Support**: Configured for Markdown/MDX content rendering.

## 📂 Project Structure (Where is everything?)

Understanding the codebase layout:

```text
📦 a-to-z-academic-help
 ┣ 📂 public               # Static files: images, logos, and downloadable PDFs (e.g., research-proposal-checklist.pdf)
 ┣ 📂 src
 ┃ ┣ 📂 app                # Next.js App Router (All Page Routes)
 ┃ ┃ ┣ 📂 about            # About Us page
 ┃ ┃ ┣ 📂 contact          # Main Contact page & Form
 ┃ ┃ ┣ 📂 faq              # Frequently Asked Questions
 ┃ ┃ ┣ 📂 legal            # Privacy, Terms, Cookie Policies
 ┃ ┃ ┣ 📂 resources        # Academic resources and guides
 ┃ ┃ ┣ 📂 services         # Detailed service pages (PhD support, proposals, etc.)
 ┃ ┃ ┣ 📂 team             # Team/Experts profiles
 ┃ ┃ ┣ 📜 layout.tsx       # Root layout containing the Header, Footer, WhatsApp widget, etc.
 ┃ ┃ ┗ 📜 page.tsx         # The main Homepage
 ┃ ┃
 ┃ ┣ 📂 components         # Reusable React Components
 ┃ ┃ ┣ 📂 blog             # MDX rendering components (Table of contents, etc.)
 ┃ ┃ ┣ 📂 home             # Homepage specific sections (Hero, etc.)
 ┃ ┃ ┣ 📂 layout           # Header.tsx and Footer.tsx
 ┃ ┃ ┣ 📂 services         # Service-specific UI blocks
 ┃ ┃ ┗ 📂 ui               # Shared UI pieces (ChecklistDownloadSection, Breadcrumbs, SecureBadge, CookieBanner, etc.)
 ┃ ┃
 ┃ ┗ 📜 middleware.ts      # (If applicable) Next.js routing middleware
 ┣ 📜 .env.local           # Environment variables (Google Script URLs, etc.)
 ┗ 📜 package.json         # Project dependencies and scripts
```

## ⚙️ Setup & Installation

1. **Clone the repository** (if you haven't already).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Create a `.env.local` file in the root directory and add your Google Apps Script URL for form submissions:
   ```env
   NEXT_PUBLIC_GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

## 📝 Form Submissions Architecture

The forms on this website (`/contact` and the `ChecklistDownloadSection`) do not use a traditional database. Instead, they send a `POST` request to a **Google Apps Script** URL. 

- **Contact Form**: Sends `formType="contact"` and fills a 9-column structure in the "Contact Submissions" Google Sheet tab.
- **Checklist Form**: Sends `formType="checklist"` and automatically triggers a local PDF download (`/research-proposal-checklist.pdf`) while simultaneously logging the email in the "Checklist Downloads" tab.

*(To modify the Google Sheet logic, you must edit the `doPost` function directly in the Extensions > Apps Script panel of the connected Google Sheet).*
