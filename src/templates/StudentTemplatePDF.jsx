import React from 'react';
import { Document, Page, View, Text, StyleSheet, Link, Image } from '@react-pdf/renderer';
import { scalePdfStyles } from '../utils/pdfResume';

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 11,
    backgroundColor: '#ffffff',
    color: '#1e293b',
    lineHeight: 1.55,
  },
  header: {
    marginBottom: 18,
    borderBottomWidth: 3,
    borderBottomColor: '#3B82F6',
    padding: 18,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 6,
    lineHeight: 1.1,
  },
  title: {
    fontSize: 16,
    color: '#475569',
    marginTop: 2,
    marginBottom: 12,
    fontStyle: 'italic',
    lineHeight: 1.2,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerIdentity: {
    flex: 1,
    paddingRight: 16,
  },
  portraitFrame: {
    width: 84,
    height: 98,
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
    fontSize: 24,
    color: '#1e40af',
    fontWeight: 'bold',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
  },
  studentDetails: {
    flex: 1,
    paddingRight: 0,
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactIcon: {
    fontSize: 9.5,
    color: '#1e40af',
    fontWeight: 'bold',
    minWidth: 54,
  },
  contactValue: {
    fontSize: 9.5,
    color: '#475569',
  },
  contactLink: {
    fontSize: 9.5,
    color: '#2563eb',
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e40af',
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    paddingBottom: 7,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  educationItemContainer: {
    minHeight: 170,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 7,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    paddingRight: 10,
  },
  itemSubtitle: {
    fontSize: 10.5,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 9.5,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'right',
    minWidth: 96,
  },
  itemLocation: {
    fontSize: 9.5,
    color: '#64748b',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 9.6,
    color: '#334155',
    marginBottom: 5,
    lineHeight: 1.45,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 2,
  },
  bullet: {
    fontSize: 9.6,
    color: '#3B82F6',
    marginRight: 6,
    fontWeight: 'bold',
  },
  bulletText: {
    fontSize: 9.6,
    color: '#334155',
    flex: 1,
    lineHeight: 1.45,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  skillText: {
    fontSize: 8.7,
    color: '#1e40af',
    fontWeight: '600',
  },
  summaryText: {
    fontSize: 9.9,
    color: '#334155',
    lineHeight: 1.55,
    textAlign: 'left',
  },
  projectMeta: {
    fontSize: 8.7,
    color: '#64748b',
    marginTop: 5,
    padding: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  educationDetails: {
    fontSize: 9.2,
    color: '#64748b',
    marginTop: 4,
  },
  achievements: {
    fontSize: 9.2,
    color: '#059669',
    fontWeight: '600',
    marginTop: 5,
    padding: 4,
    backgroundColor: '#ecfdf5',
    borderRadius: 4,
  },
  gpaHighlight: {
    fontSize: 9.8,
    color: '#1e40af',
    fontWeight: 'bold',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 4,
  },
  careerGoals: {
    fontSize: 9.1,
    color: '#1e40af',
    marginTop: 7,
    padding: 7,
    backgroundColor: '#eff6ff',
    borderRadius: 4,
  },
  coursework: {
    fontSize: 9.1,
    color: '#475569',
    marginTop: 4,
    fontStyle: 'italic',
  },
  honors: {
    fontSize: 9.1,
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 4,
    padding: 4,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
  },
  referenceText: {
    fontSize: 9.5,
    color: '#334155',
    lineHeight: 1.5,
    marginBottom: 6,
  },
});

const StudentTemplatePDF = ({
  formData = {},
  accentColor = '#3B82F6',
  fontStyle = 'Helvetica',
  fontSize = 10,
  fontScale = 1,
  sectionOrder = [
    { id: 'summary', label: 'Professional Summary' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects & Portfolio' },
    { id: 'experience', label: 'Experience & Internships' },
    { id: 'skills', label: 'Technical Skills' },
    { id: 'references', label: 'References' },
    { id: 'certifications', label: 'Certifications & Training' },
    { id: 'activities', label: 'Leadership & Activities' },
    { id: 'interests', label: 'Interests & Goals' },
  ],
}) => {
  const scaledStyles = scalePdfStyles(styles, fontScale);

  const formatDateRange = (startDate, endDate, fallbackEnd = 'Present') => {
    const cleanStart = String(startDate || '').trim();
    const cleanEnd = String(endDate || fallbackEnd || '').trim();

    if (cleanStart && cleanEnd) return `${cleanStart} - ${cleanEnd}`;
    if (cleanStart) return cleanStart;
    return cleanEnd;
  };

  const cleanLinkLabel = (url = '') =>
    String(url).replace(/^https?:\/\//, '').replace(/\/$/, '');

  const normalizeBulletLines = (text = '') =>
    String(text)
      .replace(/â€¢/g, '-')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

  const getProjectName = (project) =>
    project?.projectName || project?.name || project?.title || 'Project';

  const getProjectDescription = (project) =>
    project?.projectDescription || project?.description || '';

  const getProjectLink = (project) =>
    project?.projectLink || project?.liveUrl || project?.url || project?.githubUrl || '';

  const getProjectTech = (project) =>
    project?.technologies || project?.techStack || '';

  const buildTextList = (...sources) =>
    sources
      .flatMap((source) => {
        if (Array.isArray(source)) {
          return source
            .map((item) => {
              if (typeof item === 'string') return item;
              if (!item) return '';
              return (
                item.description ||
                item.role ||
                item.name ||
                item.title ||
                item.organization ||
                item.issuer ||
                ''
              );
            });
        }

        return String(source || '').split(/\r?\n|,/);
      })
      .map((item) => String(item || '').trim())
      .filter(Boolean);

  const buildInitials = (name = '') =>
    String(name || 'CV')
      .split(' ')
      .map((part) => part.trim()[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'CV';

  const buildReferences = () => {
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

  const references = buildReferences();
  const activityItems = buildTextList(
    formData.activities,
    formData.extracurriculars,
    formData.leadershipActivities,
    formData.supportingActivities,
  );
  const certificationItems = Array.isArray(formData.certifications)
    ? formData.certifications
        .map((cert) => {
          if (typeof cert === 'string') return { name: cert.trim() };
          return {
            name: cert?.name || cert?.title || cert?.certificate || '',
            issuer: cert?.issuer || cert?.organization || '',
            date: cert?.date || cert?.issuedDate || '',
            expiryDate: cert?.expiryDate || '',
          };
        })
        .filter((cert) => cert.name)
    : buildTextList(formData.certifications).map((name) => ({ name }));
  const effectiveSectionOrder = sectionOrder.some((section) => section.id === 'references')
    ? sectionOrder
    : [...sectionOrder, { id: 'references', label: 'References' }];

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return formData.summary ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Professional Summary</Text>
            <Text style={scaledStyles.summaryText}>{formData.summary}</Text>
            {formData.careerGoals && (
              <Text style={scaledStyles.careerGoals}>Career Goals: {formData.careerGoals}</Text>
            )}
          </View>
        ) : null;

      case 'education':
        return formData.education?.length ? (
          <View style={scaledStyles.section}>
            <View wrap={false}>
              <Text style={scaledStyles.sectionTitle}>Education</Text>
              {formData.education[0] && (
                <View style={{ ...scaledStyles.itemContainer, ...scaledStyles.educationItemContainer }}>
                  <View style={scaledStyles.itemHeader}>
                    <Text style={scaledStyles.itemTitle}>{formData.education[0].degree}</Text>
                    <Text style={scaledStyles.itemDate}>
                      {formatDateRange(
                        formData.education[0].startDate,
                        formData.education[0].endDate,
                        formData.education[0].expectedGraduation || 'Expected graduation',
                      )}
                    </Text>
                  </View>
                  <Text style={scaledStyles.itemSubtitle}>{formData.education[0].school}</Text>
                  {formData.education[0].location && (
                    <Text style={scaledStyles.itemLocation}>{formData.education[0].location}</Text>
                  )}
                  {formData.education[0].gpa && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <Text style={scaledStyles.gpaHighlight}>GPA: {formData.education[0].gpa}</Text>
                    </View>
                  )}
                  {formData.education[0].coursework && (
                    <Text style={scaledStyles.coursework}>
                      Relevant Coursework: {formData.education[0].coursework}
                    </Text>
                  )}
                  {formData.education[0].achievements && (
                    <Text style={scaledStyles.achievements}>
                      Achievements: {formData.education[0].achievements}
                    </Text>
                  )}
                  {formData.education[0].honors && (
                    <Text style={scaledStyles.honors}>Honors: {formData.education[0].honors}</Text>
                  )}
                  {formData.education[0].activities && (
                    <Text style={scaledStyles.educationDetails}>
                      Activities: {formData.education[0].activities}
                    </Text>
                  )}
                </View>
              )}
            </View>
            {formData.education.slice(1).map((edu, idx) => (
              <View
                key={`${idx + 1}-${edu.degree || 'education'}`}
                style={{ ...scaledStyles.itemContainer, ...scaledStyles.educationItemContainer }}
              >
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{edu.degree}</Text>
                  <Text style={scaledStyles.itemDate}>
                    {formatDateRange(edu.startDate, edu.endDate, edu.expectedGraduation || 'Expected graduation')}
                  </Text>
                </View>
                <Text style={scaledStyles.itemSubtitle}>{edu.school}</Text>
                {edu.location && <Text style={scaledStyles.itemLocation}>{edu.location}</Text>}
                {edu.gpa && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Text style={scaledStyles.gpaHighlight}>GPA: {edu.gpa}</Text>
                  </View>
                )}
                {edu.coursework && (
                  <Text style={scaledStyles.coursework}>Relevant Coursework: {edu.coursework}</Text>
                )}
                {edu.achievements && (
                  <Text style={scaledStyles.achievements}>Achievements: {edu.achievements}</Text>
                )}
                {edu.honors && <Text style={scaledStyles.honors}>Honors: {edu.honors}</Text>}
                {edu.activities && (
                  <Text style={scaledStyles.educationDetails}>Activities: {edu.activities}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'projects':
        return formData.projects?.length ? (
          <View style={scaledStyles.section}>
            <View wrap={false}>
              <Text style={scaledStyles.sectionTitle}>Projects & Portfolio</Text>
              {formData.projects[0] && (
                <View style={scaledStyles.itemContainer}>
                  <View style={scaledStyles.itemHeader}>
                    <Text style={scaledStyles.itemTitle}>{getProjectName(formData.projects[0])}</Text>
                    {formData.projects[0].projectDate && (
                      <Text style={scaledStyles.itemDate}>{formData.projects[0].projectDate}</Text>
                    )}
                  </View>
                  {getProjectLink(formData.projects[0]) && (
                    <Link src={getProjectLink(formData.projects[0])} style={scaledStyles.contactLink}>
                      {cleanLinkLabel(getProjectLink(formData.projects[0]))}
                    </Link>
                  )}
                  {getProjectDescription(formData.projects[0]) && (
                    <Text style={scaledStyles.itemDescription}>{getProjectDescription(formData.projects[0])}</Text>
                  )}
                  {getProjectTech(formData.projects[0]) && (
                    <Text style={scaledStyles.projectMeta}>Technologies: {getProjectTech(formData.projects[0])}</Text>
                  )}
                  {formData.projects[0].role && (
                    <Text style={scaledStyles.projectMeta}>Role: {formData.projects[0].role}</Text>
                  )}
                  {formData.projects[0].teamSize && (
                    <Text style={scaledStyles.projectMeta}>Team Size: {formData.projects[0].teamSize}</Text>
                  )}
                </View>
              )}
            </View>
            {formData.projects.slice(1).map((proj, idx) => (
              <View key={`${idx + 1}-${getProjectName(proj)}`} style={scaledStyles.itemContainer}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{getProjectName(proj)}</Text>
                  {proj.projectDate && (
                    <Text style={scaledStyles.itemDate}>{proj.projectDate}</Text>
                  )}
                </View>
                {getProjectLink(proj) && (
                  <Link src={getProjectLink(proj)} style={scaledStyles.contactLink}>
                    {cleanLinkLabel(getProjectLink(proj))}
                  </Link>
                )}
                {getProjectDescription(proj) && (
                  <Text style={scaledStyles.itemDescription}>{getProjectDescription(proj)}</Text>
                )}
                {getProjectTech(proj) && (
                  <Text style={scaledStyles.projectMeta}>Technologies: {getProjectTech(proj)}</Text>
                )}
                {proj.role && <Text style={scaledStyles.projectMeta}>Role: {proj.role}</Text>}
                {proj.teamSize && (
                  <Text style={scaledStyles.projectMeta}>Team Size: {proj.teamSize}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'experience':
        return formData.experiences?.length ? (
          <View style={scaledStyles.section}>
            <View wrap={false}>
              <Text style={scaledStyles.sectionTitle}>Experience & Internships</Text>
              {formData.experiences[0] && (
                <View style={scaledStyles.itemContainer}>
                  <View style={scaledStyles.itemHeader}>
                    <Text style={scaledStyles.itemTitle}>{formData.experiences[0].jobTitle}</Text>
                    <Text style={scaledStyles.itemDate}>
                      {formatDateRange(formData.experiences[0].startDate, formData.experiences[0].endDate, 'Present')}
                    </Text>
                  </View>
                  <Text style={scaledStyles.itemSubtitle}>{formData.experiences[0].company}</Text>
                  {formData.experiences[0].location && (
                    <Text style={scaledStyles.itemLocation}>{formData.experiences[0].location}</Text>
                  )}
                  {formData.experiences[0].description && (
                    <View>
                      {normalizeBulletLines(formData.experiences[0].description).map((line, lineIdx) => {
                        if (line.startsWith('-')) {
                          return (
                            <View key={lineIdx} style={scaledStyles.bulletPoint}>
                              <Text style={scaledStyles.bullet}>-</Text>
                              <Text style={scaledStyles.bulletText}>{line.substring(1).trim()}</Text>
                            </View>
                          );
                        }

                        return (
                          <Text key={lineIdx} style={scaledStyles.itemDescription}>
                            {line}
                          </Text>
                        );
                      })}
                    </View>
                  )}
                  {formData.experiences[0].achievements && (
                    <Text style={scaledStyles.achievements}>
                      Achievements: {formData.experiences[0].achievements}
                    </Text>
                  )}
                </View>
              )}
            </View>
            {formData.experiences.slice(1).map((exp, idx) => (
              <View key={`${idx + 1}-${exp.jobTitle || 'experience'}`} style={scaledStyles.itemContainer}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{exp.jobTitle}</Text>
                  <Text style={scaledStyles.itemDate}>
                    {formatDateRange(exp.startDate, exp.endDate, 'Present')}
                  </Text>
                </View>
                <Text style={scaledStyles.itemSubtitle}>{exp.company}</Text>
                {exp.location && <Text style={scaledStyles.itemLocation}>{exp.location}</Text>}
                {exp.description && (
                  <View>
                    {normalizeBulletLines(exp.description).map((line, lineIdx) => {
                      if (line.startsWith('-')) {
                        return (
                          <View key={lineIdx} style={scaledStyles.bulletPoint}>
                            <Text style={scaledStyles.bullet}>-</Text>
                            <Text style={scaledStyles.bulletText}>{line.substring(1).trim()}</Text>
                          </View>
                        );
                      }

                      return (
                        <Text key={lineIdx} style={scaledStyles.itemDescription}>
                          {line}
                        </Text>
                      );
                    })}
                  </View>
                )}
                {exp.achievements && (
                  <Text style={scaledStyles.achievements}>Achievements: {exp.achievements}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'skills':
        return formData.skills ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Technical Skills</Text>
            <View style={scaledStyles.skillsGrid}>
              {Array.isArray(formData.skills) ? (
                formData.skills.map((skill, idx) => (
                  <View key={idx} style={scaledStyles.skillTag}>
                    <Text style={scaledStyles.skillText}>{skill.name || skill}</Text>
                  </View>
                ))
              ) : (
                <View style={scaledStyles.skillTag}>
                  <Text style={scaledStyles.skillText}>{formData.skills}</Text>
                </View>
              )}
            </View>
          </View>
        ) : null;

      case 'references':
        return references.length ? (
          <View style={scaledStyles.section}>
            <View wrap={false}>
              <Text style={scaledStyles.sectionTitle}>References</Text>
              <View style={scaledStyles.itemContainer}>
                {references.slice(0, 4).map((reference, idx) => (
                  <Text key={idx} style={scaledStyles.referenceText}>{reference}</Text>
                ))}
              </View>
            </View>
          </View>
        ) : null;

      case 'certifications':
        return certificationItems.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Certifications & Training</Text>
            {certificationItems.slice(0, 4).map((cert, idx) => (
              <View key={idx} style={scaledStyles.itemContainer}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{cert.name}</Text>
                  {cert.date && <Text style={scaledStyles.itemDate}>{cert.date}</Text>}
                </View>
                {cert.issuer && <Text style={scaledStyles.itemSubtitle}>{cert.issuer}</Text>}
                {cert.expiryDate && (
                  <Text style={scaledStyles.educationDetails}>Expires: {cert.expiryDate}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'activities':
        return activityItems.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Leadership & Activities</Text>
            {activityItems.slice(0, 5).map((activity, idx) => (
              <View key={idx} style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemDescription}>{activity}</Text>
              </View>
            ))}
          </View>
        ) : null;

      case 'interests':
        return formData.interests || formData.targetIndustries ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Interests & Goals</Text>
            {formData.interests && (
              <Text style={scaledStyles.itemDescription}>{formData.interests}</Text>
            )}
            {formData.targetIndustries && (
              <Text style={scaledStyles.careerGoals}>Target Industries: {formData.targetIndustries}</Text>
            )}
            {formData.preferredWorkStyle && (
              <Text style={scaledStyles.educationDetails}>
                Preferred Work Style: {formData.preferredWorkStyle}
              </Text>
            )}
          </View>
        ) : null;

      default:
        return null;
    }
  };

  const getStudentTitle = () => {
    if (formData.targetJobTitle) return formData.targetJobTitle;
    if (formData.education?.length > 0) {
      const latestEdu = formData.education[0];
      if (latestEdu.degree) return `${latestEdu.degree} Student`;
    }
    return 'Student & Graduate';
  };

  return (
    <Document>
      <Page style={{ ...scaledStyles.page, fontFamily: fontStyle, fontSize }}>
        <View style={scaledStyles.header}>
          <View style={scaledStyles.headerTop}>
            <View style={scaledStyles.headerIdentity}>
              <Text style={scaledStyles.name}>{formData.fullName || 'Your Name'}</Text>
              <Text style={scaledStyles.title}>{getStudentTitle()}</Text>
            </View>

            <View style={scaledStyles.portraitFrame}>
              {formData.profileImage ? (
                <Image src={formData.profileImage} style={scaledStyles.portraitImage} />
              ) : (
                <Text style={scaledStyles.portraitFallback}>{buildInitials(formData.fullName)}</Text>
              )}
            </View>
          </View>

          <View style={scaledStyles.studentInfo}>
            <View style={scaledStyles.studentDetails}>
              {formData.email && (
                <View style={scaledStyles.contactItem}>
                  <Text style={scaledStyles.contactIcon}>Email:</Text>
                  <Link src={`mailto:${formData.email}`} style={scaledStyles.contactLink}>
                    {formData.email}
                  </Link>
                </View>
              )}
              {formData.phone && (
                <View style={scaledStyles.contactItem}>
                  <Text style={scaledStyles.contactIcon}>Phone:</Text>
                  <Link src={`tel:${formData.phone}`} style={scaledStyles.contactLink}>
                    {formData.phone}
                  </Link>
                </View>
              )}
              {formData.location && (
                <View style={scaledStyles.contactItem}>
                  <Text style={scaledStyles.contactIcon}>Location:</Text>
                  <Text style={scaledStyles.contactValue}>{formData.location}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={scaledStyles.contactGrid}>
            {formData.linkedin && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>LinkedIn:</Text>
                <Link src={formData.linkedin} style={scaledStyles.contactLink}>
                  {cleanLinkLabel(formData.linkedin)
                    .replace('linkedin.com/in/', '')
                    .replace('www.linkedin.com/in/', '')}
                </Link>
              </View>
            )}
            {formData.github && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>GitHub:</Text>
                <Link src={formData.github} style={scaledStyles.contactLink}>
                  {cleanLinkLabel(formData.github).replace('github.com/', '')}
                </Link>
              </View>
            )}
            {formData.website && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>Portfolio:</Text>
                <Link src={formData.website} style={scaledStyles.contactLink}>
                  {cleanLinkLabel(formData.website)}
                </Link>
              </View>
            )}
          </View>
        </View>

        {effectiveSectionOrder.map((section) => (
          <React.Fragment key={section.id}>{renderSection(section.id)}</React.Fragment>
        ))}
      </Page>
    </Document>
  );
};

export default StudentTemplatePDF;
