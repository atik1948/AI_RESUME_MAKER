import React from 'react';
import { Document, Page, View, Text, StyleSheet, Link } from '@react-pdf/renderer';
import { scalePdfStyles } from '../utils/pdfResume';

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
          expiryDate: String(cert?.expiryDate || '').trim(),
        };
      })
      .filter((cert) => cert.name);
  }

  return buildTextList(value).map((name) => ({ name }));
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    backgroundColor: '#ffffff',
    color: '#1e293b',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 28,
    borderBottomWidth: 4,
    borderBottomColor: '#1E293B',
    paddingBottom: 20,
    backgroundColor: '#f8fafc',
    padding: 24,
    borderRadius: 8,
  },
  name: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18,
    color: '#475569',
    marginBottom: 16,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  executiveSummary: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1E293B',
  },
  summaryText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactIcon: {
    fontSize: 9,
    color: '#1E293B',
    fontWeight: 'bold',
    minWidth: 75,
  },
  contactValue: {
    fontSize: 9,
    color: '#475569',
  },
  contactLink: {
    fontSize: 9,
    color: '#1E293B',
    textDecoration: 'underline',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
    borderBottomWidth: 2,
    borderBottomColor: '#1E293B',
    paddingBottom: 8,
    marginBottom: 18,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1E293B',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    flex: 1,
  },
  itemCompany: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 10,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'right',
    minWidth: 90,
  },
  itemLocation: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 10,
    color: '#334155',
    marginBottom: 6,
    lineHeight: 1.4,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 8,
    color: '#1E293B',
    marginRight: 8,
    marginTop: 1,
    fontWeight: 'bold',
  },
  bulletText: {
    fontSize: 10,
    color: '#334155',
    flex: 1,
    lineHeight: 1.4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillTag: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  skillText: {
    fontSize: 9,
    color: '#1E293B',
    fontWeight: '600',
  },
  achievements: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
    marginTop: 8,
    padding: 6,
    backgroundColor: '#ecfdf5',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
  },
  metrics: {
    fontSize: 9,
    color: '#7c2d12',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
  },
  leadership: {
    fontSize: 9,
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
  },
  educationDetails: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 4,
  },
  projectTech: {
    fontSize: 8,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  careerObjectives: {
    fontSize: 10,
    color: '#7c2d12',
    fontStyle: 'italic',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  industryExpertise: {
    fontSize: 9,
    color: '#1e40af',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#dbeafe',
    borderRadius: 4,
  },
  timeline: {
    fontSize: 8,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

const ExperiencedTemplatePDF = ({
  formData = {},
  accentColor = '#1E293B',
  fontStyle = 'Helvetica',
  fontSize = 10,
  fontScale = 1,
  sectionOrder = [
    { id: 'summary', label: 'Executive Summary' },
    { id: 'experience', label: 'Professional Experience' },
    { id: 'education', label: 'Education & Credentials' },
    { id: 'leadership', label: 'Leadership & Achievements' },
    { id: 'projects', label: 'Strategic Projects' },
    { id: 'skills', label: 'Core Competencies' },
    { id: 'certifications', label: 'Professional Certifications' },
    { id: 'objectives', label: 'Career Objectives' },
  ],
}) => {
  const scaledStyles = scalePdfStyles(styles, fontScale);
  const leadershipText = formData.managementExperience || formData.leadership || '';
  const achievementsText = formData.keyAchievements || formData.achievements || '';
  const specializationText = formData.specializations || '';
  const industryText = formData.industryExperience || formData.targetIndustry || formData.industryPreferences || '';
  const progressionText = formData.careerProgression || '';
  const certificationItems = buildCertificationItems(formData.certifications);

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return formData.summary ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Executive Summary</Text>
            <View style={scaledStyles.executiveSummary}>
              <Text style={scaledStyles.summaryText}>{formData.summary}</Text>
            </View>
            {formData.careerObjectives && (
              <Text style={scaledStyles.careerObjectives}>
                🎯 Career Objectives: {formData.careerObjectives}
              </Text>
            )}
          </View>
        ) : null;

      case 'experience':
        return formData.experiences?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Professional Experience</Text>
            {formData.experiences.map((exp, idx) => (
              <View key={idx} style={scaledStyles.itemContainer}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{exp.jobTitle}</Text>
                  <Text style={scaledStyles.itemDate}>
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </Text>
                </View>
                <Text style={scaledStyles.itemCompany}>{exp.company}</Text>
                {exp.location && (
                  <Text style={scaledStyles.itemLocation}>📍 {exp.location}</Text>
                )}
                {exp.description && (
                  <View>
                    {exp.description.split('\n').map((line, lineIdx) => {
                      if (line.trim().startsWith('•')) {
                        return (
                          <View key={lineIdx} style={scaledStyles.bulletPoint}>
                            <Text style={scaledStyles.bullet}>•</Text>
                            <Text style={scaledStyles.bulletText}>{line.trim().substring(1).trim()}</Text>
                          </View>
                        );
                      }
                      return (
                        <Text key={lineIdx} style={scaledStyles.itemDescription}>
                          {line.trim()}
                        </Text>
                      );
                    })}
                  </View>
                )}
                {exp.achievements && (
                  <Text style={scaledStyles.achievements}>🏆 Key Achievements: {exp.achievements}</Text>
                )}
                {exp.teamSize && (
                  <Text style={scaledStyles.leadership}>👥 Team Leadership: {exp.teamSize} direct reports</Text>
                )}
                {exp.budget && (
                  <Text style={scaledStyles.metrics}>💰 Budget Management: ${exp.budget}</Text>
                )}
                {exp.revenue && (
                  <Text style={scaledStyles.metrics}>📈 Revenue Impact: ${exp.revenue}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'education':
        return formData.education?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Education & Credentials</Text>
            {formData.education.map((edu, idx) => (
              <View key={idx} style={scaledStyles.itemContainer}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{edu.degree}</Text>
                  <Text style={scaledStyles.itemDate}>
                    {edu.startDate} – {edu.endDate || 'Present'}
                  </Text>
                </View>
                <Text style={scaledStyles.itemCompany}>{edu.school}</Text>
                {edu.location && (
                  <Text style={scaledStyles.itemLocation}>📍 {edu.location}</Text>
                )}
                {edu.gpa && (
                  <Text style={scaledStyles.educationDetails}>GPA: {edu.gpa}</Text>
                )}
                {edu.coursework && (
                  <Text style={scaledStyles.educationDetails}>
                    Relevant Coursework: {edu.coursework}
                  </Text>
                )}
                {edu.achievements && (
                  <Text style={scaledStyles.achievements}>🏆 {edu.achievements}</Text>
                )}
                {edu.honors && (
                  <Text style={scaledStyles.leadership}>🎖️ {edu.honors}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'leadership':
        return (leadershipText || achievementsText || specializationText || industryText || progressionText) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Leadership & Achievements</Text>
            {leadershipText && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Leadership Experience</Text>
                <Text style={scaledStyles.itemDescription}>{leadershipText}</Text>
              </View>
            )}
            {achievementsText && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Key Achievements</Text>
                <Text style={scaledStyles.itemDescription}>{achievementsText}</Text>
              </View>
            )}
            {specializationText && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Areas of Specialization</Text>
                <Text style={scaledStyles.itemDescription}>{specializationText}</Text>
              </View>
            )}
            {industryText && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Industries Worked In</Text>
                <Text style={scaledStyles.itemDescription}>{industryText}</Text>
              </View>
            )}
            {progressionText && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Career Progression</Text>
                <Text style={scaledStyles.itemDescription}>{progressionText}</Text>
              </View>
            )}
            {formData.awards && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Awards & Recognition</Text>
                <Text style={scaledStyles.itemDescription}>{formData.awards}</Text>
              </View>
            )}
          </View>
        ) : null;

      case 'projects':
        return formData.projects?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Strategic Projects</Text>
            {formData.projects.map((proj, idx) => (
              <View key={idx} style={scaledStyles.itemContainer}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{proj.projectName}</Text>
                  {proj.projectDate && (
                    <Text style={scaledStyles.itemDate}>{proj.projectDate}</Text>
                  )}
                </View>
                {proj.projectLink && (
                  <Link src={proj.projectLink} style={scaledStyles.contactLink}>
                    🔗 {proj.projectLink.replace('https://', '').replace('http://', '')}
                  </Link>
                )}
                {proj.projectDescription && (
                  <Text style={scaledStyles.itemDescription}>{proj.projectDescription}</Text>
                )}
                {proj.technologies && (
                  <Text style={scaledStyles.projectTech}>
                    🛠️ Technologies: {proj.technologies}
                  </Text>
                )}
                {proj.role && (
                  <Text style={scaledStyles.projectTech}>👤 Role: {proj.role}</Text>
                )}
                {proj.teamSize && (
                  <Text style={scaledStyles.projectTech}>👥 Team Size: {proj.teamSize}</Text>
                )}
                {proj.budget && (
                  <Text style={scaledStyles.metrics}>💰 Project Budget: ${proj.budget}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'skills':
        return formData.skills ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Core Competencies</Text>
            <View style={scaledStyles.skillsGrid}>
              {Array.isArray(formData.skills)
                ? formData.skills.map((skill, idx) => (
                    <View key={idx} style={scaledStyles.skillTag}>
                      <Text style={scaledStyles.skillText}>
                        {skill.name || skill}
                      </Text>
                    </View>
                  ))
                : (
                    <View style={scaledStyles.skillTag}>
                      <Text style={scaledStyles.skillText}>{formData.skills}</Text>
                    </View>
                  )}
            </View>
          </View>
        ) : null;

      case 'certifications':
        return certificationItems.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Professional Certifications</Text>
            {certificationItems.slice(0, 6).map((cert, idx) => (
              <View key={idx} style={scaledStyles.itemContainer}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{cert.name}</Text>
                  {cert.date && (
                    <Text style={scaledStyles.itemDate}>{cert.date}</Text>
                  )}
                </View>
                {cert.issuer && (
                  <Text style={scaledStyles.itemCompany}>{cert.issuer}</Text>
                )}
                {cert.expiryDate && (
                  <Text style={scaledStyles.educationDetails}>
                    Expires: {cert.expiryDate}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'objectives':
        return (formData.targetRoles || formData.preferredCompanySize || formData.industryPreferences || formData.targetIndustry || formData.yearsExperience) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Career Objectives</Text>
            {formData.targetRoles && (
              <Text style={scaledStyles.careerObjectives}>
                🎯 Target Roles: {formData.targetRoles}
              </Text>
            )}
            {formData.preferredCompanySize && (
              <Text style={scaledStyles.industryExpertise}>
                🏢 Preferred Company Size: {formData.preferredCompanySize}
              </Text>
            )}
            {formData.industryPreferences && (
              <Text style={scaledStyles.industryExpertise}>
                🏭 Industry Preferences: {formData.industryPreferences}
              </Text>
            )}
            {formData.targetIndustry && (
              <Text style={scaledStyles.industryExpertise}>
                Target Industry: {formData.targetIndustry}
              </Text>
            )}
            {formData.yearsExperience && (
              <Text style={scaledStyles.timeline}>
                📅 Total Experience: {formData.yearsExperience} years
              </Text>
            )}
          </View>
        ) : null;

      default:
        return null;
    }
  };

  const getExecutiveTitle = () => {
    if (formData.targetJobTitle) return formData.targetJobTitle;
    if (formData.experiences?.length > 0) return formData.experiences[0].jobTitle;
    if (formData.yearsExperience) {
      const years = parseInt(formData.yearsExperience);
      if (years >= 15) return 'Senior Executive';
      if (years >= 10) return 'Experienced Professional';
      if (years >= 5) return 'Mid-Career Professional';
      return 'Professional';
    }
    return 'Experienced Professional';
  };

  const getYearsExperience = () => {
    if (formData.yearsExperience) return `${formData.yearsExperience}+ years`;
    if (formData.experiences?.length > 0) {
      const totalYears = formData.experiences.reduce((total, exp) => {
        const start = new Date(exp.startDate);
        const end = exp.endDate ? new Date(exp.endDate) : new Date();
        const years = (end - start) / (1000 * 60 * 60 * 24 * 365);
        return total + years;
      }, 0);
      return `${Math.round(totalYears)}+ years`;
    }
    return 'Experienced';
  };

  return (
    <Document>
      <Page style={{ ...scaledStyles.page, fontFamily: fontStyle, fontSize }}>
        {/* Header Section */}
        <View style={scaledStyles.header}>
          <Text style={scaledStyles.name}>
            {formData.fullName || 'Your Name'}
          </Text>
          <Text style={scaledStyles.title}>
            {getExecutiveTitle()}
          </Text>
          
          <View style={scaledStyles.contactGrid}>
            {formData.email && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>📧 Email:</Text>
                <Link src={`mailto:${formData.email}`} style={scaledStyles.contactLink}>
                  {formData.email}
                </Link>
              </View>
            )}
            {formData.phone && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>📱 Phone:</Text>
                <Link src={`tel:${formData.phone}`} style={scaledStyles.contactLink}>
                  {formData.phone}
                </Link>
              </View>
            )}
            {formData.location && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>📍 Location:</Text>
                <Text style={scaledStyles.contactValue}>{formData.location}</Text>
              </View>
            )}
            {formData.linkedin && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>💼 LinkedIn:</Text>
                <Link src={formData.linkedin} style={scaledStyles.contactLink}>
                  {formData.linkedin.replace('https://linkedin.com/in/', '').replace('https://www.linkedin.com/in/', '')}
                </Link>
              </View>
            )}
            {formData.website && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>🌐 Website:</Text>
                <Link src={formData.website} style={scaledStyles.contactLink}>
                  {formData.website.replace('https://', '').replace('http://', '')}
                </Link>
              </View>
            )}
            {formData.github && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>💻 GitHub:</Text>
                <Link src={formData.github} style={scaledStyles.contactLink}>
                  {formData.github.replace('https://github.com/', '')}
                </Link>
              </View>
            )}
          </View>
        </View>

        {/* Dynamic Sections */}
        {sectionOrder.map(section => (
          <React.Fragment key={section.id}>
            {renderSection(section.id)}
          </React.Fragment>
        ))}
      </Page>
    </Document>
  );
};

export default ExperiencedTemplatePDF;
