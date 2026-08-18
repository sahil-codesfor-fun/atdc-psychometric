// Authorized assessment material supplied by Advanced Training & Development Consultant (ATDC).
// These instruments are integrated as separate scoring models because their
// response mechanics differ from the portal's standard single-score tests.

export const BELBIN_ROLES = {
  SH: { name: "Shaper", strength: "Drive and a readiness to challenge inertia, ineffectiveness, complacency or self-deception.", weakness: "Prone to provocation, irritation and impatience, and a tendency to offend others.", function: "Generates action, thrives on pressure, challenges obstacles and helps a team move decisively toward its objective." },
  CO: { name: "Co-ordinator", strength: "Welcomes contributors on their merits while keeping sight of the main objective.", weakness: "No pretensions as regards intellectual or creative ability.", function: "Creates shared goals, spots individual talents, delegates readily and coordinates diverse skills." },
  PL: { name: "Plant", strength: "Genius, imagination, intellect and knowledge.", weakness: "May disregard practical details or protocol and become absorbed in ideas.", function: "Generates original proposals and solves complex problems, especially when a project needs fresh thinking." },
  RI: { name: "Resource Investigator", strength: "Finds useful people, promising ideas and opportunities; brings vitality and external contacts.", weakness: "May lose interest once the initial fascination has passed.", function: "Explores opportunities, builds contacts, negotiates and brings useful external resources into the team." },
  ME: { name: "Monitor Evaluator", strength: "Judgement, discretion and hard-headedness.", weakness: "May lack inspiration or the ability to motivate others.", function: "Analyses problems, evaluates ideas and weighs the pros and cons of options objectively." },
  IMP: { name: "Implementer", strength: "Organising ability, practical common sense, hard work and self-discipline.", weakness: "Can be inflexible and resistant to unproven ideas.", function: "Turns plans into practical action through reliability, organisation and disciplined execution." },
  TW: { name: "Team Worker", strength: "Ability to respond to people and situations and promote team spirit.", weakness: "May be indecisive at moments of crisis or reluctant to provide a clear lead.", function: "Supports relationships, prevents interpersonal problems and helps everyone contribute effectively." },
  CF: { name: "Completer-Finisher", strength: "A capacity for fulfilling promises and working to high standards.", weakness: "May worry about small things and be reluctant to let go.", function: "Ensures accuracy, follow-through, deadlines and quality through close attention to detail." },
};

const belbinSectionsRaw = [
  [
    "I can be relied upon to see that work that needs to be done is organised.",
    "I pick up slips and omissions that others fail to notice.",
    "I react strongly when meetings look like losing track of the main objective.",
    "I produce original suggestions.",
    "I analyse other people’s ideas objectively, for both merits and failings.",
    "I am keen to find out the latest ideas and developments.",
    "I have an aptitude for organising people.",
    "I am always ready to support good suggestions that help to resolve a problem."
  ],
  [
    "I like to have a strong influence on decisions.",
    "I feel in my element where work requires a high degree of attention and concentration.",
    "I am concerned to help colleagues with their problems.",
    "I like to make critical discrimination between alternatives.",
    "I tend to have a creative approach to problem solving.",
    "I enjoy reconciling different points of view.",
    "I am more interested in practicalities than new ideas.",
    "I particularly enjoy exploring different views and techniques."
  ],
  [
    "I keep a watching eye on areas where difficulty may arise.",
    "I explore ideas that may have a wider application than in the immediate task.",
    "I like to weigh up and evaluate a range of suggestions thoroughly before choosing.",
    "I can co-ordinate and use productively other people’s abilities and talents.",
    "I maintain a steady systematic approach, whatever the pressures.",
    "I often produce a new approach to a long continuing problem.",
    "I am ready to make my personal views known in a forceful way if necessary.",
    "I am ready to help whenever I can."
  ],
  [
    "I am keen to see there is nothing vague about my task and objectives.",
    "I am not reluctant to emphasise my own point of view in meetings.",
    "I can work with all sorts of people provided that they have got something worthwhile to contribute.",
    "I make a point of following up interesting ideas and/or people.",
    "I can usually find the argument to refute unsound propositions.",
    "I tend to see patterns where others would see items as unconnected.",
    "Being busy gives me real satisfaction.",
    "I have a quiet interest in getting to know people better."
  ],
  [
    "I often find my imagination frustrated by working in a group.",
    "I find my personal skill particularly appropriate in achieving agreement.",
    "My feelings seldom interfere with my judgement.",
    "I strive to build up an effective structure.",
    "I can work with people who vary widely in their personal qualities and outlook.",
    "I feel it is sometimes worth incurring some temporary unpopularity if one is to succeed in getting one’s views across in a group.",
    "I usually know someone whose specialist knowledge is particularly apt.",
    "I seem to develop a natural sense of urgency."
  ],
  [
    "I start to look around for possible ideas and openings.",
    "I am concerned to finish and perfect current work before I start.",
    "I approach the problem in a carefully analytical way.",
    "I am able to assert myself to get other people involved if necessary.",
    "I am able to take an independent and innovative look at most situations.",
    "I am happy to take the lead when action is required.",
    "I can respond positively to my colleagues and their initiatives.",
    "I find it hard to give in a job where the goals are not clearly defined."
  ],
  [
    "I think I have a talent for sorting out the concrete steps that need to be taken given a broad brief.",
    "My considered judgement may take time but is usually near the mark.",
    "A broad range of personal contacts is important to my style of working.",
    "I have an eye for getting the details right.",
    "I try to make my mark in group meetings.",
    "I can see how ideas and techniques can be used in new relationships.",
    "I see both sides of a problem and take a decision acceptable to all.",
    "I get on well with others and work hard for the team."
  ]
];

