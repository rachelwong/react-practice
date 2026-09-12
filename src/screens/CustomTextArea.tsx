import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import classNames from "classnames";
import { useState } from "react";

const MAX_LENGTH = 10;

const CustomTextArea = () => {
  const [text, setText] = useState<string>("");

  const onTextAreaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>,
  ) => {
    setText(e.target.value.slice(0, MAX_LENGTH));
  };
  const error = text?.length === MAX_LENGTH;
  return (
    <Layout
      heading={
        <>
          <h3>Custom text area</h3>
          <p>Max length for text is {MAX_LENGTH} characters</p>
          <p>
            Original brief{" "}
            <a
              href="https://www.reactgrind.com/problems/text-area-react"
              target="_blank"
            >
              https://www.reactgrind.com/problems/text-area-react
            </a>
          </p>
          <p>
            The idea is to not use the native maxLength component to manage
            string paste events.
          </p>
        </>
      }
    >
      <textarea
        id="custom-textarea"
        name="custom-textarea"
        value={text}
        className={classNames("border-2 border-slate-900 w-full", {
          "border-red-900 text-red-900": error,
        })}
        onChange={(e) => {
          onTextAreaChange(e);
        }}
      />
      <div className="flex flex-row justify-start align-center">
        <p className={classNames({ "text-red-900 font-extrabold": error })}>
          {text?.length || 0} / {MAX_LENGTH}
        </p>
        <Button
          variant="secondary"
          size="lg"
          disabled={!text?.length}
          onClick={() => {
            setText("");
          }}
        >
          Reset
        </Button>
      </div>
    </Layout>
  );
};

export default CustomTextArea;
