import Layout from "@/components/Layout";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import { Copy } from "lucide-react";
import { useRef } from "react";

const CopyToClipboard = () => {
  const { isCopied, copy, error: isCopiedError } = useCopyToClipboard({});
  const textRef = useRef<HTMLParagraphElement>(null);

  const onCopy = (text: string) => {
    copy(text);
  };

  return (
    <Layout
      heading={
        <>
          <h3>Copy to clipboard</h3>
          <p>
            Brief from{" "}
            <a href="https://www.reactgrind.com/problems/copy-to-clipboard">
              https://www.reactgrind.com/problems/copy-to-clipboard
            </a>
          </p>
        </>
      }
    >
      <div className="flex flex-col w-full">
        <div className="bg-slate-200 border-none block px-4 py-2 rounded radius-lg w-auto">
          <p ref={textRef}>npm install some-fancy-package</p>
        </div>
        <Button
          size="lg"
          variant="default"
          className="mt-6"
          onClick={() => {
            onCopy(textRef.current?.textContent ?? "");
          }}
        >
          <Copy />
          Copy
        </Button>
        {isCopied && (
          <Alert className="bg-green-200 text-green-600">Copy Success!</Alert>
        )}
        {isCopiedError && (
          <Alert className="bg-red-200 text-red-600">{isCopiedError}</Alert>
        )}
        <textarea
          className="test-textarea my-2 p-3 border-1 border-slate-700"
          placeholder="test your clipboard here"
        />
      </div>
    </Layout>
  );
};

export default CopyToClipboard;