const belbinMapping = [
  ["IMP", "CF", "SH", "PL", "ME", "RI", "CO", "TW"],
  ["SH", "CF", "TW", "ME", "PL", "CO", "IMP", "RI"],
  ["CF", "RI", "ME", "CO", "IMP", "PL", "SH", "TW"],
  ["IMP", "SH", "CO", "RI", "ME", "PL", "CF", "TW"],
  ["PL", "TW", "ME", "IMP", "CO", "SH", "RI", "CF"],
  ["RI", "CF", "PL", "CO", "ME", "SH", "TW", "IMP"],
  ["IMP", "ME", "PL", "RI", "CO", "SH", "TW", "CF"]
];

// The source scoring grid maps each statement in each section to the role shown above.
// Where the same role appears more than once in a source section, the mapping is retained.
export const BELBIN_SECTIONS = belbinSectionsRaw.map((items, sectionIndex) => ({
  label: String.fromCharCode(65 + sectionIndex),
  prompt: [
    "When involved in a project with other people:",
    "In seeking satisfaction through my work:",
    "When the team is trying to solve a particularly complex problem:",
    "In carrying out my day-to-day work:",
    "If I am suddenly given a difficult task with limited time and unfamiliar people:",
    "When suddenly asked to consider a new project:",
    "In contributing to group projects in general:"
  ][sectionIndex],
  items: items.map((text, index) => ({ text, role: belbinMapping[sectionIndex][index], number: index + 1 }))
}));

export function scoreBelbin(sectionAnswers) {
  const roleScores = Object.fromEntries(Object.keys(BELBIN_ROLES).map((key) => [key, 0]));
  BELBIN_SECTIONS.forEach((section, sectionIndex) => {
    section.items.forEach((item, itemIndex) => {
      const points = Number(sectionAnswers?.[sectionIndex]?.[itemIndex] || 0);
      roleScores[item.role] += points;
    });
  });
  const breakdown = Object.entries(roleScores)
    .map(([id, score]) => ({ id, name: BELBIN_ROLES[id].name, score }))
    .sort((a, b) => b.score - a.score);
  const primary = breakdown[0];
  const secondary = breakdown[1];
  return {
    title: "Belbin Team Role Profile",
    description: `Your primary team role is ${primary.name}, with ${secondary.name} as your secondary role. The profile reflects your preferred contribution to team work based on the points you allocated across the seven sections.`,
    primaryRole: primary,
    secondaryRole: secondary,
    breakdown,
    roleDetails: breakdown.map((role) => ({ ...role, ...BELBIN_ROLES[role.id] })),
    suggestions: [
      `Use your ${primary.name} strengths consciously when working in teams.`,
      `Partner with people whose strengths complement your ${primary.name} profile.`,
      `Use the ${secondary.name} role as an additional contribution when team demands change.`
    ]
  };
}

