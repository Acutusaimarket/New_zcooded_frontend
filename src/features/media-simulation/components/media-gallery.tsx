import { useState } from "react";

import {
  Gallery,
  VideoFramePlayVertical,
} from "@solar-icons/react-perf/BoldDuotone";
import { Image as ImageIcon, Music, Play } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { MediaFile } from "../types/media-simulation.types";

type Props = {
  media: MediaFile[];
};

const getMediaTypeIcon = (mediaType: string) => {
  const type = mediaType.toLowerCase();
  if (type.includes("video"))
    return <VideoFramePlayVertical className="h-4 w-4" />;
  if (type.includes("audio")) return <Gallery className="h-4 w-4" />;
  return <ImageIcon className="h-4 w-4" />;
};

const getMediaTypeColor = (mediaType: string) => {
  const type = mediaType.toLowerCase();
  if (type.includes("video"))
    return "bg-purple-100 text-purple-700 hover:bg-purple-200";
  if (type.includes("audio"))
    return "bg-blue-100 text-blue-700 hover:bg-blue-200";
  return "bg-green-100 text-green-700 hover:bg-green-200";
};

const MediaGallery = ({ media }: Props) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);

  const getMediaContent = (file: MediaFile, isPreview = false) => {
    const isVideo = file.media_type.toLowerCase().includes("video");
    const isAudio = file.media_type.toLowerCase().includes("audio");

    if (isVideo) {
      return (
        <video
          src={file.media_url}
          controls
          className={`h-full w-full object-cover select-none ${isPreview ? "max-h-[70vh]" : ""}`}
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    if (isAudio) {
      return (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="w-full space-y-4 p-8 text-center">
            <Music className="mx-auto h-16 w-16 text-blue-500" />
            <audio
              src={file.media_url}
              controls
              className="mx-auto w-full max-w-md select-none"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        </div>
      );
    }

    // Default to image
    return (
      <img
        src={file.media_url}
        alt={`Media ${file.media_id}`}
        className={`object-contain transition-transform duration-300 ${!isPreview ? "select-none group-hover:scale-105" : ""}`}
      />
    );
  };

  if (media.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100">
        <ImageIcon className="mb-4 h-16 w-16 text-gray-400" />
        <p className="text-lg font-medium text-gray-600">
          No media files available
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Media files will appear here once uploaded
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Media Gallery</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {media.length} {media.length === 1 ? "file" : "files"} available
            </p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {media.map((file) => {
            const isVideo = file.media_type.toLowerCase().includes("video");
            const isAudio = file.media_type.toLowerCase().includes("audio");
            const fileName = file.media_id
              .toLowerCase()
              .replace(/_[0-9a-fA-F-]{36}$/, "");
            return (
              <Card
                key={file.media_id}
                className="group hover:border-primary/50 cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:shadow-lg"
                onClick={() => setSelectedMedia(file)}
              >
                <CardContent className="p-0">
                  {/* Media Thumbnail */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {isVideo ? (
                      <>
                        <video
                          src={file.media_url}
                          className="h-full w-full object-cover transition-transform duration-300 select-none group-hover:scale-110"
                          muted
                        />
                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="rounded-full bg-white/90 p-3 shadow-lg transition-transform group-hover:scale-110">
                            <Play className="h-6 w-6 fill-purple-600 text-purple-600" />
                          </div>
                        </div>
                      </>
                    ) : isAudio ? (
                      <div className="flex h-full flex-col items-center justify-center">
                        <Music className="mb-2 h-8 w-8 text-blue-600" />
                        <p className="text-xs font-medium text-gray-600">
                          Audio
                        </p>
                      </div>
                    ) : (
                      <img
                        src={file.media_url}
                        alt={`Media ${file.media_id}`}
                        className="h-full w-full object-cover transition-transform duration-300 select-none group-hover:scale-110"
                      />
                    )}

                    {/* Type Badge Overlay */}
                    <div className="absolute bottom-2 left-2">
                      <Badge
                        variant="secondary"
                        className={`gap-1 text-xs ${getMediaTypeColor(file.media_type)}`}
                      >
                        {getMediaTypeIcon(file.media_type)}
                      </Badge>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="border-t bg-white p-2">
                    <p
                      className="truncate text-xs font-semibold text-gray-800"
                      title={fileName}
                    >
                      {fileName}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="truncate text-xs text-gray-600">
                        {file.media_type}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {(file.media_size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Full Screen Dialog */}
      <Dialog
        open={!!selectedMedia}
        onOpenChange={() => setSelectedMedia(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto md:max-w-6xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="line-clamp-1 flex items-center gap-2">
                {selectedMedia && getMediaTypeIcon(selectedMedia.media_type)}
                {selectedMedia &&
                  (selectedMedia.media_id.replace(/_[0-9a-fA-F-]{36}$/, "") ||
                    "Media Preview")}
              </span>
            </DialogTitle>
          </DialogHeader>
          {selectedMedia && (
            <div className="space-y-4">
              <div className="relative flex max-h-[70vh] items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                {getMediaContent(selectedMedia, true)}
              </div>
              <div className="bg-muted flex items-center justify-between rounded-lg p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Type:{" "}
                    <span className="text-muted-foreground">
                      {selectedMedia.media_type}
                    </span>
                  </p>
                  <p className="text-sm font-medium">
                    Size:{" "}
                    <span className="text-muted-foreground">
                      {(selectedMedia.media_size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MediaGallery;
