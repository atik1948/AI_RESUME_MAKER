import { generateText } from '../gemini';
import { cleanAiResponse } from './aiHelpers';
import { buildFallbackSuggestions } from './aiFallbacks';

// Enhanced AI suggestion generation with context awareness and industry-specific prompts
export const generateEnhancedAiSuggestions = async (fieldType, context, options = {}) => {
  const {
    numOptions = 3,
    style = 'professional',
    targetJobTitle = '',
    profileType = '',
    industry = '',
    experienceLevel = '',
    customPrompt = '',
    existingSuggestions = [],
    appendMode = false
  } = options;

  let basePrompt = '';
  let promptContext = buildPromptContext(context, targetJobTitle, profileType, industry, experienceLevel);

  switch (fieldType) {
    case 'responsibilities':
      basePrompt = buildResponsibilitiesPrompt(numOptions, style, promptContext);
      break;
    case 'projectDescription':
      basePrompt = buildProjectPrompt(numOptions, style, promptContext);
      break;
    case 'summary':
      basePrompt = buildSummaryPrompt(numOptions, style, promptContext);
      break;
    case 'coursework':
      basePrompt = buildCourseworkPrompt(numOptions, style, promptContext);
      break;
    case 'skills':
      basePrompt = buildSkillsPrompt(numOptions, style, promptContext);
      break;
    case 'achievements':
      basePrompt = buildAchievementsPrompt(numOptions, style, promptContext);
      break;
    default:
      basePrompt = customPrompt || buildGenericPrompt(fieldType, numOptions, style, promptContext);
  }

  // Add existing suggestions context for append mode
  if (appendMode && existingSuggestions.length > 0) {
    const existingTexts = existingSuggestions.map(s => s.text || s).join('\n- ');
    basePrompt += `\n\nExisting suggestions to avoid duplicating:\n- ${existingTexts}\n\nGenerate ${numOptions} NEW and DIFFERENT suggestions that complement but don't repeat the above.`;
  }

  try {
    const rawResponse = await generateText(basePrompt);
    if (!rawResponse) return appendMode ? existingSuggestions : [];

    const newSuggestions = parseAndEnhanceSuggestions(rawResponse, fieldType, numOptions);
    
    if (appendMode) {
      // Deduplicate and combine with existing suggestions
      const combinedSuggestions = [...existingSuggestions];
      const existingTexts = new Set(existingSuggestions.map(s => (s.text || s).toLowerCase().trim()));
      
      for (const newSuggestion of newSuggestions) {
        const newText = (newSuggestion.text || newSuggestion).toLowerCase().trim();
        if (!existingTexts.has(newText)) {
          combinedSuggestions.push(newSuggestion);
          existingTexts.add(newText);
        }
      }
      
      return combinedSuggestions;
    }
    
    return newSuggestions;
  } catch (error) {
    if (import.meta.env.DEV) console.error("Error generating enhanced AI suggestions:", error?.message ?? error);
    const fallbackSuggestions = buildFallbackSuggestions(fieldType, context, options);
    return appendMode
      ? [...existingSuggestions, ...fallbackSuggestions].filter((suggestion, index, all) => {
          const text = (suggestion.text || suggestion).trim().toLowerCase();
          return text && all.findIndex((item) => (item.text || item).trim().toLowerCase() === text) === index;
        })
      : fallbackSuggestions;
  }
};

const buildPromptContext = (context, targetJobTitle, profileType, industry, experienceLevel) => {
  let promptContext = '';
  
  if (targetJobTitle) promptContext += `Target Role: ${targetJobTitle}. `;
  if (profileType) promptContext += `Profile Type: ${profileType}. `;
  if (industry) promptContext += `Industry: ${industry}. `;
  if (experienceLevel) promptContext += `Experience Level: ${experienceLevel}. `;
  
  // Add specific context from the object
  if (context.jobTitle) promptContext += `Current/Previous Role: ${context.jobTitle}. `;
  if (context.company) promptContext += `Company: ${context.company}. `;
  if (context.degree) promptContext += `Education: ${context.degree}. `;
  if (context.school) promptContext += `Institution: ${context.school}. `;
  if (context.name) promptContext += `Project: ${context.name}. `;
  if (context.technologies) promptContext += `Technologies: ${context.technologies}. `;
  
  return promptContext;
};

