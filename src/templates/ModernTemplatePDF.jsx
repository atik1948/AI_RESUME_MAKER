import React from 'react';
import { Document, Page, View, Text, StyleSheet, Link, Image } from '@react-pdf/renderer';
import { scalePdfStyles } from '../utils/pdfResume';

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontFamily: 'Helvetica',
    fontSize: 11,
    backgroundColor: '#ffffff',
    color: '#1e293b',
    lineHeight: 1.55,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#2563eb',
    paddingBottom: 16,
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 8,
  },
  headerIdentity: {
    flex: 1,
    paddingRight: 16,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  portraitFrame: {
    width: 76,
    height: 88,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  portraitFallback: {
    fontSize: 22,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 6,
    lineHeight: 1.1,
  },
  title: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '700',
    lineHeight: 1.2,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactIcon: {
    fontSize: 10.5,
    color: '#64748b',
    fontWeight: 'bold',
    minWidth: 60,
  },
  contactValue: {
    fontSize: 10.5,
    color: '#475569',
  },
  contactLink: {
    fontSize: 10.5,
    color: '#2563eb',
    textDecoration: 'underline',
    fontWeight: '600',
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 6,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemContainer: {
    marginBottom: 14,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    lineHeight: 1.25,
  },
  itemCompany: {
    fontSize: 11.5,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 3,
  },
  itemDate: {
    fontSize: 10.5,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'right',
    minWidth: 88,
  },
  itemLocation: {
    fontSize: 10.5,
    color: '#64748b',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 11,
    color: '#334155',
    marginBottom: 6,
    lineHeight: 1.6,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 9,
    color: '#64748b',
    marginRight: 6,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 10.75,
    color: '#334155',
    flex: 1,
    lineHeight: 1.6,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  skillText: {
    fontSize: 10,
    color: '#1e40af',
    fontWeight: '500',
  },
  summaryText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.55,
  },
  projectTech: {
    fontSize: 10.25,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 6,
  },
  educationDetails: {
    fontSize: 10.5,
    color: '#64748b',
    marginTop: 3,
    lineHeight: 1.35,
  },
  achievements: {
    fontSize: 10.25,
    color: '#059669',
    fontWeight: '600',
    marginTop: 6,
  },
  referenceText: {
    fontSize: 10.5,
    color: '#334155',
    lineHeight: 1.55,
    marginBottom: 8,
  },
  backgroundMetaCard: {
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  backgroundMetaBlock: {
    marginBottom: 6,
  },
  backgroundMetaLabel: {
    fontSize: 10.25,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  backgroundMetaValue: {
    fontSize: 10.75,
    color: '#1e293b',
    lineHeight: 1.45,
  },
  backgroundNarrativeCard: {
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
});

const cleanLinkText = (value = '') =>
  String(value).replace('https://', '').replace('http://', '');

const buildInitials = (name = '') =>
  String(name || 'CV')
    .split(' ')
    .map((part) => part.trim()[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'CV';

const buildReferences = (formData = {}) => {
  if (Array.isArray(formData.references)) {
    return formData.references
      .map((reference) => {
        if (typeof reference === 'string') return reference.trim();
        return [
          reference?.name || reference?.referenceName || '',
          reference?.role || reference?.designation || reference?.title || '',
          reference?.company || reference?.organization || '',
          reference?.phone || reference?.contact || '',
          reference?.email || '',
        ]
          .map((item) => String(item || '').trim())
          .filter(Boolean)
          .join(' | ');
      })
      .filter(Boolean);
  }

  const manualReferences = [
    [
      formData.reference1Name || formData.referenceName || '',
      formData.reference1Role || formData.referenceRole || '',
      formData.reference1Company || formData.referenceCompany || '',
      formData.reference1Phone || formData.referencePhone || '',
      formData.reference1Email || formData.referenceEmail || '',
    ],
    [
      formData.reference2Name || '',
      formData.reference2Role || '',
      formData.reference2Company || '',
      formData.reference2Phone || '',
      formData.reference2Email || '',
    ],
  ]
    .map((reference) =>
      reference
        .map((item) => String(item || '').trim())
        .filter(Boolean)
        .join(' | '),
    )
    .filter(Boolean);

  if (manualReferences.length) return manualReferences;

  return String(formData.reference || formData.referencesText || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
};

const buildTextList = (value = '') =>
  String(value || '')
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

const buildCertificationItems = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((cert) => {
        if (typeof cert === 'string') return { name: cert.trim() };
        return {
          name: String(cert?.name || cert?.title || '').trim(),
          issuer: String(cert?.issuer || cert?.organization || '').trim(),
          date: String(cert?.date || cert?.year || '').trim(),
        };
      })
      .filter((cert) => cert.name);
  }

  return buildTextList(value).map((name) => ({ name }));
};

const stripMarkdown = (value = '') =>
  String(value || '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .trim();

const compactCoursework = (value = '') => {
  const cleaned = stripMarkdown(value);
  if (!cleaned) return '';

  const normalized = cleaned
    .replace(/\s*\|\s*/g, ', ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  if (normalized.length <= 120) return normalized;

  const shortened = normalized
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(', ');

  return shortened.length > 117 ? `${shortened.slice(0, 117).trim()}...` : `${shortened}...`;
};

const buildEffectiveSectionOrder = (sectionOrder = [], profileType = '') => {
  const normalizedSections = Array.isArray(sectionOrder) ? sectionOrder : [];
  const baseSections = [
    { id: 'transition', label: 'Career Transition' },
    { id: 'progression', label: 'Career Progression' },
    { id: 'background', label: 'Professional Background' },
    { id: 'certifications', label: 'Professional Certifications' },
    { id: 'references', label: 'References' },
  ].reduce(
    (sections, ensured) => (sections.some((section) => section.id === ensured.id) ? sections : [...sections, ensured]),
    normalizedSections,
  );

  if (profileType !== 'experienced') {
    if (profileType !== 'career_changer') {
      return baseSections.filter((section) => section.id !== 'transition');
    }

    const preferredOrder = [
      'contact',
      'summary',
      'transition',
      'experience',
      'skills',
      'projects',
      'education',
      'certifications',
      'references',
    ];

    const sectionMap = new Map(baseSections.map((section) => [section.id, section]));
    return preferredOrder
      .map((id) => sectionMap.get(id))
      .filter(Boolean);
  }

  const hasExperiencedSectionsConfigured =
    normalizedSections.some((section) => section.id === 'background') &&
    normalizedSections.some((section) => section.id === 'certifications');

  if (hasExperiencedSectionsConfigured) {
    return baseSections;
  }

  const preferredOrder = [
    'contact',
    'summary',
    'education',
    'progression',
    'background',
    'experience',
    'skills',
    'projects',
    'certifications',
    'references',
  ];

  const sectionMap = new Map(baseSections.map((section) => [section.id, section]));
  return preferredOrder
    .map((id) => sectionMap.get(id))
    .filter(Boolean);
};

const renderDescriptionBlock = (scaledStyles, description = '') => {
  const lines = stripMarkdown(description)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.map((line, index) => {
    if (/^[•*-]/.test(line)) {
      return (
        <View key={index} style={scaledStyles.bulletPoint}>
          <Text style={scaledStyles.bullet}>•</Text>
          <Text style={scaledStyles.bulletText}>{line.replace(/^[•*-]\s*/, '')}</Text>
        </View>
      );
    }

    return (
      <Text key={index} style={scaledStyles.itemDescription}>
        {line}
      </Text>
    );
  });
};

const ModernTemplatePDF = ({
  formData = {},
  fontStyle = 'Helvetica',
  fontSize = 11,
  fontScale = 1,
  sectionOrder = [
    { id: 'contact', label: 'Contact Information' },
    { id: 'summary', label: 'Professional Summary' },
    { id: 'transition', label: 'Career Transition' },
    { id: 'progression', label: 'Career Progression' },
    { id: 'background', label: 'Professional Background' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Professional Experience' },
    { id: 'skills', label: 'Skills & Competencies' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Professional Certifications' },
    { id: 'references', label: 'References' },
  ],
}) => {
  const scaledStyles = scalePdfStyles(styles, fontScale);
  const references = buildReferences(formData);
  const certificationItems = buildCertificationItems(formData.certifications);
  const effectiveSectionOrder = buildEffectiveSectionOrder(sectionOrder, formData.profileType);
  const summaryText =
    formData.summary ||
    formData.professionalSummary ||
    formData.profileSummary ||
    formData.objective ||
    '';

  const getProfessionalTitle = () => {
    if (formData.targetJobTitle) return formData.targetJobTitle;
    if (formData.experiences?.length > 0) return formData.experiences[0].jobTitle;
    return 'Professional';
  };

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'contact':
        return null;
      case 'summary':
        return summaryText ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Professional Summary</Text>
            <Text style={scaledStyles.summaryText}>{summaryText}</Text>
          </View>
        ) : null;
      case 'transition':
        return formData.profileType === 'career_changer' &&
          (formData.previousIndustry ||
            formData.reasonForChange ||
            formData.transferableSkills ||
            formData.newFieldPreparation ||
            formData.relevantExperience) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Career Transition</Text>
            {(formData.previousIndustry || formData.targetIndustry || formData.transferableSkills) ? (
              <View style={scaledStyles.backgroundMetaCard}>
                {formData.previousIndustry || formData.targetIndustry ? (
                  <View style={scaledStyles.backgroundMetaBlock}>
                    <Text style={scaledStyles.backgroundMetaLabel}>Transition Focus</Text>
                    <Text style={scaledStyles.backgroundMetaValue}>
                      {[formData.previousIndustry || 'Previous Field', formData.targetIndustry || formData.targetJobTitle || 'New Role']
                        .filter(Boolean)
                        .join(' -> ')}
                    </Text>
                  </View>
                ) : null}
                {formData.transferableSkills ? (
                  <View style={scaledStyles.backgroundMetaBlock}>
                    <Text style={scaledStyles.backgroundMetaLabel}>Transferable Skills</Text>
                    <Text style={scaledStyles.backgroundMetaValue}>{stripMarkdown(formData.transferableSkills)}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}
            {formData.reasonForChange ? (
              <View style={scaledStyles.backgroundNarrativeCard} wrap={false}>
                <Text style={scaledStyles.cardTitle}>Reason for Career Change</Text>
                {renderDescriptionBlock(scaledStyles, formData.reasonForChange)}
              </View>
            ) : null}
            {formData.newFieldPreparation || formData.relevantExperience ? (
              <View style={scaledStyles.backgroundNarrativeCard} wrap={false}>
                <Text style={scaledStyles.cardTitle}>Preparation for New Field</Text>
                {formData.newFieldPreparation ? renderDescriptionBlock(scaledStyles, formData.newFieldPreparation) : null}
                {formData.relevantExperience ? (
                  <>
                    <Text style={scaledStyles.cardTitle}>Relevant Experience in New Field</Text>
                    {renderDescriptionBlock(scaledStyles, formData.relevantExperience)}
                  </>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : null;
      case 'progression':
        return formData.careerProgression ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Career Progression</Text>
            <View style={scaledStyles.backgroundNarrativeCard}>
              {renderDescriptionBlock(scaledStyles, formData.careerProgression)}
            </View>
          </View>
        ) : null;
      case 'background':
        return (
          formData.yearsExperience ||
          formData.industryExperience ||
          formData.managementExperience ||
          formData.keyAchievements ||
          formData.specializations
        ) ? (
          <View style={scaledStyles.section}>
            {formData.yearsExperience || formData.industryExperience || formData.specializations ? (
              <View wrap={false}>
                <Text style={scaledStyles.sectionTitle}>Professional Background</Text>
                <View style={scaledStyles.backgroundMetaCard}>
                  {formData.yearsExperience ? (
                    <View style={scaledStyles.backgroundMetaBlock}>
                      <Text style={scaledStyles.backgroundMetaLabel}>Years of Experience</Text>
                      <Text style={scaledStyles.backgroundMetaValue}>{formData.yearsExperience}</Text>
                    </View>
                  ) : null}
                  {formData.industryExperience ? (
                    <View style={scaledStyles.backgroundMetaBlock}>
                      <Text style={scaledStyles.backgroundMetaLabel}>Industries</Text>
                      <Text style={scaledStyles.backgroundMetaValue}>{formData.industryExperience}</Text>
                    </View>
                  ) : null}
                  {formData.specializations ? (
                    <View style={scaledStyles.backgroundMetaBlock}>
                      <Text style={scaledStyles.backgroundMetaLabel}>Areas of Specialization</Text>
                      <Text style={scaledStyles.backgroundMetaValue}>{formData.specializations}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ) : (
              <Text style={scaledStyles.sectionTitle}>Professional Background</Text>
            )}
            {formData.managementExperience ? (
              <View style={scaledStyles.backgroundNarrativeCard} wrap={false}>
                <Text style={scaledStyles.cardTitle}>Management & Leadership Experience</Text>
                {renderDescriptionBlock(scaledStyles, formData.managementExperience)}
              </View>
            ) : null}
          </View>
        ) : null;
      case 'experience':
        return formData.experiences?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Professional Experience</Text>
            {formData.experiences.map((exp, idx) => (
              <View key={idx} style={scaledStyles.itemContainer}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{exp.jobTitle || 'Role'}</Text>
                  <Text style={scaledStyles.itemDate}>
                    {[exp.startDate, exp.endDate || 'Present'].filter(Boolean).join(' - ')}
                  </Text>
                </View>
                <Text style={scaledStyles.itemCompany}>{exp.company || ''}</Text>
                {exp.location ? <Text style={scaledStyles.itemLocation}>{exp.location}</Text> : null}
                {renderDescriptionBlock(scaledStyles, exp.description || exp.responsibilities || '')}
                {exp.achievements ? <Text style={scaledStyles.achievements}>{exp.achievements}</Text> : null}
              </View>
            ))}
          </View>
        ) : null;
      case 'education':
        return formData.education?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Education</Text>
            {formData.education.map((edu, idx) => (
              <View key={idx} style={scaledStyles.itemContainer} wrap={false}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{edu.degree || 'Degree'}</Text>
                  <Text style={scaledStyles.itemDate}>
                    {[edu.startDate, edu.endDate || edu.graduationYear].filter(Boolean).join(' - ')}
                  </Text>
                </View>
                <Text style={scaledStyles.itemCompany}>{edu.school || ''}</Text>
                {edu.gpa ? <Text style={scaledStyles.educationDetails}>GPA: {edu.gpa}</Text> : null}
                {edu.coursework ? <Text style={scaledStyles.educationDetails}>Relevant Coursework: {compactCoursework(edu.coursework)}</Text> : null}
              </View>
            ))}
          </View>
        ) : null;
      case 'skills':
        return formData.skills?.length ? (
          <View style={scaledStyles.section} wrap={false}>
            <Text style={scaledStyles.sectionTitle}>Skills & Competencies</Text>
            <View style={scaledStyles.skillsGrid}>
              {formData.skills.map((skill, idx) => (
                <View key={idx} style={scaledStyles.skillTag}>
                  <Text style={scaledStyles.skillText}>{skill.name || skill}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null;
      case 'projects':
        return formData.projects?.some((proj) =>
          proj.projectName ||
          proj.name ||
          proj.projectDescription ||
          proj.description ||
          proj.projectLink ||
          proj.liveUrl ||
          proj.githubUrl ||
          proj.technologies
        ) ? (
          <View style={scaledStyles.section} wrap={false}>
            <Text style={scaledStyles.sectionTitle}>Projects</Text>
            {formData.projects.map((proj, idx) => {
              const name = proj.projectName || proj.name || 'Project';
              const description = stripMarkdown(proj.projectDescription || proj.description || '');
              const link = proj.projectLink || proj.liveUrl || proj.githubUrl || '';
              const date = proj.projectDate || [proj.startDate, proj.endDate].filter(Boolean).join(' - ');

              return (
                <View key={idx} style={scaledStyles.itemContainer} wrap={false}>
                  <View style={scaledStyles.itemHeader}>
                    <Text style={scaledStyles.itemTitle}>{name}</Text>
                    {date ? <Text style={scaledStyles.itemDate}>{date}</Text> : null}
                  </View>
                  {link ? (
                    <Link src={link} style={scaledStyles.contactLink}>
                      Link: {cleanLinkText(link)}
                    </Link>
                  ) : null}
                  {description ? <Text style={scaledStyles.itemDescription}>{description}</Text> : null}
                  {proj.technologies ? (
                    <Text style={scaledStyles.projectTech}>Technologies: {proj.technologies}</Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null;
      case 'certifications':
        return certificationItems.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Professional Certifications</Text>
            {certificationItems.slice(0, 6).map((cert, idx) => (
              <View key={idx} style={scaledStyles.itemContainer} wrap={false}>
                <Text style={scaledStyles.itemTitle}>{stripMarkdown(cert.name)}</Text>
                {cert.issuer ? <Text style={scaledStyles.itemCompany}>{stripMarkdown(cert.issuer)}</Text> : null}
                {cert.date ? <Text style={scaledStyles.educationDetails}>{stripMarkdown(cert.date)}</Text> : null}
              </View>
            ))}
          </View>
        ) : null;
      case 'references':
        return references.length ? (
          <View style={scaledStyles.section} wrap={false}>
            <Text style={scaledStyles.sectionTitle}>References</Text>
            <View style={scaledStyles.itemContainer}>
              {references.slice(0, 4).map((reference, idx) => (
                <Text key={idx} style={scaledStyles.referenceText}>{reference}</Text>
              ))}
            </View>
          </View>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page style={{ ...scaledStyles.page, fontFamily: fontStyle, fontSize }}>
        <View style={scaledStyles.header}>
          <View style={scaledStyles.headerTop}>
            <View style={scaledStyles.headerIdentity}>
              <Text style={scaledStyles.name}>{formData.fullName || 'Your Name'}</Text>
              <Text style={scaledStyles.title}>{getProfessionalTitle()}</Text>
            </View>
            <View style={scaledStyles.portraitFrame}>
              {formData.profileImage ? (
                <Image src={formData.profileImage} style={scaledStyles.portraitImage} />
              ) : (
                <Text style={scaledStyles.portraitFallback}>{buildInitials(formData.fullName)}</Text>
              )}
            </View>
          </View>

          <View style={scaledStyles.contactGrid}>
            {formData.email ? (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>Email:</Text>
                <Link src={`mailto:${formData.email}`} style={scaledStyles.contactLink}>{formData.email}</Link>
              </View>
            ) : null}
            {formData.phone ? (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>Phone:</Text>
                <Text style={scaledStyles.contactValue}>{formData.phone}</Text>
              </View>
            ) : null}
            {formData.location ? (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>Location:</Text>
                <Text style={scaledStyles.contactValue}>{formData.location}</Text>
              </View>
            ) : null}
            {formData.linkedin ? (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>LinkedIn:</Text>
                <Link src={formData.linkedin} style={scaledStyles.contactLink}>{cleanLinkText(formData.linkedin)}</Link>
              </View>
            ) : null}
            {formData.website ? (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>Website:</Text>
                <Link src={formData.website} style={scaledStyles.contactLink}>{cleanLinkText(formData.website)}</Link>
              </View>
            ) : null}
            {formData.github ? (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>GitHub:</Text>
                <Link src={formData.github} style={scaledStyles.contactLink}>{cleanLinkText(formData.github)}</Link>
              </View>
            ) : null}
          </View>
        </View>

        {effectiveSectionOrder.map((section) => (
          <React.Fragment key={section.id}>
            {renderSection(section.id)}
          </React.Fragment>
        ))}
      </Page>
    </Document>
  );
};

export default ModernTemplatePDF;
