export interface ActionResult<T = void> {
  success: boolean;
  data?: T | null;
  error?: string | null;
}
