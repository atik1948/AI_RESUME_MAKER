const SUMMARY_EXAMPLES = {
  frontend: [
    "Frontend developer with experience building responsive web applications using React, JavaScript, and modern CSS tools. Skilled at translating product requirements into clean user interfaces, improving usability, and delivering reliable features in collaborative teams. Focused on creating fast, accessible experiences that support business goals and user satisfaction.",
    "Results-driven frontend developer with a strong foundation in React, component architecture, and UI optimization. Experienced in working with cross-functional teams to ship polished features, improve performance, and maintain scalable codebases. Eager to contribute strong problem-solving skills and a product-focused mindset in a growth-oriented role.",
  ],
  backend: [
    "Backend developer with experience designing APIs, managing databases, and building maintainable server-side systems. Comfortable working with Node.js, SQL, and cloud-ready services to improve reliability, performance, and development workflows. Brings a practical approach to solving technical problems and supporting product delivery.",
    "Detail-oriented backend engineer focused on building secure, scalable services that power reliable user experiences. Experienced in API development, database design, and debugging production issues while collaborating with frontend and product teams. Committed to writing clean code and improving system efficiency over time.",
  ],
  marketing: [
    "Marketing professional with experience supporting digital campaigns, content planning, and audience engagement across multiple channels. Skilled at turning campaign goals into clear execution plans, measuring results, and improving performance through data-informed decisions. Brings strong communication, creativity, and organization to fast-moving teams.",
    "Growth-focused marketer with a background in content, social media, and campaign coordination. Experienced in building brand visibility, analyzing engagement trends, and contributing to conversion-focused initiatives. Motivated to help teams reach business goals through thoughtful messaging and consistent execution.",
  ],
  design: [
    "UI/UX designer with experience creating user-centered digital experiences across web and mobile products. Skilled in wireframing, prototyping, and collaborating with developers to turn product ideas into intuitive interfaces. Focused on balancing usability, visual clarity, and business impact in every design decision.",
    "Creative designer with a strong eye for layout, interaction, and visual consistency. Experienced in user research, iterative design improvements, and cross-functional collaboration that leads to better product experiences. Passionate about building interfaces that are both elegant and easy to use.",
  ],
  generic: [
    "Motivated professional with a strong foundation in problem-solving, communication, and continuous learning. Experienced in contributing to team goals, managing responsibilities effectively, and adapting quickly to new tools and processes. Looking to bring reliable execution and a growth mindset to a role aligned with long-term career goals.",
    "Detail-oriented candidate with experience applying technical and professional skills in collaborative environments. Comfortable learning quickly, taking ownership of tasks, and delivering work that supports team objectives. Seeking an opportunity to contribute value while continuing to build expertise in a focused career path.",
  ],
};

const EXPERIENCE_EXAMPLES = {
  frontend: [
    "• Built responsive user interfaces with React and reusable components, improving page consistency across core product flows.\n• Collaborated with designers and backend developers to ship new features on schedule and reduce UI defects before release.\n• Improved page performance by optimizing rendering logic and asset loading, resulting in a smoother user experience.",
    "• Developed and maintained frontend features using JavaScript, React, and CSS while following shared component and accessibility standards.\n• Translated product requirements into clean, user-friendly interfaces and supported QA to resolve usability issues quickly.\n• Contributed to bug fixes and interface improvements that increased reliability and reduced user-reported issues.",
  ],
  backend: [
    "• Developed REST APIs and backend services to support product features, authentication flows, and data processing tasks.\n• Improved database queries and server-side logic to reduce response times and increase application reliability.\n• Worked with cross-functional teams to debug production issues, deploy fixes, and maintain stable service performance.",
    "• Built and maintained backend functionality using Node.js and SQL-based systems to support scalable application workflows.\n• Implemented validation, error handling, and logging improvements that made debugging and support faster.\n• Assisted with deployment and service monitoring to ensure dependable application performance across releases.",
  ],
  marketing: [
    "• Supported digital marketing campaigns across social, email, and web channels to improve audience reach and engagement.\n• Coordinated campaign assets, scheduling, and reporting while tracking performance against key marketing goals.\n• Analyzed engagement data and shared insights that helped improve content strategy and campaign execution.",
    "• Created and managed marketing content calendars to support brand visibility and consistent campaign delivery.\n• Worked with internal teams to launch promotional campaigns and optimize messaging for target audiences.\n• Monitored campaign performance and recommended improvements based on click-through, reach, and conversion trends.",
  ],
  design: [
    "• Designed user interface layouts and interaction flows that improved usability across web and mobile screens.\n• Created wireframes, mockups, and prototypes to communicate concepts clearly to product and engineering teams.\n• Iterated on design solutions using feedback and testing insights to improve clarity, consistency, and user satisfaction.",
    "• Collaborated with stakeholders to translate business goals into intuitive visual and interaction design solutions.\n• Maintained consistent design patterns across screens and supported developers during implementation reviews.\n• Improved user journeys by refining layouts, hierarchy, and component behavior based on real product needs.",
  ],
  generic: [
    "• Managed day-to-day responsibilities efficiently while supporting team goals and maintaining consistent work quality.\n• Collaborated with colleagues to solve problems, improve processes, and deliver work within expected timelines.\n• Took ownership of assigned tasks and adapted quickly to changing priorities in a fast-paced environment.",
    "• Contributed to team objectives through reliable execution, clear communication, and strong attention to detail.\n• Supported ongoing operations and project work by organizing tasks, resolving issues, and following through on deliverables.\n• Helped improve workflow efficiency by identifying practical ways to streamline routine work.",
  ],
};

