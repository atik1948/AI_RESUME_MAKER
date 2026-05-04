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
    borderBottomColor: '#7C3AED',
    paddingBottom: 18,
    backgroundColor: '#faf5ff',
    padding: 22,
    borderRadius: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#581c87',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 16,
    color: '#7c3aed',
    marginBottom: 12,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  academicSummary: {
    backgroundColor: '#f3e8ff',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  summaryText: {
    fontSize: 10,
    color: '#581c87',
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
    color: '#581c87',
    fontWeight: 'bold',
    minWidth: 70,
  },
  contactValue: {
    fontSize: 9,
    color: '#7c3aed',
  },
  contactLink: {
    fontSize: 9,
    color: '#7C3AED',
    textDecoration: 'underline',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#581c87',
    borderBottomWidth: 2,
    borderBottomColor: '#7C3AED',
    paddingBottom: 8,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemContainer: {
    marginBottom: 18,
    padding: 14,
    backgroundColor: '#faf5ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
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
    color: '#7c3aed',
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
    color: '#7C3AED',
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
    backgroundColor: '#ede9fe',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#7C3AED',
  },
  skillText: {
    fontSize: 8,
    color: '#581c87',
    fontWeight: '600',
  },
  researchInterests: {
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
  publications: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#ecfdf5',
    borderRadius: 4,
  },
  grants: {
    fontSize: 9,
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 6,
    padding: 4,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
  },
  collaboration: {
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
  academicGoals: {
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
  publicationType: {
    fontSize: 8,
    color: '#7c3aed',
    fontWeight: '600',
    marginTop: 4,
    padding: 2,
    backgroundColor: '#f3e8ff',
    borderRadius: 3,
  },
  impactFactor: {
    fontSize: 8,
    color: '#059669',
    fontWeight: '600',
    marginTop: 4,
    padding: 2,
    backgroundColor: '#ecfdf5',
    borderRadius: 3,
  },
});

const AcademicTemplatePDF = ({
  formData = {},
  accentColor = '#7C3AED',
  fontStyle = 'Helvetica',
  fontSize = 10,
  fontScale = 1,
  sectionOrder = [
    { id: 'summary', label: 'Academic Summary' },
    { id: 'research', label: 'Research Interests' },
    { id: 'publications', label: 'Publications' },
    { id: 'grants', label: 'Grants & Funding' },
    { id: 'experience', label: 'Academic Experience' },
    { id: 'education', label: 'Education & Credentials' },
    { id: 'projects', label: 'Research Projects' },
    { id: 'skills', label: 'Research Skills' },
    { id: 'collaboration', label: 'Collaborations' },
    { id: 'goals', label: 'Academic Goals' },
  ],
}) => {
  const scaledStyles = scalePdfStyles(styles, fontScale);

  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'summary':
        return formData.summary ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Academic Summary</Text>
            <View style={scaledStyles.academicSummary}>
              <Text style={scaledStyles.summaryText}>{formData.summary}</Text>
            </View>
            {formData.researchInterests && (
              <Text style={scaledStyles.researchInterests}>
                🔬 Research Focus: {formData.researchInterests}
              </Text>
            )}
          </View>
        ) : null;

      case 'research':
        return (formData.researchInterests || formData.researchFocus) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Research Interests & Focus Areas</Text>
            <View style={scaledStyles.itemContainer}>
              {formData.researchInterests && (
                <Text style={scaledStyles.itemDescription}>
                  <Text style={{ fontWeight: 'bold' }}>Primary Research Interests:</Text>
                  {'\n'}{formData.researchInterests}
                </Text>
              )}
              {formData.researchFocus && (
                <Text style={scaledStyles.itemDescription}>
                  <Text style={{ fontWeight: 'bold' }}>Research Focus Areas:</Text>
                  {'\n'}{formData.researchFocus}
                </Text>
              )}
              {formData.methodology && (
                <Text style={scaledStyles.researchInterests}>
                  🧪 Methodology: {formData.methodology}
                </Text>
              )}
              {formData.researchTools && (
                <Text style={scaledStyles.researchInterests}>
                  🛠️ Research Tools: {formData.researchTools}
                </Text>
              )}
            </View>
          </View>
        ) : null;

      case 'publications':
        return formData.publications?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Publications</Text>
            {formData.publications.map((pub, idx) => (
              <View key={idx} style={scaledStyles.itemContainer}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{pub.title}</Text>
                  {pub.date && (
                    <Text style={scaledStyles.itemDate}>{pub.date}</Text>
                  )}
                </View>
                {pub.authors && (
                  <Text style={scaledStyles.itemSubtitle}>{pub.authors}</Text>
                )}
                {pub.journal && (
                  <Text style={scaledStyles.itemDescription}>
                    📚 Journal: {pub.journal}
                  </Text>
                )}
                {pub.doi && (
                  <Link src={`https://doi.org/${pub.doi}`} style={scaledStyles.contactLink}>
                    🔗 DOI: {pub.doi}
                  </Link>
                )}
                {pub.type && (
                  <Text style={scaledStyles.publicationType}>
                    📄 {pub.type}
                  </Text>
                )}
                {pub.impactFactor && (
                  <Text style={scaledStyles.impactFactor}>
                    📊 Impact Factor: {pub.impactFactor}
                  </Text>
                )}
                {pub.citations && (
                  <Text style={scaledStyles.publications}>
                    📈 Citations: {pub.citations}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'grants':
        return formData.grants?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Grants & Funding</Text>
            {formData.grants.map((grant, idx) => (
              <View key={idx} style={scaledStyles.itemContainer}>
                <View style={scaledStyles.itemHeader}>
                  <Text style={scaledStyles.itemTitle}>{grant.title}</Text>
                  {grant.date && (
                    <Text style={scaledStyles.itemDate}>{grant.date}</Text>
                  )}
                </View>
                {grant.fundingAgency && (
                  <Text style={scaledStyles.itemSubtitle}>{grant.fundingAgency}</Text>
                )}
                {grant.amount && (
                  <Text style={scaledStyles.grants}>
                    💰 Amount: ${grant.amount}
                  </Text>
                )}
                {grant.role && (
                  <Text style={scaledStyles.itemDescription}>
                    👤 Role: {grant.role}
                  </Text>
                )}
                {grant.description && (
                  <Text style={scaledStyles.itemDescription}>{grant.description}</Text>
                )}
                {grant.status && (
                  <Text style={scaledStyles.publications}>
                    📋 Status: {grant.status}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'experience':
        return formData.experiences?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Academic Experience</Text>
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
                {edu.thesis && (
                  <Text style={scaledStyles.researchInterests}>
                    📝 Thesis: {edu.thesis}
                  </Text>
                )}
                {edu.advisor && (
                  <Text style={scaledStyles.educationDetails}>
                    Advisor: {edu.advisor}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'projects':
        return formData.projects?.length ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Research Projects</Text>
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
                {proj.funding && (
                  <Text style={scaledStyles.grants}>
                    💰 Funding: {proj.funding}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : null;

      case 'skills':
        return formData.skills ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Research Skills</Text>
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

      case 'collaboration':
        return (formData.collaborationPreferences || formData.internationalCollaborations) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Collaborations & Partnerships</Text>
            {formData.collaborationPreferences && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>Collaboration Preferences</Text>
                <Text style={scaledStyles.itemDescription}>{formData.collaborationPreferences}</Text>
              </View>
            )}
            {formData.internationalCollaborations && (
              <View style={scaledStyles.itemContainer}>
                <Text style={scaledStyles.itemTitle}>International Collaborations</Text>
                <Text style={scaledStyles.itemDescription}>{formData.internationalCollaborations}</Text>
              </View>
            )}
            {formData.industryPartnerships && (
              <Text style={scaledStyles.collaboration}>
                🤝 Industry Partnerships: {formData.industryPartnerships}
              </Text>
            )}
          </View>
        ) : null;

      case 'goals':
        return (formData.publicationGoals || formData.fundingSources || formData.researchImpact) ? (
          <View style={scaledStyles.section}>
            <Text style={scaledStyles.sectionTitle}>Academic Goals</Text>
            {formData.publicationGoals && (
              <Text style={scaledStyles.academicGoals}>
                📚 Publication Goals: {formData.publicationGoals}
              </Text>
            )}
            {formData.fundingSources && (
              <Text style={scaledStyles.researchInterests}>
                💰 Funding Sources: {formData.fundingSources}
              </Text>
            )}
            {formData.researchImpact && (
              <Text style={scaledStyles.researchInterests}>
                🌍 Research Impact: {formData.researchImpact}
              </Text>
            )}
            {formData.conferencePresentations && (
              <Text style={scaledStyles.publications}>
                🎤 Conference Presentations: {formData.conferencePresentations}
              </Text>
            )}
          </View>
        ) : null;

      default:
        return null;
    }
  };

  const getAcademicTitle = () => {
    if (formData.targetJobTitle) return formData.targetJobTitle;
    if (formData.education?.length > 0) {
      const latestEdu = formData.education[0];
      if (latestEdu.degree) {
        if (latestEdu.degree.includes('PhD')) return 'Research Scholar';
        if (latestEdu.degree.includes('Master')) return 'Graduate Researcher';
        return 'Academic Professional';
      }
    }
    if (formData.researchInterests) return 'Research Professional';
    return 'Academic Professional';
  };

  const getResearchFocus = () => {
    if (formData.researchInterests) return formData.researchInterests;
    if (formData.researchFocus) return formData.researchFocus;
    return 'Research & Academia';
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
            {getAcademicTitle()}
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
            {formData.orcid && (
              <View style={scaledStyles.contactItem}>
                <Text style={scaledStyles.contactIcon}>🆔 ORCID:</Text>
                <Link src={formData.orcid} style={scaledStyles.contactLink}>
                  {formData.orcid.replace('https://orcid.org/', '')}
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

export default AcademicTemplatePDF;
