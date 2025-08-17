export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type Chat = {
  id: string;
  title: string;
  pdfName: string;
  pdfDataUri: string;
  mode: string;
  messages: Message[];
  createdAt: Date;
};