export const MCCLELLAND_QUESTIONS = [
  "My job requires skills that I have to practice and improve upon.",
  "Other people have to come to me for decisions.",
  "I spend most of my day sitting in one place.",
  "On my job, I meet pretty often with my boss.",
  "On my job, there is ample opportunity to talk and joke with other people.",
  "On my job, I meet pretty often with my subordinates/juniors.",
  "With the type of job I have, I have to set my standards pretty high.",
  "On this job, I am expected to help other people.",
  "In my type of work one has to know how to get along with other people.",
  "If I have to get help from someone, it’s an indication I can’t do the work well.",
  "My job offers a lot of opportunity for creativity and innovation.",
  "An important aspect of my job is the status involved.",
  "My job requires a good deal of cooperation from others.",
  "There is always something new in my job.",
  "On my job, I have to interact with a lot of people.",
  "I see the end results of my work/projects don’t just ‘disappear’ after I have done my part.",
  "My job depends on how well others do their work.",
  "I spend a lot of time telling people what has to be done.",
  "On this job (assignment) you get to know other people really well.",
  "I get a real sense of pride from my work.",
  "This type of work involves a lot of pressure to meet deadlines.",
  "The size of the unit I work with is fairly small.",
  "In this type of work, mistake can be extremely costly.",
  "I have to supervise large number of people.",
  "The thing about this job is it gives a person a chance to really achieve something.",
  "I don’t have all my work approved by my supervisor.",
  "I work almost exclusively by myself.",
  "My job requires me to sympathise with other people’s problems.",
  "I have to make sure that things run smoothly.",
  "My job is very clear cut and well defined.",
  "I am frequently in contact with other people.",
  "When I’m working on something, I often have to set it aside to do something more pressing then come back to it.",
  "This job is a big help in furthering my career.",
  "This job requires a lot of overtime and after hour work.",
  "A great deal of my work is decision making.",
  "My ability to influence others has to be used on this job.",
  "There is a lot of variety in the things I do; it is not a case of doing the same thing over and over.",
  "One of the most important aspects of my job is keeping other people happy.",
  "On this job, one can see a job from its inception through to its completion.",
  "On this job, the quality of the output is essential; it has to be excellent.",
  "There is a heavy volume of work in this job.",
  "This job keeps one working every minute.",
  "I spend most of my time managing people.",
  "My physical work surroundings are very pleasant."
];

export const MCCLELLAND_ITEMS = {
  Achievement: [1, 7, 11, 16, 20, 25, 33, 40],
  Affiliation: [4, 8, 13, 15, 19, 28, 31, 38],
  Power: [2, 6, 12, 18, 24, 29, 36, 43]
};

export function scoreMcClelland(answers) {
  const scores = {};
  for (const [need, items] of Object.entries(MCCLELLAND_ITEMS)) {
    scores[need] = items.reduce((sum, questionNumber) => sum + Number(answers?.[questionNumber - 1] || 0), 0);
  }
  const breakdown = Object.entries(scores).map(([id, score]) => ({ id, name: id, score, max: 40, percentage: Math.round((score / 40) * 100) })).sort((a, b) => b.score - a.score);
  const dominant = breakdown[0];
  const secondary = breakdown[1];
  const descriptions = {
    Achievement: "You are motivated by accomplishing challenging goals, improving performance, meeting high standards and seeing tangible results.",
    Affiliation: "You are motivated by positive relationships, cooperation, belonging, mutual support and maintaining harmonious interactions.",
    Power: "You are motivated by influence, responsibility, leadership, decision-making and the ability to make an impact on people or outcomes."
  };
  return {
    title: "McClelland Motivation Profile",
    description: `Your strongest motivational need is ${dominant.name}, followed by ${secondary.name}.`,
    dominantNeed: dominant,
    secondaryNeed: secondary,
    breakdown,
    motivationDetails: breakdown.map((item) => ({ ...item, description: descriptions[item.id] })),
    suggestions: [
      `Design academic and project goals that activate your ${dominant.name} motivation.`,
      `Use your ${secondary.name} motivation as a supporting source of energy and persistence.`,
      "Seek learning environments that allow your strongest motivational needs to be expressed constructively."
    ]
  };
}

