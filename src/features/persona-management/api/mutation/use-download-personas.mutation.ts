import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { personasApiEndPoint } from "@/lib/api-end-point";
import { axiosPrivateInstance } from "@/lib/axios";

interface DownloadPersonasParams {
  metadata_id: string;
}

const downloadPersonas = async ({
  metadata_id,
}: DownloadPersonasParams): Promise<{ success: boolean; filename: string }> => {
  // console.log({ metadata_id });

  try {
    const response = await axiosPrivateInstance.get(
      `${personasApiEndPoint.downloadPersona}/${metadata_id}`,
      {
        responseType: "blob",
      }
    );

    // Get filename from Content-Disposition header or use a default name
    const contentDisposition = response.headers["Content-Disposition"];

    let filename = `personas_${metadata_id}.json`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?$/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/["']/g, "");
      }
    }

    // Create a URL for the blob
    const url = window.URL.createObjectURL(response.data);

    // Create a temporary link element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);

    // Append to the document, click and then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    window.URL.revokeObjectURL(url);

    return { success: true, filename };
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(
          error.response?.data?.detail ||
            "Personas not found for the given metadata ID"
        );
      } else if (error.response?.status === 422) {
        throw new Error(
          error.response?.data?.detail
            .map((item: { message: string }) => item.message)
            .join(", ") ||
            "Invalid metadata ID provided for downloading personas"
        );
      }
      throw new Error(
        error.response?.data?.detail || "Failed to download personas"
      );
    }
    throw new Error("An unexpected error occurred while downloading personas");
  }
};

export const useDownloadPersonasMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: downloadPersonas,
    onSuccess: (result) => {
      toast.success(`Personas downloaded successfully as ${result.filename}`);
      queryClient.invalidateQueries({ queryKey: ["personas-list"] });
      queryClient.invalidateQueries({ queryKey: ["personas", "stats"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to download personas: ${error.message}`);
    },
  });
};
