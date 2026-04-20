insert into public.projects
(name, slug, description, github_url, website_url, category, difficulty, tech_stack, tags, beginner_friendly, setup_complexity, issue_availability, mentorship_available)
values
('freeCodeCamp', 'freecodecamp', 'A large learning platform with documentation, curriculum, translation, and approachable frontend issues for learners.', 'https://github.com/freeCodeCamp/freeCodeCamp', 'https://www.freecodecamp.org', 'Education', 'Easy', array['JavaScript','React','Node.js','Docs'], array['curriculum','docs','good first issue','education'], true, 'Medium', 'High', true),
('The Odin Project', 'the-odin-project', 'Open source curriculum for full-stack web development with content improvements, docs, and community-focused tasks.', 'https://github.com/TheOdinProject/curriculum', 'https://www.theodinproject.com', 'Education', 'Beginner', array['Markdown','Ruby','JavaScript','Docs'], array['curriculum','documentation','beginner friendly'], true, 'Low', 'Moderate', true),
('Public APIs', 'public-apis', 'A curated list of free public APIs where beginners can contribute entries, fixes, categorization, and documentation updates.', 'https://github.com/public-apis/public-apis', 'https://publicapis.dev', 'Open Data', 'Beginner', array['Docs','Markdown','Data'], array['curation','open data','documentation'], true, 'Low', 'High', false),
('Appwrite', 'appwrite', 'Backend-as-a-service platform with SDKs, examples, docs, and well-labeled issues across web and backend areas.', 'https://github.com/appwrite/appwrite', 'https://appwrite.io', 'Backend', 'Medium', array['TypeScript','PHP','Docker','Docs'], array['backend','cloud','hacktoberfest'], true, 'Medium', 'Moderate', true),
('Hoppscotch', 'hoppscotch', 'Open source API development ecosystem with frontend, docs, localization, and developer tooling contribution paths.', 'https://github.com/hoppscotch/hoppscotch', 'https://hoppscotch.io', 'Developer Tools', 'Easy', array['TypeScript','Vue','Node.js','Docs'], array['api','developer tools','frontend'], true, 'Medium', 'Moderate', true),
('Excalidraw', 'excalidraw', 'Virtual whiteboard for sketching diagrams with opportunities in UI polish, docs, bug fixes, and translations.', 'https://github.com/excalidraw/excalidraw', 'https://excalidraw.com', 'Frontend', 'Easy', array['React','TypeScript','CSS'], array['canvas','ui','collaboration'], true, 'Medium', 'Moderate', false),
('EddieHub Community', 'eddiehub-community', 'Community repositories focused on inclusive open source practice, documentation, profile improvements, and starter issues.', 'https://github.com/EddieHubCommunity', 'https://www.eddiehub.org', 'Community', 'Beginner', array['Docs','JavaScript','Markdown'], array['community','docs','first contribution'], true, 'Low', 'High', true),
('Django Girls Tutorial', 'django-girls-tutorial', 'Beginner-friendly Django tutorial where contributors can improve docs, examples, translations, and learning clarity.', 'https://github.com/DjangoGirls/tutorial', 'https://tutorial.djangogirls.org', 'Docs', 'Beginner', array['Python','Django','Docs'], array['tutorial','python','documentation'], true, 'Low', 'Moderate', true),
('Pandas', 'pandas', 'Powerful data analysis library with docs, tests, examples, and beginner-friendly issue labels for Python contributors.', 'https://github.com/pandas-dev/pandas', 'https://pandas.pydata.org', 'Open Data', 'Medium', array['Python','Data','Docs'], array['data science','documentation','testing'], true, 'High', 'Moderate', false),
('ToolJet', 'tooljet', 'Open source low-code platform with full-stack tasks, UI issues, docs, and integrations suitable for growing contributors.', 'https://github.com/ToolJet/ToolJet', 'https://www.tooljet.com', 'Full Stack', 'Easy', array['React','Node.js','TypeScript','PostgreSQL'], array['low code','full stack','dashboard'], true, 'Medium', 'Moderate', true),
('OpenSauced', 'opensauced', 'Open source insights platform with React, docs, community, and API contribution opportunities.', 'https://github.com/open-sauced/app', 'https://opensauced.pizza', 'Full Stack', 'Easy', array['React','TypeScript','Node.js','Docs'], array['analytics','community','github'], true, 'Medium', 'Moderate', true),
('Scikit-learn Documentation', 'scikit-learn-docs', 'Machine learning documentation and examples where new contributors can improve explanations, examples, and tutorials.', 'https://github.com/scikit-learn/scikit-learn', 'https://scikit-learn.org', 'AI/ML', 'Medium', array['Python','AI/ML','Docs'], array['machine learning','examples','documentation'], true, 'High', 'Moderate', false)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  github_url = excluded.github_url,
  website_url = excluded.website_url,
  category = excluded.category,
  difficulty = excluded.difficulty,
  tech_stack = excluded.tech_stack,
  tags = excluded.tags,
  beginner_friendly = excluded.beginner_friendly,
  setup_complexity = excluded.setup_complexity,
  issue_availability = excluded.issue_availability,
  mentorship_available = excluded.mentorship_available;