const buildResponsibilitiesPrompt = (numOptions, style, context) => {
  const styleInstructions = getStyleInstructions(style);
  
  return `Generate ${numOptions} distinct, professional achievement-focused bullet points for job responsibilities. ${context}

${styleInstructions}

Requirements:
- Start each bullet with a strong action verb (Led, Developed, Implemented, Created, Managed, etc.)
- Include specific metrics, percentages, or numbers wherever possible
- Focus on impact and results, not just tasks
- Each bullet should be 15-25 words
- Use past tense for completed roles, present tense for current roles
- Avoid generic responsibilities, focus on unique contributions

Format: Return ONLY the bullet points, one per line, each starting with "•". No headers, explanations, or additional text.

Examples of good format:
• Led cross-functional team of 8 developers to deliver e-commerce platform, increasing sales by 35%
• Implemented automated testing framework, reducing deployment time by 60% and bug reports by 40%
• Developed machine learning algorithms that improved recommendation accuracy by 25%`;
};

const buildProjectPrompt = (numOptions, style, context) => {
  const styleInstructions = getStyleInstructions(style);
  
  return `Generate ${numOptions} compelling project descriptions for a resume/CV. ${context}

${styleInstructions}

Requirements:
- Each description should be 2-4 sentences (50-100 words)
- Highlight the problem solved and solution implemented
- Include technical details and technologies used
- Mention measurable outcomes or impact
- Show progression of skills and complexity
- Make it relevant to target role

Format: Return each description as a separate paragraph. No bullets, headers, or labels.

Focus on: Purpose → Solution → Technology → Impact`;
};

const buildSummaryPrompt = (numOptions, style, context) => {
  const styleInstructions = getStyleInstructions(style);
  
  return `Generate ${numOptions} professional summary statements for a resume. ${context}

${styleInstructions}

Requirements:
- Each summary should be 60-100 words (3-4 sentences)
- Start with years of experience or key qualification
- Highlight 2-3 main areas of expertise
- Include industry-specific keywords
- End with value proposition or career goal
- Tailor to target role and industry

Format: Return each summary as a separate paragraph. No bullets, headers, or labels.

Structure: Experience/Qualification + Key Skills + Achievements + Value Proposition`;
};

const buildCourseworkPrompt = (numOptions, style, context) => {
  return `Generate ${numOptions} relevant coursework entries for an academic CV. ${context}

Requirements:
- Focus on courses relevant to target career/industry
- Include honors, distinctions, or notable grades if applicable
- Mix core courses with specialized/advanced topics
- Use proper academic terminology
- Keep each entry concise but descriptive

Format: Return one entry per line. Each entry should be a complete phrase.

Examples:
Relevant Coursework: Data Structures & Algorithms, Machine Learning, Database Systems
Honors: Dean's List (Fall 2022, Spring 2023), Magna Cum Laude
Advanced Studies: Artificial Intelligence, Computer Vision, Natural Language Processing`;
};

const buildSkillsPrompt = (numOptions, style, context) => {
  return `Generate ${numOptions} different skill combinations for a resume. ${context}

Requirements:
- Each set should have 8-15 skills
- Mix technical and soft skills appropriately
- Include relevant tools, frameworks, and technologies
- Arrange by relevance to target role
- Use industry-standard terminology
- Include both current and emerging technologies

Format: Return each skill set as a comma-separated list, one per line.

Categories to consider: Programming Languages, Frameworks, Tools, Databases, Cloud Services, Methodologies, Soft Skills`;
};

const buildAchievementsPrompt = (numOptions, style, context) => {
  const styleInstructions = getStyleInstructions(style);
  
  return `Generate ${numOptions} significant professional achievements. ${context}

${styleInstructions}

Requirements:
- Each achievement should be specific and quantifiable
- Use the STAR method (Situation, Task, Action, Result)
- Include metrics, percentages, or concrete outcomes
- Focus on business impact and value creation
- Vary the types of achievements (efficiency, revenue, innovation, leadership)

Format: Return each achievement as a bullet point starting with "•"

Focus areas: Revenue growth, Cost reduction, Process improvement, Team leadership, Innovation, Customer satisfaction`;
};

