// data/prompts.ts
import { Prompt } from '@/types'; // Adjust path if needed

export const prompts: Prompt[] = [
    {
        id: 1,
        sender: "mochi",
        message: "Hi! I'm Mochi, your date planner 💖 Ready to plan the perfect date?",
        inputMode: "buttons",
        options: ["Yes, just me!", "Yes, with my partner!"]
    },
    {
        id: 2,
        sender: "mochi",
        message: "What kind of vibe are you in the mood for?",
        inputMode: "text",
    },
    {
        id: 3,
        sender: "mochi",
        message: "Sounds great! Let's set the mood. Indoor or outdoor?",
        inputMode: "buttons",
        options: ["Indoor!", "Outdoor!"]
    },
    {
        id: 4,
        sender: "mochi",
        message: "Any budget in mind?",
        inputMode: "text",
    },
    {
        id: 5,
        sender: "mochi",
        message: "Where are you located?",
        inputMode: "text",
    },
    {
        id: 6,
        sender: "mochi",
        message: "Is this for a special occasion (birthday/anniversary/etc.)?",
        inputMode: "text",
    },
    {
        id: 7,
        sender: "mochi",
        message: "Anything else you wanna tell me? You can be as specific as you want!",
        inputMode: "text",
    },
];