export const MBTI_QUESTIONS = [
  [1,"When you go somewhere for the day, would you rather","Plan what you will do and when","Just go?"],
  [2,"Do you consider yourself to be","More of a spontaneous person","More of an organized person"],
  [3,"If you were a teacher, would you rather teach","Fact courses","Courses involving theory"],
  [4,"Are you usually","A good mixer","Rather quiet and reserved"],
  [5,"Do you usually get along better with","Imaginative people","Realistic people"],
  [6,"Do you more often let","Your heart rule your head","Your head rule your heart"],
  [7,"Do you prefer to do many things","On the spur of the moment","According to your plans"],
  [8,"Are you","Easy to get to know","Hard to get to know"],
  [9,"Does following a schedule","Appeal to you","Cramp you"],
  [10,"When you have a special job to do, do you like to","Organize it carefully before you start","Find out what is necessary as you go along"],
  [11,"In most instances, do you prefer to","Go with the flow","Follow a schedule"],
  [12,"Would most people say you are","A private person","A very open person"],
  [13,"Would you rather be considered","A practical person","An ingenious person"],
  [14,"In a large group do you more often","Introduce others","Get introduced"],
  [15,"Would you rather have as a friend someone who","Is always coming up with new ideas","Has both feet on the ground"],
  [16,"Are you inclined to","Value sentiment more than logic","Value logic more than sentiment"],
  [17,"Do you prefer to","Wait and see what happens and then make plans","Plan things far in advance"],
  [18,"Do you tend to spend a lot of time","By yourself","With others"],
  [19,"Do you find being around a lot of people","Gives you more energy","Is often draining"],
  [20,"Do you prefer to","Arrange dates, parties, etc., well in advance","Be free to do whatever looks like fun when the time comes"],
  [21,"In planning a trip would you prefer to","Most of the time do whatever you feel like that day","Know ahead of time what you’ll be doing most days"],
  [22,"At parties, do you","Sometimes get bored","Always have fun"],
  [23,"Do you usually","Mingle well with others","Tend to keep more to yourself"],
  [24,"Are you more attracted to","A person with a quick and brilliant mind","A practical person with a lot of common sense"],
  [25,"In your daily work, do you","Rather enjoy an emergency that makes you work against time","Usually plan your work so you won’t need to work under pressure"],
  [26,"Would you say it generally takes others","A lot of time to get to know you","A little time to get to know you"],
  [27,"Which word appeals to you more?","private","open"],
  [28,"Which word appeals to you more?","scheduled","unplanned"],
  [29,"Which word appeals to you more?","abstract","solid"],
  [30,"Which word appeals to you more?","gentle","firm"],
  [31,"Which word appeals to you more?","thinking","feeling"],
  [32,"Which word appeals to you more?","facts","ideas"],
  [33,"Which word appeals to you more?","impulse","decision"],
  [34,"Which word appeals to you more?","hearty","quiet"],
  [35,"Which word appeals to you more?","quiet","outgoing"],
  [36,"Which word appeals to you more?","systematic","casual"],
  [37,"Which word appeals to you more?","theory","certainty"],
  [38,"Which word appeals to you more?","sensitive","just"],
  [39,"Which word appeals to you more?","convincing","touching"],
  [40,"Which word appeals to you more?","statement","concept"],
  [41,"Which word appeals to you more?","unconstrained","scheduled"],
  [42,"Which word appeals to you more?","reserved","talkative"],
  [43,"Which word appeals to you more?","orderly","easygoing"],
  [44,"Which word appeals to you more?","idea","actuality"],
  [45,"Which word appeals to you more?","compassion","foresight"],
  [46,"Which word appeals to you more?","benefits","blessings"],
  [47,"Which word appeals to you more?","no-nonsense","theoretical"],
  [48,"Which word appeals to you more?","few friends","lots of friends"],
  [49,"Which word appeals to you more?","systematic","spontaneous"],
  [50,"Which word appeals to you more?","imaginative","matter-of-fact"],
  [51,"Which word appeals to you more?","warm","objective"],
  [52,"Which word appeals to you more?","objective","passionate"],
  [53,"Which word appeals to you more?","build","invent"],
  [54,"Which word appeals to you more?","quiet","gregarious"],
  [55,"Which word appeals to you more?","theory","fact"],
  [56,"Which word appeals to you more?","compassionate","logical"],
  [57,"Which word appeals to you more?","analytical","sentimental"],
  [58,"Which word appeals to you more?","sensible","fascinating"],
  [59,"When you start a big project that is due in a week, do you","Take time to list the separate things to be done and the order of doing them","Plunge in"],
  [60,"In social situations do you generally find it","Difficult to start and maintain a conversation with some people","Easy to talk to most people for long periods of time"],
  [61,"In doing something that many other people do, does it appeal to you more to","Do it in the accepted way","Invent a new way of your own"],
  [62,"Can the new people you meet tell what you are interested in","Right away","Only after they really get to know you"],
  [63,"Do you generally prefer courses that teach","Concepts and principles","Facts and figures"],
  [64,"Is it a higher compliment to be called","A person of real feeling","A consistently reasonable person"],
  [65,"Do you find going by a schedule","Necessary at times but generally unfavorable","Helpful and favorable most of the time"],
  [66,"When you are with a group of people, would you usually rather","Talk individually with people you know well","Join in the talk of the group"],
  [67,"At parties do you","Do much of the talking","Let others do most of the talking"],
  [68,"Does the idea of making a list of what you should get done over a weekend","Appeal to you","Leave you cold"],
  [69,"Which is a higher compliment, to be called","Competent","Compassionate"],
  [70,"Do you generally prefer to","Make your social engagements some distance ahead","Be free to do things on the spur of the moment"],
  [71,"Overall, when working on a big assignment, do you tend to","Figure out what needs to be done as you go along","Begin by breaking it down into steps"],
  [72,"Can you keep a conversation going indefinitely?","Only with people who share some interest of yours","With almost anyone"],
  [73,"Would you rather","Support the established methods of doing good","Analyze what is still wrong and attack unsolved problems"],
  [74,"In reading for pleasure, do you","Enjoy odd or original ways of saying things","Like writers to say exactly what they mean"],
  [75,"Would you rather work under a boss (or teacher) who is","Good-natured but often inconsistent","Sharp-tongued but always logical"],
  [76,"Would you prefer to do most things according to","However you feel that particular day","A set schedule"],
  [77,"Can you","Talk easily to almost anyone for as long as you have to","Find a lot to say only to certain people or under certain conditions"],
  [78,"When making a decision, is it more important to you to","Weigh the facts","Consider people’s feelings and opinions"],
  [79,"Which word appeals to you more?","imaginative","realistic"],
  [80,"Which word appeals to you more?","bighearted","firm-minded"],
  [81,"Which word appeals to you more?","fair-minded","caring"],
  [82,"Which word appeals to you more?","production","design"],
  [83,"Which word appeals to you more?","possibilities","certainties"],
  [84,"Which word appeals to you more?","tenderness","strength"],
  [85,"Which word appeals to you more?","practical","sentimental"],
  [86,"Which word appeals to you more?","make","create"],
  [87,"Which word appeals to you more?","novel","already known"],
  [88,"Which word appeals to you more?","sympathize","analyze"],
  [89,"Which word appeals to you more?","strong-willed","tenderhearted"],
  [90,"Which word appeals to you more?","concrete","abstract"],
  [91,"Which word appeals to you more?","devoted","determined"],
  [92,"Which word appeals to you more?","competent","kindhearted"],
  [93,"Which word appeals to you more?","practical","innovative"]
].map(([number, prompt, a, b]) => ({ number, prompt, options: { a, b } }));