const buildGenericPrompt = (fieldType, numOptions, style, context) => {
  return `Generate ${numOptions} professional examples for the "${fieldType}" field of a resume. ${context}

Requirements:
- Make content specific and relevant to the provided context
- Use professional language appropriate for a resume
- Include concrete details and avoid generic statements
- Focus on value and impact
- Tailor to target role and industry

Format: Return ${numOptions} distinct options, separated by line breaks.`;
};

const getStyleInstructions = (style) => {
  switch (style) {
    case 'achievement-focused':
      return 'Emphasize quantifiable results, metrics, and business impact. Use numbers, percentages, and concrete outcomes.';
    case 'skills-focused':
      return 'Highlight technical expertise, tools, and methodologies. Emphasize competencies and capabilities.';
    case 'leadership-focused':
      return 'Showcase management, team leadership, and strategic initiatives. Focus on people management and organizational impact.';
    case 'innovation-focused':
      return 'Emphasize creative solutions, new initiatives, and innovative approaches. Highlight forward-thinking and problem-solving.';
    case 'collaborative':
      return 'Focus on teamwork, cross-functional collaboration, and stakeholder management. Emphasize communication and relationship building.';
    default:
      return 'Use clear, professional language that demonstrates value and impact.';
  }
};

const parseAndEnhanceSuggestions = (rawResponse, fieldType, numOptions) => {
  let suggestions = [];

  try {
    if (fieldType === 'responsibilities') {
      suggestions = rawResponse
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('•'))
        .map(line => ({
          text: cleanAiResponse(line, 'responsibilities'),
          type: 'responsibility',
          wordCount: line.split(' ').length,
          hasMetrics: /\d+%|\d+\$|\d+k|\d+m|\d+ (times|percent|fold)/i.test(line)
        }));
    } else if (fieldType === 'skills') {
      suggestions = rawResponse
        .split('\n')
        .map(line => ({
          text: cleanAiResponse(line, 'skills'),
          type: 'skills',
          skillCount: line.split(',').length
        }))
        .filter(suggestion => suggestion.text.length > 0);
    } else {
      suggestions = rawResponse
        .split('\n\n')
        .map(paragraph => ({
          text: cleanAiResponse(paragraph, fieldType),
          type: fieldType,
          wordCount: paragraph.split(' ').length
        }))
        .filter(suggestion => suggestion.text.length > 0);
    }

    // Remove duplicates and enhance with metadata
    suggestions = Array.from(new Set(suggestions.map(s => s.text)))
      .map(text => {
        const original = suggestions.find(s => s.text === text);
        return {
          ...original,
          id: Math.random().toString(36).substr(2, 9),
          quality: assessQuality(text, fieldType),
          relevanceScore: calculateRelevance(text, fieldType)
        };
      });

    // Sort by quality and relevance
    suggestions.sort((a, b) => (b.quality + b.relevanceScore) - (a.quality + a.relevanceScore));

    return suggestions.slice(0, numOptions);
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error parsing suggestions:', error?.message ?? error);
    return [];
  }
};

const assessQuality = (text, fieldType) => {
  let score = 5; // Base score

  const wordCount = text.split(' ').length;
  const hasNumbers = /\d/.test(text);
  const hasActionVerbs = /^(Led|Developed|Implemented|Created|Managed|Increased|Decreased|Improved|Built|Designed|Coordinated|Executed|Achieved|Delivered|Optimized|Streamlined|Enhanced|Established|Launched|Spearheaded)/i.test(text);
  const hasMetrics = /(\d+%|\d+\$|\d+k|\d+m|\d+ (times|percent|fold|reduction|increase|improvement))/i.test(text);

  // Field-specific quality assessment
  if (fieldType === 'responsibilities') {
    if (hasActionVerbs) score += 2;
    if (hasMetrics) score += 3;
    if (wordCount >= 10 && wordCount <= 25) score += 1;
    if (hasNumbers && !hasMetrics) score += 1;
  } else if (fieldType === 'summary') {
    if (wordCount >= 60 && wordCount <= 100) score += 2;
    if (wordCount >= 40 && wordCount <= 60) score += 1;
    if (text.includes('experience') || text.includes('expertise')) score += 1;
  } else if (fieldType === 'projectDescription') {
    if (wordCount >= 50 && wordCount <= 100) score += 2;
    if (hasNumbers) score += 1;
    if (text.toLowerCase().includes('developed') || text.toLowerCase().includes('created') || text.toLowerCase().includes('built')) score += 1;
  }

  return Math.min(score, 10); // Cap at 10
};

