import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel";
import { X } from "lucide-react";
import { typography } from "../styles/typography";
import { sectionBg } from "../styles/colors";

export function PhotoCarousel({ photos, initialIndex = 0, isOpen, onClose }) {
  const [api, setApi] = useState();
  const [currentIndex, setCurrentIndex] = useState(initialIndex); 

  useEffect(() => {
    if (api && initialIndex >= 0) {
      api.scrollTo(initialIndex, true);
      setCurrentIndex(initialIndex);
    }
  }, [api, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      } else if (event.key === "ArrowLeft") {
        api?.scrollPrev();
      } else if (event.key === "ArrowRight") {
        api?.scrollNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, api]);

  if (!isOpen || !photos || photos.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-black bg-opacity-90 overflow-hidden rounded-lg flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <Carousel
          setApi={setApi}
          className="w-full flex-1 flex flex-col"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="flex-1">
            {photos.map((photo, index) => (
              <CarouselItem key={photo.id} className="flex items-center">
                <div className="p-1 w-full">
                  <Card className="border-0 shadow-none bg-transparent">
                    <CardContent className="relative flex items-center justify-center p-0 max-h-[calc(90vh-8rem)]">
                      <img
                        src={photo.file_path}
                        alt={photo.caption || `Photo ${index + 1}`}
                        className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                      />
                      {/* Caption overlay on the photo */}
                      {photo.caption?.trim() && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 rounded-b-lg">
                          <p className={typography.small + ' text-white break-words'}>
                            {photo.caption}
                          </p>
                        </div>
                      )}
                      {/* Timestamp overlay in top-right corner */}
                      {photo.uploaded_at && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-60 px-3 py-1 rounded-md">
                          <p className={typography.xsmall + ' text-slate-300'}>
                            {new Date(photo.uploaded_at).toLocaleString([], {
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </div>
  );
}
