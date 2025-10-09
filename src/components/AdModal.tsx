import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface AdModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdModal = ({ isOpen, onClose }: AdModalProps) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (isOpen) {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Werbung</h2>
            <p className="text-muted-foreground">
              Bitte warten Sie {countdown} Sekunden...
            </p>
          </div>

          {/* Ad Placeholder - Replace with your ad network code */}
          <div className="bg-muted rounded-lg p-8 min-h-[300px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-4xl">📺</div>
              <p className="text-xl font-bold">Ihre Werbung hier</p>
              <p className="text-sm text-muted-foreground">
                Integrieren Sie Google AdSense oder andere Werbenetzwerke hier
              </p>
              {/* 
                Replace this div with your ad code, for example:
                <ins className="adsbygoogle"
                     style={{display:'block'}}
                     data-ad-client="ca-pub-XXXXX"
                     data-ad-slot="XXXXX"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
              */}
            </div>
          </div>

          <Button
            onClick={onClose}
            disabled={countdown > 0}
            className="w-full"
          >
            {countdown > 0 ? `Warten... (${countdown}s)` : "Weiter zum Spiel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdModal;
