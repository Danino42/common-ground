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
    name: "University Life",
    category: "University",
    author: "System",
    isPublic: true,
    cards: [
      { id: "1-1", text: "I've pulled an all-nighter studying" },
      { id: "1-2", text: "I've changed my major at least once" },
      { id: "1-3", text: "I've fallen asleep in a lecture" },
      { id: "1-4", text: "I've joined a student organization" },
      { id: "1-5", text: "I've studied abroad or want to" },
    ],
  },
  {
    id: "2",
    name: "Life in Switzerland",
    category: "Life in Switzerland",
    author: "System",
    isPublic: true,
    cards: [
      { id: "2-1", text: "I can speak Swiss German" },
      { id: "2-2", text: "I've been hiking in the Alps" },
      { id: "2-3", text: "I love fondue" },
      { id: "2-4", text: "I've used Swiss public transport today" },
      { id: "2-5", text: "I've lived in more than one Swiss canton" },
    ],
  },
  {
    id: "3",
    name: "Kids Edition",
    category: "Card set for kids",
    author: "System",
    isPublic: true,
    cards: [
      { id: "3-1", text: "I have a pet" },
      { id: "3-2", text: "I like pizza" },
      { id: "3-3", text: "I can ride a bike" },
      { id: "3-4", text: "I've been to the zoo" },
      { id: "3-5", text: "I like drawing" },
    ],
  },
  {
    id: "4",
    name: "Food & Cooking",
    category: "Hobbies",
    author: "Emma Weber",
    isPublic: true,
    cards: [
      { id: "4-1", text: "I know how to make sushi" },
      { id: "4-2", text: "I've baked bread from scratch" },
      { id: "4-3", text: "I'm a vegetarian or vegan" },
      { id: "4-4", text: "I can cook without a recipe" },
      { id: "4-5", text: "I've tried cooking a foreign cuisine" },
    ],
  },
  {
    id: "5",
    name: "Entertainment",
    category: "Interests",
    author: "Max Mueller",
    isPublic: true,
    cards: [
      { id: "5-1", text: "I like sitcoms" },
      { id: "5-2", text: "I've binge-watched a series in one weekend" },
      { id: "5-3", text: "I play video games regularly" },
      { id: "5-4", text: "I've been to a music concert this year" },
      { id: "5-5", text: "I prefer books over movies" },
    ],
  },
  {
    id: "6",
    name: "Languages & Travel",
    category: "Skills",
    author: "Sophie Laurent",
    isPublic: true,
    cards: [
      { id: "6-1", text: "I speak more than 3 languages" },
      { id: "6-2", text: "I've visited more than 10 countries" },
      { id: "6-3", text: "I've lived in another country" },
      { id: "6-4", text: "I can have a conversation in a language I'm learning" },
      { id: "6-5", text: "I want to learn a new language" },
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
