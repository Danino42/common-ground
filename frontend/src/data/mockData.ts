// Mock data for the prototype

export interface Card {
  id: string;
  text: string;
}

export interface CardSet {
  id: string;
  name: string;
  category: string;
  cards: Card[];
  author: string;
  isPublic: boolean;
}

export interface Player {
  id: string;
  name: string;
  groupId: number;
  groupColor: string;
}

export interface GroupSubmission {
  groupId: number;
  groupColor: string;
  statement: string;
  members: string[];
}

export const mockCardSets: CardSet[] = [
  {
    id: "1",
    name: "Political Views",
    category: "Politics",
    author: "System",
    isPublic: true,
    cards: [
      { id: "1-1", text: "I support a universal basic income" },
      { id: "1-2", text: "Climate change should be the #1 political priority" },
      { id: "1-3", text: "Borders should be more open to immigration" },
      { id: "1-4", text: "Wealthy people should pay significantly more taxes" },
      { id: "1-5", text: "Social media does more harm than good to democracy" },
      { id: "1-6", text: "The state should provide free university education" },
      { id: "1-7", text: "Surveillance cameras in public spaces make us safer" },
      { id: "1-8", text: "Nuclear energy is necessary for a green future" },
      { id: "1-9", text: "Voting should be mandatory for all citizens" },
      { id: "1-10", text: "Corporations have too much political influence" },
    ],
  },
  {
    id: "2",
    name: "University Life",
    category: "University",
    author: "System",
    isPublic: true,
    cards: [
      { id: "2-1", text: "I've pulled an all-nighter before an exam" },
      { id: "2-2", text: "I've changed my major at least once" },
      { id: "2-3", text: "I've fallen asleep in a lecture" },
      { id: "2-4", text: "I joined a student club or society" },
      { id: "2-5", text: "I've studied abroad or want to" },
      { id: "2-6", text: "I prefer studying alone over group study" },
      { id: "2-7", text: "I've pulled an all-nighter before a deadline" },
      { id: "2-8", text: "I use AI tools to help with my studies" },
      { id: "2-9", text: "I've skipped a class to work on another assignment" },
      { id: "2-10", text: "I plan to do a masters degree" },
    ],
  },
  {
    id: "3",
    name: "Life & Values",
    category: "Personal",
    author: "System",
    isPublic: true,
    cards: [
      { id: "3-1", text: "I consider myself a spiritual person" },
      { id: "3-2", text: "Family is the most important thing in life" },
      { id: "3-3", text: "I believe hard work always pays off" },
      { id: "3-4", text: "Money can buy happiness to some extent" },
      { id: "3-5", text: "I think social media has made people lonelier" },
      { id: "3-6", text: "I prefer experiences over material possessions" },
      { id: "3-7", text: "I believe in second chances" },
      { id: "3-8", text: "I think people are fundamentally good" },
      { id: "3-9", text: "I value privacy over convenience" },
      { id: "3-10", text: "I think ambition is more important than talent" },
    ],
  },
  {
    id: "4",
    name: "Life in Switzerland",
    category: "Switzerland",
    author: "System",
    isPublic: true,
    cards: [
      { id: "4-1", text: "I can speak Swiss German" },
      { id: "4-2", text: "I've been hiking in the Alps" },
      { id: "4-3", text: "I think Switzerland is too expensive" },
      { id: "4-4", text: "I use Swiss public transport daily" },
      { id: "4-5", text: "I've lived in more than one Swiss canton" },
      { id: "4-6", text: "I think Switzerland should join the EU" },
      { id: "4-7", text: "I prefer Swiss German over High German" },
      { id: "4-8", text: "I've voted in a Swiss referendum" },
      { id: "4-9", text: "I think Switzerland is too politically neutral" },
      { id: "4-10", text: "I feel more European than Swiss" },
    ],
  },
  {
    id: "5",
    name: "Work & Career",
    category: "Work",
    author: "System",
    isPublic: true,
    cards: [
      { id: "5-1", text: "I've worked a job I truly hated" },
      { id: "5-2", text: "I prefer working remotely over the office" },
      { id: "5-3", text: "I think a 4-day work week should be standard" },
      { id: "5-4", text: "I've started or want to start my own business" },
      { id: "5-5", text: "I prioritise work-life balance over career growth" },
      { id: "5-6", text: "I've changed careers or plan to" },
      { id: "5-7", text: "I think passion matters more than salary" },
      { id: "5-8", text: "I've had a mentor who shaped my career" },
      { id: "5-9", text: "I check work messages outside working hours" },
      { id: "5-10", text: "I think AI will take my job within 10 years" },
    ],
  },
  {
    id: "6",
    name: "Food & Lifestyle",
    category: "Lifestyle",
    author: "Emma Weber",
    isPublic: true,
    cards: [
      { id: "6-1", text: "I follow a vegetarian or vegan diet" },
      { id: "6-2", text: "I cook at home most days" },
      { id: "6-3", text: "I think fast food gets too much criticism" },
      { id: "6-4", text: "I've tried intermittent fasting" },
      { id: "6-5", text: "I care about where my food comes from" },
      { id: "6-6", text: "I'd rather cook than go to a restaurant" },
      { id: "6-7", text: "I've tried a diet that didn't work" },
      { id: "6-8", text: "I think food is one of life's great pleasures" },
      { id: "6-9", text: "I eat breakfast every day" },
      { id: "6-10", text: "I've gone through a phase of eating very healthy" },
    ],
  },
];

