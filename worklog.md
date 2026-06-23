---
Task ID: 1
Agent: Main Agent
Task: Build a lightweight but visually beautiful web app with login, admin panel, and user view

Work Log:
- Updated Prisma schema with User (username, password, name, role) and Branch (name, targetSent) models
- Pushed schema to SQLite database and generated Prisma client
- Seeded database with admin user (admin/admin123), regular user (user/user123), and 12 branches
- Created API routes: /api/auth/login, /api/auth/logout, /api/auth/session, /api/branches, /api/branches/[id]
- Built beautiful login page with dark gradient background, glass-morphism card, animated particles, and smooth transitions
- Built dashboard with stats cards (total branches, sent, not sent, percentage), branch table with RTL support
- Implemented beautiful animated toggle switches for admin users to change target sent status
- Implemented read-only badges for regular users showing "ارسال شده" / "ارسال نشده"
- Added framer-motion animations throughout (page transitions, row animations, toggle animations)
- Verified with Agent Browser: login works for both admin and user, toggle works, read-only mode works

Stage Summary:
- App fully functional at http://localhost:3000
- Admin: admin / admin123 (can toggle target sent)
- User: user / user123 (read-only view)
- 12 branches seeded: تهران غرب, تهران شرق, تهران جنوب, تهران هورکا, تهران عمده, اصفهان, گیلان, خراسان رضوی, فارس, البرز, بابل, خوزستان
