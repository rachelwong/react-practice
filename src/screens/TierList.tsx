import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CirclePlus, RefreshCw } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

const ZONES = [
  { id: "zone-a", value: "A", color: "bg-rose-300" },
  { id: "zone-b", value: "B", color: "bg-orange-300" },
  { id: "zone-c", value: "C", color: "bg-yellow-300" },
  { id: "zone-d", value: "D", color: "bg-green-300" },
  { id: "zone-e", value: "E", color: "bg-sky-400" },
  { id: "zone-f", value: "F", color: "bg-purple-400" },
];

interface FileToDrag {
  url: string;
  zone: string;
}

const TierList = () => {
  const [files, setFiles] = useState<FileToDrag[]>([]);

  const [currDrag, setCurrDrag] = useState<FileToDrag | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddFile = (event: ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) {
      return;
    }
    const fileURL = URL.createObjectURL(uploadedFiles[0]);
    setFiles((prev) => [...prev, { url: fileURL, zone: "" }]);
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

  // useState instead of e.dataTransfer so we can transfer more data
  const handleDragStart = ({
    event,
    item,
  }: {
    event: DragEvent<HTMLDivElement>;
    item: FileToDrag;
  }) => {
    console.log("handledragstart", event);
    setCurrDrag(item);
  };

  //  Browsers block drops by default.
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = ({
    event,
    zone,
  }: {
    event: DragEvent<HTMLDivElement>;
    zone: string;
  }) => {
    console.log("handleDrop");
    if (!currDrag) {
      return;
    }
    const updated = { ...currDrag, zone };
    setCurrDrag(updated);
    // every time you drag into a zone then it is re-ordered to the back
    setFiles((prev) => [...prev.filter((x) => x.url !== updated.url), updated]);
  };

  const handleDragEnd = () => {
    setCurrDrag(null);
  };

  return (
    <Layout
      title="Tier List"
      brief="https://www.reactchallenges.com/challenges/tier-list"
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-y-10 items-center justify-start">
        <p>currDrag {JSON.stringify(currDrag)}</p>
        <div className="tiers w-full h-auto rounded round-lg border-1 border-neutral-900">
          {ZONES.map((zone) => {
            return (
              <div
                key={zone.id}
                className={`row w-full h-20 flex flex-row flex-nowrap items-center justify-between border-1 border-neutral-100`}
              >
                <div
                  className={`label p-10 h-full flex flex-col items-center text-2xl w-20 justify-center font-extrabold ${zone.color}`}
                >
                  {zone.value}
                </div>
                <div
                  className="drag-zone w-full h-full flex items-center justify-start flex-wrap flex-row"
                  id={zone.id}
                  onDragEnter={() => {}}
                  onDragOver={(e) => {
                    handleDragOver(e);
                  }}
                  onDragLeave={() => {}}
                  onDragEnd={() => {
                    handleDragEnd();
                  }}
                  onDrop={(e) => {
                    console.log("DROP!", e);
                    handleDrop({ event: e, zone: zone.id });
                  }}
                >
                  {files
                    .filter((x) => x.zone === zone.id)
                    .map((file) => {
                      return (
                        <div
                          className="h-20 w-20 flex flex-row items-center justify-center"
                          draggable
                          key={file.url}
                          onDragStart={(e) => {
                            handleDragStart({
                              event: e,
                              item: file,
                            });
                          }}
                        >
                          <img
                            src={file.url}
                            className="w-full h-full object-cover block"
                          />
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
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
            className="h-15 w-15"
          >
            <RefreshCw />
          </Button>
        </div>
        {/* // zone id is empty string */}
        <div
          className="file-zone w-full h-80 rounded round-lg border-1 border-neutral-900 flex flex-row flex-wrap justify-start items-start relative"
          onDragEnter={() => {}}
          onDragOver={(e) => {
            handleDragOver(e);
          }}
          onDragEnd={() => {
            handleDragEnd();
          }}
          onDragLeave={() => {}}
          onDrop={(e) => {
            handleDrop({ event: e, zone: "" });
          }}
        >
          {files
            .filter((file) => file.zone === "")
            .map((file) => (
              <div
                className="h-20 w-20 flex flex-row items-center justify-center"
                key={file.url}
                draggable
                onDragStart={(e) => {
                  handleDragStart({
                    event: e,
                    item: file,
                  });
                }}
              >
                <img
                  src={file.url}
                  className="w-full h-full object-cover block"
                />
              </div>
            ))}
          <div className="absolute -z-10 w-full h-full top-0 left-0 flex flex-row items-center justify-center">
            <h3 className="select-none text-5xl text-neutral-200 font-extrabold">
              Dropzone
            </h3>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TierList;
