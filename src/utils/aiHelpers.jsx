import { generateText } from '../gemini';
import { buildFallbackRewrite } from './aiFallbacks';

// Function to clean AI responses
export const cleanAiResponse = (response, fieldName) => {
  if (!response) return '';
  
  // Remove common AI response prefixes/suffixes more precisely
  let cleaned = response
    // Remove opening phrases
    .replace(/^(Here's|Here are|Here is)\s+/i, '')
    .replace(/^(I'll|I can|I will|I would)\s+/i, '')
    .replace(/^(This is|This would be|These are)\s+/i, '')
    .replace(/^(The following|Below is|Below are)\s+/i, '')
    .replace(/^(Let me|Allow me)\s+/i, '')
    // Remove quotes if they wrap the entire content
    .replace(/^"(.*)"$/s, '$1')
    .replace(/^'(.*)'$/s, '$1')
    // Clean up multiple newlines
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    // Trim whitespace
    .trim();

  // Field-specific cleaning
  switch (fieldName) {
    case 'skills':
      // For skills, ensure it's a comma-separated list
      cleaned = cleaned
        .replace(/and\s+/g, ', ') // Replace "and" with commas
        .replace(/,\s*,/g, ',') // Remove duplicate commas
        .replace(/,\s*$/, '') // Remove trailing comma
        .replace(/^\s*,/, '') // Remove leading comma
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0)
        .join(', ');
      break;
    
    case 'description':
    case 'responsibilities':
      // For job descriptions/responsibilities, ensure proper bullet point format
      if (cleaned.includes('•') || cleaned.includes('-') || cleaned.includes('*')) {
        // Split by various bullet point types
        let items = cleaned
          .split(/[•\-\*]/)
          .map(item => item.trim())
          .filter(item => item.length > 0);
        
        // Format as proper bullet points
        cleaned = items
          .map(item => '• ' + item)
          .join('\n');
      } else if (cleaned.includes('\n')) {
        // If there are line breaks but no bullets, add them
        cleaned = cleaned
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0)
          .map(item => item.startsWith('•') ? item : '• ' + item)
          .join('\n');
      } else {
        // Single line, add bullet point
        cleaned = '• ' + cleaned;
      }
      break;
    
    case 'projectDescription':
      // For project descriptions, ensure it's properly formatted
      cleaned = cleaned
        .replace(/\n+/g, ' ') // Convert to single paragraph
        .replace(/\s+/g, ' ') // Clean up multiple spaces
        .trim();
      break;
    
    case 'coursework':
      // For coursework, keep it clean and professional
      cleaned = cleaned
        .replace(/^\s*[*-]\s*/gm, '') // remove markdown bullets at line starts
        .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold markers
        .replace(/\*(.*?)\*/g, '$1') // remove italic markers
        .replace(/\n+/g, ', ') // Convert newlines to commas if needed
        .replace(/\s*,\s*\*/g, ', ') // clean stray list markers after comma joins
        .replace(/,\s*,/g, ',') // Remove duplicate commas
        .replace(/^\s*\*\s*/,'') // remove any remaining leading marker
        .replace(/\s{2,}/g, ' ')
        .trim();
      break;
    
    case 'summary':
      // For summaries, ensure proper paragraph format
      cleaned = cleaned
        .replace(/\n+/g, ' ') // Convert to single paragraph
        .replace(/\s+/g, ' ') // Clean up multiple spaces
        .trim();
      break;
    
    case 'fullName':
      // For names, ensure proper capitalization
      cleaned = cleaned
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      break;
  }

  return cleaned;
};

// Build contextual information for better AI prompting
const buildRewriteContext = (formData, fieldType) => {
  let context = '';
  
  // Add relevant profile information
  if (formData.targetJobTitle) {
    context += `Target Role: ${formData.targetJobTitle}. `;
  }
  if (formData.profileType) {
    context += `Profile Type: ${formData.profileType}. `;
  }
  if (formData.yearsExperience) {
    context += `Experience Level: ${formData.yearsExperience} years. `;
  }
  if (formData.industryExperience) {
    context += `Industry: ${formData.industryExperience}. `;
  }
  
  return context;
};

// Generate field-specific rewrite prompts
const generateRewritePrompt = (currentContent, fieldType, context, formData) => {
  const contextInfo = buildRewriteContext(formData, fieldType);
  
  switch (fieldType) {
    case 'description':
    case 'responsibilities':
      return `You are a professional resume writer. Rewrite the following job description/responsibilities to be more professional, impactful, and ATS-friendly.

CONTEXT: ${contextInfo}

CURRENT CONTENT:
"${currentContent}"

REQUIREMENTS:
- Start each bullet point with a strong action verb
- Include specific metrics, numbers, or percentages where possible
- Focus on achievements and impact, not just tasks
- Use professional, concise language
- Format as bullet points starting with "•"
- Keep each bullet point to 15-25 words
- Make it relevant to the target role
- Remove any generic or weak language

RETURN ONLY the improved bullet points, nothing else:`;

    case 'coursework':
      return `You are a professional resume writer. Rewrite the following coursework/academic information to be more professional and relevant.

CONTEXT: ${contextInfo}

CURRENT CONTENT:
"${currentContent}"

REQUIREMENTS:
- Make it concise and professional
- Focus on coursework relevant to the target role
- Include honors, GPA, or distinctions if mentioned
- Use proper academic formatting
- Keep it brief but impactful

RETURN ONLY the improved coursework description:`;

    case 'projectDescription':
      return `You are a professional resume writer. Rewrite the following project description to be more professional and impactful.

CONTEXT: ${contextInfo}

CURRENT CONTENT:
"${currentContent}"

REQUIREMENTS:
- Clearly describe what the project does and its purpose
- Highlight key technical achievements
- Include metrics or impact if possible
- Use professional, concise language
- Make it 2-4 sentences maximum
- Focus on skills relevant to the target role

RETURN ONLY the improved project description:`;

    case 'summary':
      return `You are a professional resume writer. Rewrite the following professional summary to be more compelling and targeted.

CONTEXT: ${contextInfo}

CURRENT CONTENT:
"${currentContent}"

REQUIREMENTS:
- Make it 3-4 sentences (60-100 words)
- Start with years of experience or key qualification
- Highlight 2-3 main areas of expertise
- Include industry-specific keywords
- End with value proposition or career goal
- Make it specific to the target role and industry
- Use powerful, professional language

RETURN ONLY the improved professional summary:`;

    default:
      return `You are a professional resume writer. Rewrite the following content to be more professional and impactful for a resume.

CONTEXT: ${contextInfo}

CURRENT CONTENT:
"${currentContent}"

REQUIREMENTS:
- Use professional, concise language
- Make it relevant to the target role
- Focus on achievements and value
- Keep it appropriately formatted for a resume

RETURN ONLY the improved content:`;
  }
};

// Function to handle AI rewrite operations
export const handleAiRewrite = async (currentValue, promptPrefix, formData, setFormData, saveFormData, setLoading, fieldName = null) => {
  if (typeof setLoading !== 'function') {
    console.error('setLoading is not a function');
    return;
  }
  
  const currentText = String(currentValue ?? '');
  const promptText = String(promptPrefix ?? '').trim();
  const isGenerationRequest = currentText.trim() === '';
  let fieldType = 'general';

  if (isGenerationRequest && !promptText) {
    alert("Please add some content or provide a prompt before using AI.");
    return;
  }

  // Don't proceed with rewrites if there is no content and no generation prompt.
  if (!isGenerationRequest && currentText.trim() === '') {
    alert("Please add some content first before using AI rewrite.");
    return;
  }
  
  setLoading(true);
  try {
    // Determine field type from fieldName for better prompting
    if (fieldName) {
      const normalizedFieldName = fieldName.toLowerCase();
      if (normalizedFieldName.includes('description') || normalizedFieldName.includes('responsibilities')) {
        fieldType = 'description';
      } else if (normalizedFieldName.includes('coursework')) {
        fieldType = 'coursework';
      } else if (normalizedFieldName.includes('summary')) {
        fieldType = 'summary';
      } else if (normalizedFieldName.includes('project')) {
        fieldType = 'projectDescription';
      } else if (normalizedFieldName.includes('skill')) {
        fieldType = 'skills';
      }
    }
    
    // Generate contextual prompt
    const prompt = isGenerationRequest
      ? promptText
      : generateRewritePrompt(currentText, fieldType, promptPrefix, formData);

    const rawResponse = await generateText(prompt);

    if (!rawResponse) {
      alert("AI response was empty. Please try again.");
      setLoading(false);
      return;
    }

    // Clean the AI response
    const cleanedResponse = cleanAiResponse(rawResponse, fieldType);
    
    if (!cleanedResponse || cleanedResponse.trim() === '') {
      alert("AI response was empty or invalid. Please try again.");
      setLoading(false);
      return;
    }
    
    applyAiResponseToFormData(fieldName, cleanedResponse, formData, setFormData, saveFormData);

    return cleanedResponse;
  } catch (error) {
    const code = error?.code ?? error?.cause?.code;
    const fallbackResponse = buildFallbackRewrite({
      fieldType,
      currentText,
      formData,
    });

    if (fallbackResponse) {
      const cleanedFallback = cleanAiResponse(fallbackResponse, fieldType);
      applyAiResponseToFormData(fieldName, cleanedFallback, formData, setFormData, saveFormData);
      alert(
        code === 'QUOTA_EXCEEDED'
          ? 'AI quota exceeded right now. Added a smart fallback based on your resume details.'
          : 'AI is unavailable right now. Added a smart fallback based on your resume details.',
      );
      return cleanedFallback;
    }

    const message =
      code === 'API_KEY_MISSING' || code === 'API_KEY_INVALID' || code === 'SERVER_KEY_MISSING'
        ? 'Gemini API key is missing or invalid. Add GEMINI_API_KEY to server/.env and restart the backend.'
        : code === 'QUOTA_EXCEEDED'
          ? 'AI quota exceeded. Please try again later.'
          : code === 'NETWORK_ERROR'
            ? 'Network error. Check your connection and try again.'
            : code === 'CONTENT_BLOCKED' || code === 'EMPTY_RESPONSE'
              ? 'AI could not generate content for this text. Try rephrasing or shortening.'
              : 'Failed to rewrite with AI. Please try again.';
    if (import.meta.env.DEV) console.error('AI rewrite error:', error?.message ?? error);
    alert(message);
    return null;
  } finally {
    setLoading(false);
  }
};

function applyAiResponseToFormData(fieldName, value, formData, setFormData, saveFormData) {
  if (!fieldName) {
    if (import.meta.env.DEV) console.warn('No field name provided to handleAiRewrite');
    return;
  }

  if (!fieldName.includes('[') && !fieldName.includes('.')) {
    const updatedData = { ...formData, [fieldName]: value };
    setFormData(updatedData);
    if (saveFormData) {
      saveFormData(updatedData);
    }
    return;
  }

  const keys = fieldName.replace(/\[(\d+)\]/g, '.$1').split('.');
  const temp = { ...formData };
  let obj = temp;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!obj[keys[i]]) {
      obj[keys[i]] = Number.isNaN(Number(keys[i + 1])) ? {} : [];
    }
    obj = obj[keys[i]];
  }
  obj[keys[keys.length - 1]] = value;
  setFormData(temp);
  if (saveFormData) {
    saveFormData(temp);
  }
}

