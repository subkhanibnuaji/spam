"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CameraCaptureProps {
  open: boolean;
  onClose: () => void;
  onCapture: (photoDataUrl: string) => void;
  type: "check-in" | "check-out";
}

export function CameraCapture({
  open,
  onClose,
  onCapture,
  type,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      stopCamera();
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 480, height: 640 },
      });
      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError(
        "Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan."
      );
    }
  }, [stopCamera]);

  useEffect(() => {
    if (open) {
      setPhoto(null);
      setError(null);
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [open, startCamera, stopCamera]);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Mirror for selfie
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
    setPhoto(dataUrl);
    stopCamera();
  };

  const retake = () => {
    setPhoto(null);
    startCamera();
  };

  const confirm = () => {
    if (photo) {
      onCapture(photo);
      onClose();
    }
  };

  const handleClose = () => {
    stopCamera();
    setPhoto(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "check-in" ? "Foto Cek Datang" : "Foto Cek Keluar"}
          </DialogTitle>
          <DialogDescription>
            Ambil foto selfie untuk{" "}
            {type === "check-in" ? "presensi datang" : "presensi pulang"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {error ? (
            <div className="flex h-64 w-full items-center justify-center rounded-lg bg-gray-100 p-4 text-center text-sm text-red-500">
              {error}
            </div>
          ) : photo ? (
            <img
              src={photo}
              alt="Captured"
              className="h-64 w-full rounded-lg object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-64 w-full rounded-lg bg-gray-900 object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
          )}

          <canvas ref={canvasRef} className="hidden" />

          <div className="flex gap-3">
            {photo ? (
              <>
                <Button variant="outline" onClick={retake} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Ulangi
                </Button>
                <Button
                  onClick={confirm}
                  className={`gap-2 ${
                    type === "check-in"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  <Check className="h-4 w-4" />
                  Konfirmasi
                </Button>
              </>
            ) : (
              <Button onClick={takePhoto} className="gap-2" disabled={!!error}>
                <Camera className="h-4 w-4" />
                Ambil Foto
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
