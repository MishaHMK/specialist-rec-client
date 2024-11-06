import { IEmotion } from "./IEmotion";

export interface IDiaryEntry {
    id: number;
    diaryId: number;
    createdAt: string;
    description: string;
    emotionId: number;
    emotion: IEmotion;
    value: number;
  }