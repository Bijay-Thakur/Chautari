export type SeedKite = {
  id: string;
  message: string;          // What youth feel — shown on kite body
  nepaliPhrase: string;     // What they hear at home (Devanagari)
  silencingPhrase?: string; // What shut them down — optional, used for matching
  color: string;
  position_x: number;
  position_y: number;
};

export const seedKites: SeedKite[] = [
  {
    id: "seed-1",
    message: "Nobody at home really hears me.",
    nepaliPhrase: "शर्मा जीको छोरोले ९४ ल्यायो। तैंले जिन्दगीमा के गर्दैछस्? हामीले तेरो लागि सबै त्याग गर्यौं, र यही हो तेरो जवाफ?",
    silencingPhrase: "Just do as I say. You don't need to understand — you just need to obey.",
    color: "#c0392b",
    position_x: 9,
    position_y: 22,
  },
  {
    id: "seed-2",
    message: "I feel like I'm never enough.",
    nepaliPhrase: "तिम्रो उमेरमा हामी नदीबाट पानी बोक्थ्यौं र खेतमा काम गर्थ्यौं। तिमीलाई सबै सुविधा दिइयो, अनि पनि यो एउटा काम गर्न सकेनौ?",
    silencingPhrase: "Stop making excuses. If you can't do better, don't bother saying anything.",
    color: "#2d6a4f",
    position_x: 23,
    position_y: 16,
  },
  {
    id: "seed-3",
    message: "They compare me to everyone else.",
    nepaliPhrase: "मान्छेले के भन्ला? छिमेकको केटो भर्खरै इन्जिनियरिङमा भर्ना भयो। तिमीको बारेमा सबैलाई के जवाफ दिनु?",
    silencingPhrase: "We're only telling you the truth because nobody else will. You should be grateful.",
    color: "#6c3483",
    position_x: 43,
    position_y: 20,
  },
  {
    id: "seed-4",
    message: "Scared to speak up about how I feel.",
    nepaliPhrase: "यो नाटक बन्द गर। किन सधैं तिमीलाई मात्र यस्तो हुन्छ? मान्छेहरूलाई आफ्नो समस्या भन्दै नहिंड — परिवारभित्रै राख।",
    silencingPhrase: "That's enough. I don't want to hear another word about this. Conversation over.",
    color: "#b7950b",
    position_x: 58,
    position_y: 28,
  },
  {
    id: "seed-5",
    message: "I just want someone to actually listen.",
    nepaliPhrase: "नरोऊ। भावना देखाउनु कमजोरी हो। कडा बन। तिमी धेरै सोच्छौ — त्यसैले यस्तो लाग्छ। व्यस्त रह, आफैं ठीक हुन्छ।",
    silencingPhrase: "You're being dramatic. Go to your room and stop wasting everyone's time.",
    color: "#1a5276",
    position_x: 32,
    position_y: 38,
  },
];
