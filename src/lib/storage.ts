interface ProjectProgress {
  code: string;
  completed: boolean;
  lastUpdated: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export const saveProjectProgress = (projectId: string, progress: Omit<ProjectProgress, 'lastUpdated'>) => {
  const allProgress = JSON.parse(localStorage.getItem('learningProgress') || '{}');
  allProgress[projectId] = {
    ...progress,
    lastUpdated: Date.now()
  };
  localStorage.setItem('learningProgress', JSON.stringify(allProgress));
};

export const getProjectProgress = (projectId: string): ProjectProgress => {
  const allProgress = JSON.parse(localStorage.getItem('learningProgress') || '{}');
  return allProgress[projectId] || { code: '', completed: false, lastUpdated: 0 };
};

export const getAllProgress = (): Record<string, ProjectProgress> => {
  return JSON.parse(localStorage.getItem('learningProgress') || '{}');
};

export const saveChatHistory = (projectId: string, messages: ChatMessage[]) => {
  const allChats = JSON.parse(localStorage.getItem('chatHistory') || '{}');
  allChats[projectId] = messages;
  localStorage.setItem('chatHistory', JSON.stringify(allChats));
};

export const getChatHistory = (projectId: string): ChatMessage[] => {
  const allChats = JSON.parse(localStorage.getItem('chatHistory') || '{}');
  return allChats[projectId] || [];
};

export const saveCodeDraft = (projectId: string, code: string) => {
  const allDrafts = JSON.parse(localStorage.getItem('codeDrafts') || '{}');
  allDrafts[projectId] = code;
  localStorage.setItem('codeDrafts', JSON.stringify(allDrafts));
};

export const getCodeDraft = (projectId: string): string => {
  const allDrafts = JSON.parse(localStorage.getItem('codeDrafts') || '{}');
  return allDrafts[projectId] || '';
};
