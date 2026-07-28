export const AGENT_PATHWAYS = Object.freeze({
  GEMINI_IMAGE_CHAT: "gemini-image-chat",
  NOTEBOOKLM_SLIDE_REVISION: "notebooklm-slide-revision",
  LOCAL_GRID_SEGMENTATION: "local-grid-segmentation"
});

export const DEFAULT_AGENT_PATHWAY = AGENT_PATHWAYS.GEMINI_IMAGE_CHAT;

export const AGENT_PATHWAY_OPTIONS = Object.freeze([
  {
    id: AGENT_PATHWAYS.GEMINI_IMAGE_CHAT,
    label: "Google Gemini · Image chat",
    description: "Uploads the current slide image to Gemini and sends the revision prompt.",
    isDefault: true
  },
  {
    id: AGENT_PATHWAYS.NOTEBOOKLM_SLIDE_REVISION,
    label: "NotebookLM · Slide revision",
    description: "Uses the existing NotebookLM Studio revision flow.",
    isDefault: false
  },
  {
    id: AGENT_PATHWAYS.LOCAL_GRID_SEGMENTATION,
    label: "Local grid segmentation",
    description: "Keeps edits local and updates component metadata without browser automation.",
    isDefault: false
  }
]);

export function normalizeAgentPathway(pathway) {
  return AGENT_PATHWAY_OPTIONS.some((option) => option.id === pathway)
    ? pathway
    : DEFAULT_AGENT_PATHWAY;
}