const calculateRelevance = (text, fieldType) => {
  // Simple relevance calculation based on keyword presence
  const commonKeywords = ['professional', 'experience', 'skills', 'development', 'management', 'project', 'team', 'results'];
  const keywordCount = commonKeywords.filter(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  ).length;

  return Math.min(keywordCount, 5); // Cap at 5
};

// Real-time content analysis
export const analyzeContent = (text, fieldType, targetRole = '') => {
  const analysis = {
    wordCount: text.split(' ').filter(word => word.length > 0).length,
    charCount: text.length,
    sentenceCount: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
    hasNumbers: /\d/.test(text),
    hasActionVerbs: false,
    hasMetrics: false,
    readabilityScore: 0,
    keywordDensity: {},
    suggestions: []
  };

  // Action verb detection
  const actionVerbs = ['led', 'developed', 'implemented', 'created', 'managed', 'increased', 'decreased', 'improved', 'built', 'designed', 'coordinated', 'executed', 'achieved', 'delivered'];
  analysis.hasActionVerbs = actionVerbs.some(verb => text.toLowerCase().includes(verb));

  // Metrics detection
  analysis.hasMetrics = /(\d+%|\d+\$|\d+k|\d+m|\d+ (times|percent|fold|reduction|increase|improvement))/i.test(text);

  // Basic readability (simplified Flesch score)
  if (analysis.wordCount > 0 && analysis.sentenceCount > 0) {
    const avgWordsPerSentence = analysis.wordCount / analysis.sentenceCount;
    analysis.readabilityScore = Math.max(0, 100 - (avgWordsPerSentence * 2));
  }

  // Generate field-specific suggestions
  analysis.suggestions = generateContentSuggestions(text, fieldType, analysis);

  return analysis;
};

const generateContentSuggestions = (text, fieldType, analysis) => {
  const suggestions = [];

  if (fieldType === 'responsibilities') {
    if (!analysis.hasActionVerbs) {
      suggestions.push({
        type: 'improvement',
        message: 'Start your bullet points with strong action verbs like "Led", "Developed", or "Implemented"',
        priority: 'high'
      });
    }
    if (!analysis.hasMetrics) {
      suggestions.push({
        type: 'improvement',
        message: 'Add specific numbers or percentages to quantify your achievements',
        priority: 'high'
      });
    }
    if (analysis.wordCount < 8) {
      suggestions.push({
        type: 'length',
        message: 'Consider adding more detail to make your accomplishments clearer',
        priority: 'medium'
      });
    }
  } else if (fieldType === 'summary') {
    if (analysis.wordCount < 40) {
      suggestions.push({
        type: 'length',
        message: 'Your summary could be longer. Aim for 60-100 words for optimal impact',
        priority: 'medium'
      });
    } else if (analysis.wordCount > 120) {
      suggestions.push({
        type: 'length',
        message: 'Consider shortening your summary. 60-100 words is ideal for readability',
        priority: 'medium'
      });
    }
  }

  if (analysis.readabilityScore < 30) {
    suggestions.push({
      type: 'readability',
      message: 'Try using shorter sentences for better readability',
      priority: 'low'
    });
  }

  return suggestions;
};

// Smart autocomplete suggestions
export const getSmartAutocompleteSuggestions = async (partialText, fieldType, context) => {
  if (partialText.length < 3) return [];

  const prompt = `Complete the following ${fieldType} text in a professional manner. Provide 3 different completion options that make sense in context.

Partial text: "${partialText}"
Context: ${JSON.stringify(context)}

Requirements:
- Each completion should be natural and professional
- Maintain consistency with the existing text style
- Provide diverse options with different approaches
- Keep completions relevant to ${fieldType}

Format: Return only the completion text for each option, one per line.`;

  try {
    const response = await generateText(prompt);
    if (!response) return [];

    return response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 3)
      .map(completion => ({
        text: completion,
        type: 'autocomplete',
        confidence: Math.random() * 0.3 + 0.7 // Random confidence between 0.7-1.0
      }));
  } catch (error) {
    if (import.meta.env.DEV) console.error('Error generating autocomplete suggestions:', error?.message ?? error);
    return [];
  }
};

export default {
  generateEnhancedAiSuggestions,
  analyzeContent,
  getSmartAutocompleteSuggestions
};
