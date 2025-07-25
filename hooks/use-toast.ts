import { toast as Toaster } from "react-hot-toast"

export const useToast = () => {
  return { toast: Toaster }
}
