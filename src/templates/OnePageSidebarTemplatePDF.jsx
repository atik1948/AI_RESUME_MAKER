import React from 'react';
import { Document, Page, View, Text, StyleSheet, Link, Image } from '@react-pdf/renderer';
import { scalePdfStyles } from '../utils/pdfResume';

const styles = StyleSheet.create({
  page: {
    padding: 16,
    fontFamily: 'Helvetica',
    fontSize: 9,
    backgroundColor: '#f7f7f5',
    color: '#0f172a',
  },
  frame: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 14,
    backgroundColor: '#ffffff',
    minHeight: '100%',
  },
  layout: {
    flexDirection: 'row',
    minHeight: '100%',
  },
  sidebar: {
    width: '34%',
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
    paddingTop: 18,
    paddingHorizontal: 14,
    paddingBottom: 18,
    marginRight: 14,
  },
  main: {
    width: '66%',
    backgroundColor: '#b9e0ea',
    borderTopLeftRadius: 34,
    borderBottomLeftRadius: 34,
    paddingTop: 26,
    paddingBottom: 22,
    paddingHorizontal: 18,
  },
  portrait: {
    width: 92,
    height: 112,
    backgroundColor: '#dbe4ea',
    borderWidth: 1,
    borderColor: '#94a3b8',
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  portraitText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#334155',
  },
  sidebarSection: {
    marginBottom: 14,
  },
  sidebarTitle: {
    fontSize: 10,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  sidebarText: {
    fontSize: 8.3,
    lineHeight: 1.35,
    color: '#111827',
    marginBottom: 2,
  },
  sidebarLink: {
    fontSize: 8.3,
    lineHeight: 1.35,
    color: '#1d4ed8',
    textDecoration: 'underline',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bullet: {
    width: 8,
    fontSize: 8.3,
  },
  bulletContent: {
    flex: 1,
    fontSize: 8.3,
    lineHeight: 1.3,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'normal',
    textAlign: 'center',
    marginBottom: 18,
    color: '#111827',
  },
  mainSection: {
    marginBottom: 12,
  },
  mainSectionTitle: {
    fontSize: 10.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
    color: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    paddingBottom: 3,
  },
  itemBlock: {
    marginBottom: 8,
  },
  itemHeading: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111827',
  },
  itemSubheading: {
    fontSize: 8.4,
    color: '#111827',
    marginTop: 1,
  },
  itemMeta: {
    fontSize: 8.2,
    color: '#334155',
    marginTop: 1,
  },
  bodyText: {
    fontSize: 8.2,
    lineHeight: 1.3,
    marginTop: 2,
    color: '#111827',
  },
  numberedRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  numberLabel: {
    width: 12,
    fontSize: 8.2,
  },
  compactDivider: {
    marginTop: 2,
  },
});

