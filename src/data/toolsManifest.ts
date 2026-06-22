export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  status: 'active';
}

export const ALL_TOOLS: Tool[] = [];
