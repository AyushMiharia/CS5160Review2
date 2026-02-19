# NodeNews

A News Social Media platform

# Developer

Avijit (Vee) Singh
Nishant Naravarajula (Nish)

# Description:

NewsNode is a news discussion platform where users can share, discover, and discuss current events through
article links and commentary. The platform uses a voting system and trending algorithms to surface the most
important discussions, helping users quickly identify what matters most. NewsNode provides a dedicated space
for serious news discussions where journalists can share original research and users can explore diverse
perspectives on important issues.

# User Personas:

1. Tired Office Worker Ahmed
   Needs to quickly catch up on important news without reading full articles.
   Wants to see trending topics and community sentiment at a glance with limited time after work.
2. Independent Journalist Casey
   Needs to share original research and independent perspectives with an engaged audience interested in serious journalism and meaningful discussion.

# User Stories:

As a user, I need to see the most discussed articles (today/week/month), so I can quickly catch up on important news.
As a user, I need to post article links with my commentary, so I can share my perspective and start discussions.
As a user, I need to upvote/downvote posts and comments, so relevant content rises to the top.
As a user, I need to comment on posts, so I can engage in debates about current events.
As a user, I need to browse by category (Politics, Tech, Health), so I can focus on topics I'm interested in.
As a user, I need to filter by trending periods, so I can catch up on recent discussions when I've been away.

# Core Features:

User authentication (registration/login with JWT)
Post article links with commentary and categories
Upvote/downvote system for posts and comments
Comment threads on posts
Trending page with time-based filters
Category-based filtering and search
Homepage feed showing recent posts

# Technical Stack:

Backend: Node.js, Express.js, MongoDB native driver (no Mongoose)
Frontend: Vanilla ES6 JavaScript (no frameworks), HTML5, CSS3
Authentication: JWT (jsonwebtoken)
Deployment: Render, MongoDB Atlas

# Work Split:

Vee (Avijit Singh):
Backend:

User authentication system (registration, login, JWT middleware)
Posts API (Create, Read, Update, Delete)
Trending algorithm implementation

Frontend:

Login and Registration pages
Submit post form
Homepage feed (display posts list)
Voting UI for posts

Nish (Nishant Naravarajula):
Backend:

Comments API (Create, Read, Update, Delete)
Vote tracking system (prevent duplicate votes)
Search and filter functionality by category
Trending page data aggregation

Frontend:

Post detail page with full article view
Comments section with threaded replies
Trending page with time-based filters
Category filtering UI

Shared Responsibilities:
Database schema design and optimization
Deployment to Render and MongoDB Atlas
