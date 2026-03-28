export type AnswerOption = {
  id: string;
  text: string;
  textNe: string;
};

export type ScreeningQuestion = {
  id: string;
  text: string;
  textNe: string;
  category: 'emotional_suppression' | 'comparison_pressure' | 'conditional_love' | 'absence' | 'shame_culture';
  options: AnswerOption[];
  positiveAnswerIds: string[];
};

export type ScreeningResult = 'strong_signs' | 'moderate_signs' | 'low_signs';

export type ScenarioOption = {
  id: string;
  text: string;
  textNe: string;
  score: number;
  reflection: string;
};

export type ScenarioQuestion = {
  id: string;
  situation: string;
  situationNe: string;
  options: ScenarioOption[];
};

export type ChainResult = 'chain_broken' | 'chain_bending' | 'chain_holding';

export const categoryLabels: Record<ScreeningQuestion['category'], string> = {
  emotional_suppression: 'Emotional Space',
  comparison_pressure: 'Family Pressure',
  conditional_love: 'Conditional Love',
  absence: 'Presence & Care',
  shame_culture: 'Shame & Silence',
};

export const screeningQuestions: ScreeningQuestion[] = [
  {
    id: "sq1",
    category: "comparison_pressure",
    text: "Growing up, were you often compared to other children by your parents or family elders?",
    textNe: "हुर्कँदा, तपाईंलाई अभिभावक वा परिवारका ठूलाहरूले अरू बच्चासँग प्रायः तुलना गर्थे?",
    options: [
      { id: "sq1_a", text: "Almost never", textNe: "लगभग कहिल्यै हैन" },
      { id: "sq1_b", text: "Sometimes", textNe: "कहिलेकाहीँ" },
      { id: "sq1_c", text: "Often", textNe: "प्रायः" },
      { id: "sq1_d", text: "Almost always — it was how they motivated me", textNe: "लगभग सधैँ — यसैले उनीहरू मलाई प्रेरित गर्थे" }
    ],
    positiveAnswerIds: ["sq1_c", "sq1_d"]
  },
  {
    id: "sq2",
    category: "emotional_suppression",
    text: "When you were upset or crying as a child, what usually happened at home?",
    textNe: "बच्चाकालमा तपाईं दुःखी वा रोइरहनुभएको बेला घरमा प्रायः के हुन्थ्यो?",
    options: [
      { id: "sq2_a", text: "I was comforted and heard", textNe: "मलाई सान्त्वना दिइन्थ्यो र सुनिन्थ्यो" },
      { id: "sq2_b", text: "I was given space to feel it", textNe: "मलाई भावना व्यक्त गर्न ठाउँ दिइन्थ्यो" },
      { id: "sq2_c", text: "I was told to stop crying and toughen up", textNe: "मलाई रुन छाड्न र कडा बन्न भनिन्थ्यो" },
      { id: "sq2_d", text: "I was ignored or told my feelings were exaggerated", textNe: "मलाई बेवास्ता गरिन्थ्यो वा मेरो भावना अतिरञ्जित भएको भनिन्थ्यो" }
    ],
    positiveAnswerIds: ["sq2_c", "sq2_d"]
  },
  {
    id: "sq3",
    category: "conditional_love",
    text: "Did you feel your parents' love or approval depended on your performance — in school, sports, or behaviour?",
    textNe: "के तपाईंलाई लाग्थ्यो कि अभिभावकको माया वा स्वीकृति तपाईंको प्रदर्शनमा — पढाइमा, खेलमा, वा व्यवहारमा — निर्भर थियो?",
    options: [
      { id: "sq3_a", text: "No, I felt loved regardless", textNe: "होइन, म जे भए पनि प्रेमित महसुस गर्थें" },
      { id: "sq3_b", text: "Mostly yes, but there were warm moments", textNe: "प्रायः हो, तर न्यानो क्षणहरू पनि थिए" },
      { id: "sq3_c", text: "Yes, good results meant good treatment", textNe: "हो, राम्रो नतिजाको अर्थ राम्रो व्यवहार थियो" },
      { id: "sq3_d", text: "Yes — I never felt enough no matter what I did", textNe: "हो — मैले जे गरे पनि म कहिल्यै पर्याप्त महसुस गरिनँ" }
    ],
    positiveAnswerIds: ["sq3_c", "sq3_d"]
  },
  {
    id: "sq4",
    category: "shame_culture",
    text: "Were topics like mental health, sadness, or personal struggles treated as shameful or private in your household?",
    textNe: "के तपाईंको घरमा मानसिक स्वास्थ्य, उदासी, वा व्यक्तिगत समस्याहरूलाई लाजमर्दो वा गोप्य विषयको रूपमा लिइन्थ्यो?",
    options: [
      { id: "sq4_a", text: "No, we talked about feelings openly", textNe: "होइन, हामी भावनाबारे खुलेर कुरा गर्थ्यौं" },
      { id: "sq4_b", text: "It was uncomfortable but not forbidden", textNe: "असहज थियो तर निषेधित थिएन" },
      { id: "sq4_c", text: "Yes — ke bhancha manchhele was the main concern", textNe: "हो — 'के भन्छन् मान्छेले' नै मुख्य चिन्ता थियो" },
      { id: "sq4_d", text: "Completely — showing struggle was seen as weakness", textNe: "पूर्णतया — कठिनाइ देखाउनु कमजोरीको संकेत मानिन्थ्यो" }
    ],
    positiveAnswerIds: ["sq4_c", "sq4_d"]
  },
  {
    id: "sq5",
    category: "absence",
    text: "Was a parent or primary caregiver physically or emotionally absent during important parts of your childhood?",
    textNe: "के तपाईंको बाल्यकालका महत्त्वपूर्ण अवस्थामा कुनै अभिभावक वा प्राथमिक हेरचाहकर्ता शारीरिक वा भावनात्मक रूपमा अनुपस्थित थिए?",
    options: [
      { id: "sq5_a", text: "No, they were present and engaged", textNe: "होइन, उनीहरू उपस्थित र संलग्न थिए" },
      { id: "sq5_b", text: "Sometimes absent due to work, but emotionally present", textNe: "कामको कारण कहिलेकाहीँ अनुपस्थित, तर भावनात्मक रूपमा उपस्थित" },
      { id: "sq5_c", text: "Often away — I grew up mostly without them around", textNe: "प्रायः टाढा — म प्रायः उनीहरूबिना हुर्केँ" },
      { id: "sq5_d", text: "Present physically but emotionally completely unavailable", textNe: "शारीरिक रूपमा उपस्थित तर भावनात्मक रूपमा पूर्णतया अनुपलब्ध" }
    ],
    positiveAnswerIds: ["sq5_c", "sq5_d"]
  },
  {
    id: "sq6",
    category: "emotional_suppression",
    text: "Were you ever punished — directly or indirectly — for expressing anger, sadness, or fear?",
    textNe: "के तपाईंलाई कहिल्यै — प्रत्यक्ष वा अप्रत्यक्ष रूपमा — रिस, उदासी, वा डर व्यक्त गरेकोमा दण्ड दिइएको थियो?",
    options: [
      { id: "sq6_a", text: "No, emotions were accepted", textNe: "होइन, भावनाहरू स्वीकार गरिन्थ्यो" },
      { id: "sq6_b", text: "I was gently redirected but not punished", textNe: "मलाई बिस्तारै दिशानिर्देश गरिन्थ्यो तर दण्ड दिइँदैनथ्यो" },
      { id: "sq6_c", text: "Yes — I learned to hide how I really felt", textNe: "हो — मैले आफ्नो वास्तविक भावना लुकाउन सिकेँ" },
      { id: "sq6_d", text: "Yes — I still struggle to show real emotions to anyone", textNe: "हो — अझै पनि मलाई कसैलाई साँचो भावना देखाउन गाह्रो छ" }
    ],
    positiveAnswerIds: ["sq6_c", "sq6_d"]
  },
  {
    id: "sq7",
    category: "comparison_pressure",
    text: "Did family expectations about your career, marriage, or life path feel like they were chosen for you — not with you?",
    textNe: "के परिवारको क्यारियर, विवाह, वा जीवन मार्गबारेको अपेक्षा तपाईंसँग मिलेर नभएर तपाईंका लागि छनोट गरिएजस्तो लाग्थ्यो?",
    options: [
      { id: "sq7_a", text: "No, I felt involved in decisions about my life", textNe: "होइन, मलाई आफ्नो जीवनका निर्णयमा संलग्न भएको महसुस भयो" },
      { id: "sq7_b", text: "Partially — some pressure but some freedom too", textNe: "आंशिक रूपमा — केही दबाब तर केही स्वतन्त्रता पनि" },
      { id: "sq7_c", text: "Mostly — the path was decided, I just had to walk it", textNe: "प्रायः — बाटो तय थियो, मैले हिँड्नु मात्र थियो" },
      { id: "sq7_d", text: "Completely — my own dreams felt selfish to even think about", textNe: "पूर्णतया — आफ्नै सपनाहरू सोच्नु पनि स्वार्थी जस्तो लाग्थ्यो" }
    ],
    positiveAnswerIds: ["sq7_c", "sq7_d"]
  },
  {
    id: "sq8",
    category: "shame_culture",
    text: "Was the concept of seeking help — a counselor, therapist, or even a trusted adult outside family — seen as embarrassing?",
    textNe: "के सहायता खोज्ने विचार — एक परामर्शदाता, थेरापिस्ट, वा परिवारबाहिरको विश्वसनीय वयस्क — लाजमर्दो मानिन्थ्यो?",
    options: [
      { id: "sq8_a", text: "No, seeking help was encouraged", textNe: "होइन, सहायता माग्न प्रोत्साहन गरिन्थ्यो" },
      { id: "sq8_b", text: "Neutral — never discussed either way", textNe: "तटस्थ — कहिल्यै छलफल भएन" },
      { id: "sq8_c", text: "Yes — only 'weak' or 'pagal' people went to counselors", textNe: "हो — केवल 'कमजोर' वा 'पागल' मान्छे परामर्शदाताकहाँ जान्थे" },
      { id: "sq8_d", text: "Yes — I have never told anyone I struggled because of this", textNe: "हो — यसकारण मैले कहिल्यै कसैलाई आफ्नो समस्याबारे बताइनँ" }
    ],
    positiveAnswerIds: ["sq8_c", "sq8_d"]
  },
  {
    id: "sq9",
    category: "conditional_love",
    text: "Did you ever feel you had to earn your place in your own family — by being useful, successful, or obedient?",
    textNe: "के तपाईंलाई कहिल्यै आफ्नै परिवारमा आफ्नो स्थान कमाउनु पर्छजस्तो लाग्यो — उपयोगी, सफल, वा आज्ञाकारी भएर?",
    options: [
      { id: "sq9_a", text: "No, I always felt I belonged", textNe: "होइन, मलाई सधैँ आफ्नो ठाउँ भएको महसुस भयो" },
      { id: "sq9_b", text: "Sometimes, but it felt normal growing up", textNe: "कहिलेकाहीँ, तर हुर्कँदा सामान्य जस्तो लाग्थ्यो" },
      { id: "sq9_c", text: "Often — good behaviour meant love, bad meant withdrawal", textNe: "प्रायः — राम्रो व्यवहारको अर्थ माया, नराम्रोको अर्थ दूरी" },
      { id: "sq9_d", text: "Always — I still feel I'm not enough for them", textNe: "सधैँ — अझै पनि लाग्छ म उनीहरूका लागि पर्याप्त छैनँ" }
    ],
    positiveAnswerIds: ["sq9_c", "sq9_d"]
  },
  {
    id: "sq10",
    category: "absence",
    text: "Looking back, do you feel your childhood had enough space for play, joy, and just being a child — without pressure?",
    textNe: "पछाडि फर्केर हेर्दा, के तपाईंको बाल्यकालमा खेल्न, आनन्द लिन, र दबाबविना बच्चा हुनका लागि पर्याप्त ठाउँ थियो?",
    options: [
      { id: "sq10_a", text: "Yes, it was a free and joyful childhood", textNe: "हो, यो स्वतन्त्र र आनन्दमय बाल्यकाल थियो" },
      { id: "sq10_b", text: "Mostly yes, with some pressured periods", textNe: "प्रायः हो, केही दबाबयुक्त अवधिहरूसहित" },
      { id: "sq10_c", text: "Not really — I was always preparing for the next expectation", textNe: "त्यति होइन — म सधैँ अर्को अपेक्षाको तयारी गरिरहन्थें" },
      { id: "sq10_d", text: "No — I don't really remember joy without guilt attached to it", textNe: "होइन — मलाई अपराधबोधबिनाको आनन्द साँच्चै याद छैन" }
    ],
    positiveAnswerIds: ["sq10_c", "sq10_d"]
  }
];

