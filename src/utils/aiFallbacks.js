const KNOWN_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express.js",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring Boot",
  "C#",
  ".NET",
  "PHP",
  "Laravel",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Firebase",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "REST APIs",
  "GraphQL",
  "Tailwind CSS",
  "Figma",
  "Agile",
  "Scrum",
  "Communication",
  "Problem Solving",
  "Leadership",
  "Team Collaboration",
  "Testing",
];

const ROLE_SKILLS = {
  frontend: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Responsive Design", "Tailwind CSS", "Git"],
  backend: ["Node.js", "Express.js", "REST APIs", "SQL", "PostgreSQL", "Docker", "Git", "Testing"],
  fullstack: ["React", "Node.js", "JavaScript", "SQL", "REST APIs", "Firebase", "Git", "Problem Solving"],
  software: ["JavaScript", "Git", "REST APIs", "Testing", "Problem Solving", "Agile", "Team Collaboration", "SQL"],
};

const uniq = (items) => Array.from(new Set(items.filter(Boolean)));

const collectSourceText = (value) => {
  if (!value) return "";
  if (Array.isArray(value)) return value.map(collectSourceText).join(" ");
  if (typeof value === "object") return Object.values(value).map(collectSourceText).join(" ");
  return String(value);
};

const inferRoleKey = (text = "") => {
  const lower = text.toLowerCase();
  if (lower.includes("front")) return "frontend";
  if (lower.includes("back")) return "backend";
  if (lower.includes("full")) return "fullstack";
  return "software";
};

export const buildFallbackSkills = (formData = {}) => {
  const sourceText = [
    formData.targetJobTitle,
    formData.summary,
    collectSourceText(formData.experiences),
    collectSourceText(formData.projects),
    collectSourceText(formData.education),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const detected = KNOWN_SKILLS.filter((skill) =>
    sourceText.includes(skill.toLowerCase().replace(".js", "").replace(/\s+/g, " ")),
  );

  const roleSkills = ROLE_SKILLS[inferRoleKey(formData.targetJobTitle || "")] || ROLE_SKILLS.software;

  return uniq([...detected, ...roleSkills]).slice(0, 12);
};

export const buildFallbackSummary = (formData = {}) => {
  const role = formData.targetJobTitle || "professional role";
  const profileType = formData.profileType ? `${formData.profileType} candidate` : "candidate";
  const skills = buildFallbackSkills(formData).slice(0, 4).join(", ");
  const experienceCount = formData.experiences?.length || 0;
  const projectCount = formData.projects?.length || 0;
  const evidence = [];

  if (experienceCount) evidence.push(`${experienceCount} hands-on work experience${experienceCount > 1 ? " entries" : ""}`);
  if (projectCount) evidence.push(`${projectCount} practical project${projectCount > 1 ? "s" : ""}`);

  const evidenceText = evidence.length ? `Backed by ${evidence.join(" and ")}, ` : "";

  return `${profileType.charAt(0).toUpperCase() + profileType.slice(1)} targeting ${role} opportunities. ${evidenceText}brings strengths in ${skills || "communication, problem solving, and modern development workflows"}. Focused on delivering clean, reliable results and growing quickly in high-impact teams.`;
};

export const buildFallbackProjectDescription = (project = {}, formData = {}) => {
  const name = project.name || project.projectName || "this project";
  const tech = project.technologies || buildFallbackSkills(formData).slice(0, 3).join(", ");
  const role = formData.targetJobTitle || "the target role";

  return `Built ${name} to solve a practical user need with ${tech || "modern web technologies"}. Designed the core experience, implemented key functionality, and focused on a polished, reliable result aligned with ${role}.`;
};

export const buildFallbackResponsibilities = (currentText = "") => {
  const cleaned = String(currentText || "")
    .split(/\r?\n+/)
    .map((line) => line.replace(/^[•*-]\s*/, "").trim())
    .filter(Boolean)
    .map((line) => `• ${line}`)
    .join("\n");

  if (cleaned.trim()) return cleaned;

  return "• Collaborated with cross-functional teammates to deliver reliable work on schedule.\n• Improved usability, quality, and consistency through careful implementation and testing.";
};

export const buildFallbackCourseworkSuggestions = (context = {}, options = {}) => {
  const role = String(options.targetJobTitle || "").toLowerCase();
  const degree = String(context.degree || "").toLowerCase();
  const suggestions = [];

  if (degree.includes("computer") || role.includes("developer") || role.includes("engineer")) {
    suggestions.push(
      "Relevant Coursework: Data Structures, Algorithms, Database Systems, Operating Systems",
      "Advanced Studies: Software Engineering, Computer Networks, Object-Oriented Programming",
      "Academic Highlights: Machine Learning, Web Development, System Design",
    );
  }

  if (role.includes("design")) {
    suggestions.push(
      "Relevant Coursework: Human-Computer Interaction, Visual Design, User Research, Prototyping",
      "Academic Highlights: Design Systems, Interaction Design, Usability Testing",
    );
  }

  if (role.includes("market")) {
    suggestions.push(
      "Relevant Coursework: Digital Marketing, Consumer Behavior, Market Research, Brand Management",
      "Academic Highlights: Campaign Strategy, Analytics, Content Marketing",
    );
  }

  suggestions.push(
    "Honors: Dean's List, Merit Scholarship, Academic Excellence Recognition",
    "Relevant Coursework: Project Management, Communication, Research Methods, Professional Ethics",
  );

  return uniq(suggestions).slice(0, Math.max(1, options.numOptions || 3));
};

export const buildFallbackRewrite = ({
  fieldType,
  currentText = "",
  formData = {},
}) => {
  switch (fieldType) {
    case "skills":
      return buildFallbackSkills(formData).join(", ");
    case "summary":
      return buildFallbackSummary(formData);
    case "projectDescription":
      return buildFallbackProjectDescription(formData, formData);
    case "description":
    case "responsibilities":
      return buildFallbackResponsibilities(currentText);
    default:
      return String(currentText || "").trim();
  }
};

export const buildFallbackSuggestions = (fieldType, context = {}, options = {}) => {
  const numOptions = options.numOptions || 3;

  if (fieldType === "summary") {
    return [
      { text: buildFallbackSummary(context), type: "summary" },
    ];
  }

  if (fieldType === "projectDescription") {
    return [
      { text: buildFallbackProjectDescription(context, options), type: "projectDescription" },
    ];
  }

  if (fieldType === "skills") {
    return [
      { text: buildFallbackSkills(context).join(", "), type: "skills" },
    ];
  }

  if (fieldType === "responsibilities") {
    return [
      { text: buildFallbackResponsibilities(context.description || context.responsibilities || ""), type: "responsibility" },
    ];
  }

  if (fieldType === "coursework") {
    return buildFallbackCourseworkSuggestions(context, options).map((text) => ({
      text,
      type: "coursework",
    }));
  }

  return Array.from({ length: Math.max(1, numOptions) }, () => ({
    text: "",
    type: fieldType,
  })).filter((item) => item.text);
};
