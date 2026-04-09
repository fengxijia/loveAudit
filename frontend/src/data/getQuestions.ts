import type { Locale } from "@/i18n";
import type { Chapter, Question } from "@/types";
import { chapters as chaptersZh, questions as questionsZh } from "./questions";
import { chaptersEn, questionsEn } from "./questions_en";

export function getChapters(locale: Locale): Chapter[] {
  return locale === "en" ? chaptersEn : chaptersZh;
}

export function getQuestions(locale: Locale): Question[] {
  return locale === "en" ? questionsEn : questionsZh;
}