// Exact scoring grid from the supplied loose MBTI results sheet.
const MBTI_MAP = {
  E: ["4a","8a","12b","14a","18b","19a","22b","23a","26b","27b","34a","35b","42b","48b","54b","60b","62a","66b","67a","72b","77a"],
  I: ["4b","8b","12a","14b","18a","19b","22a","23b","26a","27a","34b","35a","42a","48a","54a","60a","62b","66a","67b","72a","77b"],
  S: ["3a","5b","13a","15b","24b","29b","32a","37b","40a","44b","47a","50b","53a","55b","58a","61a","63b","73a","74b","79b","83b","85a","86a","87b","90a","93a"],
  N: ["3b","5a","13b","15a","24a","29a","32b","37a","40b","44a","47b","50a","53b","55a","58b","61b","63a","73b","74a","79a","83a","85b","86b","87a","90b","93b"],
  T: ["6b","16b","30b","31a","38b","39a","45b","46a","51b","52a","56b","57a","64b","69a","75b","78a","80b","81a","84b","88b","89a","92a"],
  F: ["6a","16a","30a","31b","38a","39b","45a","46b","51a","52b","56a","57b","64a","69b","75a","78b","80a","81b","84a","88a","89b","92b"],
  J: ["1a","2b","7b","9a","10a","11b","17b","20a","21b","25b","28a","33b","36a","41b","43a","49a","59a","65b","68a","70a","71b","76b","82a","91b"],
  P: ["1b","2a","7a","9b","10b","11a","17a","20b","21a","25a","28b","33a","36b","41a","43b","49b","59b","65a","68b","70b","71a","76a","82b","91a"]
};

const MBTI_SCORE_KEYS = Object.entries(MBTI_MAP).reduce((acc, [type, keys]) => {
  keys.forEach((key) => { acc[key] = type; });
  return acc;
}, {});

