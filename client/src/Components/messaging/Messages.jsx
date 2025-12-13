import { MessageSquare } from "lucide-react"
import { useState } from "react"
import { useAuth } from "../../context/context"
export const Messages = ({ issue }) => {
    const [newMessage, setNewMessage] = useState("");
    const { user } = useAuth();

    console.log(user)
    
    function handleMessageChange(e) {
        const { value } = e.target;
        setNewMessage(value)
    }

    return (
        <>
            {issue.messages && issue.messages.length > 0 ? (
                <div className="space-y-4">
                    {issue.messages.map((message) => (
                        <div
                            key={message.id}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">
                                        {message.sender?.first_name} {message.sender?.last_name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                                        {message.sender?.role}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(message.sent_at).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {message.message_text}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-black-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 text-black-400" />
                    <p>No messages yet</p>
                    <textarea
                        type="text"
                        id="message-submit"
                        value={newMessage}
                        onChange={handleMessageChange}
                    >

                    </textarea>
                    <div className="flex gap-3 justify-center">
                        <label
                            htmlFor="message-submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                            Send
                        </label>
                    </div>
                </div>
            )
            }
        </>
    )
}