const PROJECT_EXAMPLES = {
  frontend: [
    "Built a responsive web application that helps users manage tasks, track progress, and organize daily work more efficiently. Developed the frontend using React and reusable UI components, with attention to usability, accessibility, and smooth state-driven interactions. Improved the overall experience by optimizing layout responsiveness and simplifying core user flows.",
    "Created a modern portfolio and project showcase website to present work samples, technical skills, and contact information in a professional format. Used React, component-based design, and clean styling patterns to deliver a fast, mobile-friendly interface. Focused on performance, visual consistency, and an intuitive browsing experience for recruiters and clients.",
  ],
  backend: [
    "Developed a backend service that manages user accounts, secure authentication, and data retrieval for a web application. Designed API endpoints, structured database operations, and added validation and error handling to improve system reliability. The project strengthened understanding of scalable server-side development and maintainable backend architecture.",
    "Built a REST API for an application that handles product, order, and user data across multiple workflows. Implemented server logic, database integration, and structured responses to support consistent communication with frontend clients. Focused on performance, data integrity, and writing maintainable service code.",
  ],
  data: [
    "Created a data analysis project that cleaned raw datasets, explored key trends, and presented findings in a clear, decision-friendly format. Used Python and common analysis libraries to process information, identify patterns, and support business or academic insights. Emphasized accuracy, readability, and practical interpretation of results.",
    "Built a machine learning workflow to prepare data, test models, and compare predictive performance across approaches. Documented preprocessing steps, evaluation results, and improvement opportunities to make the project easy to understand and extend. Focused on applying analytical thinking to solve a defined problem with measurable outputs.",
  ],
  generic: [
    "Developed a practical project to solve a real user problem through thoughtful planning, execution, and iteration. Defined the core goal, implemented the main features, and refined the solution based on testing and feedback. The work demonstrates initiative, problem-solving ability, and the capacity to turn ideas into usable outcomes.",
    "Built an end-to-end project that combined planning, implementation, and quality improvements to deliver a polished result. Focused on clear functionality, maintainable structure, and a user-friendly experience while working within realistic technical constraints. The project highlights both technical skill and project ownership.",
  ],
};

const normalize = (value = "") => String(value || "").toLowerCase();

const detectExampleCategory = (jobTitle = "", profileType = "", fallbackText = "") => {
  const text = `${normalize(jobTitle)} ${normalize(profileType)} ${normalize(fallbackText)}`;
  if (/(front ?end|react|ui|ux|javascript|web developer)/.test(text)) return "frontend";
  if (/(back ?end|node|api|server|database|sql|java|python developer)/.test(text)) return "backend";
  if (/(marketing|seo|campaign|content|brand|growth)/.test(text)) return "marketing";
  if (/(design|designer|ui|ux|figma|visual)/.test(text)) return "design";
  if (/(data|analyst|analytics|machine learning|ml|tableau|python)/.test(text)) return "data";
  return "generic";
};

export const getSummaryExamples = (formData = {}) => {
  const category = detectExampleCategory(formData.targetJobTitle, formData.profileType, formData.summary);
  return SUMMARY_EXAMPLES[category] || SUMMARY_EXAMPLES.generic;
};

export const getExperienceExamples = (experience = {}, formData = {}) => {
  const category = detectExampleCategory(experience.jobTitle, formData.profileType, formData.targetJobTitle);
  return EXPERIENCE_EXAMPLES[category] || EXPERIENCE_EXAMPLES.generic;
};

export const getProjectExamples = (project = {}, formData = {}) => {
  const category = detectExampleCategory(project.name, formData.profileType, `${formData.targetJobTitle} ${project.technologies || ""}`);
  return PROJECT_EXAMPLES[category] || PROJECT_EXAMPLES.generic;
};
