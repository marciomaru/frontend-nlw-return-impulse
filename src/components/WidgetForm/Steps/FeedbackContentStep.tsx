import { ArrowLeft } from "phosphor-react";
import { FormEvent, useState } from "react";
import { FeedbackTypes, feedbackTypes } from "..";
import { api } from "../../../lib/api";
import { CloseButton } from "../../CloseButton";
import { Loading } from "../../Loading";
import { ScreenShotButton } from "../ScreenShotButton";

interface FeedbackContentStepProps {
    feedbackType: FeedbackTypes;
    onFeedbackRestartRequested: () => void;
    onFeedbackSent: () => void;
}

export function FeedbackContentStep({ feedbackType, onFeedbackRestartRequested, onFeedbackSent }: FeedbackContentStepProps) {
    const [screenShot, setScreenShot] = useState<string | null>(null);
    const [comment, setComment] = useState<string>('');
    const [isSendingFeedback, setIsSendingFeedback] = useState(false);

    const feedbackTypeInfo = feedbackTypes[feedbackType];

    async function handleSubmitFeedback(event: FormEvent) {
        event.preventDefault();

        setIsSendingFeedback(true);
        await api.post('/feedbacks', {
            type: feedbackType,
            comment,
            screenshot: screenShot,
        });

        setIsSendingFeedback(false);
        onFeedbackSent();
    }

    return (
        <>
            <header>
                <button
                    type="button"
                    className="top-5 left-5 absolute text-zinc-400 hover:text-zinc-100"
                    onClick={onFeedbackRestartRequested}
                >
                    <ArrowLeft
                        className="w-4 h-4"
                        weight="bold"
                    />
                </button>

                <span className="text-xl leading-6 flex items-center gap-2">
                    <img src={feedbackTypeInfo.image.source} alt={feedbackTypeInfo.image.alt} className='h-6 w-6' />
                    {feedbackTypeInfo.title}
                </span>
                <CloseButton />
            </header>

            <form onSubmit={handleSubmitFeedback} className="my-4 w-full">
                <textarea
                    className="
                    min-w-[384px] 
                    w-full 
                    min-h-[112px] 
                    text-sm 
                    placeholder-zinc-400 
                    text-zinc-100 
                    border-zinc-600
                    bg-transparent
                    rounded-md
                    focus:border-brand-500
                    focus:ring-brand-500
                    focus:ring-1
                    focus:
                    resize-none
                    scrollbar
                    scrollbar-thumb-zinc-700
                    scrollbar-track-trasparent
                    scrollbar-thin
                    scrollbar-thumb-  
                    "
                    placeholder="Conte com detalhes o que esta acontecendo..."
                    onChange={event => setComment(event.target.value)}
                />
                <footer className="flex gap-2 mt-2">

                    <ScreenShotButton
                        screenShot={screenShot}
                        onScreenShotTook={setScreenShot}
                    />

                    <button
                        type="submit"
                        className="
                            p-2 
                            bg-brand-500 
                            rounded-md 
                            border-transparent 
                            flex-1 flex 
                            justify-center 
                            items-center
                            text-sm
                            hover:bg-brand-300
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-offset-zinc-900
                            focus:ring-brand-500
                            transition-colors
                            disabled:opacity-50
                            disabled:hover:bg-brand-500
                            "
                        disabled={comment.length === 0 || isSendingFeedback}
                    >
                        {isSendingFeedback ? <Loading /> : 'Enviar feedback'}
                    </button>
                </footer>

            </form>
        </>
    );
}