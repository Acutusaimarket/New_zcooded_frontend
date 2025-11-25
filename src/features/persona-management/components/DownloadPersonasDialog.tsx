import { useState } from "react";

import { Download, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useMetadataListQuery } from "../../../api/query/use-metadata-list.query";
import { useDownloadPersonasMutation } from "../api/mutation/use-download-personas.mutation";

// import { useDownloadPersonasMutation, useMetadataListQuery } from "../api";

interface DownloadPersonasDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadPersonasDialog = ({
  isOpen,
  onClose,
}: DownloadPersonasDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetadataId, setSelectedMetadataId] = useState<string | null>(
    null
  );
  // const [isDownloading, setIsDownloading] = useState(false);

  // Get metadata list
  const { data: metadataList, isLoading } = useMetadataListQuery({
    search: searchQuery,
    per_page: 100,
  });

  // Download mutation
  const downloadPersonasMutation = useDownloadPersonasMutation();

  const handleDownload = () => {
    if (!selectedMetadataId) {
      toast.error("Please select a metadata ID to download");
      return;
    }

    // setIsDownloading(true);
    downloadPersonasMutation.mutate(
      { metadata_id: selectedMetadataId },
      {
        onSuccess: () => {
          onClose();
        },
        onError: () => {},
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Download Personas by Metadata</DialogTitle>
          <DialogDescription>
            Select a metadata ID to download all associated personas.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search metadata..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="max-h-[400px] overflow-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Select</TableHead>
                {/* <TableHead>Metadata ID</TableHead> */}
                <TableHead>Filename</TableHead>
                {/* <TableHead>Total Personas</TableHead> */}
                <TableHead>Upload Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center">
                    Loading metadata...
                  </TableCell>
                </TableRow>
              ) : metadataList?.items?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center">
                    No metadata found. Try a different search.
                  </TableCell>
                </TableRow>
              ) : (
                metadataList?.items.map((metadata) => (
                  <TableRow
                    key={metadata.id}
                    className={
                      selectedMetadataId === metadata.id
                        ? "bg-primary/10 cursor-pointer"
                        : "hover:bg-muted/50 cursor-pointer"
                    }
                    onClick={() => setSelectedMetadataId(metadata.id)}
                  >
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <div
                          className={`h-4 w-4 rounded-full border ${
                            selectedMetadataId === metadata.id
                              ? "bg-primary border-primary"
                              : "border-gray-400"
                          }`}
                        />
                      </div>
                    </TableCell>
                    {/* <TableCell className="font-medium">{metadata.id}</TableCell> */}
                    <TableCell>{metadata.filename}</TableCell>
                    {/* <TableCell>{metadata.persona_count || 0}</TableCell> */}
                    <TableCell>
                      {new Date(metadata.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!selectedMetadataId || downloadPersonasMutation.isPending}
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {downloadPersonasMutation.isPending
              ? "Downloading..."
              : "Download Personas"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