export function scoreMBTI(answers) {
  const totals = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  MBTI_QUESTIONS.forEach((question, index) => {
    const answer = answers?.[index];
    if (!answer) return;
    const type = MBTI_SCORE_KEYS[`${question.number}${answer}`];
    if (type) totals[type] += 1;
  });
  const pairs = [["E","I"],["S","N"],["T","F"],["J","P"]];
  const chosen = pairs.map(([left, right]) => totals[left] >= totals[right] ? left : right);
  const type = chosen.join("");
  const names = {
    ISTJ: "The Inspector", ISFJ: "The Defender", INFJ: "The Advocate", INTJ: "The Architect",
    ISTP: "The Virtuoso", ISFP: "The Adventurer", INFP: "The Mediator", INTP: "The Logician",
    ESTP: "The Entrepreneur", ESFP: "The Entertainer", ENFP: "The Campaigner", ENTP: "The Debater",
    ESTJ: "The Executive", ESFJ: "The Consul", ENFJ: "The Protagonist", ENTJ: "The Commander"
  };
  const descriptions = {
    ISTJ: "Practical, dependable and methodical; you tend to value structure, responsibility and evidence.",
    ISFJ: "Supportive, conscientious and dependable; you tend to notice practical needs and follow through carefully.",
    INFJ: "Insightful, values-driven and thoughtful; you tend to look for meaning and long-term possibilities.",
    INTJ: "Independent, strategic and analytical; you tend to build structured solutions around long-term goals.",
    ISTP: "Practical, adaptable and analytical; you tend to learn by doing and solve problems directly.",
    ISFP: "Observant, flexible and considerate; you tend to value authenticity, harmony and hands-on experience.",
    INFP: "Reflective, empathetic and values-driven; you tend to seek meaningful work aligned with your ideals.",
    INTP: "Curious, analytical and independent; you tend to explore systems, concepts and possibilities deeply.",
    ESTP: "Action-oriented, practical and adaptable; you tend to respond quickly to opportunities and real-world challenges.",
    ESFP: "Energetic, sociable and practical; you tend to bring enthusiasm, responsiveness and people awareness to activities.",
    ENFP: "Enthusiastic, imaginative and people-focused; you tend to explore possibilities and energize others around ideas.",
    ENTP: "Inventive, analytical and exploratory; you tend to challenge assumptions and generate alternative solutions.",
    ESTJ: "Organized, decisive and practical; you tend to create structure and drive work toward clear outcomes.",
    ESFJ: "Warm, cooperative and organized; you tend to build relationships while ensuring responsibilities are handled.",
    ENFJ: "People-focused, organized and encouraging; you tend to develop others and align groups around shared goals.",
    ENTJ: "Strategic, decisive and goal-oriented; you tend to organize people and resources around ambitious objectives."
  };
  const dimensionScores = pairs.map(([left, right]) => ({
    dimension: `${left}/${right}`,
    left,
    right,
    leftScore: totals[left],
    rightScore: totals[right],
    preference: totals[left] >= totals[right] ? left : right
  }));
  return {
    title: "16-Type Personality Profile",
    type,
    typeName: names[type],
    description: descriptions[type],
    totals,
    dimensionScores,
    breakdown: dimensionScores.map((d) => ({ id: d.dimension, name: d.dimension, score: Math.max(d.leftScore, d.rightScore), preference: d.preference })),
    suggestions: [
      `Your four-letter profile is ${type} (${names[type]}). Use it as a preference profile rather than a fixed label.`,
      "Choose learning and teamwork strategies that fit your strongest preferences while deliberately practicing the opposite preferences when useful.",
      "Use the profile as a starting point for reflection, not as a measure of ability or worth."
    ]
  };
}

export const ADDITIONAL_TESTS = {
  belbin: {
    title: "Belbin Team Role Assessment",
    kind: "belbin",
    instructions: "In each section, distribute exactly 10 points among the statements that best describe you. You may give 0 points to statements that do not apply. The highest two role totals become your primary and secondary preferred team roles."
  },
  mcclelland: {
    title: "McClelland Motivation Profile",
    kind: "mcclelland",
    options: ["5 - Very characteristic", "4 - Quite characteristic", "3 - Moderately/Fairly characteristic", "2 - Not very characteristic", "1 - Not at all characteristic / Does not apply"],
    questions: MCCLELLAND_QUESTIONS
  },
  mbti: {
    title: "Myers-Briggs Type Indicator (MBTI)",
    kind: "mbti",
    questions: MBTI_QUESTIONS
  }
};
