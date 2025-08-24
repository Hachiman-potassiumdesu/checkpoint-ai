export type Points = {
  point: string;
  score: number;
  explanation: string;
};

export type Message = {
  content: string;
  role: string;
};

export type Messages = {
  context: string;
  content: Message[];
  source_uri: string[],
  source_title: string[]
};

export type ChatContent = {
  content: Points[];
  source_uri: string[];
  source_title: string[];
};

export type Chat = {
  id: string;
  title: string;
  mode: string;
  messages: ChatContent;
  createdAt: string;
};
