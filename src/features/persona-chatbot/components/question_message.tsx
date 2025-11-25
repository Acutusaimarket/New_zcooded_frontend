import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";

import type { GeneratedQuestion } from "../types";

type Props = {
  question: GeneratedQuestion;
  user_name: string;
};

const QuestionMessage = ({ question, user_name }: Props) => {
  return (
    <>
      <Message from={"assistant"}>
        <MessageContent>
          <div className="space-y-1">
            <Response isAnimating={true} parseIncompleteMarkdown={true}>
              {question.question_text}
            </Response>
            {question.answer_option && question.answer_option.length > 0 && (
              <p className="text-muted-foreground text-sm">
                You can select options below or type your own answer.
              </p>
            )}
          </div>
        </MessageContent>
        <MessageAvatar
          name={"Assistant"}
          src={"https://ui-avatars.com/api/?name=Assistant"}
        />
      </Message>
      {question.has_answered && question.answer && (
        <Message from={"user"}>
          <MessageContent>
            <Response isAnimating={true} parseIncompleteMarkdown={true}>
              {question.answer}
            </Response>
          </MessageContent>
          <MessageAvatar name={user_name} src={""} />
        </Message>
      )}
    </>
  );
};

export default QuestionMessage;
