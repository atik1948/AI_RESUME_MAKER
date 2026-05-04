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
    borderBottomColor: '#F59E0B',
    paddingBottom: 18,
    backgroundColor: '#fffbeb',
    padding: 22,
    borderRadius: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    color: '#d97706',
    marginBottom: 12,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  creativeSummary: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  summaryText: {
    fontSize: 10,
    color: '#92400e',
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
    color: '#92400e',
    fontWeight: 'bold',
    minWidth: 70,
  },
  contactValue: {
    fontSize: 9,
    color: '#d97706',
  },
  contactLink: {
    fontSize: 9,
    color: '#F59E0B',
    textDecoration: 'underline',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    borderBottomWidth: 2,
    borderBottomColor: '#F59E0B',
    paddingBottom: 8,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemContainer: {
    marginBottom: 18,
    padding: 14,
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
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
    color: '#d97706',
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
    color: '#F59E0B',
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
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  skillText: {
    fontSize: 8,
    color: '#92400e',
    fontWeight: '600',
  },
  creativeVision: {
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
  portfolio: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#ecfdf5',
    borderRadius: 4,
  },
  clientWork: {
    fontSize: 9,
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
  },
  creativeProcess: {
    fontSize: 9,
    color: '#1e40af',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#dbeafe',
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
  creativeGoals: {
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
  projectCategory: {
    fontSize: 8,
    color: '#f59e0b',
    fontWeight: '600',
    marginTop: 4,
    padding: 2,
    backgroundColor: '#fffbeb',
    borderRadius: 3,
  },
  projectImpact: {
    fontSize: 8,
    color: '#059669',
    fontWeight: '600',
    marginTop: 4,
    padding: 2,
    backgroundColor: '#ecfdf5',
    borderRadius: 3,
  },
  styleGuide: {
    fontSize: 9,
    color: '#7c3aed',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#faf5ff',
    borderRadius: 4,
  },
});

const CreativeTemplatePDF = ({
  formData = {},
  accentColor = '#F59E0B',
  fontStyle = 'Helvetica',
  fontSize = 10,
  fontScale = 1,
  sectionOrder = [
    { id: 'summary', label: 'Creative Summary' },
    { id: 'vision', label: 'Creative Vision & Style' },
    { id: 'portfolio', label: 'Portfolio & Projects' },
    { id: 'experience', label: 'Creative Experience' },
    { id: 'skills', label: 'Creative Skills' },
    { id: 'education', label: 'Education & Training' },
    { id: 'clients', label: 'Client Work & Collaborations' },
    { id: 'process', label: 'Creative Process' },
    { id: 'goals', label: 'Creative Goals' },
  ],
}) => {
  const scaledStyles = scalePdfStyles(styles, fontScale);

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return formData.summary ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Creative Summary</Text>
            <View style={scaledStyles.creativeSummary}>
              <Text style={scaledStyles.summaryText}>{formData.summary}</Text>
            </View>
            {formData.creativeVision && (
              <Text style={scaledStyles.creativeVision}>
                🎨 Creative Vision: {formData.creativeVision}
              </Text>
            )}
          </View>
        ) : null;

      case 'vision':
        return (formData.creativeVision || formData.creativeStyle) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Creative Vision & Style</Text>
            <View style={scaledStyles.itemContainer}>
              {formData.creativeVision && (
                <Text style={scaledStyles.itemDescription}>
                  <Text style={{ fontWeight: 'bold' }}>Creative Vision:</Text>
                  {'\n'}{formData.creativeVision}
                </Text>
              )}
              {formData.creativeStyle && (
                <Text style={scaledStyles.itemDescription}>
                  <Text style={{ fontWeight: 'bold' }}>Creative Style:</Text>
                  {'\n'}{formData.creativeStyle}
                </Text>
              )}
              {formData.creativeProcess && (
                <Text style={scaledStyles.creativeProcess}>
                  🔄 Process: {formData.creativeProcess}
                </Text>
              )}
              {formData.industryTrends && (
                <Text style={scaledStyles.creativeProcess}>
                  📈 Trends: {formData.industryTrends}
                </Text>
              )}
            </View>
          </View>
        ) : null;

      case 'portfolio':
        return formData.projects?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Portfolio & Projects</Text>
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
                    🛠️ Tools: {proj.technologies}
                  </Text>
                )}
                {proj.role && (
                  <Text style={scaledStyles.projectTech}>👤 Role: {proj.role}</Text>
                )}
                {proj.category && (
                  <Text style={scaledStyles.projectCategory}>
                    🏷️ {proj.category}
                  </Text>
                )}
                {proj.impact && (
                  <Text style={scaledStyles.projectImpact}>
                    💫 Impact: {proj.impact}
                  </Text>
                )}
                {proj.client && (
                  <Text style={scaledStyles.clientWork}>
                    👥 Client: {proj.client}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'experience':
        return formData.experiences?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Creative Experience</Text>
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

      case 'skills':
        return formData.skills ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Creative Skills</Text>
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
            {formData.software && (
              <Text style={scaledStyles.creativeProcess}>
                💻 Software: {formData.software}
              </Text>
            )}
            {formData.techniques && (
              <Text style={scaledStyles.creativeProcess}>
                🎭 Techniques: {formData.techniques}
              </Text>
            )}
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
                {edu.achievements && (
                  <Text style={scaledStyles.achievements}>🏆 {edu.achievements}</Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'clients':
        return (formData.targetAudience || formData.clientBase || formData.collaborations) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Client Work & Collaborations</Text>
            {formData.targetAudience && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Target Audience</Text>
                <Text style={scaledStyles.itemDescription}>{formData.targetAudience}</Text>
              </View>
            )}
            {formData.clientBase && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Client Base</Text>
                <Text style={scaledStyles.itemDescription}>{formData.clientBase}</Text>
              </View>
            )}
            {formData.collaborations && (
              <Text style={scaledStyles.clientWork}>
                🤝 Collaborations: {formData.collaborations}
              </Text>
            )}
            {formData.industryExperience && (
              <Text style={scaledStyles.creativeProcess}>
                🏭 Industries: {formData.industryExperience}
              </Text>
            )}
          </View>
        ) : null;

      case 'process':
        return (formData.creativeProcess || formData.workflow || formData.methodology) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Creative Process & Methodology</Text>
            {formData.creativeProcess && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Creative Process</Text>
                <Text style={scaledStyles.itemDescription}>{formData.creativeProcess}</Text>
              </View>
            )}
            {formData.workflow && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Workflow</Text>
                <Text style={scaledStyles.itemDescription}>{formData.workflow}</Text>
              </View>
            )}
            {formData.methodology && (
              <Text style={scaledStyles.creativeProcess}>
                🧪 Methodology: {formData.methodology}
              </Text>
            )}
            {formData.styleGuide && (
              <Text style={scaledStyles.styleGuide}>
                📐 Style Guide: {formData.styleGuide}
              </Text>
            )}
          </View>
        ) : null;

      case 'goals':
        return (formData.creativeGoals || formData.targetAudience || formData.industryTrends) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Creative Goals</Text>
            {formData.creativeGoals && (
              <Text style={scaledStyles.creativeGoals}>
                🎯 Creative Goals: {formData.creativeGoals}
              </Text>
            )}
            {formData.targetAudience && (
              <Text style={scaledStyles.creativeProcess}>
                👥 Target Audience: {formData.targetAudience}
              </Text>
            )}
            {formData.industryTrends && (
              <Text style={scaledStyles.creativeProcess}>
                📈 Industry Trends: {formData.industryTrends}
              </Text>
            )}
            {formData.futureProjects && (
              <Text style={scaledStyles.portfolio}>
                🚀 Future Projects: {formData.futureProjects}
              </Text>
            )}
          </View>
        ) : null;

      default:
        return null;
    }
  };

  const getCreativeTitle = () => {
    if (formData.targetJobTitle) return formData.targetJobTitle;
    if (formData.creativeVision) {
      if (formData.creativeVision.includes('Design')) return 'Creative Designer';
      if (formData.creativeVision.includes('Art')) return 'Visual Artist';
      if (formData.creativeVision.includes('Digital')) return 'Digital Creative';
      return 'Creative Professional';
    }
    return 'Creative Professional';
  };

  const getCreativeStyle = () => {
    if (formData.creativeStyle) return formData.creativeStyle;
    if (formData.creativeVision) return formData.creativeVision;
    return 'Creative & Visual Arts';
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
            {getCreativeTitle()}
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
            {formData.website && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>🌐 Portfolio:</Text>
                <Link src={formData.website} style={scaledStyles.contactLink}>
                  {formData.website.replace('https://', '').replace('http://', '')}
                </Link>
              </View>
            )}
            {formData.behance && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>🎨 Behance:</Text>
                <Link src={formData.behance} style={scaledStyles.contactLink}>
                  {formData.behance.replace('https://www.behance.net/', '')}
                </Link>
              </View>
            )}
            {formData.dribbble && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>🏀 Dribbble:</Text>
                <Link src={formData.dribbble} style={scaledStyles.contactLink}>
                  {formData.dribbble.replace('https://dribbble.com/', '')}
                </Link>
              </View>
            )}
            {formData.instagram && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>📸 Instagram:</Text>
                <Link src={formData.instagram} style={scaledStyles.contactLink}>
                  {formData.instagram.replace('https://www.instagram.com/', '@')}
                </Link>
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

export default CreativeTemplatePDF;