export function calculateScreeningScore(answers: Record<string, string>): {
  score: number;
  result: ScreeningResult;
  dominantCategory: string;
} {
  let score = 0;
  const categoryCounts: Record<string, number> = {};

  screeningQuestions.forEach(q => {
    const answer = answers[q.id];
    if (q.positiveAnswerIds.includes(answer)) {
      score += 1;
      categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
    }
  });

  const dominantCategory = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'general';

  const result: ScreeningResult =
    score >= 7 ? 'strong_signs' :
    score >= 4 ? 'moderate_signs' : 'low_signs';

  return { score, result, dominantCategory };
}

export const scenarioQuestions: ScenarioQuestion[] = [
  {
    id: "sc1",
    situation: "Your younger sibling just failed an important exam. Your first instinct is to say:",
    situationNe: "तपाईंको सानो भाई/बहिनी भर्खरै महत्त्वपूर्ण परीक्षामा फेल भयो। तपाईंको पहिलो प्रतिक्रिया के हुन्छ?",
    options: [
      {
        id: "sc1_a", score: 0,
        text: "\"Why did you fail? Your cousin passed with distinction. What will people say?\"",
        textNe: "\"किन फेल भयौ? तिम्रो दाजुले distinction मा पास गर्यो। मान्छेले के भन्छन्?\"",
        reflection: "This mirrors the comparison cycle. Your sibling will feel what you once felt."
      },
      {
        id: "sc1_b", score: 1,
        text: "Stay silent. You don't want to make it worse, but you don't know what to say.",
        textNe: "चुप बस्नुहोस्। अझ नराम्रो नगर्न चाहनुहुन्छ, तर के भन्ने थाहा छैन।",
        reflection: "Silence is better than comparison, but your sibling still feels alone right now."
      },
      {
        id: "sc1_c", score: 2,
        text: "\"It's okay. Let's figure out what happened and how to do better next time.\"",
        textNe: "\"ठीक छ। के भयो र अर्को पटक कसरी राम्रो गर्ने भनौं।\"",
        reflection: "This is constructive. You're focused on growth, not shame."
      },
      {
        id: "sc1_d", score: 3,
        text: "\"That must feel awful. I'm here. You're more than this result.\"",
        textNe: "\"यो कस्तो नराम्रो लाग्यो होला। म यहाँ छु। तिमी यो नतिजाभन्दा धेरै बढी हौ।\"",
        reflection: "You just gave your sibling something you may never have received. That is the chain breaking."
      }
    ]
  },
  {
    id: "sc2",
    situation: "Your future child comes to you crying about friendship problems at school. You are tired from work. You:",
    situationNe: "तपाईंको भविष्यको बच्चा स्कूलमा साथीहरूसँगको समस्याबारे रोँदै तपाईंकहाँ आउँछ। तपाईं कामबाट थाक्नुभएको छ। तपाईं:",
    options: [
      {
        id: "sc2_a", score: 0,
        text: "\"Not now. This is small stuff. Stop crying — go do your homework.\"",
        textNe: "\"अहिले होइन। यो सानो कुरा हो। नरो — गएर गृहकार्य गर।\"",
        reflection: "Your fatigue became their silence. This is how emotional suppression passes down."
      },
      {
        id: "sc2_b", score: 1,
        text: "Distract them with food or TV. The crying stops. You feel relieved.",
        textNe: "खाना वा टेलिभिजनले ध्यान हटाउनुस्। रुनु बन्द हुन्छ। तपाईंलाई राहत महसुस हुन्छ।",
        reflection: "You stopped the pain but didn't address it. They learned to suppress, not process."
      },
      {
        id: "sc2_c", score: 2,
        text: "Sit with them for 10 minutes. Listen. Say \"that sounds hard\" even if you're tired.",
        textNe: "१० मिनेट उनीहरूसँग बस्नुस्। सुन्नुस्। थकान भए पनि \"त्यो गाह्रो रहेछ\" भन्नुस्।",
        reflection: "Ten minutes of presence is a gift. You're building their emotional safety."
      },
      {
        id: "sc2_d", score: 3,
        text: "Take a breath, put your phone down, hold them, and say \"Tell me everything.\"",
        textNe: "सास फेर्नुस्, फोन राख्नुस्, उनीहरूलाई अँगाल्नुस्, र भन्नुस् \"सबै कुरा भन।\"",
        reflection: "You just chose presence over performance. They will remember this their whole life."
      }
    ]
  },
  {
    id: "sc3",
    situation: "You're at a family gathering. A relative asks your child \"So, what rank did you get? What will you become?\" in front of everyone. You:",
    situationNe: "तपाईं पारिवारिक भेलामा हुनुहुन्छ। एक नातेदारले सबैको अगाडि तपाईंको बच्चालाई सोध्छ \"त्यसो भए, कति rank आयो? के बन्छौ?\" तपाईं:",
    options: [
      {
        id: "sc3_a", score: 0,
        text: "Push your child to answer and then add \"still needs to improve\" yourself.",
        textNe: "आफ्नो बच्चालाई जवाफ दिन बाध्य गर्नुस् र आफैं \"अझ सुधार्नुपर्छ\" थप्नुस्।",
        reflection: "You just validated the comparison system and made your child smaller in public."
      },
      {
        id: "sc3_b", score: 1,
        text: "Stay quiet. You feel uncomfortable but don't want to create conflict.",
        textNe: "चुप बस्नुस्। असहज महसुस गर्नुहुन्छ तर द्वन्द्व सिर्जना गर्न चाहनुहुन्न।",
        reflection: "Your silence taught your child that their discomfort doesn't deserve protection."
      },
      {
        id: "sc3_c", score: 2,
        text: "Change the subject quickly and check on your child afterwards privately.",
        textNe: "विषय छिटो बदल्नुस् र पछि एकान्तमा आफ्नो बच्चालाई जाँच गर्नुस्।",
        reflection: "You protected them quietly. That private check-in matters a lot."
      },
      {
        id: "sc3_d", score: 3,
        text: "Smile and say \"We don't measure them by rank. They're doing great just as they are.\"",
        textNe: "मुस्कुराउनुस् र भन्नुस् \"हामी उनीहरूलाई rank ले मापन गर्दैनौं। उनीहरू जस्ता छन् त्यसैमा राम्रो गरिरहेका छन्।\"",
        reflection: "You just publicly protected your child's dignity. That is generational healing in real time."
      }
    ]
  },
  {
    id: "sc4",
    situation: "Your child tells you they want to pursue art or music instead of engineering or medicine. Your reaction:",
    situationNe: "तपाईंको बच्चाले इन्जिनियरिङ वा चिकित्साको सट्टा कला वा संगीत पढ्न चाहन्छु भन्छ। तपाईंको प्रतिक्रिया:",
    options: [
      {
        id: "sc4_a", score: 0,
        text: "\"That's not a real career. Think about your future. Think about what we sacrificed.\"",
        textNe: "\"त्यो वास्तविक क्यारियर होइन। आफ्नो भविष्यको बारेमा सोच। हामीले गरेको त्यागबारे सोच।\"",
        reflection: "You just put your fear above their identity. They will either break or hide from you."
      },
      {
        id: "sc4_b", score: 1,
        text: "Say nothing now, but quietly hope they'll \"come to their senses\" later.",
        textNe: "अहिले केही नभन्नुस्, तर शान्तसँग आशा राख्नुस् कि उनीहरू पछि \"होशमा आउनेछन्।\"",
        reflection: "You're tolerating their dream, not respecting it. They can feel the difference."
      },
      {
        id: "sc4_c", score: 2,
        text: "\"Tell me more about what draws you to this. I want to understand.\"",
        textNe: "\"यसले तिमीलाई के आकर्षित गर्छ भनेर अझ बताऊ। म बुझ्न चाहन्छु।\"",
        reflection: "Curiosity before judgment. This is what most parents never offered their children."
      },
      {
        id: "sc4_d", score: 3,
        text: "\"I may not fully understand it, but if this is your path — let's figure it out together.\"",
        textNe: "\"म यसलाई पूर्ण रूपमा नबुझ्न सक्छु, तर यदि यो तिम्रो बाटो हो भने — सँगै निकाल्छौं।\"",
        reflection: "You just gave them something that changes everything: permission to be themselves."
      }
    ]
  },
  {
    id: "sc5",
    situation: "You notice your child seems withdrawn and sad for several days. When you ask, they say \"I'm fine.\" You:",
    situationNe: "तपाईंले आफ्नो बच्चा केही दिनदेखि एकान्तप्रिय र उदास देख्नुहुन्छ। सोध्दा उनीहरूले \"म ठीक छु\" भन्छन्। तपाईं:",
    options: [
      {
        id: "sc5_a", score: 0,
        text: "Accept \"I'm fine\" and move on. They said it, so it must be true.",
        textNe: "\"म ठीक छु\" स्वीकार गरेर अगाडि बढ्नुस्। उनीहरूले भने, त्यसैले सत्य हुनुपर्छ।",
        reflection: "\"I'm fine\" is often the learned answer when children don't feel safe to share. You may have taught them this."
      },
      {
        id: "sc5_b", score: 1,
        text: "Tell them to pray, stay busy, or \"think positively.\"",
        textNe: "उनीहरूलाई प्रार्थना गर्न, व्यस्त रहन, वा \"सकारात्मक सोच्न\" भन्नुस्।",
        reflection: "Spiritual bypassing and toxic positivity dismiss real pain. Their sadness deserved acknowledgment."
      },
      {
        id: "sc5_c", score: 2,
        text: "Check in again the next day. Create a low-pressure moment — tea, a walk, no agenda.",
        textNe: "भोलिपल्ट फेरि जाँच गर्नुस्। कम दबाबको क्षण सिर्जना गर्नुस् — चिया, हिँडाइ, कुनै उद्देश्य नभएको।",
        reflection: "Showing up again, without pressure, is a profound act of care. They notice."
      },
      {
        id: "sc5_d", score: 3,
        text: "Sit beside them quietly and say: \"You don't have to be fine. I'm not going anywhere.\"",
        textNe: "उनीहरूको छेउमा शान्तसँग बस्नुस् र भन्नुस्: \"ठीक हुनु जरुरी छैन। म कतै जाँदैनँ।\"",
        reflection: "You just broke the silence that was passed to you. This is how healing moves forward."
      }
    ]
  },
  {
    id: "sc6",
    situation: "You had a terrible day and you're overwhelmed. Your child did something minor that frustrates you. You feel your parents' voice rising in you. You:",
    situationNe: "तपाईंको दिन भयानक थियो र तपाईं अभिभूत हुनुहुन्छ। तपाईंको बच्चाले केही सानो कुरा गर्यो जसले तपाईंलाई निराश बनाउँछ। तपाईं आफूभित्र अभिभावकको आवाज उठ्दै गरेको महसुस गर्नुहुन्छ। तपाईं:",
    options: [
      {
        id: "sc6_a", score: 0,
        text: "Let it out. They need to learn. It's not that bad.",
        textNe: "पोखिन दिनुस्। उनीहरूले सिक्नुपर्छ। यो त्यति नराम्रो होइन।",
        reflection: "In this moment, your child became the place you put your pain. They will remember this."
      },
      {
        id: "sc6_b", score: 1,
        text: "Go silent and cold. Don't explode, but withdraw completely.",
        textNe: "चुप र चिसो बन्नुस्। विस्फोट नगर्नुस्, तर पूरै पछि हट्नुस्।",
        reflection: "Cold silence is its own wound. They don't understand what they did wrong — only that you disappeared."
      },
      {
        id: "sc6_c", score: 2,
        text: "Step away for 10 minutes. Come back calmer. Address the issue without using them as an outlet.",
        textNe: "१० मिनेट टाढा जानुस्। शान्त भएर फर्कनुस्। उनीहरूलाई आउटलेट नबनाई समस्या सम्बोधन गर्नुस्।",
        reflection: "Pausing before reacting is one of the hardest and most powerful things a parent can do."
      },
      {
        id: "sc6_d", score: 3,
        text: "Say: \"I'm having a hard day. What you did was minor. Give me a moment, then let's talk properly.\"",
        textNe: "भन्नुस्: \"मेरो दिन कठिन छ। तिमीले गरेको सानो कुरा हो। मलाई एक क्षण दिनुस्, त्यसपछि राम्रोसँग कुरा गरौं।\"",
        reflection: "You just modeled emotional honesty, accountability, and repair — all in one sentence. This is what healing looks like."
      }
    ]
  }
];

export function calculateChainScore(answers: Record<string, string>): {
  totalScore: number;
  maxScore: number;
  percentage: number;
  result: ChainResult;
  reflections: string[];
} {
  let totalScore = 0;
  const maxScore = scenarioQuestions.length * 3;
  const reflections: string[] = [];

  scenarioQuestions.forEach(q => {
    const selectedOptionId = answers[q.id];
    const selectedOption = q.options.find(o => o.id === selectedOptionId);
    if (selectedOption) {
      totalScore += selectedOption.score;
      reflections.push(selectedOption.reflection);
    }
  });

  const percentage = (totalScore / maxScore) * 100;

  const result: ChainResult =
    percentage >= 70 ? 'chain_broken' :
    percentage >= 40 ? 'chain_bending' : 'chain_holding';

  return { totalScore, maxScore, percentage, result, reflections };
}
