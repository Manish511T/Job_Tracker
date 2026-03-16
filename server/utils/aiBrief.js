// AI Brief Generator - Creates 3-bullet summary from job description
const generateAIBrief = (jobDescription) => {
  if (!jobDescription) return [];

  const text = jobDescription.toLowerCase();
  
  const briefPoints = [];

  // Extract key responsibility
  const respMatch = text.match(
    /(?:responsible for|responsibilities|will\s+(?:be|perform)|primary duties)[\s:]*([^.]+\.)/i
  );
  if (respMatch) {
    briefPoints.push(respMatch[1].substring(0, 80).trim());
  }

  // Extract key requirement
  const reqMatch = text.match(
    /(?:must\s+have|required|qualifications|experience)[\s:]*([^.]+\.)/i
  );
  if (reqMatch) {
    briefPoints.push(reqMatch[1].substring(0, 80).trim());
  }

  // Extract benefits or growth
  const benefitMatch = text.match(
    /(?:offer|provide|opportunity|growth|development)[\s:]*([^.]+\.)/i
  );
  if (benefitMatch) {
    briefPoints.push(benefitMatch[1].substring(0, 80).trim());
  }

  // Fallback: Extract first 3 sentences if needed
  if (briefPoints.length < 3) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
    while (briefPoints.length < 3 && sentences.length > 0) {
      const sentence = sentences.shift().trim();
      if (sentence.length > 10) {
        briefPoints.push(sentence.substring(0, 80) + '.');
      }
    }
  }

  return briefPoints.slice(0, 3);
};

module.exports = { generateAIBrief };