/**
 * Generate multiple AI suggestions for a given field type and context.
 * Returns an array of clean, CV-formatted options.
 * @param {string} fieldType - e.g. 'responsibilities', 'projectDescription', 'summary', 'skills'
 * @param {object} context - formData or relevant context for the prompt
 * @param {number} numOptions - how many options to generate (default 3)
 * @returns {Promise<string[]>}
 */
export const generateAiSuggestions = async (fieldType, context, numOptions = 3) => {
  let prompt = '';
  switch (fieldType) {
      case 'responsibilities':
      prompt = `Generate ${numOptions} distinct, professional bullet points for job responsibilities/achievements. Each bullet should be a single, concise sentence starting with an action verb and focusing on measurable results. Context: Job Title: ${context.jobTitle || 'Not specified'}, Company: ${context.company || 'Not specified'}, Industry: ${context.industry || 'Technology'}. Return ONLY the bullet points, one per line, each starting with "•". No headers, no explanations, no additional formatting.`;
      break;
    // case 'responsibilities':
    //   prompt = `Generate ${numOptions} distinct, professional bullet points for a work experience description, formatted for a CV. Each bullet should be concise, achievement-focused, and relevant to the following context: ${JSON.stringify(context)}. Return each bullet on a new line, starting with "•". Do not include any introductory or closing text.`;
    //   break;
    case 'projectDescription':
      prompt = `Generate ${numOptions} distinct, concise project descriptions for a CV, each as a single paragraph (1-2 sentences), based on the following context: ${JSON.stringify(context)}. Do not include any introductory or closing text. Separate each option with a line break.`;
      break;
    case 'summary':
      prompt = `Generate ${numOptions} professional summary statements for a CV, tailored to the following context: ${JSON.stringify(context)}. Each summary should be 2-3 sentences, impactful, and suitable for a resume. Do not include any introductory or closing text. Separate each option with a line break.`;
      break;
    case 'coursework':
      prompt = `Generate ${numOptions} distinct, relevant coursework examples or academic honors for a CV, based on the following context: ${JSON.stringify(context)}. Each option should be a short, descriptive phrase (e.g., "Relevant Coursework: Data Structures, Algorithms", "Honors: Dean's List"). Return each option on a new line. Do not include any introductory or closing text or labels like "Option 1:".`;
      break;
    case 'skills':
      prompt = `Suggest ${numOptions} different sets of 8-12 relevant skills for a CV, based on the following context: ${JSON.stringify(context)}. Each set should be a comma-separated list, and each set should be on a new line. Do not include any introductory or closing text.`;
      break;
    default:
      prompt = `Generate ${numOptions} distinct, well-formatted options for the "${fieldType}" field of a CV, based on the following context: ${JSON.stringify(context)}. Separate each option with a line break. Do not include any introductory or closing text.`;
  }

  try {
    const rawResponse = await generateText(prompt);
    if (!rawResponse) return [];

    // Split response into options
    let options = [];
    if (fieldType === 'skills') {
      // Each line is a comma-separated list
      options = rawResponse
        .split('\n')
        .map(line => cleanAiResponse(line, 'skills'))
        .filter(opt => opt.length > 0);
    } else if (fieldType === 'responsibilities') {
      // Split by bullet points
      options = rawResponse
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('•'))
        .map(line => cleanAiResponse(line, 'responsibilities'));
    } else {
      // Split by line breaks for other fields
      options = rawResponse
        .split('\n')
        .map(opt => cleanAiResponse(opt, fieldType))
        .filter(opt => opt.length > 0);
    }

    // Remove duplicates and empty options
    options = Array.from(new Set(options)).filter(opt => opt.length > 0);

    // Limit to numOptions
    return options.slice(0, numOptions);
  } catch (error) {
    if (import.meta.env.DEV) console.error("Error generating AI suggestions:", error?.message ?? error);
    return [];
  }
};

export const validateAiResponse = (response, expectedFormat) => {
  // Future implementation for validating AI responses
  // This could ensure responses meet specific criteria
};
