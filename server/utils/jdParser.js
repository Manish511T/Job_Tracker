// Simple JD Parser utility
const parseJobDescription = (jobDescription) => {
  try {
    const text = jobDescription || '';

    // Extract company name (commonly appears near top or with "company" keyword)
    let company = '';
    try {
      const companyMatch = text.match(
        /(?:company|employer|hiring|at\s+)[\s:]*([A-Za-z\s&.,'-]+?)(?:is\s+hiring|job|role|position|located|apply)/i
      );
      company = companyMatch ? companyMatch[1].trim().split(/\n/)[0] : '';
    } catch (e) {
      console.log('Error extracting company:', e.message);
    }

    // Extract role/job title (commonly appears in opening line)
    let role = '';
    try {
      const roleMatch = text.match(
        /(?:we\s+are\s+looking|we\s+are\s+hiring|job\s+title|position|role)[\s:]*([A-Za-z\s/(),-]+?)(?:\n|at\s+|in\s+|location|requirements|responsibilities)/i
      ) ||
        text.match(/^([A-Za-z\s/(),-]+?)(?:\s+(?:job|position|role|opening))/i) ||
        text.match(/Looking for\s+(?:an?\s+)?([A-Za-z\s/(),-]+?)(?:\s+(?:to|who|for|at))/i);

      role = roleMatch ? roleMatch[1].trim() : '';
    } catch (e) {
      console.log('Error extracting role:', e.message);
    }

    // Extract location
    let location = '';
    try {
      const locationMatch = text.match(
        /(?:location|based\s+in|located\s+in|office|remote|workplace)[\s:]*([A-Za-z\s,'-]+?)(?:\n|,\s*(?:USA|UK|India|contract|permanent|job|role|about))/i
      );
      location = locationMatch ? locationMatch[1].trim() : '';
    } catch (e) {
      console.log('Error extracting location:', e.message);
    }

    // Extract experience required
    let experience = '';
    try {
      const experienceMatch = text.match(
        /(?:experience\s+required|years?\s+of\s+experience|experience\s+level)[\s:]*([0-9]+[\s\-–]*(?:years?|yrs?|months?|mths?)?[^.]*)/i
      );
      experience = experienceMatch ? experienceMatch[1].trim() : '';
    } catch (e) {
      console.log('Error extracting experience:', e.message);
    }

    // Extract skills (looking for common patterns)
    let skills = [];
    try {
      const skillsMatch = text.match(
        /(?:required\s+)?skills?[\s:]*\n?([^.]*?)(?:\n\n|requirements|qualifications|responsibilities|about)/is
      );
      if (skillsMatch) {
        skills = skillsMatch[1]
          .split(/[,\n•\-\*]/)
          .map((skill) => skill.trim())
          .filter(
            (skill) =>
              skill.length > 2 && skill.length < 50 && !skill.match(/^\d+/)
          )
          .slice(0, 10);
      }

      // If no skills found from structured section, extract common tech skills
      if (skills.length === 0) {
        const commonSkills = [
          'JavaScript',
          'Python',
          'Java',
          'C++',
          'React',
          'Node.js',
          'Angular',
          'Vue.js',
          'MongoDB',
          'PostgreSQL',
          'AWS',
          'Azure',
          'Google Cloud',
          'Docker',
          'Kubernetes',
          'Git',
          'API',
          'REST',
          'SQL',
          'HTML',
          'CSS',
        ];
        try {
          skills = commonSkills.filter((skill) =>
            new RegExp(skill, 'i').test(text)
          );
        } catch (e) {
          console.log('Error filtering skills:', e.message);
          skills = [];
        }
      }
    } catch (e) {
      console.log('Error extracting skills:', e.message);
    }

    // Create summary (first meaningful paragraph)
    let summary = '';
    try {
      const summaryMatch = text.match(
        /(?:about\s+(?:the\s+)?(?:role|position|job)|description)[\s:]*\n?([^.]*\.[^.]*\.)/is
      );
      summary = summaryMatch ? summaryMatch[1].trim() : '';
      if (!summary) {
        // If no structured summary, take first paragraph
        const firstPara = text.match(/^([^.\n]*\.)/);
        summary = firstPara ? firstPara[1].trim() : text.substring(0, 200);
      }
    } catch (e) {
      console.log('Error extracting summary:', e.message);
    }

    return {
      company,
      role,
      location,
      skills,
      experience,
      summary: summary.substring(0, 500),
    };
  } catch (error) {
    console.error('JD Parser error:', error);
    throw new Error(`Error parsing job description: ${error.message}`);
  }
};

module.exports = { parseJobDescription };
