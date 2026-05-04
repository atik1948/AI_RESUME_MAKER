export const normalizeSkills = (skills) => {
  if (!skills) return [];

  if (typeof skills === "string") {
    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .map((name) => ({ name, proficiency: "Intermediate" }));
  }

  if (Array.isArray(skills)) {
    return skills
      .map((skill) => {
        if (typeof skill === "string") {
          return { name: skill.trim(), proficiency: "Intermediate" };
        }

        return {
          ...skill,
          name: String(skill?.name ?? skill?.text ?? skill?.value ?? "").trim(),
          proficiency: skill?.proficiency || "Intermediate",
        };
      })
      .filter((skill) => skill.name);
  }

  return [];
};

export const skillsToText = (skills) =>
  normalizeSkills(skills)
    .map((skill) => skill.name)
    .join(", ");

export const normalizeExperience = (experience = {}) => {
  const description =
    experience.description ??
    experience.responsibilities ??
    experience.details ??
    "";

  return {
    ...experience,
    jobTitle: experience.jobTitle ?? experience.title ?? experience.position ?? "",
    company: experience.company ?? experience.employer ?? "",
    location: experience.location ?? experience.city ?? "",
    startDate: experience.startDate ?? experience.from ?? "",
    endDate: experience.endDate ?? experience.to ?? "",
    description,
    responsibilities: experience.responsibilities ?? description,
  };
};

export const normalizeEducation = (education = {}) => ({
  ...education,
  school: education.school ?? education.institution ?? "",
  degree: education.degree ?? education.program ?? "",
  startDate: education.startDate ?? education.from ?? "",
  endDate: education.endDate ?? education.to ?? "",
  coursework: education.coursework ?? education.relevantCoursework ?? "",
  graduationYear:
    education.graduationYear ?? education.endDate ?? education.expectedGraduation ?? "",
});

export const normalizeProject = (project = {}) => {
  const projectName =
    project.projectName ??
    project.name ??
    project.title ??
    "";
  const projectDescription =
    project.projectDescription ??
    project.description ??
    project.details ??
    "";
  const projectLink =
    project.projectLink ??
    project.liveUrl ??
    project.githubUrl ??
    project.url ??
    "";
  const projectDate =
    project.projectDate ??
    [project.startDate, project.endDate].filter(Boolean).join(" - ");

  return {
    ...project,
    name: project.name ?? projectName,
    description: project.description ?? projectDescription,
    liveUrl: project.liveUrl ?? project.projectLink ?? "",
    technologies: project.technologies ?? project.techStack ?? "",
    projectName,
    projectDescription,
    projectLink,
    projectDate,
  };
};

export const normalizeResumeData = (data = {}) => ({
  ...data,
  fullName: data.fullName ?? data.name ?? "",
  targetJobTitle: data.targetJobTitle ?? data.title ?? data.headline ?? "",
  summary:
    data.summary ??
    data.professionalSummary ??
    data.profileSummary ??
    data.objective ??
    "",
  email: data.email ?? "",
  phone: data.phone ?? data.mobile ?? "",
  location: data.location ?? data.address ?? "",
  linkedin: data.linkedin ?? "",
  website: data.website ?? data.portfolio ?? "",
  github: data.github ?? "",
  profileImage: data.profileImage ?? data.photoUrl ?? data.avatar ?? "",
  experiences: Array.isArray(data.experiences)
    ? data.experiences.map(normalizeExperience)
    : [],
  education: Array.isArray(data.education)
    ? data.education.map(normalizeEducation)
    : [],
  projects: Array.isArray(data.projects) ? data.projects.map(normalizeProject) : [],
  skills: normalizeSkills(data.skills),
});