const compactText = (value = '', maxLength = 220) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3).trim()}...`;
};

const compactLines = (value = '', maxLines = 4) =>
  String(value || '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^[•*-]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, maxLines);

const cleanLinkText = (value = '') =>
  String(value || '').replace('https://', '').replace('http://', '');

const buildInitials = (name = '') =>
  String(name || '')
    .split(' ')
    .map((part) => part.trim()[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'CV';

const buildSidebarList = (items = []) =>
  items
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, 6);

const buildSkillsList = (skills = []) =>
  skills
    .map((skill) => (typeof skill === 'string' ? skill : skill?.name))
    .filter(Boolean)
    .slice(0, 8);

const compactReferenceText = (reference = {}) =>
  [
    reference.name,
    reference.role,
    reference.company,
    reference.phone,
    reference.email,
  ]
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .join(' | ');

const buildReferences = (formData = {}) => {
  if (Array.isArray(formData.references)) {
    return formData.references
      .map((reference) => {
        if (typeof reference === 'string') {
          return { text: reference.trim() };
        }

        return {
          name: reference?.name || reference?.referenceName || '',
          role: reference?.role || reference?.designation || reference?.title || '',
          company: reference?.company || reference?.organization || '',
          phone: reference?.phone || reference?.contact || '',
          email: reference?.email || '',
          text: compactReferenceText({
            name: reference?.name || reference?.referenceName || '',
            role: reference?.role || reference?.designation || reference?.title || '',
            company: reference?.company || reference?.organization || '',
            phone: reference?.phone || reference?.contact || '',
            email: reference?.email || '',
          }),
        };
      })
      .filter((reference) => reference.text);
  }

  const manualReferences = [
    {
      name: formData.reference1Name || formData.referenceName || '',
      role: formData.reference1Role || formData.referenceRole || '',
      company: formData.reference1Company || formData.referenceCompany || '',
      phone: formData.reference1Phone || formData.referencePhone || '',
      email: formData.reference1Email || formData.referenceEmail || '',
    },
    {
      name: formData.reference2Name || '',
      role: formData.reference2Role || '',
      company: formData.reference2Company || '',
      phone: formData.reference2Phone || '',
      email: formData.reference2Email || '',
    },
  ]
    .map((reference) => ({
      ...reference,
      text: compactReferenceText(reference),
    }))
    .filter((reference) => reference.text);

  if (manualReferences.length) {
    return manualReferences;
  }

  const plainTextReferences = String(formData.reference || formData.referencesText || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((text) => ({ text }));

  return plainTextReferences;
};

const buildExtras = (formData) => ({
  hobbies: buildSidebarList(
    Array.isArray(formData.hobbies)
      ? formData.hobbies
      : String(formData.hobbies || formData.interests || '')
          .split(/[,\n]/),
  ),
  qualities: buildSidebarList(
    Array.isArray(formData.qualities)
      ? formData.qualities
      : String(formData.qualities || formData.strengths || '')
          .split(/[,\n]/),
  ),
  activities: buildSidebarList(
    Array.isArray(formData.extracurriculars)
      ? formData.extracurriculars
      : String(formData.extracurriculars || formData.activities || '')
          .split(/[,\n]/),
  ),
});

const OnePageSidebarTemplatePDF = ({
  formData = {},
  fontStyle = 'Times-Roman',
  fontSize = 9,
  fontScale = 1,
}) => {
  const scaledStyles = scalePdfStyles(styles, fontScale);
  const summary =
    compactText(
      formData.summary ||
        formData.professionalSummary ||
        formData.profileSummary ||
        formData.objective ||
        formData.careerGoals ||
        '',
      260,
    );
  const skills = buildSkillsList(formData.skills || []);
  const extras = buildExtras(formData);
  const references = buildReferences(formData);

  return (
    <Document>
      <Page size="A4" style={{ ...scaledStyles.page, fontFamily: fontStyle, fontSize }}>
        <View style={scaledStyles.frame}>
          <View style={scaledStyles.layout}>
            <View style={scaledStyles.sidebar}>
              <View style={scaledStyles.portrait}>
                {formData.profileImage ? (
                  <Image src={formData.profileImage} style={scaledStyles.portraitImage} />
                ) : (
                  <Text style={scaledStyles.portraitText}>{buildInitials(formData.fullName)}</Text>
                )}
              </View>

              {summary ? (
                <View style={scaledStyles.sidebarSection}>
                  <Text style={scaledStyles.sidebarTitle}>Objective</Text>
                  <Text style={scaledStyles.sidebarText}>{summary}</Text>
                </View>
              ) : null}

              <View style={scaledStyles.sidebarSection}>
                <Text style={scaledStyles.sidebarTitle}>Contact</Text>
                {formData.phone ? <Text style={scaledStyles.sidebarText}>Phone: {formData.phone}</Text> : null}
                {formData.email ? (
                  <Link src={`mailto:${formData.email}`} style={scaledStyles.sidebarLink}>
                    Email: {formData.email}
                  </Link>
                ) : null}
                {formData.location ? <Text style={scaledStyles.sidebarText}>Location: {formData.location}</Text> : null}
                {formData.linkedin ? (
                  <Link src={formData.linkedin} style={scaledStyles.sidebarLink}>
                    LinkedIn: {cleanLinkText(formData.linkedin)}
                  </Link>
                ) : null}
                {formData.website ? (
                  <Link src={formData.website} style={scaledStyles.sidebarLink}>
                    Portfolio: {cleanLinkText(formData.website)}
                  </Link>
                ) : null}
                {formData.github ? (
                  <Link src={formData.github} style={scaledStyles.sidebarLink}>
                    GitHub: {cleanLinkText(formData.github)}
                  </Link>
                ) : null}
              </View>

              {extras.hobbies.length ? (
                <View style={scaledStyles.sidebarSection}>
                  <Text style={scaledStyles.sidebarTitle}>Hobbies</Text>
                  {extras.hobbies.map((item, idx) => (
                    <View key={idx} style={scaledStyles.bulletRow}>
                      <Text style={scaledStyles.bullet}>-</Text>
                      <Text style={scaledStyles.bulletContent}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {skills.length ? (
                <View style={scaledStyles.sidebarSection}>
                  <Text style={scaledStyles.sidebarTitle}>Skills</Text>
                  {skills.map((item, idx) => (
                    <View key={idx} style={scaledStyles.bulletRow}>
                      <Text style={scaledStyles.bullet}>-</Text>
                      <Text style={scaledStyles.bulletContent}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {extras.qualities.length ? (
                <View style={scaledStyles.sidebarSection}>
                  <Text style={scaledStyles.sidebarTitle}>Qualities</Text>
                  {extras.qualities.map((item, idx) => (
                    <View key={idx} style={scaledStyles.bulletRow}>
                      <Text style={scaledStyles.bullet}>-</Text>
                      <Text style={scaledStyles.bulletContent}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>

            <View style={scaledStyles.main}>
              <Text style={scaledStyles.headerName}>{formData.fullName || 'Your Name'}</Text>

              {formData.education?.length ? (
                <View style={scaledStyles.mainSection}>
                  <Text style={scaledStyles.mainSectionTitle}>Education</Text>
                  {formData.education.slice(0, 3).map((edu, idx) => (
                    <View key={idx} style={scaledStyles.itemBlock}>
                      <Text style={scaledStyles.itemHeading}>{edu.degree || 'Degree'}</Text>
                      <Text style={scaledStyles.itemSubheading}>{edu.school || ''}</Text>
                      <Text style={scaledStyles.itemMeta}>
                        {[edu.startDate, edu.endDate || edu.graduationYear].filter(Boolean).join(' - ')}
                      </Text>
                      {edu.gpa ? <Text style={scaledStyles.bodyText}>Result: {edu.gpa}</Text> : null}
                    </View>
                  ))}
                </View>
              ) : null}

              {formData.experiences?.length ? (
                <View style={scaledStyles.mainSection}>
                  <Text style={scaledStyles.mainSectionTitle}>Work Experience</Text>
                  {formData.experiences.slice(0, 2).map((exp, idx) => (
                    <View key={idx} style={scaledStyles.itemBlock}>
                      <Text style={scaledStyles.itemHeading}>{exp.jobTitle || 'Role'}</Text>
                      <Text style={scaledStyles.itemSubheading}>{exp.company || ''}</Text>
                      <Text style={scaledStyles.itemMeta}>
                        {[exp.startDate, exp.endDate || 'Present'].filter(Boolean).join(' - ')}
                      </Text>
                      {compactLines(exp.description || exp.responsibilities || '', 4).map((line, lineIdx) => (
                        <Text key={lineIdx} style={scaledStyles.bodyText}>{line}</Text>
                      ))}
                    </View>
                  ))}
                </View>
              ) : null}

              {extras.activities.length ? (
                <View style={scaledStyles.mainSection}>
                  <Text style={scaledStyles.mainSectionTitle}>Extracurricular Activities</Text>
                  {extras.activities.slice(0, 4).map((item, idx) => (
                    <View key={idx} style={scaledStyles.numberedRow}>
                      <Text style={scaledStyles.numberLabel}>{idx + 1}.</Text>
                      <Text style={scaledStyles.bodyText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {formData.projects?.some((proj) => proj.projectName || proj.name || proj.description || proj.projectDescription) ? (
                <View style={scaledStyles.mainSection}>
                  <Text style={scaledStyles.mainSectionTitle}>Projects</Text>
                  {formData.projects.slice(0, 2).map((proj, idx) => {
                    const name = proj.projectName || proj.name || 'Project';
                    const link = proj.projectLink || proj.liveUrl || proj.githubUrl || '';
                    const description = compactText(proj.projectDescription || proj.description || '', 180);
                    return (
                      <View key={idx} style={scaledStyles.itemBlock}>
                        <Text style={scaledStyles.itemHeading}>{name}</Text>
                        <Text style={scaledStyles.itemMeta}>
                          {[proj.startDate, proj.endDate].filter(Boolean).join(' - ')}
                        </Text>
                        {link ? (
                          <Link src={link} style={scaledStyles.sidebarLink}>
                            {cleanLinkText(link)}
                          </Link>
                        ) : null}
                        {description ? <Text style={scaledStyles.bodyText}>{description}</Text> : null}
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {references.length ? (
                <View style={[scaledStyles.mainSection, scaledStyles.compactDivider]}>
                  <Text style={scaledStyles.mainSectionTitle}>References</Text>
                  {references.slice(0, 2).map((reference, idx) => (
                    <Text key={idx} style={scaledStyles.bodyText}>{reference.text}</Text>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default OnePageSidebarTemplatePDF;
