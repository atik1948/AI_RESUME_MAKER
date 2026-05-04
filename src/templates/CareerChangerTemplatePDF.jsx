import React from 'react';
import { Document, Page, View, Text, StyleSheet, Link } from '@react-pdf/renderer';
import { scalePdfStyles } from '../utils/pdfResume';

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
    marginBottom: 26,
    borderBottomWidth: 3,
    borderBottomColor: '#10B981',
    paddingBottom: 18,
    backgroundColor: '#f0fdf4',
    padding: 22,
    borderRadius: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#065f46',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    color: '#047857',
    marginBottom: 12,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  transitionStory: {
    backgroundColor: '#ecfdf5',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  storyText: {
    fontSize: 10,
    color: '#065f46',
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginTop: 18,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactIcon: {
    fontSize: 9,
    color: '#065f46',
    fontWeight: 'bold',
    minWidth: 70,
  },
  contactValue: {
    fontSize: 9,
    color: '#047857',
  },
  contactLink: {
    fontSize: 9,
    color: '#10B981',
    textDecoration: 'underline',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#065f46',
    borderBottomWidth: 2,
    borderBottomColor: '#10B981',
    paddingBottom: 8,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemContainer: {
    marginBottom: 18,
    padding: 14,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
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
    color: '#0f172a',
    flex: 1,
  },
  itemSubtitle: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'right',
    minWidth: 85,
  },
  itemLocation: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 9,
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
    color: '#10B981',
    marginRight: 8,
    marginTop: 1,
    fontWeight: 'bold',
  },
  bulletText: {
    fontSize: 9,
    color: '#334155',
    flex: 1,
    lineHeight: 1.4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillTag: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  skillText: {
    fontSize: 8,
    color: '#065f46',
    fontWeight: '600',
  },
  transferableSkills: {
    fontSize: 10,
    color: '#7c2d12',
    fontWeight: '600',
    marginTop: 8,
    padding: 6,
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  motivation: {
    fontSize: 9,
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
  },
  preparation: {
    fontSize: 9,
    color: '#1e40af',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#dbeafe',
    borderRadius: 4,
  },
  timeline: {
    fontSize: 9,
    color: '#7c2d12',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#fef3c7',
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
  achievements: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#ecfdf5',
    borderRadius: 4,
  },
  careerGoals: {
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
});

const CareerChangerTemplatePDF = ({
  formData = {},
  accentColor = '#10B981',
  fontStyle = 'Helvetica',
  fontSize = 10,
  fontScale = 1,
  sectionOrder = [
    { id: 'summary', label: 'Career Transition Summary' },
    { id: 'motivation', label: 'Motivation for Change' },
    { id: 'transferable', label: 'Transferable Skills' },
    { id: 'experience', label: 'Previous Experience' },
    { id: 'preparation', label: 'Preparation & Training' },
    { id: 'projects', label: 'Relevant Projects' },
    { id: 'education', label: 'Education & Training' },
    { id: 'skills', label: 'Technical Skills' },
    { id: 'goals', label: 'Career Goals' },
  ],
}) => {
  const scaledStyles = scalePdfStyles(styles, fontScale);

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return formData.summary ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Career Transition Summary</Text>
            <View style={scaledStyles.transitionStory}>
              <Text style={scaledStyles.storyText}>{formData.summary}</Text>
            </View>
            {formData.motivationForChange && (
              <Text style={scaledStyles.motivation}>
                💡 Motivation: {formData.motivationForChange}
              </Text>
            )}
          </View>
        ) : null;

      case 'motivation':
        return formData.motivationForChange ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Motivation for Career Change</Text>
            <View style={scaledStyles.itemContainer}>
              <Text style={scaledStyles.itemDescription}>{formData.motivationForChange}</Text>
              {formData.targetIndustry && (
                <Text style={scaledStyles.preparation}>
                  🎯 Target Industry: {formData.targetIndustry}
                </Text>
              )}
              {formData.timelineForTransition && (
                <Text style={scaledStyles.timeline}>
                  ⏰ Timeline: {formData.timelineForTransition}
                </Text>
              )}
            </View>
          </View>
        ) : null;

      case 'transferable':
        return (formData.transferableSkills || formData.softSkills) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Transferable Skills</Text>
            <View style={scaledStyles.itemContainer}>
              {formData.transferableSkills && (
                <Text style={scaledStyles.itemDescription}>
                  <Text style={{ fontWeight: 'bold' }}>Core Transferable Skills:</Text>
                  {'\n'}{formData.transferableSkills}
                </Text>
              )}
              {formData.softSkills && (
                <Text style={scaledStyles.itemDescription}>
                  <Text style={{ fontWeight: 'bold' }}>Soft Skills:</Text>
                  {'\n'}{formData.softSkills}
                </Text>
              )}
              {formData.leadershipSkills && (
                <Text style={scaledStyles.transferableSkills}>
                  👑 Leadership: {formData.leadershipSkills}
                </Text>
              )}
              {formData.communicationSkills && (
                <Text style={scaledStyles.transferableSkills}>
                  💬 Communication: {formData.communicationSkills}
                </Text>
              )}
            </View>
          </View>
        ) : null;

      case 'experience':
        return formData.experiences?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Previous Experience</Text>
            {formData.experiences.map((exp, idx) => (
              <View key={idx} style={scaledStyles.itemContainer}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{exp.jobTitle}</Text>
                  <Text style={scaledStyles.itemDate}>
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </Text>
                </View>
                <Text style={scaledStyles.itemSubtitle}>{exp.company}</Text>
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
                  <Text style={scaledStyles.achievements}>🏆 {exp.achievements}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'preparation':
        return (formData.supportingActivities || formData.certifications || formData.courses) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Preparation & Training</Text>
            {formData.supportingActivities && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Supporting Activities</Text>
                <Text style={scaledStyles.itemDescription}>{formData.supportingActivities}</Text>
              </View>
            )}
            {formData.courses && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Relevant Courses</Text>
                <Text style={scaledStyles.itemDescription}>{formData.courses}</Text>
              </View>
            )}
            {formData.certifications?.length > 0 && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Certifications</Text>
                {formData.certifications.map((cert, idx) => (
                  <View key={idx} style={{ marginBottom: 8 }}>
                    <Text style={scaledStyles.itemSubtitle}>{cert.name}</Text>
                    {cert.issuer && (
                      <Text style={scaledStyles.educationDetails}>Issuer: {cert.issuer}</Text>
                    )}
                    {cert.date && (
                      <Text style={scaledStyles.educationDetails}>Date: {cert.date}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : null;

      case 'projects':
        return formData.projects?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Relevant Projects</Text>
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
              </View>
            ))}
          </View>
        ) : null;

      case 'education':
        return formData.education?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Education & Training</Text>
            {formData.education.map((edu, idx) => (
              <View key={idx} style={scaledStyles.itemContainer}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{edu.degree}</Text>
                  <Text style={scaledStyles.itemDate}>
                    {edu.startDate} – {edu.endDate || 'Present'}
                  </Text>
                </View>
                <Text style={scaledStyles.itemSubtitle}>{edu.school}</Text>
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
              </View>
            ))}
          </View>
        ) : null;

      case 'skills':
        return formData.skills ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Technical Skills</Text>
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

      case 'goals':
        return (formData.careerGoals || formData.targetIndustries || formData.preferredWorkStyle) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Career Goals</Text>
            {formData.careerGoals && (
              <Text style={scaledStyles.careerGoals}>
                🎯 Career Goals: {formData.careerGoals}
              </Text>
            )}
            {formData.targetIndustries && (
              <Text style={scaledStyles.preparation}>
                🏭 Target Industries: {formData.targetIndustries}
              </Text>
            )}
            {formData.preferredWorkStyle && (
              <Text style={scaledStyles.preparation}>
                💼 Preferred Work Style: {formData.preferredWorkStyle}
              </Text>
            )}
            {formData.relocationWillingness && (
              <Text style={scaledStyles.timeline}>
                🌍 Relocation: {formData.relocationWillingness}
              </Text>
            )}
          </View>
        ) : null;

      default:
        return null;
    }
  };

  const getCareerChangerTitle = () => {
    if (formData.targetJobTitle) return formData.targetJobTitle;
    if (formData.targetIndustry) return `${formData.targetIndustry} Professional`;
    if (formData.previousIndustry && formData.targetIndustry) {
      return `${formData.previousIndustry} to ${formData.targetIndustry} Transition`;
    }
    return 'Career Transition Professional';
  };

  const getTransitionTimeline = () => {
    if (formData.timelineForTransition) return formData.timelineForTransition;
    return 'Career Transition';
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
            {getCareerChangerTitle()}
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
                <Text style={scaledStyles.contactIcon}>🌐 Portfolio:</Text>
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

export default CareerChangerTemplatePDF;
