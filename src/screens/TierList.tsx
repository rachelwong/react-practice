import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CirclePlus, RefreshCw } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";

const TierList = () => {
  const [files, setFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddFile = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) {
      return;
    }
    const fileURL = URL.createObjectURL(uploadedFiles[0]);
    setFiles((prev) => [...prev, fileURL]);
  };

  // mock click on the input
  const handleFileButtonClick = () => {
    if (!fileInputRef?.current) {
      return;
    }

    fileInputRef?.current.click();
  };

  const reset = () => {
    setFiles([]);
  };

  return (
    <Layout
      title="Tier List"
      brief="https://www.reactchallenges.com/challenges/tier-list"
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-y-10 items-center justify-start">
        <div className="tiers w-full h-auto rounded round-lg border-1 border-neutral-900"></div>
        <div className="flex flex-row justify-center items-center gap-x-4">
          <Button
            size="icon"
            onClick={() => handleFileButtonClick()}
            variant="secondary"
            className="h-15 w-15"
          >
            <input
              ref={fileInputRef}
              type="file"
              id="imagePicker"
              accept="image/*"
              className="hidden"
              onChange={handleAddFile}
            />
            <CirclePlus className="h-12 w-12" />
          </Button>
          <Button
            size="icon"
            onClick={() => {
              reset();
            }}
          >
            <RefreshCw />
          </Button>
        </div>
        <div className="file-zone w-full h-80 rounded round-lg border-1 border-neutral-900 flex flex-row flex-wrap justify-start items-start">
          {files.map((fileUrl) => (
            <div
              className="h-20 w-20 flex flex-row items-center justify-center"
              key={fileUrl}
            >
              <img src={fileUrl} className="w-full h-full object-cover block" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TierList;