export const mockPlayers: Player[] = [
  { id: "p1", name: "Anna", groupId: 1, groupColor: "BLUE" },
  { id: "p2", name: "Ben", groupId: 1, groupColor: "BLUE" },
  { id: "p3", name: "Clara", groupId: 1, groupColor: "BLUE" },
  { id: "p4", name: "David", groupId: 1, groupColor: "BLUE" },
  { id: "p5", name: "Emma", groupId: 1, groupColor: "BLUE" },
  { id: "p6", name: "Felix", groupId: 2, groupColor: "RED" },
  { id: "p7", name: "Greta", groupId: 2, groupColor: "RED" },
  { id: "p8", name: "Hans", groupId: 2, groupColor: "RED" },
  { id: "p9", name: "Iris", groupId: 2, groupColor: "RED" },
  { id: "p10", name: "Jakob", groupId: 2, groupColor: "RED" },
  { id: "p11", name: "Karin", groupId: 3, groupColor: "GREEN" },
  { id: "p12", name: "Lars", groupId: 3, groupColor: "GREEN" },
  { id: "p13", name: "Maria", groupId: 3, groupColor: "GREEN" },
  { id: "p14", name: "Nina", groupId: 3, groupColor: "GREEN" },
  { id: "p15", name: "Oliver", groupId: 3, groupColor: "GREEN" },
  { id: "p16", name: "Paula", groupId: 4, groupColor: "YELLOW" },
  { id: "p17", name: "Quinn", groupId: 4, groupColor: "YELLOW" },
  { id: "p18", name: "Rosa", groupId: 4, groupColor: "YELLOW" },
  { id: "p19", name: "Simon", groupId: 4, groupColor: "YELLOW" },
  { id: "p20", name: "Tina", groupId: 4, groupColor: "YELLOW" },
];

export const mockGroupSubmissions: GroupSubmission[] = [
  {
    groupId: 1,
    groupColor: "BLUE",
    statement: "We all love coffee and can't start the day without it",
    members: ["Anna", "Ben", "Clara", "David", "Emma"],
  },
  {
    groupId: 2,
    groupColor: "RED",
    statement: "We have all traveled to at least 5 different countries",
    members: ["Felix", "Greta", "Hans", "Iris", "Jakob"],
  },
  {
    groupId: 3,
    groupColor: "GREEN",
    statement: "We all enjoy outdoor activities like hiking or cycling",
    members: ["Karin", "Lars", "Maria", "Nina", "Oliver"],
  },
];
