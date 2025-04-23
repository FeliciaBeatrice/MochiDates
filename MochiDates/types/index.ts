// types/index.ts
export interface Prompt {
    id: number;
    sender: "mochi";
    message: string;
    inputMode: "buttons" | "text";
    options?: string[];
  }
  
  export interface Message {
    id: number | string;
    sender: "mochi" | "user";
    message: string;
  }